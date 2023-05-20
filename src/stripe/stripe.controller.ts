import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { StripeService } from './stripe.service';
import { CreateStripeDto } from './dto/create-stripe.dto';
import { UpdateStripeDto } from './dto/update-stripe.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { AuthUser } from 'src/auth/decorators/me.decorator';
import { User } from 'src/users/models/_user.model';

@ApiBearerAuth()
@ApiTags('stripe')
@Controller('stripe')
export class StripeController {
  constructor(private readonly stripeService: StripeService) {}

  @Post()
  async createCharge(
    @Body() charge: CreateStripeDto,
    /*    @Req() request: RequestWithUser, */
    @AuthUser() user: User,
  ) {
    await this.stripeService.charge(
      charge.amount,
      charge.paymentMethodId,
      user.stripeCustomerId,
    );
  }
}
