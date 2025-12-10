import email = require('@sendgrid/mail');
import { exceptions } from './constants';
import { Client } from '@sendgrid/client';
import { ISendGridParams } from './interfaces';
import { Injectable, Inject } from '@nestjs/common';
import { Exception } from 'src/utils/exception.utility';
import IHubspotModuleOption from './interfaces/IModuleOptions';

@Injectable()
export class SendgridService {
  private from: string;

  constructor(
    @Inject('SENDGRID_API_KEY') readonly options: IHubspotModuleOption
  ) {
    this.from = options.from;
    email.setClient(new Client());
    email.setApiKey(options.apiKey);
  }

  async email(params: ISendGridParams) {
    try {
      await email.send({
        from: this.from,
        to: params.to,
        personalizations: [
          {
            to: [
              {
                email: params.to,
              },
            ],
            dynamicTemplateData: params.params,
          },
        ],
        templateId: params.template_id,
      });
    } catch (error) {
      if (error.response)
        throw Exception(
          { exception: exceptions.error },
          [],
          error.response.body
        );
      else throw Exception({ exception: exceptions.error }, [], error);
    }
  }
}

