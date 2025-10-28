import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';
import * as crypto from 'crypto';

// Ensure crypto is available globally for TypeORM
if (!global.crypto) {
  global.crypto = crypto as any;
}

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Configurar CORS
  const corsOrigins = process.env.CORS_ORIGIN?.split(',') || [
    'http://localhost:8100',
    'capacitor://localhost',
    'http://localhost',
  ];

  app.enableCors({
    origin: corsOrigins,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    credentials: false,
  });

  // Configurar validación global
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  const port = process.env.PORT || 3000;
  await app.listen(port);
  console.log(`🚀 Servidor corriendo en http://localhost:${port}`);
  console.log(`📊 API disponible en http://localhost:${port}/api/tasks`);
}
bootstrap();
