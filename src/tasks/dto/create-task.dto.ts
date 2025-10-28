import { IsString, IsNotEmpty, MinLength, MaxLength } from 'class-validator';

export class CreateTaskDto {
  @IsString()
  @IsNotEmpty()
  @MinLength(3, { message: 'El título debe tener al menos 3 caracteres' })
  @MaxLength(255, { message: 'El título no puede exceder 255 caracteres' })
  title: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(5, { message: 'La descripción debe tener al menos 5 caracteres' })
  @MaxLength(5000, { message: 'La descripción no puede exceder 5000 caracteres' })
  description: string;
}
