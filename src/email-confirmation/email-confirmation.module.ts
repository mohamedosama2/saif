import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { UsersModule } from 'src/users/users.module';
import { MailerModule } from '@nestjs-modules/mailer';
import { EmailConfirmationController } from './email-confirmation.controller';
import { EmailConfirmationService } from './email-confirmation.service';

@Module({
  imports: [
    MailerModule.forRoot({
      transport: {
        host: 'smtp.sendgrid.net',
        auth: {
          user: 'apikey',
          pass: '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',
        },
        tls: {
          rejectUnauthorized: false,
        },
      },
    }),
    UsersModule,
  ],
  controllers: [EmailConfirmationController],
  providers: [EmailConfirmationService],
  exports: [EmailConfirmationService],
})
export class EmailConfirmationModule {}
