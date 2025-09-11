import {
  Injectable,
  NotFoundException,
  BadRequestException,
  InternalServerErrorException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Participant, ParticipantDocument } from './schema/participant.schema';
import { CreateParticipantDto } from './dto/create-participant.dto';
import { UpdateParticipantDto } from './dto/update-participant.dto';
import { v4 as uuidv4 } from 'uuid';
import * as QRCode from 'qrcode';
import { EmailService } from 'src/email/email.service';
import { ProgramsService } from 'src/programs/programs.service';
import { EventEmitter2 } from '@nestjs/event-emitter';

@Injectable()
export class ParticipantsService {
  constructor(
    @InjectModel(Participant.name)
    private readonly participantModel: Model<ParticipantDocument>,
    private readonly emailService: EmailService,
    private readonly programService: ProgramsService,
    private readonly eventEmitter: EventEmitter2,
  ) {}

  async register(createDto: CreateParticipantDto): Promise<Participant> {
    const { email, phone, name, programId } = createDto;
    try {
      // check if participant already exists
      const existing = await this.participantModel.findOne({
        $or: [{ email }, { phone }],
      });

      // throw error if participant already exists
      if (existing) {
        throw new BadRequestException('Participant already exists');
      }

      // fetch program to get its name
      const program = await this.programService.findById(programId);
      if (!program) {
        throw new NotFoundException('Program not found');
      }

      // generate qr code token
      const qrCodeToken = uuidv4();

      // generate qr code
      const qrCodeUrl = await QRCode.toDataURL(qrCodeToken);

      const participant = new this.participantModel({
        ...createDto,
        qrCodeToken,
        qrCodeUrl,
        hasClaimed: false,
        claimedAt: null,
        registeredAt: new Date(),
      });
      await this.emailService.sendQrCodeEmail(
        email,
        qrCodeUrl,
        name,
        program.name,
      );
      const savedParticipant = await participant.save();
      this.eventEmitter.emit('participant.registered', savedParticipant);
      return savedParticipant;
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  //   verify QRcode
  async verifyQRCode(qrCodeToken: string, programId: string) {
    try {
      const participant = await this.participantModel.findOne({
        qrCodeToken,
        programId: new Types.ObjectId(programId),
      });
      if (!participant) {
        throw new NotFoundException('Participant not found');
      }
      if (participant.hasClaimed) {
        throw new BadRequestException('Participant already claimed');
      }
      participant.hasClaimed = true;
      participant.claimedAt = new Date();
      await participant.save();

      // emit the event after participant claimed the reward
      this.eventEmitter.emit('participant.claimed', participant);
      return { status: 'success', message: 'Participant claimed successfully' };
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }

  //   update participant
  async update(
    id: string,
    updateDto: UpdateParticipantDto,
  ): Promise<Participant> {
    try {
      const participant = await this.participantModel.findById(id);
      if (!participant) {
        throw new NotFoundException('Participant not found');
      }

      Object.assign(participant, updateDto);
      return await participant.save();
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }

  //   find participant
  async findById(id: string): Promise<Participant> {
    try {
      const participant = await this.participantModel
        .findById(id)
        .populate('programId');
      if (!participant) {
        throw new NotFoundException('Participant not found');
      }
      return participant;
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }

  //   find all participants
  async findAll(): Promise<Participant[]> {
    try {
      return await this.participantModel.find().populate('programId').exec();
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }
}
