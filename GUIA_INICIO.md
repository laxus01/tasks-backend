# 🚀 Guía de Inicio Rápido - Backend To-Do List

## ✅ Pasos para Iniciar el Backend

### 1. Configurar MySQL

Asegúrate de tener MySQL instalado y corriendo.

```bash
# Verificar que MySQL está corriendo
mysql --version
```

### 2. Crear la Base de Datos

```bash
# Conectar a MySQL
mysql -u root -p

# Ejecutar el script de inicialización
source database/init.sql

# O copiar y pegar el contenido del archivo
```

Alternativamente, ejecutar manualmente:

```sql
CREATE DATABASE IF NOT EXISTS todoapp 
  CHARACTER SET utf8mb4 
  COLLATE utf8mb4_unicode_ci;

USE todoapp;
```

### 3. Configurar Variables de Entorno

Editar el archivo `.env` con tus credenciales de MySQL:

```env
PORT=3000
NODE_ENV=development

DB_HOST=localhost
DB_PORT=3306
DB_USERNAME=root
DB_PASSWORD=TU_CONTRASEÑA_AQUI
DB_DATABASE=todoapp

CORS_ORIGIN=http://localhost:8100,capacitor://localhost,http://localhost
```

### 4. Instalar Dependencias (si no lo hiciste)

```bash
npm install
```

### 5. Iniciar el Servidor

```bash
# Modo desarrollo (recomendado)
npm run start:dev

# Modo producción
npm run build
npm run start:prod
```

### 6. Verificar que Funciona

Abrir en el navegador o usar curl:

```bash
# Health check
curl http://localhost:3000/health

# Obtener todas las tareas
curl http://localhost:3000/api/tasks
```

Deberías ver:

```json
{
  "status": "ok",
  "timestamp": "2025-10-28T...",
  "service": "todo-backend"
}
```

## 📡 Endpoints Disponibles

### Health Check
```
GET http://localhost:3000/health
```

### Tareas
```
GET    http://localhost:3000/api/tasks           - Listar todas
POST   http://localhost:3000/api/tasks           - Crear nueva
GET    http://localhost:3000/api/tasks/:id       - Obtener una
PUT    http://localhost:3000/api/tasks/:id       - Actualizar
PATCH  http://localhost:3000/api/tasks/:id/toggle - Toggle completado
DELETE http://localhost:3000/api/tasks/:id       - Eliminar
POST   http://localhost:3000/api/tasks/sync      - Sincronización
```

## 🧪 Probar los Endpoints

### Crear una tarea

```bash
curl -X POST http://localhost:3000/api/tasks \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Mi primera tarea",
    "description": "Esta es una tarea de prueba"
  }'
```

### Obtener todas las tareas

```bash
curl http://localhost:3000/api/tasks
```

### Marcar como completada

```bash
curl -X PATCH http://localhost:3000/api/tasks/TASK_ID/toggle
```

### Actualizar tarea

```bash
curl -X PUT http://localhost:3000/api/tasks/TASK_ID \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Título actualizado",
    "completed": true
  }'
```

### Eliminar tarea

```bash
curl -X DELETE http://localhost:3000/api/tasks/TASK_ID
```

## 🔧 Solución de Problemas

### Error: Cannot connect to MySQL

**Problema**: No se puede conectar a la base de datos.

**Solución**:
1. Verificar que MySQL está corriendo
2. Verificar credenciales en `.env`
3. Verificar que la base de datos `todoapp` existe

```bash
mysql -u root -p -e "SHOW DATABASES;"
```

### Error: Port 3000 already in use

**Problema**: El puerto 3000 ya está en uso.

**Solución**: Cambiar el puerto en `.env`:

```env
PORT=3001
```

### Error: Module not found

**Problema**: Faltan dependencias.

**Solución**:

```bash
rm -rf node_modules package-lock.json
npm install
```

## 📊 Estructura de la Base de Datos

La tabla `tasks` se crea automáticamente con TypeORM (synchronize: true en desarrollo).

Campos:
- `id`: VARCHAR(36) - UUID
- `title`: VARCHAR(255) - Título
- `description`: TEXT - Descripción
- `completed`: BOOLEAN - Estado
- `created_at`: TIMESTAMP - Fecha creación
- `updated_at`: TIMESTAMP - Fecha actualización
- `deleted_at`: TIMESTAMP - Soft delete

## 🔄 Integración con Frontend

Una vez que el backend esté corriendo, actualizar la URL en el frontend Ionic:

```typescript
// En el frontend: src/environments/environment.ts
export const environment = {
  production: false,
  apiUrl: 'http://localhost:3000/api'
};
```

## 📝 Próximos Pasos

1. ✅ Backend corriendo en `http://localhost:3000`
2. ⏭️ Configurar el frontend para usar esta API
3. ⏭️ Probar la sincronización offline-first
4. ⏭️ Desplegar a producción (Railway, Render, etc.)

## 🐳 Usar con Docker (Opcional)

Si prefieres usar Docker:

```bash
# Iniciar MySQL y Backend
docker-compose up -d

# Ver logs
docker-compose logs -f

# Detener
docker-compose down
```

## ✨ Listo!

El backend está configurado y listo para usar. Ahora puedes:

1. Probar los endpoints con Postman/Thunder Client
2. Integrar con el frontend Ionic
3. Desarrollar nuevas funcionalidades

Para más detalles, ver `README.md`.
