import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ProgramsModule } from './programs/programs.module';
import { ParticipantsModule } from './participants/participants.module';

import { MongooseModule } from '@nestjs/mongoose';
import { EmailModule } from './email/email.module';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { ParticipantsController } from './participants/participants.controller';
import { DashboardController } from './participants/dashbord.controller';
import { ConfigModule, ConfigService } from '@nestjs/config';
@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    // MongooseModule.forRoot('mongodb://localhost:27017/pazzin'),
    MongooseModule.forRootAsync({
      imports: [ConfigModule], // Import the ConfigModule
      useFactory: async (configService: ConfigService) => ({
        uri: configService.get<string>('MONGODB_URI'),
      }),
      inject: [ConfigService], // Inject the ConfigService
    }),
    ProgramsModule,
    ParticipantsModule,
    EmailModule,
    EventEmitterModule.forRoot(),
  ],
  controllers: [AppController, ParticipantsController, DashboardController],
  providers: [AppService],
})
export class AppModule {}
