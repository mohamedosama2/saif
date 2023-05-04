import { ApiHideProperty, ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsArray,
  IsNotEmpty,
  IsNotEmptyObject,
  IsNumber,
  IsObject,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';

/* export class AddressDto {
  @IsOptional()
  type = 'Point';

  @IsArray()
  coordinates: Array<number>;
} */

export class CreateHouseDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  city: string;

  @IsString()
  @IsNotEmpty()
  street: string;

  @IsString()
  @IsNotEmpty()
  house_num: string;

  @IsString()
  @IsNotEmpty()
  code: string;

  @IsString()
  @IsNotEmpty()
  conditions: string;

  @IsNumber()
  @IsNotEmpty()
  rooms: number;

  @IsNumber()
  @IsNotEmpty()
  persons: number;
  
  @IsNumber()
  @IsNotEmpty()
  children: number;

  @IsString()
  @IsNotEmpty()
  beds: string;

  @IsString()
  @IsNotEmpty()
  bathrooms: string;

  @IsString()
  @IsNotEmpty()
  apartment_area: string;

  @IsNumber()
  @IsNotEmpty()
  price: number;

  @IsString()
  @IsNotEmpty()
  about: string;

  @ApiProperty({
    type: String,
    isArray: true,
    format: 'binary',
  })
  images: string[];

  @ApiProperty({
    type: String,
    format: 'binary',
  })
  contractImage: string;

  /*   @IsNotEmptyObject()
  @IsObject() */
  /*   @ValidateNested()
  @Type(() => AddressDto) */
  @ApiHideProperty()
  location: any;

  @IsNumber()
  lat: number;
  @IsNumber()
  long: number;
}
