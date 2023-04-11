import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import config, { database } from './config';
import { validationSchema } from './config/env.validation';
import { AuthModule } from './modules/auth/auth.module';
import { DatabaseModule } from './modules/database/database.module';
import { UsersModule } from './modules/users/users.module';
import { MessagesModule } from './modules/messages/messages.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [config, database],
      validationSchema,
    }),
    DatabaseModule,
    UsersModule,
    AuthModule,
    MessagesModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
