import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';

export type TaskDocument = HydratedDocument<Task>;

export enum TaskStatus {
  PENDING = 'pending',
  IN_PROGRESS = 'in-progress',
  COMPLETED = 'completed',
}

@Schema({ timestamps: true })
export class Task {
  [x: string]: any;
  @Prop({ required: true })
  title: string;

  @Prop()
  description?: string;

  @Prop({
    required: true,
    enum: TaskStatus,
    default: TaskStatus.PENDING,
  })
  status: TaskStatus;

  @Prop({
    required: true,
  })
  dueDate: Date;

  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  })
  userId: mongoose.Types.ObjectId;
}

export const TaskSchema = SchemaFactory.createForClass(Task);
