import { Module, forwardRef } from '@nestjs/common';
import { HousesService } from './houses.service';
import { HousesController } from './houses.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { House, HouseSchema } from './models/house.model';
import { HouseRepository } from './house.repository';
import { UsersModule } from 'src/users/users.module';
import { MulterModule } from '@nestjs/platform-express';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { UploadCloudinary } from 'src/utils/services/upload-cloudinary';
import { ReservationsModule } from 'src/reservations/reservations.module';
import { RateModule } from 'src/rate/rate.module';

@Module({
  controllers: [HousesController],
  providers: [HousesService, HouseRepository],
  imports: [
    MongooseModule.forFeature([
      {
        name: House.name,
        schema: HouseSchema,
      },
    ]),
    UsersModule,
    MulterModule.registerAsync({
      imports: [ConfigModule],
      useClass: UploadCloudinary,
      inject: [ConfigService],
    }),
    forwardRef(() => ReservationsModule),
    forwardRef(() => RateModule),
  ],
  exports: [HousesService, HouseRepository],
})
export class HousesModule {}
