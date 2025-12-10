import { Logger, ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { json } from 'body-parser';

import Documentation from './utils/documentation.utility';

import { AppModule } from './app.module';

async function bootstrap() {
  const globalPrefix = 'api';
  const docPrefix = 'docs';

  const port = process.env.PORT || 3000;

  const application = await NestFactory.create(AppModule);

  application.use(json({ limit: '500mb' }));

  application.enableCors();

  application.setGlobalPrefix(globalPrefix);

  if (process.env.DOC_ENABLED === 'true') {
    new Documentation(application, docPrefix);
  }

  application.useGlobalPipes(new ValidationPipe({ transform: true }));

  await application.listen(port);

  Logger.log(`🚀 Application ⇢ http://localhost:${port}/${globalPrefix}`);
  Logger.log(`📖 Swagger ⇢ http://localhost:${port}/${docPrefix}`);
}

bootstrap();

