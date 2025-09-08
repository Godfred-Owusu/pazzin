import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Program, ProgramDocument } from './schema/program.schema';
import { CreateProgramDto } from './dto/create-program.dto';
import { UpdateProgramDto } from './dto/update-program.dto';

@Injectable()
export class ProgramsService {
  constructor(
    @InjectModel(Program.name) private programModel: Model<ProgramDocument>,
  ) {}

  async create(createDto: CreateProgramDto): Promise<Program> {
    try {
      const program = new this.programModel(createDto);
      return await program.save();
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }

  async findAll(): Promise<Program[]> {
    try {
      return this.programModel.find().exec();
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }

  async findById(id: string): Promise<Program> {
    try {
      const program = await this.programModel.findById(id);
      if (!program) throw new NotFoundException('Program not found');
      return program;
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }

  async update(id: string, updateDto: UpdateProgramDto): Promise<Program> {
    try {
      const program = await this.programModel.findByIdAndUpdate(id, updateDto, {
        new: true,
      });
      if (!program) throw new NotFoundException('Program not found');
      return program;
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }

  async remove(id: string): Promise<{ deleted: boolean }> {
    try {
      const result = await this.programModel.findByIdAndDelete(id);
      if (!result) throw new NotFoundException('Program not found');
      return { deleted: true };
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }
}
