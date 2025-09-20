import {
  Injectable,
  NotFoundException,
  BadRequestException,
  InternalServerErrorException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Participant, ParticipantDocument } from './schema/participant.schema';
import { CreateParticipantDto } from './dto/create-participant.dto';
import { UpdateParticipantDto } from './dto/update-participant.dto';
import { v4 as uuidv4 } from 'uuid';
import * as QRCode from 'qrcode';
import { EmailService } from 'src/email/email.service';
import { EventEmitter2 } from '@nestjs/event-emitter';

@Injectable()
export class ParticipantsService {
  constructor(
    @InjectModel(Participant.name)
    private readonly participantModel: Model<ParticipantDocument>,
    private readonly emailService: EmailService,
    private readonly eventEmitter: EventEmitter2,
  ) {}

  async register(createDto: CreateParticipantDto): Promise<Participant> {
    const { email, phone, name } = createDto;
    try {
      // Check if participant already exists
      const existing = await this.participantModel.findOne({
        $or: [{ email }, { phone }],
      });

      // Throw error if participant already exists
      if (existing) {
        throw new BadRequestException('Participant already exists');
      }

      // Generate QR code token
      const qrCodeToken = uuidv4();

      // Generate QR code
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
        'Event Registration',
      );
      const savedParticipant = await participant.save();
      this.eventEmitter.emit('participant.registered', savedParticipant);
      return savedParticipant;
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  async verifyQRCode(qrCodeToken: string) {
    try {
      const participant = await this.participantModel.findOne({ qrCodeToken });

      if (!participant) {
        throw new NotFoundException('Participant not found');
      }
      if (participant.hasClaimed) {
        throw new BadRequestException(
          `${participant.name} has already claimed`,
        );
      }
      participant.hasClaimed = true;
      participant.claimedAt = new Date();
      await participant.save();

      this.eventEmitter.emit('participant.claimed', participant);
      return {
        email: participant.email,
        name: participant.name,
        message: 'Participant claimed successfully',
        claimed: participant.hasClaimed,
      };
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }

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

  async findById(id: string): Promise<Participant> {
    try {
      const participant = await this.participantModel.findById(id);
      if (!participant) {
        throw new NotFoundException('Participant not found');
      }
      return participant;
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }

  async findAll(): Promise<Participant[]> {
    try {
      return await this.participantModel.find().exec();
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }
}
