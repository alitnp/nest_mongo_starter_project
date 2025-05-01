import { ValidationPipe, VersioningType } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import cookieParser from 'cookie-parser';
import helmet from 'helmet';
import { configuration } from 'src/common/config/configuration';
import { AppModule } from './app.module';

async function bootstrap() {
  const environment = configuration().NODE_ENV;
  const Port = configuration().port;
  console.log('Environment:', environment);
  console.log('Port:', Port);
  console.log('JWT Secret:', configuration().jwt.secret);
  console.log('JWT Expiration:', configuration().jwt.expiresIn);
  console.log('Bcrypt Salt Rounds:', configuration().bcrypt.saltRounds);
  console.log('Postgres Host:', configuration().db.postgres.host);
  console.log('Postgres Port:', configuration().db.postgres.port);
  console.log('Postgres User:', configuration().db.postgres.username);
  console.log('Postgres Password:', configuration().db.postgres.password);
  console.log('Postgres Database:', configuration().db.postgres.database);

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

  app.enableVersioning({
    type: VersioningType.URI,
  });

  app.useGlobalPipes(new ValidationPipe());

  await app.listen(Port);
}
bootstrap();
