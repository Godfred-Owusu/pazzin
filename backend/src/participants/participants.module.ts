import { Module } from '@nestjs/common';
import { ParticipantsController } from './participants.controller';
import { ParticipantsService } from './participants.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Participant, ParticipantSchema } from './schema/participant.schema';
import { EmailModule } from 'src/email/email.module';
import { ProgramsModule } from 'src/programs/programs.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Participant.name, schema: ParticipantSchema },
    ]),
    EmailModule,
    ProgramsModule,
  ],
  controllers: [ParticipantsController],
  providers: [ParticipantsService],
  exports: [ParticipantsService],
})
export class ParticipantsModule {}
