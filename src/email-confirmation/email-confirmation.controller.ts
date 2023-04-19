import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';

import { Public } from 'src/auth/decorators/public.decorator';
import { UsersService } from 'src/users/users.service';
import { UpdateUserDto } from 'src/users/dto/update-user.dto';
import { VerificationInstance } from 'twilio/lib/rest/verify/v2/service/verification';
import { User, UserDocument } from 'src/users/models/_user.model';
import { FilterQuery } from 'mongoose';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { UserRepository } from 'src/users/users.repository';
import { EmailConfirmationService } from './email-confirmation.service';
import { CreateEmailConfirmationDto } from './dto/create-email-confirmation.dto';
import { VerifyEmailDto } from './dto/verify-email.dto';

@ApiBearerAuth()
@ApiTags('EMAIL-CONFIRMATION')
@Controller('Email-confirmation')
export class EmailConfirmationController {
  constructor(
    private readonly emailConfirmationService: EmailConfirmationService,
    private readonly userRepository: UserRepository,
  ) {}

  @Public()
  @HttpCode(HttpStatus.OK)
  @Post()
  async sendSMS(
    @Body() createEmailConfirmationDto: CreateEmailConfirmationDto,
  ): Promise<string> {
    return await this.emailConfirmationService.sendSMS(
      createEmailConfirmationDto,
    );
  }

  @Public()
  @HttpCode(HttpStatus.OK)
  @Post('verify')
  async verificationCode(
    @Body() verifyData: VerifyEmailDto,
  ): Promise<UserDocument> {
    await this.emailConfirmationService.verificationCode(verifyData);
    return await this.userRepository.updateOne(
      { email: verifyData.email } as FilterQuery<UserDocument>,
      { enabled: true } as UpdateUserDto,
    );
  }
}
