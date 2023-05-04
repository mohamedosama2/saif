import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { BaseAbstractRepository } from 'src/utils/base.abstract.repository';
import { Reservation, ReservationDocument } from '../models/reservation.model';
import {
  ReservationNotification,
  ReservationNotificationDocument,
} from '../models/reservationNotification.model';

@Injectable()
export class ReservationNotificationRepository extends BaseAbstractRepository<ReservationNotification> {
  constructor(
    @InjectModel(ReservationNotification.name)
    private reservationNotificationModel: Model<ReservationNotificationDocument>,
  ) {
    super(reservationNotificationModel);
  }
  async findMyReservationsNotifications(me: string) {
    return await this.reservationNotificationModel
      .find({ owner: me })
      .populate({ path: 'house', select: 'name about price' });
  }
}
