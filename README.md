# 🚀 To-Do List Backend API

Backend REST API para la aplicación To-Do List desarrollada con **NestJS + TypeORM + MySQL**.

## 📋 Características

- ✅ CRUD completo de tareas
- ✅ Sincronización batch offline-first
- ✅ Soft delete (eliminación lógica)
- ✅ Validación de datos con class-validator
- ✅ CORS configurado para Ionic
- ✅ TypeScript con tipado fuerte
- ✅ MySQL con TypeORM

## 🛠️ Requisitos Previos

- Node.js (v16 o superior)
- MySQL (v8.0 o superior)
- npm o yarn

## 📦 Instalación

### 1. Clonar o navegar al proyecto

```bash
cd todo-backend
```

### 2. Instalar dependencias

```bash
npm install
```

### 3. Configurar base de datos MySQL

#### Opción A: Crear manualmente

```bash
# Conectar a MySQL
mysql -u root -p

# Ejecutar el script de inicialización
source database/init.sql
```

#### Opción B: Usar el script SQL

```sql
CREATE DATABASE IF NOT EXISTS todoapp 
  CHARACTER SET utf8mb4 
  COLLATE utf8mb4_unicode_ci;
```

### 4. Configurar variables de entorno

Copiar el archivo `.env.example` a `.env` y ajustar los valores:

```bash
cp .env.example .env
```

Editar `.env`:

```env
PORT=3000
NODE_ENV=development

DB_HOST=localhost
DB_PORT=3306
DB_USERNAME=root
DB_PASSWORD=tu_contraseña_aqui
DB_DATABASE=todoapp

CORS_ORIGIN=http://localhost:8100,capacitor://localhost,http://localhost
```

### 5. Iniciar el servidor

```bash
# Desarrollo
npm run start:dev

# Producción
npm run build
npm run start:prod
```

El servidor estará disponible en `http://localhost:3000`

## 📡 Endpoints API

### Health Check

```
GET /health
```

Respuesta:
```json
{
  "status": "ok",
  "timestamp": "2025-10-28T12:00:00.000Z",
  "service": "todo-backend"
}
```

### Tareas

#### Obtener todas las tareas

```
GET /api/tasks
```

Respuesta:
```json
[
  {
    "id": "uuid-here",
    "title": "Tarea de ejemplo",
    "description": "Descripción de la tarea",
    "completed": false,
    "createdAt": "2025-10-28T12:00:00.000Z",
    "updatedAt": "2025-10-28T12:00:00.000Z"
  }
]
```

#### Obtener una tarea por ID

```
GET /api/tasks/:id
```

#### Crear nueva tarea

```
POST /api/tasks
Content-Type: application/json

{
  "title": "Nueva tarea",
  "description": "Descripción de la tarea"
}
```

Validaciones:
- `title`: mínimo 3 caracteres, máximo 255
- `description`: mínimo 5 caracteres, máximo 5000

#### Actualizar tarea

```
PUT /api/tasks/:id
Content-Type: application/json

{
  "title": "Título actualizado",
  "description": "Descripción actualizada",
  "completed": true
}
```

#### Toggle estado completado

```
PATCH /api/tasks/:id/toggle
```

#### Eliminar tarea

```
DELETE /api/tasks/:id
```

Nota: Usa soft delete, la tarea no se elimina físicamente.

#### Obtener cambios desde timestamp

```
GET /api/tasks/changes?since=2025-10-28T12:00:00.000Z
```

#### Sincronización batch

```
POST /api/tasks/sync
Content-Type: application/json

{
  "lastSyncTimestamp": "2025-10-28T12:00:00.000Z",
  "changes": [
    {
      "localId": 1,
      "action": "create",
      "data": {
        "title": "Nueva tarea",
        "description": "Descripción",
        "completed": false,
        "updatedAt": "2025-10-28T12:05:00.000Z"
      }
    }
  ]
}
```

Respuesta:
```json
{
  "syncTimestamp": "2025-10-28T12:10:00.000Z",
  "serverChanges": [
    {
      "localId": 1,
      "serverId": "uuid-here",
      "action": "create",
      "data": { /* tarea completa */ }
    }
  ]
}
```

## 🗄️ Estructura de la Base de Datos

### Tabla: tasks

| Campo | Tipo | Descripción |
|-------|------|-------------|
| id | VARCHAR(36) | UUID, clave primaria |
| title | VARCHAR(255) | Título de la tarea |
| description | TEXT | Descripción detallada |
| completed | BOOLEAN | Estado de completado |
| created_at | TIMESTAMP | Fecha de creación |
| updated_at | TIMESTAMP | Fecha de última actualización |
| deleted_at | TIMESTAMP | Fecha de eliminación (soft delete) |

## 📁 Estructura del Proyecto

```
src/
├── tasks/
│   ├── dto/
│   │   ├── create-task.dto.ts
│   │   ├── update-task.dto.ts
│   │   └── sync.dto.ts
│   ├── entities/
│   │   └── task.entity.ts
│   ├── tasks.controller.ts
│   ├── tasks.service.ts
│   └── tasks.module.ts
├── app.controller.ts
├── app.module.ts
├── app.service.ts
└── main.ts
```

## 🧪 Testing

```bash
# Pruebas unitarias
npm run test

# Pruebas e2e
npm run test:e2e

# Cobertura
npm run test:cov
```

## 🔧 Scripts Disponibles

```bash
npm run start          # Iniciar en modo normal
npm run start:dev      # Iniciar en modo desarrollo (watch)
npm run start:prod     # Iniciar en modo producción
npm run build          # Compilar el proyecto
npm run lint           # Ejecutar linter
npm run format         # Formatear código con Prettier
```

## 🐳 Docker (Opcional)

Crear archivo `docker-compose.yml`:

```yaml
version: '3.8'

services:
  mysql:
    image: mysql:8.0
    environment:
      MYSQL_ROOT_PASSWORD: password
      MYSQL_DATABASE: todoapp
    ports:
      - "3306:3306"
    volumes:
      - mysql_data:/var/lib/mysql
      - ./database/init.sql:/docker-entrypoint-initdb.d/init.sql

  backend:
    build: .
    ports:
      - "3000:3000"
    environment:
      DB_HOST: mysql
      DB_PORT: 3306
      DB_USERNAME: root
      DB_PASSWORD: password
      DB_DATABASE: todoapp
    depends_on:
      - mysql

volumes:
  mysql_data:
```

Ejecutar:

```bash
docker-compose up -d
```

## 🔒 Seguridad

- ✅ Validación de datos con class-validator
- ✅ CORS configurado
- ✅ Sanitización de inputs
- ✅ Variables de entorno para configuración sensible
- ✅ Soft delete para no perder datos

## 🚀 Despliegue

### Railway / Render

1. Crear cuenta en Railway o Render
2. Conectar repositorio
3. Configurar variables de entorno
4. Agregar servicio MySQL
5. Deploy automático

### Variables de entorno en producción:

```env
NODE_ENV=production
PORT=3000
DB_HOST=tu-host-mysql
DB_PORT=3306
DB_USERNAME=usuario
DB_PASSWORD=contraseña-segura
DB_DATABASE=todoapp
CORS_ORIGIN=https://tu-app.com
```

## 📝 Notas Importantes

1. **Sincronización**: TypeORM está configurado con `synchronize: true` solo en desarrollo. En producción, usar migraciones.

2. **Timezone**: La base de datos está configurada en UTC (`timezone: 'Z'`).

3. **Soft Delete**: Las tareas eliminadas no se borran físicamente, solo se marca `deleted_at`.

4. **UUIDs**: Se usan UUIDs v4 para los IDs de las tareas.

## 🤝 Integración con Frontend

El frontend Ionic debe configurar la URL base de la API:

```typescript
// En el frontend (Angular)
const API_URL = 'http://localhost:3000/api/tasks';
```

Ver documentación del frontend para más detalles sobre la integración.

## 📄 Licencia

MIT

## 👨‍💻 Autor

Desarrollado para el proyecto To-Do List con Ionic + Angular + NestJS
