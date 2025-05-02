import { ValidationPipe, VersioningType } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import {
  DocumentBuilder,
  SwaggerDocumentOptions,
  SwaggerModule,
} from '@nestjs/swagger';
import cookieParser from 'cookie-parser';
import helmet from 'helmet';
import { configuration } from 'src/common/config/configuration';
import metadata from 'src/metadata';
import { AppModule } from './app.module';

async function bootstrap() {
  const environment = configuration().NODE_ENV;
  const Port = configuration().port;
  console.log('Environment:', environment);

  const app = await NestFactory.create(AppModule, {
    cors: environment === 'production' ? true : false,
    logger: ['error', 'warn', 'log'],
  });

  // if (environment === 'production') {
  //   app.enableCors();
  // }

  app.use(helmet());

  app.use(cookieParser());

  app.setGlobalPrefix('api');

  const config = new DocumentBuilder()
    .setTitle('Robi Trader')
    .setDescription('The Robi Trader API description')
    .setVersion('1.0')
    // .addTag('cats')
    .addBearerAuth({
      type: 'http',
      scheme: 'bearer',
      bearerFormat: 'JWT', // Optional: Adds "JWT" to the format
      in: 'header',
      description: 'Enter JWT token in the format: Bearer <token>',
    })
    .addSecurityRequirements('bearer')
    .build();
  const options: SwaggerDocumentOptions = {
    operationIdFactory: (controllerKey: string, methodKey: string) => methodKey,
    // extraModels: [User, Role],
  };
  await SwaggerModule.loadPluginMetadata(metadata);
  const documentFactory = () =>
    SwaggerModule.createDocument(app, config, options);
  SwaggerModule.setup('swagger', app, documentFactory);

  app.enableVersioning({
    type: VersioningType.URI,
  });

  app.useGlobalPipes(new ValidationPipe());

  await app.listen(Port);
}
bootstrap();
