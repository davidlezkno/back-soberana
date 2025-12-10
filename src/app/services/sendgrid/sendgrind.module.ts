import { SendgridService } from './sendgrid.service';
import { DynamicModule, Module } from '@nestjs/common';
import ISendgridModuleOption from './interfaces/IModuleOptions';

@Module({
  providers: [SendgridService],
})
export class SendgridModule {
  static register(options: ISendgridModuleOption): DynamicModule {
    return {
      module: SendgridModule,
      exports: [SendgridService],
      providers: [
        {
          provide: 'SENDGRID_API_KEY',
          useValue: options,
        },
        SendgridService,
      ],
    };
  }
}

