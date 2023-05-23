import { Prop, Schema, SchemaFactory, raw } from '@nestjs/mongoose';
import * as mongoose from 'mongoose';
import { House } from 'src/houses/models/house.model';
import { User } from 'src/users/models/_user.model';
import { Reservation } from './reservation.model';

export type ReservationNotificationDocument = ReservationNotification &
  mongoose.Document;

@Schema({
  timestamps: true,
})
export class ReservationNotification {
  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: User.name,
    required: true,
  })
  owner: string;

  @Prop({ type: Date, required: true })
  start_date: Date;

  @Prop({ type: Date, required: true })
  end_date: Date;

  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: House.name,
    required: true,
  })
  house: string;

  @Prop({ type: String, required: true })
  event: string;

  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: User.name,
    required: true,
  })
  customer: string;
}
const ReservationNotificationSchema = SchemaFactory.createForClass(
  ReservationNotification,
);
export { ReservationNotificationSchema };
