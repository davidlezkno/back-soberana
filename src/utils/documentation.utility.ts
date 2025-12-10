import { INestApplication } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

export default class Documentation {
  /**
   * constructor
   * @description First call where the class create
   * @param  {INestApplication} application
   * @param  {string} url
   */
  constructor(application: INestApplication, url: string) {
    const config = new DocumentBuilder()
      .addBearerAuth()
      .setTitle('Templra Back API')
      .setDescription('Service application for authentication.')
      .setVersion('1.0')
      .build();

    const options = {
      customCss: `.swagger-ui .topbar { display: none }`,
    };

    const document = SwaggerModule.createDocument(application, config);

    SwaggerModule.setup(url, application, document, options);
  }
}

