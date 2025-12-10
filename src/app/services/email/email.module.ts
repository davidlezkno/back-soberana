import { Module } from '@nestjs/common';
import { EmailService } from './email.service';
import { SendgridModule } from '../sendgrid/sendgrind.module';

@Module({
  imports: [
    SendgridModule.register({
      apiKey: process.env.SENDGRID_API_KEY || '-',
      from: process.env.SENDGRID_FROM || 'noreply@example.com',
    }),
  ],
  providers: [EmailService],
  exports: [EmailService],
})
export class EmailModule {}

