-- Crear base de datos
CREATE DATABASE IF NOT EXISTS todoapp 
  CHARACTER SET utf8mb4 
  COLLATE utf8mb4_unicode_ci;

USE todoapp;

-- Crear tabla tasks
CREATE TABLE IF NOT EXISTS tasks (
  id VARCHAR(36) PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  description TEXT NOT NULL,
  completed BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  deleted_at TIMESTAMP NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Índices para mejorar el rendimiento
CREATE INDEX idx_updated_at ON tasks(updated_at);
CREATE INDEX idx_deleted_at ON tasks(deleted_at);
CREATE INDEX idx_completed ON tasks(completed);

-- Datos de prueba (opcional - comentar si no se desean)
INSERT INTO tasks (id, title, description, completed) VALUES
  (UUID(), 'Tarea de ejemplo 1', 'Esta es una tarea de prueba para verificar el funcionamiento', FALSE),
  (UUID(), 'Tarea completada', 'Esta tarea ya está marcada como completada', TRUE),
  (UUID(), 'Comprar víveres', 'Ir al supermercado y comprar frutas, verduras y lácteos', FALSE);
