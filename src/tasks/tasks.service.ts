import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, MoreThan, IsNull } from 'typeorm';
import { v4 as uuidv4 } from 'uuid';
import { Task } from './entities/task.entity';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { SyncRequestDto, SyncResponseDto, ServerChangeDto } from './dto/sync.dto';

@Injectable()
export class TasksService {
  constructor(
    @InjectRepository(Task)
    private readonly taskRepository: Repository<Task>,
  ) {}

  async findAll(): Promise<Task[]> {
    return this.taskRepository.find({
      where: { deletedAt: IsNull() },
      order: { createdAt: 'DESC' },
    });
  }

  async findOne(id: string): Promise<Task> {
    const task = await this.taskRepository.findOne({
      where: { id, deletedAt: IsNull() },
    });

    if (!task) {
      throw new NotFoundException(`Tarea con ID ${id} no encontrada`);
    }

    return task;
  }

  async create(createTaskDto: CreateTaskDto): Promise<Task> {
    const task = this.taskRepository.create({
      id: uuidv4(),
      ...createTaskDto,
      completed: false,
    });

    return this.taskRepository.save(task);
  }

  async update(id: string, updateTaskDto: UpdateTaskDto): Promise<Task> {
    const task = await this.findOne(id);
    
    Object.assign(task, updateTaskDto);
    
    return this.taskRepository.save(task);
  }

  async toggleComplete(id: string): Promise<Task> {
    const task = await this.findOne(id);
    task.completed = !task.completed;
    return this.taskRepository.save(task);
  }

  async remove(id: string): Promise<void> {
    const task = await this.findOne(id);
    await this.taskRepository.softDelete(id);
  }

  async getChangesSince(timestamp: string): Promise<Task[]> {
    const date = new Date(timestamp);
    
    return this.taskRepository.find({
      where: {
        updatedAt: MoreThan(date),
      },
      withDeleted: true,
    });
  }

  async sync(syncRequest: SyncRequestDto): Promise<SyncResponseDto> {
    const serverChanges: ServerChangeDto[] = [];

    // Procesar cambios del cliente
    for (const change of syncRequest.changes) {
      try {
        if (change.action === 'create') {
          const newTask = await this.create({
            title: change.data.title,
            description: change.data.description,
          });
          
          serverChanges.push({
            localId: change.localId,
            serverId: newTask.id,
            action: 'create',
            data: newTask,
          });
        } else if (change.action === 'update' && change.serverId) {
          const updatedTask = await this.update(change.serverId, {
            title: change.data.title,
            description: change.data.description,
            completed: change.data.completed,
          });
          
          serverChanges.push({
            serverId: updatedTask.id,
            action: 'update',
            data: updatedTask,
          });
        } else if (change.action === 'delete' && change.serverId) {
          await this.remove(change.serverId);
          
          serverChanges.push({
            serverId: change.serverId,
            action: 'delete',
          });
        }
      } catch (error) {
        console.error(`Error processing change:`, error);
      }
    }

    // Obtener cambios del servidor desde el último timestamp
    const updatedTasks = await this.getChangesSince(syncRequest.lastSyncTimestamp);
    
    for (const task of updatedTasks) {
      // Evitar duplicados de los cambios que acabamos de procesar
      const alreadyProcessed = serverChanges.some(
        change => change.serverId === task.id
      );
      
      if (!alreadyProcessed) {
        serverChanges.push({
          serverId: task.id,
          action: task.deletedAt ? 'delete' : 'update',
          data: task.deletedAt ? undefined : task,
        });
      }
    }

    return {
      syncTimestamp: new Date().toISOString(),
      serverChanges,
    };
  }
}
