import { IsMongoId, IsOptional } from 'class-validator';
import { Transform } from 'class-transformer';
import { escapeRegExp } from 'lodash';
import { PaginationParams } from 'src/utils/pagination/paginationParams.dto';
import { IntersectionType } from '@nestjs/swagger';

export class FilterQueryReservation {
  /*  @IsOptional()
  @Transform(({ obj }) => {
    return new RegExp(escapeRegExp(obj.username), 'i');
  })
  username?: string; */
}

export class FilterQueryOptionsReservation extends IntersectionType(
  FilterQueryReservation,
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
