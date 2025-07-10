// src/modules/rentals/rentals.service.ts
import { Injectable, Logger, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Rental } from './entities/rental.entity';
import { UsersService } from '../users/users.service';
import { UmbrellasService } from '../umbrellas/umbrellas.service';
import { WalletsService } from '../wallets/wallets.service';
import { RENTAL_STATUS } from 'src/common/constants/rental-status';
import { UMBRELLA_STATUS } from 'src/common/constants/umbrella-status';
import { RentalMessages } from 'src/common/messages/rental-messages';
import { RentalNotFoundException, RentalStatusException } from 'src/common/exceptions/rental.exceptions';
import { WebsocketService } from '../websocket/websocket.service';
import { SubscriptionsService } from '../subscriptions/subscriptions.service';

@Injectable()
export class RentalsService {
  private readonly logger = new Logger(RentalsService.name);

  // 1일 대여료 (츄르)
  private readonly DAILY_RENTAL_FEE = 150;
  
  // 보증금 (츄르)
  private readonly DEPOSIT_AMOUNT = 500;
  
  // 대여 시 적립되는 캣닢
  private readonly RENTAL_CATNIP_REWARD = 10;

  constructor(
    @InjectRepository(Rental)
    private rentalRepository: Repository<Rental>,
    private usersService: UsersService,
    private umbrellasService: UmbrellasService,
    private walletsService: WalletsService,
    private websocketService: WebsocketService,
    private subscriptionsService: SubscriptionsService,
  ) {}

  async findAll(): Promise<Rental[]> {
    return this.rentalRepository.find({ relations: ['user', 'umbrella'] });
  }

  async findOne(id: number): Promise<Rental> {
    const rental = await this.rentalRepository.findOne({ 
      where: { id },
      relations: ['user', 'umbrella']
    });
    if (!rental) {
      throw new RentalNotFoundException();
    }
    return rental;
  }

  async findByUser(userId: number): Promise<Rental[]> {
    // 사용자 존재 여부 확인
    await this.usersService.findUserById(userId);
    
    return await this.rentalRepository.find({
      where: { user: { id: userId } },
      relations: ['umbrella'],
    });
  }

  async rentUmbrella(userId: number, umbrellaId: number): Promise<Rental> {
    // 사용자 확인
    const user = await this.usersService.findUserById(userId);
    
    // 우산 확인
    const umbrella = await this.umbrellasService.findOne(umbrellaId);
    
    // 우산 대여 가능 여부 확인
    if (umbrella.status !== UMBRELLA_STATUS.AVAILABLE) {
      throw new BadRequestException(RentalMessages.ALREADY_RENTED);
    }
    
    // 이용권 확인
    const hasActiveSubscription = await this.subscriptionsService.hasActiveSubscription(userId);
    
    let actualRentalFee = this.DAILY_RENTAL_FEE;
    if (hasActiveSubscription) {
      this.logger.log(`사용자 ${userId}에게 활성 이용권이 있어 대여료 ${this.DAILY_RENTAL_FEE}츄르 면제.`);
      actualRentalFee = 0; // 이용권이 있으면 대여료 면제
    }

    // 츄르 잔액 확인 (보증금 + 실제 대여료)
    const totalCost = this.DEPOSIT_AMOUNT + actualRentalFee;
    const churuBalance = await this.walletsService.getChuruBalance(userId);
    
    if (churuBalance < totalCost) {
      throw new BadRequestException(`츄르 잔액이 부족합니다. 필요한 츄르: ${totalCost}, 현재 잔액: ${churuBalance}`);
    }

    // 보증금 차감
    await this.walletsService.withdrawChuru(userId, this.DEPOSIT_AMOUNT);
    
    // 실제 대여료 차감 (이용권 있으면 0)
    if (actualRentalFee > 0) {
      await this.walletsService.withdrawChuru(userId, actualRentalFee);
    }

    // 우산 상태 업데이트
    umbrella.status = UMBRELLA_STATUS.RENTED;
    await this.umbrellasService.update(umbrellaId, umbrella);

    // 대여 정보 생성
    const rental = this.rentalRepository.create({
      user,
      umbrella,
      rentalStart: new Date(),
      status: RENTAL_STATUS.PENDING,
      rentalStationId: umbrella.stationId,
      depositAmount: this.DEPOSIT_AMOUNT, // 보증금 금액 저장
      totalFee: actualRentalFee, // 실제 차감된 대여료 저장
    });

    const savedRental = await this.rentalRepository.save(rental);

    // 웹소켓으로 우산 상태 업데이트 알림
    this.websocketService.sendUmbrellaUpdate({
      id: umbrella.id,
      status: umbrella.status,
      stationId: null, // 대여 중이므로 대여소에 없음
      updatedAt: new Date()
    });

    // 대여소 우산 개수 업데이트 알림
    if (umbrella.stationId) {
      this.websocketService.sendStationUpdate(umbrella.stationId);
    }

    return savedRental;
  }

  async confirmRental(rentalId: number): Promise<Rental> {
    const rental = await this.findOne(rentalId);
    
    if (rental.status !== RENTAL_STATUS.PENDING) {
      throw new RentalStatusException(RentalMessages.CONFIRM_ONLY_WHEN_PENDING);
    }
    
    rental.status = RENTAL_STATUS.RENTED;
    const updatedRental = await this.rentalRepository.save(rental);
    
    // 웹소켓으로 대여 상태 업데이트 알림
    this.websocketService.sendUmbrellaUpdate({
      id: rental.umbrella.id,
      status: rental.umbrella.status,
      stationId: null, // 대여 중이므로 대여소에 없음
      updatedAt: new Date()
    });
    
    return updatedRental;
  }

  async cancelRental(rentalId: number): Promise<Rental> {
    const rental = await this.findOne(rentalId); // user 관계가 로드됨
    
    if (rental.status !== RENTAL_STATUS.PENDING) {
      throw new RentalStatusException(RentalMessages.CANCEL_ONLY_WHEN_PENDING);
    }
    
    // 우산 상태를 다시 AVAILABLE로 변경
    await this.umbrellasService.update(rental.umbrella.id, { status: UMBRELLA_STATUS.AVAILABLE });
    
    rental.status = RENTAL_STATUS.CANCELED;
    const updatedRental = await this.rentalRepository.save(rental);
    
    // 웹소켓으로 우산 상태 업데이트 알림
    this.websocketService.sendUmbrellaUpdate({
      id: rental.umbrella.id,
      status: UMBRELLA_STATUS.AVAILABLE,
      stationId: rental.rentalStationId, // 원래 있던 대여소로 돌아감
      updatedAt: new Date()
    });
    
    // 대여소 우산 개수 업데이트 알림
    if (rental.rentalStationId) {
      this.websocketService.sendStationUpdate(rental.rentalStationId);
    }
    
    return updatedRental;
  }

  async returnUmbrella(rentalId: number, returnStationId: number): Promise<Rental> {
    // 대여 정보 확인
    const rental = await this.findOne(rentalId); // user 관계가 로드됨
    this.validateRentalReturnStatus(rental);

    // 반납 시간 및 요금 계산
    const rentalEnd = new Date();
    rental.rentalEnd = rentalEnd;
    rental.status = RENTAL_STATUS.RETURNED;
    rental.returnStationId = returnStationId;

    // 1일 종일권 정책 적용 (시간당 요금 계산 대신 고정 요금)
    // 대여일과 반납일이 다른 경우 추가 요금 부과 (하루당 DAILY_RENTAL_FEE)
    const rentalStartDay = new Date(rental.rentalStart);
    rentalStartDay.setHours(0, 0, 0, 0); // 대여일의 00:00:00
    
    const rentalEndDay = new Date(rentalEnd);
    rentalEndDay.setHours(0, 0, 0, 0); // 반납일의 00:00:00
    
    // 대여 기간 (일수) 계산
    const diffTime = rentalEndDay.getTime() - rentalStartDay.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    // 첫날은 이미 결제했으므로, 추가 일수에 대한 요금만 계산
    const additionalDays = Math.max(0, diffDays - 1);
    const additionalFee = additionalDays * this.DAILY_RENTAL_FEE;
    
    // 추가 요금이 있으면 츄르 차감
    if (additionalFee > 0) {
      await this.walletsService.withdrawChuru(rental.user.id, additionalFee);
      rental.totalFee += additionalFee; // 총 요금 업데이트
    }

    // 보증금 반환
    await this.walletsService.depositChuru(rental.user.id, rental.depositAmount);
    
    // 캣닢 적립
    await this.walletsService.addCatnip(rental.user.id, this.RENTAL_CATNIP_REWARD);

    // 우산 상태 업데이트
    await this.umbrellasService.update(rental.umbrella.id, { 
      status: UMBRELLA_STATUS.AVAILABLE,
      stationId: returnStationId // 반납된 대여소로 우산 위치 업데이트
    });

    // 대여 정보 업데이트
    const updatedRental = await this.rentalRepository.save(rental);

    // 웹소켓으로 우산 상태 업데이트 알림
    this.websocketService.sendUmbrellaUpdate({
      id: rental.umbrella.id,
      status: UMBRELLA_STATUS.AVAILABLE,
      stationId: returnStationId,
      updatedAt: new Date()
    });

    // 대여소 우산 개수 업데이트 알림
    this.websocketService.sendStationUpdate(returnStationId);

    return updatedRental;
  }

  async reportLostUmbrella(rentalId: number): Promise<Rental> {
    const rental = await this.findOne(rentalId); // user 관계가 로드됨
        
    if (rental.status !== RENTAL_STATUS.RENTED) {
      throw new RentalStatusException(RentalMessages.LOST_ONLY_WHEN_RENTED);
    }
    
    // 분실 처리
    rental.status = RENTAL_STATUS.LOST;
    
    // 분실 수수료 부과 (예: 우산 가격 + 패널티)
    const lostFee = rental.umbrella.price + 5000; // 5000원 패널티 추가
    rental.totalFee = lostFee;
    
    // 사용자 잔액에서 차감 (WalletsService 사용)
    await this.walletsService.withdrawChuru(rental.user.id, lostFee); // 츄르로 차감
    
    // 우산 상태 업데이트
    const umbrella = rental.umbrella;
    umbrella.status = UMBRELLA_STATUS.LOST;
    umbrella.isLost = true;
    await this.umbrellasService.update(umbrella.id, umbrella);
    
    // 대여 정보 업데이트
    return await this.rentalRepository.save(rental);
  }

  // 대여 상태 검증 메서드
  validateRentalReturnStatus(rental: Rental): void {
    if (rental.status !== RENTAL_STATUS.RENTED) {
      throw new RentalStatusException(RentalMessages.RETURN_ONLY_WHEN_RENTED);
    }
  }
}
