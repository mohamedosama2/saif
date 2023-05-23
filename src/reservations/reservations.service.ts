import {
  Injectable,
  BadRequestException,
  ForbiddenException,
  NotFoundException,
} from '@nestjs/common';
import { CreateReservationDto } from './dto/create-reservation.dto';
import { UpdateReservationDto } from './dto/update-reservation.dto';
import { ReservationRepository } from './repositaries/reservations.repository';
import { FilterQueryOptionsReservation } from './dto/filterQueryOptions.dto';
import { HouseRepository } from 'src/houses/house.repository';
import { ApiNotFoundResponse } from '@nestjs/swagger';
import { ReservationNotificationRepository } from './repositaries/reservationsNotifications.repository';
import { IS_RESERVED, ReservationDocument } from './models/reservation.model';
import { HouseDocument } from 'src/houses/models/house.model';
import { StripeService } from 'src/stripe/stripe.service';

@Injectable()
export class ReservationsService {
  constructor(
    private readonly reservationRepostary: ReservationRepository,
    private readonly reservationNotificationRepository: ReservationNotificationRepository,
    private readonly houseRepository: HouseRepository,
    private readonly stripeService: StripeService,
  ) {}
  async create(createReservationDto: CreateReservationDto) {
    // is house existed
    const isHouseExisted = await this.houseRepository.findOne({
      _id: createReservationDto.house,
    });
    if (!isHouseExisted) throw new NotFoundException('this house not existed ');
    //////////////////// is reserved
    let isReserved = await this.reservationRepostary.findOne({
      house: createReservationDto.house,
      $or: [
        {
          start_date: { $lte: createReservationDto.start_date },
          end_date: { $gte: createReservationDto.start_date },
        },
        {
          start_date: { $lte: createReservationDto.end_date },
          end_date: { $gte: createReservationDto.end_date },
        },
      ],
      /*  start_date: { $lte: createReservationDto.start_date },
      end_date: { $gte: createReservationDto.start_date }, */
    });

    /*    await this.stripeService.charge(
      createReservationDto.price,
      createReservationDto.paymentMethodId,
      createReservationDto.stripeCustomerId,
    ); */

    if (isReserved) {
      return await this.reservationRepostary.create({
        ...createReservationDto,
        isReserved: IS_RESERVED.WAITING,
      });
    }
    /*  throw new BadRequestException(
        `this house is reserved from ${isReserved.start_date} to ${isReserved.end_date} `,
      ); */
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
      customer: createReservationDto.user,
    });

    return reservation;
  }

  async hasWaitingReservation(reservation: ReservationDocument, owner: string) {
    //update resrevation
    const existedReservation = await this.reservationRepostary.findOne({
      house: reservation.house,
      isReserved: IS_RESERVED.WAITING,
    });
    if (existedReservation) {
      let newReservation = await this.reservationRepostary.create({
        start_date: existedReservation.start_date,
        end_date: existedReservation.end_date,
        price: existedReservation.price,
        house: existedReservation.house,
        user: existedReservation.user,
        payment_method: existedReservation.payment_method,
      });
      await this.reservationRepostary.deleteOne({ _id: existedReservation });
      await this.houseRepository.updateOneVoid(
        { _id: existedReservation.house },
        { $addToSet: { reservations: newReservation._id } as any },
      );

      //make  resrevation notification
      await this.reservationNotificationRepository.create({
        start_date: existedReservation.start_date,
        end_date: existedReservation.end_date,
        owner: owner,
        house: existedReservation.house,
        event: 'NEW RESERVATION',
        customer: existedReservation.user,
      });
    }
  }

  // still case of sel waiting reservation

  async removeReservation(reservationId: string, userId: string) {
    //////////// check if i the one who made the reservation DONE!!!
    //////////// save the one who reserve

    let reservation = await this.reservationRepostary.findOne({
      _id: reservationId,
    });

    if (!reservation) throw new NotFoundException('not found this reservation');
    if (reservation.user !== userId)
      throw new ForbiddenException(`cannot delete this reservation `);
    if (reservation.isReserved === IS_RESERVED.WAITING) {
      return await this.reservationRepostary.deleteOne({ _id: reservationId });
    }
    ////////////////WHERE
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
      customer: userId,
    });
    await this.hasWaitingReservation(reservation, house.owner);

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
