import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class CreateStripeDto {
  @IsString()
  @IsNotEmpty()
  paymentMethodId: string;

  @IsNumber()
  amount: number;
}
