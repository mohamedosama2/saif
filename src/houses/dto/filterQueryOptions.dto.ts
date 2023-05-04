import { IsDate, IsMongoId, IsNumber, IsOptional } from 'class-validator';
import { Transform } from 'class-transformer';
import { escapeRegExp } from 'lodash';
import { PaginationParams } from 'src/utils/pagination/paginationParams.dto';
import { IntersectionType } from '@nestjs/swagger';

export class FilterQueryHouse {
  @IsOptional()
  @Transform(({ obj }) => {
    return new RegExp(escapeRegExp(obj.city), 'i');
  })
  city?: string;

  @IsOptional()
  @IsNumber()
  minimum_price?: number;

  @IsOptional()
  @IsNumber()
  highest_price?: number;

  @IsOptional()
  @IsDate()
  start_date?: Date;

  @IsOptional()
  @IsDate()
  end_date?: Date;

  @IsOptional()
  @IsNumber()
  persons?: number;
  
  @IsOptional()
  @IsNumber()
  rooms?: number;

  @IsOptional()
  @IsNumber()
  children?: number;
}

export class FilterQueryOptionsHouse extends IntersectionType(
  FilterQueryHouse,
  PaginationParams,
) {}

/* export class FilterQueryNotification {
  @IsMongoId()
  receiver: string;
}

export class FilterQueryOptionsNotification extends IntersectionType(
  FilterQueryUser,
  PaginationParams,
) {} */
