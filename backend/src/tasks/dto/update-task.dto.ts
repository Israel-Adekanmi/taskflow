import { ApiProperty, PartialType } from '@nestjs/swagger';
import { IsEnum, IsIn, IsOptional } from 'class-validator';

import { CreateTaskDto } from './create-task.dto';
import { TaskStatus } from '../schema/task.schema';

export class UpdateTaskDto extends PartialType(CreateTaskDto) {
  @ApiProperty()
  @IsOptional()
  @IsEnum(TaskStatus)
  status?: TaskStatus;
}

export enum TaskFilter {
  OVERDUE = 'overdue',
}

export class TaskQueryDto {
  @ApiProperty()
  @IsOptional()
  @IsIn([...Object.values(TaskStatus), TaskFilter.OVERDUE])
  status?: TaskStatus | TaskFilter;
}
