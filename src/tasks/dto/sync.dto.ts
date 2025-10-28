import { IsString, IsNotEmpty, IsArray, ValidateNested, IsOptional, IsIn, IsBoolean, IsNumber } from 'class-validator';
import { Type } from 'class-transformer';

// Declarar TaskDataDto primero para evitar error de inicialización
export class TaskDataDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsNotEmpty()
  description: string;

  @IsBoolean()
  completed: boolean;

  @IsString()
  updatedAt: string;
}

export class TaskChangeDto {
  @IsOptional()
  @IsNumber()
  localId?: number;

  @IsOptional()
  @IsString()
  serverId?: string;

  @IsString()
  @IsIn(['create', 'update', 'delete'])
  action: 'create' | 'update' | 'delete';

  @ValidateNested()
  @Type(() => TaskDataDto)
  data: TaskDataDto;
}

export class SyncRequestDto {
  @IsString()
  @IsNotEmpty()
  lastSyncTimestamp: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => TaskChangeDto)
  changes: TaskChangeDto[];
}

export class ServerChangeDto {
  @IsOptional()
  @IsNumber()
  localId?: number;

  @IsString()
  serverId: string;

  @IsString()
  @IsIn(['create', 'update', 'delete'])
  action: 'create' | 'update' | 'delete';

  @IsOptional()
  data?: any;
}

export class SyncResponseDto {
  @IsString()
  syncTimestamp: string;

  @IsArray()
  serverChanges: ServerChangeDto[];
}
