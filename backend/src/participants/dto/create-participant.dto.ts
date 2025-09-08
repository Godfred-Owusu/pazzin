import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsMongoId,
  IsNotEmpty,
  IsPhoneNumber,
  IsString,
} from 'class-validator';

export class CreateParticipantDto {
  @ApiProperty({ example: 'Godfred Owusu' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ example: 'godfredmirekuowusu@gmail.com' })
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @ApiProperty({ example: '+233591130145' })
  @IsPhoneNumber()
  phone: string;

  @ApiProperty({
    example: '68bedbc1959366b0a6b72f9f',
    description: 'MongoDB ObjectId of the program',
  })
  @IsMongoId()
  programId: string;
}
