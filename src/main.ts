import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as cookieParser from 'cookie-parser';
import {
  DocumentBuilder,
  SwaggerCustomOptions,
  SwaggerModule,
} from '@nestjs/swagger';
import { ResponseInterceptor } from './common/interseptors/response.interceptor';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix('v1/api');
  app.enableCors({
    // origin: 'http://localhost:3000',
    origin: 'https://real-estate-tnhn.onrender.com',
    credentials: true,
  });
  app.use(cookieParser());

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

  app.useGlobalInterceptors(new ResponseInterceptor());

  await app.listen(process.env.PORT ?? 3001);
}

bootstrap();
