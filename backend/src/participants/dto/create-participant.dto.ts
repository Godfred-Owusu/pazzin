import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsPhoneNumber, IsString } from 'class-validator';

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
  @IsPhoneNumber('FR', { message: 'Phone number is not valid' })
  phone: string;
}
