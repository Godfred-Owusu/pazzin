import {
  Controller,
  Post,
  Get,
  Patch,
  Delete,
  Param,
  Body,
  NotFoundException,
} from '@nestjs/common';
import { ProgramsService } from './programs.service';
import { CreateProgramDto } from './dto/create-program.dto';
import { UpdateProgramDto } from './dto/update-program.dto';
import { Program } from './schema/program.schema';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';

@ApiTags('Programs')
@Controller('programs')
export class ProgramsController {
  constructor(private readonly programService: ProgramsService) {}

  // --------------------------
  // Create Program
  // --------------------------
  @Post()
  @ApiOperation({ summary: 'Create a new program' })
  @ApiResponse({ status: 201, description: 'Program created', type: Program })
  async create(@Body() createDto: CreateProgramDto): Promise<Program> {
    return this.programService.create(createDto);
  }

  // --------------------------
  // Get all programs
  // --------------------------
  @Get()
  @ApiOperation({ summary: 'Get all programs' })
  @ApiResponse({
    status: 200,
    description: 'List of programs',
    type: [Program],
  })
  async findAll(): Promise<Program[]> {
    return this.programService.findAll();
  }

  // --------------------------
  // Get program by ID
  // --------------------------
  @Get(':id')
  @ApiOperation({ summary: 'Get program by ID' })
  @ApiResponse({ status: 200, description: 'Program data', type: Program })
  async findById(@Param('id') id: string): Promise<Program> {
    const program = await this.programService.findById(id);
    if (!program) throw new NotFoundException('Program not found');
    return program;
  }

  // --------------------------
  // Update program
  // --------------------------
  @Patch(':id')
  @ApiOperation({ summary: 'Update a program' })
  @ApiResponse({ status: 200, description: 'Updated program', type: Program })
  async update(
    @Param('id') id: string,
    @Body() updateDto: UpdateProgramDto,
  ): Promise<Program> {
    return this.programService.update(id, updateDto);
  }

  // --------------------------
  // Delete program
  // --------------------------
  @Delete(':id')
  @ApiOperation({ summary: 'Delete a program' })
  @ApiResponse({ status: 200, description: 'Deleted successfully' })
  async remove(@Param('id') id: string): Promise<{ deleted: boolean }> {
    return this.programService.remove(id);
  }
}
