import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { BaseAbstractRepository } from 'src/utils/base.abstract.repository';
import { Reservation, ReservationDocument } from '../models/reservation.model';

@Injectable()
export class ReservationRepository extends BaseAbstractRepository<Reservation> {
  constructor(
    @InjectModel(Reservation.name)
    private reservationModel: Model<ReservationDocument>,
  ) {
    super(reservationModel);
  }
  async allReservationOfHouse(house: string) {
    return await this.reservationModel
      .find({ house }, { start_date: 1, end_date: 1, house: 1, isReserved: 1 })
      .populate('house');
  }

  async myReservations(user: string) {
    return await this.reservationModel
      .find({ user }, { start_date: 1, end_date: 1, house: 1, isReserved: 1 })
      .populate('house');
  }

  async findMostReserved() {
    return await this.reservationModel.aggregate([
      {
        $lookup: {
          from: 'houses',
          localField: 'house',
          foreignField: '_id',
          as: 'house',
        },
      },
      {
        $group: {
          _id: { house: '$house' },
          timeReserved: { $count: {} },
          houseInfo: { $first: '$house' },
        },
      },
      { $sort: { timeReserved: -1 } },
      { $limit: 10 },
    ]);
  }
}
