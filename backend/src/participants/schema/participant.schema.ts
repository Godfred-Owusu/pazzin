import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type ParticipantDocument = Participant & Document;

@Schema()
export class Participant {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true, unique: true })
  email: string;

  @Prop({ required: true, unique: true })
  phone: string;

  @Prop({ type: Types.ObjectId, ref: 'Program', required: false })
  programId?: Types.ObjectId;

  @Prop({ default: Date.now })
  registeredAt: Date;

  @Prop({ required: true, unique: true })
  qrCodeToken: string;

  @Prop({ unique: true })
  qrCodeUrl: String;

  @Prop({ default: false })
  hasClaimed: boolean;

  @Prop({ type: Date, default: null })
  claimedAt: Date | null;
}

export const ParticipantSchema = SchemaFactory.createForClass(Participant);
