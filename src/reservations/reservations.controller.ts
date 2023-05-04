import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
} from '@nestjs/common';
import { ReservationsService } from './reservations.service';
import { CreateReservationDto } from './dto/create-reservation.dto';
import { UpdateReservationDto } from './dto/update-reservation.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { AuthUser } from 'src/auth/decorators/me.decorator';
import { UserDocument } from 'src/users/models/_user.model';
import { FilterQueryOptionsReservation } from './dto/filterQueryOptions.dto';
import { PaginateResult } from 'mongoose';
import { ReservationDocument } from './models/reservation.model';

@Controller('reservations')
@ApiTags('Reservations')
@ApiBearerAuth()
export class ReservationsController {
  constructor(private readonly reservationsService: ReservationsService) {}

  @Post()
  create(
    @Body() createReservationDto: CreateReservationDto,
    @AuthUser() me: UserDocument,
  ) {
    createReservationDto.user = me._id;
    return this.reservationsService.create(createReservationDto);
  }

  @Get()
  findAll(
    @Query() queryFiltersAndOptions: FilterQueryOptionsReservation,
  ): Promise<PaginateResult<ReservationDocument> | ReservationDocument[]> {
    return this.reservationsService.findAll(queryFiltersAndOptions);
  }

  /*  @Get('all-reservations/:id')
  findOne(@Param('id') id: string) {
    return this.reservationsService.findOne(id);
  } */

  @Get('/my-reservations')
  findMyReservations(@AuthUser() me: UserDocument) {
    return this.reservationsService.findMyReservations(me._id);
  }

  @Get('/house-reservations/:id')
  findHouseReservation(@Param('id') id: string) {
    return this.reservationsService.allReservationsOfHouse(id);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.reservationsService.removeReservation(id);
  }

  @Get('my-notifications')
  findMyReservationsNotifications(@AuthUser() me: UserDocument) {
    return this.reservationsService.findMyReservationsNotifications(me._id);
  }

  @Get('/most-reserved')
  findMostReserved() {
    return this.reservationsService.findMostReserved();
  }
}
