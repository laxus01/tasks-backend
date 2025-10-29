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
cd tasks-backend
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

El proyecto utiliza archivos de entorno específicos según el ambiente:
- `.env.development` - Para desarrollo
- `.env.production` - Para producción

Copiar el archivo `.env.example` al archivo correspondiente:

```bash
# Para desarrollo
cp .env.example .env.development

# Para producción
cp .env.example .env.production
```

Editar el archivo correspondiente:

```env
# Application
NODE_ENV=development
PORT=3000

# Database
DB_HOST=localhost
DB_PORT=3306
DB_USERNAME=root
DB_PASSWORD=tu_contraseña_aqui
DB_DATABASE=todoapp

# CORS (Nota: actualmente el backend acepta todas las peticiones)
CORS_ENABLED=true
CORS_ORIGIN=http://localhost:8100
```

**Nota importante sobre CORS:** Actualmente el backend está configurado para aceptar peticiones de **cualquier origen** (`origin: true` en `main.ts`). Las variables `CORS_ENABLED` y `CORS_ORIGIN` están definidas pero no se utilizan en el código actual.

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
├── config/
│   └── configuration.ts      # Configuración centralizada
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
├── app.controller.spec.ts
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

El proyecto incluye configuración completa de Docker con `docker-compose.yml`:

**Características:**
- Contenedor MySQL 8.0 con inicialización automática
- Contenedor backend con hot-reload para desarrollo
- Red personalizada para comunicación entre servicios
- Volúmenes persistentes para la base de datos

**Ejecutar con Docker:**

```bash
# Iniciar todos los servicios
docker-compose up -d

# Ver logs
docker-compose logs -f

# Detener servicios
docker-compose down

# Detener y eliminar volúmenes
docker-compose down -v
```

**Configuración incluida:**
- MySQL en puerto 3306
- Backend en puerto 3000
- Base de datos inicializada con `database/init.sql`
- Hot-reload habilitado en modo desarrollo

## 🔒 Seguridad

- ✅ Validación de datos con class-validator
- ✅ CORS habilitado (actualmente acepta todos los orígenes - ajustar para producción)
- ✅ Sanitización de inputs mediante ValidationPipe
- ✅ Variables de entorno para configuración sensible
- ✅ Soft delete para no perder datos
- ⚠️ **Recomendación**: Configurar CORS restrictivo en producción modificando `src/main.ts`

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

1. **Configuración Automática por Ambiente**: El proyecto ajusta automáticamente su configuración según `NODE_ENV`:
   - **Desarrollo**: `synchronize: true`, `logging: true` (TypeORM sincroniza automáticamente el esquema)
   - **Producción**: `synchronize: false`, `logging: false` (usar migraciones para cambios de esquema)

2. **Archivos de Entorno**: El sistema carga automáticamente:
   - `.env.development` cuando `NODE_ENV !== 'production'`
   - `.env.production` cuando `NODE_ENV === 'production'`

3. **CORS**: Actualmente configurado para aceptar **todas las peticiones** (`origin: true`). Para restringir orígenes en producción, modificar `src/main.ts`.

4. **Timezone**: La base de datos está configurada en UTC (`timezone: 'Z'`).

5. **Soft Delete**: Las tareas eliminadas no se borran físicamente, solo se marca `deleted_at`.

6. **UUIDs**: Se usan UUIDs v4 para los IDs de las tareas.

7. **Validación Global**: Todos los endpoints tienen validación automática con `class-validator`:
   - `whitelist: true` - Elimina propiedades no definidas en los DTOs
   - `forbidNonWhitelisted: true` - Rechaza peticiones con propiedades extras
   - `transform: true` - Transforma los payloads a instancias de DTO

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
