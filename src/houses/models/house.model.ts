import { Prop, Schema, SchemaFactory, raw } from '@nestjs/mongoose';
import * as mongoose from 'mongoose';
import { Reservation } from 'src/reservations/models/reservation.model';
import { User } from 'src/users/models/_user.model';

export type HouseDocument = House & mongoose.Document;

@Schema({ timestamps: true })
export class House {
  id?: string;

  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: User.name,
    required: true,
  })
  owner: string;

  @Prop({ type: String, required: true })
  name: string;

  @Prop({ type: String, required: true })
  city: string;
  @Prop({ type: String, required: true })
  street: string;
  @Prop({ type: String, required: true })
  house_num: string;
  @Prop({ type: String, required: true })
  code: string;
  @Prop({ type: String, required: true })
  conditions: string;
  //change
  @Prop({ type: Number, required: true })
  rooms: number;
  @Prop({ type: Number, required: true })
  persons: number;
  @Prop({ type: Number, required: true })
  children: number;

  @Prop({ type: String, required: true })
  beds: string;
  @Prop({ type: String, required: true })
  bathrooms: string;

  @Prop({ type: String, required: true })
  apartment_area: string;
  @Prop({ type: Number, required: true })
  price: number;
  @Prop({ type: String, required: true })
  about: string;

  @Prop({ type: [String], required: true })
  images: string[];

  @Prop({ type: String, required: true })
  contractImage: string;

  @Prop(
    raw({
      type: {
        type: String,
        default: 'Point',
      },
      coordinates: {
        type: [Number],
        index: { type: '2dsphere', sparse: false },
      },
    }),
  )
  location: {
    type: string;
    coordinates: Array<number>;
  };

  @Prop({
    type: [{ type: mongoose.Schema.Types.ObjectId, ref: User.name }],
  })
  favourites?: string[];

  @Prop({
    type: [{ type: mongoose.Schema.Types.ObjectId, ref: Reservation.name }],
  })
  reservations?: string[];

  @Prop(Number)
  rating?: number;
}
const HouseSchema = SchemaFactory.createForClass(House);
export { HouseSchema };
