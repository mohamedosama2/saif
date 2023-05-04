import { IsDate, IsEnum, IsMongoId, IsNumber } from 'class-validator';
import { PAYMENT_METHOD } from '../models/reservation.model';
import { ApiHideProperty } from '@nestjs/swagger';

export class CreateReservationDto {
  @IsEnum(PAYMENT_METHOD)
  payment_method: PAYMENT_METHOD;

  @IsDate()
  start_date: Date;

  @IsDate()
  end_date: Date;

  @ApiHideProperty()
  user: string;

  @IsMongoId()
  house: string;

  @IsNumber()
  price: number;
}
