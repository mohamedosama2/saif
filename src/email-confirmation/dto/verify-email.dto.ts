import { IsNotEmpty, IsOptional, IsString, Matches } from 'class-validator';
import { Constants } from 'src/utils/constants';

export class VerifyEmailDto {
  @IsString()
  @Matches(Constants.EMAIL_REGX, { message: 'Email is invalid' })
  email: string;

  @IsString()
  @IsNotEmpty()
  code: string;
}
