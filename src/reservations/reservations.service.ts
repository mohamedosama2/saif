import {
  Injectable,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { CreateReservationDto } from './dto/create-reservation.dto';
import { UpdateReservationDto } from './dto/update-reservation.dto';
import { ReservationRepository } from './repositaries/reservations.repository';
import { FilterQueryOptionsReservation } from './dto/filterQueryOptions.dto';
import { HouseRepository } from 'src/houses/house.repository';
import { ApiNotFoundResponse } from '@nestjs/swagger';
import { ReservationNotificationRepository } from './repositaries/reservationsNotifications.repository';

@Injectable()
export class ReservationsService {
  constructor(
    private readonly reservationRepostary: ReservationRepository,
    private readonly reservationNotificationRepository: ReservationNotificationRepository,
    private readonly houseRepository: HouseRepository,
  ) {}
  async create(createReservationDto: CreateReservationDto) {
    let isReserved = await this.reservationRepostary.findOne({
      house: createReservationDto.house,
      start_date: { $lte: createReservationDto.start_date },
      end_date: { $gte: createReservationDto.start_date },
    });

    if (isReserved)
      throw new BadRequestException(
        `this house is reserved from ${isReserved.start_date} to ${isReserved.end_date} `,
      );
    let reservation = await this.reservationRepostary.create(
      createReservationDto,
    );

    await this.houseRepository.updateOneVoid(
      { _id: createReservationDto.house },
      { $addToSet: { reservations: reservation._id } as any },
    );
    let house = await this.houseRepository.findOne({
      _id: createReservationDto.house,
    });

    await this.reservationNotificationRepository.create({
      start_date: createReservationDto.start_date,
      end_date: createReservationDto.end_date,
      owner: house.owner,
      house: createReservationDto.house,
      event: 'NEW RESERVATION',
    });

    return reservation;
  }

  async removeReservation(reservationId: string) {
    let reservation = await this.reservationRepostary.findOne({
      _id: reservationId,
    });
    let house = await this.houseRepository.findOne({
      reservations: reservationId,
    });

    await this.reservationRepostary.deleteOne({ _id: reservationId });

    await this.houseRepository.updateAllVoid(
      {},
      { $pull: { reservations: reservationId } as any },
    );

    await this.reservationNotificationRepository.create({
      start_date: reservation.start_date,
      end_date: reservation.end_date,
      owner: house.owner,
      house: house._id,
      event: 'DELETED RESERVATION',
    });
    return 'SUUCESS';
  }

  async findAll(queryFiltersAndOptions: FilterQueryOptionsReservation) {
    return await this.reservationRepostary.findAllWithPaginationOption(
      queryFiltersAndOptions,
      [],
      { populate: ['house', 'user'] },
    );
  }

  async findMyReservations(id: string) {
    let myReservations = await this.reservationRepostary.myReservations(id);
    if (myReservations.length === 0)
      throw new NotFoundException('NO Reservation Yet ');
    return myReservations;
  }
  async allReservationsOfHouse(id: string) {
    let allReservations = await this.reservationRepostary.allReservationOfHouse(
      id,
    );
    if (allReservations.length === 0)
      throw new NotFoundException('NO Reservation For this house ');
    return allReservations;
  }

  async findMyReservationsNotifications(me: string) {
    return await this.reservationNotificationRepository.findMyReservationsNotifications(
      me,
    );
  }

  /* async findOne(house: string) {
    let hasReserve = await this.reservationRepostary.({ });
    if (!hasReserve) return await this.houseRepository.findOne({ _id: house });
    return hasReserve;
  }
 */
  update(id: number, updateReservationDto: UpdateReservationDto) {
    return `This action updates a #${id} reservation`;
  }

  remove(id: number) {
    return `This action removes a #${id} reservation`;
  }
  findMostReserved() {
    return this.reservationRepostary.findMostReserved();
  }

}
