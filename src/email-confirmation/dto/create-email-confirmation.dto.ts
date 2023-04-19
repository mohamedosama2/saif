import { IsOptional, IsString, Matches } from 'class-validator';
import { Constants } from 'src/utils/constants';

export class CreateEmailConfirmationDto {
  @IsString()
  @Matches(Constants.EMAIL_REGX, { message: 'email is invalid' })
  email: string;
}
