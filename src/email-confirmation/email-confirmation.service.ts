import { BadRequestException, Injectable } from '@nestjs/common';

import { MailerService } from '@nestjs-modules/mailer';
import { CreateEmailConfirmationDto } from './dto/create-email-confirmation.dto';
import { UsersService } from 'src/users/users.service';
import { User } from 'src/users/models/_user.model';
import { VerifyEmailDto } from './dto/verify-email.dto';

@Injectable()
export class EmailConfirmationService {
  constructor(
    private mailService: MailerService,
    private userService: UsersService,
  ) {}

  async sendSMS(createEmailConfirmationDto: CreateEmailConfirmationDto) {
    const generatedCode = Math.floor(1000 + Math.random() * 9000);
    await this.userService.update(
      { email: createEmailConfirmationDto.email },
      { code: generatedCode.toString(), enabled: false },
    );
    try {
      await this.mailService.sendMail({
        to: createEmailConfirmationDto.email,
        from: 'latokalatohamato@gmail.com',
        subject: `Your Verfication Number`,
        text: `YOUR VERFICATION NUMBER IS ${generatedCode}`,
      });
      return 'SUCCESS';
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  async verificationCode(verifyData: VerifyEmailDto): Promise<void> {
    try {
      const existedUser = await this.userService.findOne({
        email: verifyData.email,
      });
      if (verifyData.code !== existedUser.code)
        throw new BadRequestException('code is not correct');
      await this.userService.update(
        { email: verifyData.email },
        { enabled: true },
      );
    } catch (error) {
      throw error;
    }
  }
}
