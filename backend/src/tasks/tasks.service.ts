/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable no-useless-catch */
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { Task, TaskStatus } from './schema/task.schema';
import { CreateTaskDto } from './dto/create-task.dto';
import { TaskFilter, UpdateTaskDto } from './dto/update-task.dto';

@Injectable()
export class TasksService {
  constructor(
    @InjectModel(Task.name)
    private readonly taskModel: Model<Task>,
  ) {}

  private formatTask(task: Task) {
    const taskData = task?.toObject();
    const now = new Date();

    return {
      ...taskData,
      isOverdue: task.status !== TaskStatus.COMPLETED && task.dueDate < now,
    };
  }

  async create(createTaskDto: CreateTaskDto, userId: string) {
    try {
      const task = await this.taskModel.create({
        ...createTaskDto,
        userId,
      });

      return {
        error: false,
        message: 'Task created successfully',
        data: this.formatTask(task),
      };
    } catch (error) {
      throw error;
    }
  }

  async findAll(userId: string, status?: TaskStatus | TaskFilter) {
    try {
      const filter: Record<string, any> = { userId };

      if (status === TaskFilter.OVERDUE) {
        filter.status = { $ne: TaskStatus.COMPLETED };
        filter.dueDate = { $lt: new Date() };
      } else if (status) {
        filter.status = status;
      }

      const tasks = await this.taskModel.find(filter).sort({ createdAt: -1 });

      return {
        error: false,
        message: 'Tasks retrieved successfully',
        data: tasks.map((task) => this.formatTask(task)),
      };
    } catch (error) {
      throw error;
    }
  }

  async findOne(id: string, userId: string) {
    try {
      const task = await this.taskModel.findOne({
        _id: id,
        userId,
      });

      if (!task) {
        throw new NotFoundException('Task not found');
      }

      return {
        error: false,
        message: 'Task retrieved successfully',
        data: this.formatTask(task),
      };
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }

      throw error;
    }
  }

  async update(id: string, updateTaskDto: UpdateTaskDto, userId: string) {
    try {
      const task = await this.taskModel.findOneAndUpdate(
        {
          _id: id,
          userId,
        },
        updateTaskDto,
        {
          new: true,
        },
      );

      if (!task) {
        throw new NotFoundException('Task not found');
      }

      return {
        error: false,
        message: 'Task updated successfully',
        data: this.formatTask(task),
      };
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }

      throw error;
    }
  }

  async remove(id: string, userId: string) {
    try {
      const task = await this.taskModel.findOneAndDelete({
        _id: id,
        userId,
      });

      if (!task) {
        throw new NotFoundException('Task not found');
      }

      return {
        error: false,
        message: 'Task deleted successfully',
        data: null,
      };
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }

      throw error;
    }
  }
}
