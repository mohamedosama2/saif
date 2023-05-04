import { Prop, Schema, SchemaFactory, raw } from '@nestjs/mongoose';
import * as mongoose from 'mongoose';

import { User } from 'src/users/models/_user.model';

@Schema()
export class House {}

export type ReservationDocument = Reservation & mongoose.Document;

export enum PAYMENT_METHOD {
  CASH = 'CASH',
  PAYPAL = 'PAYPAL',
}

export enum IS_RESERVED {
  FIRST = 'FIREST',
  WAITING = 'WAITING',
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
    ref: House.name,
    required: true,
  })
  house: string;

  @Prop({ type: Number, required: true })
  price: number;

  @Prop({
    type: String,
    default: IS_RESERVED.FIRST,
    enum: Object.values(IS_RESERVED),
  })
  isReserved?: IS_RESERVED;
}
const ReservationSchema = SchemaFactory.createForClass(Reservation);
export { ReservationSchema };
