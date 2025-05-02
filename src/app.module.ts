import { CacheModule } from '@nestjs/cache-manager';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_GUARD } from '@nestjs/core';
import { JwtModule } from '@nestjs/jwt';
import { MongooseModule } from '@nestjs/mongoose';
import { ThrottlerModule } from '@nestjs/throttler';
import { AuthGuard } from 'src/auth/auth.guard';
import { configuration } from 'src/common/config/configuration';
import { RolesGuard } from 'src/role/role.gaurd';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { RoleModule } from './role/role.module';
import { UserModule } from './user/user.module';

@Module({
  imports: [
    // env confit
    ConfigModule.forRoot({
      isGlobal: true, // Makes ConfigModule available globally
    }),
    // rate limiter
    ThrottlerModule.forRoot({
      throttlers: [
        {
          ttl: 6000,
          limit: 10,
          blockDuration: 6000,
        },
      ],
    }),
    // cache manager
    CacheModule.register({
      isGlobal: true,
    }),
    MongooseModule.forRoot(
      `mongodb://${configuration().db.mongo.userPass}${configuration().db.mongo.host}:${configuration().db.mongo.port}/admin`,
      {
        dbName: configuration().db.mongo.database,
      },
    ),
    // MongooseModule.forRoot('mongodb://localhost/robi-admin-panel'),
    JwtModule,
    UserModule,
    AuthModule,
    RoleModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_GUARD,
      useClass: AuthGuard,
    },
    {
      provide: APP_GUARD,
      useClass: RolesGuard,
    },
  ],
})
export class AppModule {}
