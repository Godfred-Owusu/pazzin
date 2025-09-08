import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
export type ProgramDocument = Program & Document;
@Schema({ timestamps: true })
export class Program extends Document {
  @Prop({ required: true })
  name: string;

  @Prop()
  description?: string;

  @Prop({ default: Date.now })
  createdAt: Date;
}

export const ProgramSchema = SchemaFactory.createForClass(Program);
