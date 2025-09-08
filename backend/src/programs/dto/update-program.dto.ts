import { PartialType } from '@nestjs/mapped-types';
import { CreateProgramDto } from './create-program.dto';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class UpdateProgramDto extends PartialType(CreateProgramDto) {
  @ApiPropertyOptional({ example: 'Updated program description' })
  @IsOptional()
  @IsString()
  description?: string;
}
