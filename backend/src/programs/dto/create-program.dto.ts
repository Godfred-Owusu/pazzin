import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateProgramDto {
  @ApiProperty({ example: 'Wedding Ceremony' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({
    example: 'A special wedding program for invited guests',
    required: false,
  })
  @IsOptional()
  @IsString()
  description?: string;
}
