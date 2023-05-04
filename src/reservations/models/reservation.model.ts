import { Prop, Schema, SchemaFactory, raw } from '@nestjs/mongoose';
import * as mongoose from 'mongoose';
import { House } from 'src/houses/models/house.model';
import { User } from 'src/users/models/_user.model';

export type ReservationDocument = Reservation & mongoose.Document;

export enum PAYMENT_METHOD {
  CASH = 'CASH',
  PAYPAL = 'PAYPAL',
}

@Schema({
  timestamps: true,
})
export class Reservation {
  @Prop({ type: String, required: true, enum: Object.values(PAYMENT_METHOD) })
  payment_method: PAYMENT_METHOD;

  @Prop({ type: Date, required: true })
  start_date: Date;

  @Prop({ type: Date, required: true })
  end_date: Date;

  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: User.name,
    required: true,
  })
  user: string;

  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref:'houses',
    required: true,
  })
  house: string;

  @Prop({ type: Number, required: true })
  price: number;
}
const ReservationSchema = SchemaFactory.createForClass(Reservation);
export { ReservationSchema };
