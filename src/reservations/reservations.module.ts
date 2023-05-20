import { Module, forwardRef } from '@nestjs/common';
import { ReservationsService } from './reservations.service';
import { ReservationsController } from './reservations.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Reservation, ReservationSchema } from './models/reservation.model';
import { ReservationRepository } from './repositaries/reservations.repository';
import { HousesModule } from 'src/houses/houses.module';
import {
  ReservationNotification,
  ReservationNotificationSchema,
} from './models/reservationNotification.model';
import { ReservationNotificationRepository } from './repositaries/reservationsNotifications.repository';
import { StripeModule } from 'src/stripe/stripe.module';

@Module({
  controllers: [ReservationsController],
  providers: [
    ReservationsService,
    ReservationRepository,
    ReservationNotificationRepository,
  ],
  imports: [
    MongooseModule.forFeature([
      {
        name: Reservation.name,
        schema: ReservationSchema,
      },
      {
        name: ReservationNotification.name,
        schema: ReservationNotificationSchema,
      },
    ]),
    forwardRef(() => HousesModule),
    StripeModule,
  ],
  exports: [ReservationsService],
})
export class ReservationsModule {}
