// src/modules/admin/service/admin.service.ts
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Admin } from '../entities/admin.entity';
import { CreateAdminDto } from '../dto/create-admin.dto';
import { UpdateAdminDto } from '../dto/update-admin.dto';
import {
  AdminEmailExistsException,
  AdminLoginFailedException,
  AdminNotFoundException,
} from 'src/common/exceptions/admin.exceptions';
import { AdminLogService } from '../logs/admin-log.service';
import { PasswordUtil } from 'src/common/utils/password-util';
import { Request } from 'express';
import { ADMIN_LOG_ACTION } from '../../../common/constants/admin-log-action-status'
import { getClientIp, getUserAgent } from 'src/common/utils/request-util';
import { AdminResponseDto } from '../dto/admin-response.dto';
import { ChangePasswordDto } from '../dto/change-password-admin.dto';
import { ResetPasswordDto } from '../dto/reset-password-admin.dto';

@Injectable()
export class AdminService {
  constructor(
    @InjectRepository(Admin)
    private readonly adminRepository: Repository<Admin>,
    private readonly adminLogService: AdminLogService,
  ) {}

  private async getAdminOrFail(id: number): Promise<Admin> {
    const admin = await this.adminRepository.findOne({ where: { id } });
    if (!admin) throw new AdminNotFoundException();
    return admin;
  }

  async createAdmin(createAdminDto: CreateAdminDto, request?: Request): Promise<AdminResponseDto> {
    const exists = await this.adminRepository.findOne({
      where: { email: createAdminDto.email },
    });
    if (exists) throw new AdminEmailExistsException();

    PasswordUtil.validatePassword(createAdminDto.password);

    const hashedPassword = await PasswordUtil.hash(createAdminDto.password);

    const admin = this.adminRepository.create({
      ...createAdminDto,
      password: hashedPassword,
    });

    const savedAdmin = await this.adminRepository.save(admin);

    await this.adminLogService.logAction({
      adminId: savedAdmin.id,
      action: ADMIN_LOG_ACTION.CREATE,
      ipAddress: request ? getClientIp(request) : 'seed-script',
      userAgent: request ? getUserAgent(request) : 'seed-script',
    });

    return new AdminResponseDto(savedAdmin);
  }

  async getAllAdmins(): Promise<AdminResponseDto[]> {
    const admins = await this.adminRepository.find();
    return admins.map(admin => new AdminResponseDto(admin));
  }

  async getAdminById(id: number): Promise<AdminResponseDto> {
    const admin = await this.adminRepository.findOne({ where: { id } });
    if (!admin) throw new AdminNotFoundException();
    return new AdminResponseDto(admin);
  }

  async updateAdmin(
    id: number,
    updateAdminDto: UpdateAdminDto,
    request: Request,
  ): Promise<AdminResponseDto> {
    const admin = await this.adminRepository.findOne({ where: { id } });
    if (!admin) throw new AdminNotFoundException();
  
    if (updateAdminDto.password) {
      PasswordUtil.validatePassword(updateAdminDto.password);
      updateAdminDto.password = await PasswordUtil.hash(updateAdminDto.password);
    }
  
    if (updateAdminDto.email) admin.email = updateAdminDto.email;
    if (updateAdminDto.role) admin.role = updateAdminDto.role;
    if (updateAdminDto.password) admin.password = updateAdminDto.password;
    if (typeof updateAdminDto.isActive === 'boolean') admin.isActive = updateAdminDto.isActive;
  
    const updatedAdmin = await this.adminRepository.save(admin);
  
    await this.adminLogService.logAction({
      adminId: updatedAdmin.id,
      action: ADMIN_LOG_ACTION.UPDATE,
      ipAddress: getClientIp(request),
      userAgent: getUserAgent(request),
    });
  
    return new AdminResponseDto(updatedAdmin);
  }

  async softDeleteAdmin(id: number, request: Request): Promise<{ message: string }> {
    const admin = await this.getAdminOrFail(id);
    await this.adminRepository.softDelete(id);
    await this.adminLogService.logAction({
      adminId: admin.id,
      action: ADMIN_LOG_ACTION.REMOVE,
      ipAddress: getClientIp(request),
      userAgent: getUserAgent(request),
    });
    return { message: '관리자가 삭제(비활성화)되었습니다.' };
  }

  async validateAdminCredentials(email: string, password: string): Promise<AdminResponseDto> {
    const admin = await this.adminRepository.findOne({ where: { email } });
    if (!admin) throw new AdminLoginFailedException();
  
    const isMatch = await PasswordUtil.compare(password, admin.password);
    if (!isMatch) throw new AdminLoginFailedException();
  
    return new AdminResponseDto(admin);
  }

  async changeAdminPassword(
    adminId: number,
    dto: ChangePasswordDto,
    request: Request,
  ): Promise<{ message: string }> {
    const admin = await this.getAdminOrFail(adminId);
  
    // 현재 비밀번호 확인
    const isMatch = await PasswordUtil.compare(dto.currentPassword, admin.password);
    if (!isMatch) throw new Error('현재 비밀번호가 일치하지 않습니다.');
  
    // 새 비밀번호와 확인 값 일치 확인
    if (dto.newPassword !== dto.confirmNewPassword) {
      throw new Error('새 비밀번호와 비밀번호 확인이 일치하지 않습니다.');
    }
  
    // 새 비밀번호 정책 검증
    PasswordUtil.validatePassword(dto.newPassword);
  
    admin.password = await PasswordUtil.hash(dto.newPassword);
    await this.adminRepository.save(admin);
  
    await this.adminLogService.logAction({
      adminId: admin.id,
      action: ADMIN_LOG_ACTION.PASSWORD_CHANGE,
      ipAddress: getClientIp(request),
      userAgent: getUserAgent(request),
    });
  
    return { message: '비밀번호가 변경되었습니다.' };
  }

  async resetAdminPassword(
    adminId: number,
    dto: ResetPasswordDto,
    request: Request,
  ): Promise<{ message: string }> {
    const admin = await this.getAdminOrFail(adminId);
  
    // 새 비밀번호와 확인 일치 검증
    if (dto.newPassword !== dto.confirmNewPassword) {
      throw new Error('새 비밀번호와 비밀번호 확인이 일치하지 않습니다.');
    }
  
    // 비밀번호 정책 검증
    PasswordUtil.validatePassword(dto.newPassword);
  
    admin.password = await PasswordUtil.hash(dto.newPassword);
    await this.adminRepository.save(admin);
  
    await this.adminLogService.logAction({
      adminId: admin.id,
      action: ADMIN_LOG_ACTION.PASSWORD_CHANGE,
      ipAddress: getClientIp(request),
      userAgent: getUserAgent(request),
    });
  
    return { message: '비밀번호가 초기화되었습니다.' };
  }
  
  async logAdminLogin(email: string, password: string, request: Request): Promise<AdminResponseDto> {
    const admin = await this.adminRepository.findOne({ where: { email } });
    if (!admin) throw new AdminLoginFailedException();
    const isMatch = await PasswordUtil.compare(password, admin.password);
    if (!isMatch) throw new AdminLoginFailedException();
  
    await this.adminLogService.logAction({
      adminId: admin.id,
      action: ADMIN_LOG_ACTION.LOGIN,
      ipAddress: getClientIp(request),
      userAgent: getUserAgent(request),
    });
  
    return new AdminResponseDto(admin);
  }
  
  async logAdminLogout(adminId: number, request: Request): Promise<{ message: string }> {
    await this.adminLogService.logAction({
      adminId,
      action: ADMIN_LOG_ACTION.LOGOUT,
      ipAddress: getClientIp(request),
      userAgent: getUserAgent(request),
    });
    return { message: '로그아웃 되었습니다.' };
  }
}
