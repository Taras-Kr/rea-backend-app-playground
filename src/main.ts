import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import {
  DocumentBuilder,
  SwaggerCustomOptions,
  SwaggerModule,
} from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix('v1/api');
  app.enableCors();

  const config = new DocumentBuilder()
    .setTitle('Real Estate Agency')
    .setDescription('The Real Estate Agency API.' + ' \n Base route: /v1/api')
    .addServer('http://localhost:3001')
    .setVersion('1.0')
    .addTag('API')
    .build();
  const documentFactory = () =>
    SwaggerModule.createDocument(app, config, { ignoreGlobalPrefix: true });
  const swaggerOptions: SwaggerCustomOptions = {
    customSiteTitle: 'Real Estate Agency',
  };
  SwaggerModule.setup('swagger', app, documentFactory, swaggerOptions);

  await app.listen(process.env.PORT ?? 3001);
}

bootstrap();
