# Configuración de Variables de Entorno

Este proyecto utiliza diferentes archivos de configuración según el entorno de ejecución.

## Archivos de Entorno

- `.env.development` - Configuración para desarrollo
- `.env.production` - Configuración para producción
- `.env.example` - Plantilla con todas las variables necesarias

## Variables de Entorno

### Aplicación
- `NODE_ENV`: Entorno de ejecución (`development` o `production`)
- `PORT`: Puerto en el que corre la aplicación (por defecto: 3000)

### Base de Datos
- `DB_HOST`: Host de la base de datos
- `DB_PORT`: Puerto de la base de datos (por defecto: 3306)
- `DB_USERNAME`: Usuario de la base de datos
- `DB_PASSWORD`: Contraseña de la base de datos
- `DB_DATABASE`: Nombre de la base de datos

### CORS
- `CORS_ENABLED`: Habilitar CORS (`true` o `false`)
- `CORS_ORIGIN`: Origen permitido para CORS

## Configuración por Entorno

### Desarrollo
- **Synchronize**: `true` - TypeORM sincroniza automáticamente el esquema
- **Logging**: `true` - Se registran todas las consultas SQL
- **CORS**: Habilitado para `http://localhost:4200`

### Producción
- **Synchronize**: `false` - No se sincroniza automáticamente (usar migraciones)
- **Logging**: `false` - No se registran consultas SQL
- **CORS**: Configurado según el dominio de producción

## Uso

### Desarrollo
```bash
# El archivo .env.development se carga automáticamente
npm run start:dev
```

### Producción
```bash
# Configurar NODE_ENV=production para cargar .env.production
NODE_ENV=production npm run start:prod
```

## Configuración Inicial

1. Copiar `.env.example` a `.env.development`:
   ```bash
   cp .env.example .env.development
   ```

2. Copiar `.env.example` a `.env.production`:
   ```bash
   cp .env.example .env.production
   ```

3. Editar cada archivo con los valores correspondientes a cada entorno.

## Seguridad

⚠️ **IMPORTANTE**: Los archivos `.env.development` y `.env.production` están en `.gitignore` y NO deben ser versionados. Solo `.env.example` debe estar en el repositorio.
