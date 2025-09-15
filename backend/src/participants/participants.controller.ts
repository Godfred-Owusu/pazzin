import {
  Controller,
  Post,
  Body,
  Patch,
  Param,
  Get,
  Sse,
  MessageEvent,
  NotFoundException,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam } from '@nestjs/swagger';
import { ParticipantsService } from './participants.service';
import { CreateParticipantDto } from './dto/create-participant.dto';
import { UpdateParticipantDto } from './dto/update-participant.dto';
import { Participant } from './schema/participant.schema';
import { EventEmitter2 } from '@nestjs/event-emitter';

@ApiTags('Participants')
@Controller('participants')
export class ParticipantsController {
  constructor(
    private readonly participantsService: ParticipantsService,
    private readonly eventEmitter: EventEmitter2,
  ) {}

  //   register participant
  @Post('register')
  @ApiOperation({ summary: 'Register a new participant and generate QR code' })
  @ApiResponse({
    status: 201,
    description: 'Participant created',
    type: Participant,
  })
  async register(
    @Body() createDto: CreateParticipantDto,
  ): Promise<Participant> {
    return this.participantsService.register(createDto);
  }

  //   verify QR code
  @Post('verify/:qrCodeToken/:programId')
  @ApiOperation({ summary: 'Verify QR code and claim participant' })
  @ApiParam({
    name: 'qrCodeToken',
    type: String,
    description: 'The unique token from the scanned QR code',
  })
  @ApiParam({
    name: 'programId',
    type: String,
    description: 'The ID of the program the QR code belongs to',
  })
  @ApiResponse({
    status: 200,
    description: 'Participant claimed successfully',
  })
  @ApiResponse({
    status: 404,
    description: 'Participant not found',
  })
  @ApiResponse({
    status: 400,
    description: 'Participant already claimed',
  })
  @ApiResponse({
    status: 500,
    description: 'Internal server error',
  })
  async verifyQRCode(
    @Param('qrCodeToken') qrCodeToken: string,
    @Param('programId') programId: string,
  ) {
    return this.participantsService.verifyQRCode(qrCodeToken, programId);
  }

  // --------------------------
  // Get participant by ID
  // --------------------------
  @Get(':id')
  @ApiOperation({ summary: 'Get participant by ID' })
  @ApiResponse({
    status: 200,
    description: 'Participant data',
    type: Participant,
  })
  async findById(@Param('id') id: string): Promise<Participant> {
    const participant = await this.participantsService.findById(id);
    if (!participant) throw new NotFoundException('Participant not found');
    return participant;
  }

  // --------------------------
  // Get all participants
  // --------------------------
  @Get()
  @ApiOperation({ summary: 'Get all participants' })
  @ApiResponse({
    status: 200,
    description: 'List of participants',
    type: [Participant],
  })
  async findAll(): Promise<Participant[]> {
    return this.participantsService.findAll();
  }

  // SSE endpoint to stream events
  // @Sse('sse')
  // sse(): Observable<any> {
  //   return this.participantsService.getEvents();
  // }
}
