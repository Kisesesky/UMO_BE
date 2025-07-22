// src/modules/admin/orders/dto/update-order.dto.ts
import { IsOptional, IsString, IsIn, IsNumber } from 'class-validator';

export class UpdateOrderDto {
  @IsOptional()
  @IsIn(['pending', 'completed', 'canceled'])
  status?: string;

  @IsOptional()
  @IsString()
  deliveryAddress?: string;

  @IsOptional()
  @IsString()
  note?: string;

  // 추가적으로 관리자가 수정할 수 있는 필드
}
