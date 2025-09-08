import { PartialType } from '@nestjs/mapped-types';
import { CreateParticipantDto } from './create-participant.dto';
import { ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsBoolean,
  IsDate,
  IsOptional,
  IsString,
  IsUrl,
} from 'class-validator';

export class UpdateParticipantDto extends PartialType(CreateParticipantDto) {
  @ApiPropertyOptional({ example: 'https://yourdomain.com/qrcodes/uuid.png' })
  @IsOptional()
  @IsUrl()
  qrCodeUrl?: string;

  @ApiPropertyOptional({ example: true })
  @IsOptional()
  @IsBoolean()
  hasClaimed?: boolean;

  @ApiPropertyOptional({ example: '2025-09-07T12:30:00Z' })
  @IsOptional()
  @IsDate()
  claimedAt?: Date | null;

  @ApiPropertyOptional({ example: 'new-qr-code-token' })
  @IsOptional()
  @IsString()
  qrCodeToken?: string;
}
