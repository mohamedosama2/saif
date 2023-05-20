import { Module } from '@nestjs/common';
import { StripeService } from './stripe.service';
import { StripeController } from './stripe.controller';
import { ConfigModule } from '@nestjs/config';

@Module({
  controllers: [StripeController],
  providers: [StripeService],
  imports: [
    ConfigModule,
    // ...
  ],
  exports: [StripeService],
})
export class StripeModule {}
