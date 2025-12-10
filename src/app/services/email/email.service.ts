import { Injectable } from '@nestjs/common';
import { ISendGridParams } from '../sendgrid/interfaces';
import { SendgridService } from '../sendgrid/sendgrid.service';

@Injectable()
export class EmailService {
  constructor(private readonly sendgridService: SendgridService) {}

  async send(params: ISendGridParams) {
    const result = await this.sendgridService.email(params);

    return result;
  }
}

