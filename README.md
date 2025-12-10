# LA_SOBERANA Back

API REST desarrollada con NestJS para la gestión de inventarios, productos, usuarios y almacenes.

## 📋 Prerrequisitos

Antes de comenzar, asegúrate de tener instalado:

- **Node.js** (versión 18 o superior)
- **npm** (versión 8 o superior) o **yarn**
- **PostgreSQL** (versión 15 o superior) - Solo si ejecutas sin Docker
- **Docker** y **Docker Compose** (opcional, pero recomendado)

## 🚀 Instalación y Configuración

### Opción 1: Desarrollo Local (Sin Docker)

#### Paso 1: Clonar el repositorio

```bash
git clone <repository-url>
cd back
```

#### Paso 2: Instalar dependencias

```bash
npm install
```

#### Paso 3: Configurar PostgreSQL

Asegúrate de tener PostgreSQL corriendo en tu máquina local:

```bash
# Crear la base de datos
createdb templra_db

# O usando psql
psql -U postgres
CREATE DATABASE templra_db;
\q
```

#### Paso 4: Crear archivo de variables de entorno

Crea un archivo `.env` en la raíz del proyecto con la siguiente configuración:

```env
# Puerto de la aplicación
PORT=3000

# Configuración de base de datos
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=postgres
DB_DATABASE=templra_db
DB_SCHEMA=public

# Configuración JWT
JWT_SECRET=tu-clave-secreta-aqui-cambiar-en-produccion
JWT_EXPIRES_IN=24h

# Configuración de hash de contraseñas
PASSWORD_HASH_SALT=10

# Configuración SendGrid (para envío de emails)
SENDGRID_API_KEY=tu-api-key-de-sendgrid
SENDGRID_FROM=noreply@example.com

# Configuración Mailer
MAILER_URL=http://localhost:3000
MAILER_API_KEY=tu-api-key-del-mailer

# Configuración reCAPTCHA
CAPTCHA_KEY=tu-clave-secreta-de-recaptcha

# Configuración general
DOC_ENABLED=true
TZ=UTC
NODE_ENV=development
```

**⚠️ Importante:** 
- Reemplaza los valores de ejemplo con tus propias credenciales
- Nunca subas el archivo `.env` al repositorio (ya está en `.gitignore`)

#### Paso 5: Ejecutar el proyecto

```bash
# Modo desarrollo (con hot-reload)
npm run start:dev

# Modo producción
npm run build
npm run start:prod
```

#### Paso 6: Verificar que la aplicación esté corriendo

Una vez iniciada, deberías ver en la consola:

```
LOG 🚀 Application ⇢ http://localhost:3000/api
LOG 📖 Swagger ⇢ http://localhost:3000/docs
```

**Accesos:**
- **API REST:** http://localhost:3000/api
- **Documentación Swagger:** http://localhost:3000/docs
- **Base de datos:** localhost:5432

---

### Opción 2: Desarrollo con Docker (Recomendado)

Esta es la forma más sencilla de ejecutar el proyecto, ya que incluye PostgreSQL y todas las dependencias.

#### Paso 1: Clonar el repositorio

```bash
git clone <repository-url>
cd back
```

#### Paso 2: Ejecutar con Docker Compose

**Para desarrollo (con hot-reload):**

```bash
docker-compose -f docker-compose.dev.yml up --build
```

**Para producción:**

```bash
docker-compose up --build
```

#### Paso 3: Verificar que los contenedores estén corriendo

```bash
# Ver estado de los contenedores
docker-compose ps

# Ver logs de la aplicación
docker-compose logs -f app
```

#### Paso 4: Acceder a la aplicación

- **API REST:** http://localhost:3000/api
- **Documentación Swagger:** http://localhost:3000/docs
- **PostgreSQL:** localhost:5432

**Comandos útiles de Docker:**

```bash
# Detener los contenedores
docker-compose down

# Detener y eliminar volúmenes (⚠️ elimina la base de datos)
docker-compose down -v

# Ver logs en tiempo real
docker-compose logs -f app

# Reiniciar los contenedores
docker-compose restart
```

> 📖 **Para más información sobre Docker, consulta:** [DOCKER_INSTRUCCIONES.md](./DOCKER_INSTRUCCIONES.md)

---

## 🔧 Scripts Disponibles

```bash
# Desarrollo
npm run start:dev          # Inicia en modo desarrollo con hot-reload

# Producción
npm run build              # Compila el proyecto
npm run start:prod         # Inicia en modo producción

# Calidad de código
npm run lint               # Ejecuta el linter
npm run format             # Formatea el código con Prettier

# Testing
npm run test               # Ejecuta los tests unitarios
npm run test:watch         # Ejecuta tests en modo watch
npm run test:cov           # Ejecuta tests con cobertura
npm run test:e2e           # Ejecuta tests end-to-end
```

---

## 📁 Estructura del Proyecto

```
back/
├── src/
│   ├── app/                    # Módulos de la aplicación
│   │   ├── auth/               # Autenticación y autorización
│   │   ├── users/              # Gestión de usuarios
│   │   ├── product/            # Gestión de productos
│   │   ├── warehouse/           # Gestión de almacenes
│   │   ├── inventory-count/    # Conteos de inventario
│   │   ├── inventory-line/     # Líneas de inventario
│   │   └── ...
│   ├── common/                 # Código compartido
│   ├── utils/                  # Utilidades
│   └── main.ts                 # Punto de entrada
├── test/                       # Tests
├── docker-compose.yml          # Configuración Docker (producción)
├── docker-compose.dev.yml      # Configuración Docker (desarrollo)
├── Dockerfile                  # Dockerfile para producción
├── Dockerfile.dev              # Dockerfile para desarrollo
└── package.json               # Dependencias y scripts
```

---

## 🗄️ Base de Datos

### Configuración

El proyecto usa **PostgreSQL** como base de datos. La configuración se realiza mediante variables de entorno:

- `DB_HOST`: Host de PostgreSQL
- `DB_PORT`: Puerto (por defecto 5432)
- `DB_USERNAME`: Usuario
- `DB_PASSWORD`: Contraseña
- `DB_DATABASE`: Nombre de la base de datos
- `DB_SCHEMA`: Esquema (por defecto 'public')

### Migraciones

- **En desarrollo:** TypeORM sincroniza automáticamente el esquema (`synchronize: true`)
- **En producción:** Las migraciones se ejecutan automáticamente al iniciar (`migrationsRun: true`)

---

## 🔐 Variables de Entorno

### Variables Requeridas

| Variable | Descripción | Ejemplo |
|----------|-------------|---------|
| `PORT` | Puerto de la aplicación | `3000` |
| `DB_HOST` | Host de PostgreSQL | `localhost` o `postgres` (Docker) |
| `DB_PORT` | Puerto de PostgreSQL | `5432` |
| `DB_USERNAME` | Usuario de PostgreSQL | `postgres` |
| `DB_PASSWORD` | Contraseña de PostgreSQL | `postgres` |
| `DB_DATABASE` | Nombre de la base de datos | `templra_db` |
| `JWT_SECRET` | Clave secreta para JWT | `tu-clave-secreta` |
| `JWT_EXPIRES_IN` | Tiempo de expiración del token | `24h` |
| `PASSWORD_HASH_SALT` | Salt para hash de contraseñas | `10` |

### Variables Opcionales

| Variable | Descripción | Valor por Defecto |
|----------|-------------|-------------------|
| `DOC_ENABLED` | Habilitar documentación Swagger | `true` |
| `NODE_ENV` | Entorno de ejecución | `development` |
| `TZ` | Zona horaria | `UTC` |
| `SENDGRID_API_KEY` | API Key de SendGrid | - |
| `MAILER_API_KEY` | API Key del mailer | - |
| `CAPTCHA_KEY` | Clave secreta de reCAPTCHA | - |

---

## 🐛 Solución de Problemas

### Error: "Cannot connect to database"

1. Verifica que PostgreSQL esté corriendo:
   ```bash
   # Windows
   services.msc

   # Linux/Mac
   sudo systemctl status postgresql
   ```

2. Verifica las credenciales en el archivo `.env`

3. Verifica que el puerto 5432 no esté en uso:
   ```bash
   # Windows
   netstat -ano | findstr :5432

   # Linux/Mac
   lsof -i :5432
   ```

### Error: "Port 3000 is already in use"

1. Cambia el puerto en el archivo `.env`:
   ```env
   PORT=3001
   ```

2. O detén el proceso que está usando el puerto 3000

### Error: "Module not found"

1. Elimina `node_modules` y reinstala:
   ```bash
   rm -rf node_modules
   npm install
   ```

### La aplicación no inicia en Docker

1. Verifica los logs:
   ```bash
   docker-compose logs app
   ```

2. Reconstruye sin caché:
   ```bash
   docker-compose build --no-cache
   docker-compose up
   ```

---

## 📚 Documentación Adicional

- **Docker:** Consulta [DOCKER_INSTRUCCIONES.md](./DOCKER_INSTRUCCIONES.md) para una guía completa de Docker
- **API:** Accede a la documentación Swagger en http://localhost:3000/docs cuando la aplicación esté corriendo

## Git Flow

This project follows the Git flow branching model for development and collaboration. The main branches used are:

- master: Represents the production-ready code.
- develop: Serves as the main branch for ongoing development.
- feature/<feature-name>: Used for developing new features.
- bugfix/<bugfix-name>: Used for fixing bugs.
- hotfix/<hotfix-name>: Used for critical fixes in production.
- release/<release-version>: Marks a release point for a specific version.

## Commits:

```bash
     <type>: `[JIRA-123] Describes the type of the commit. Some common types include:
     feat: A new feature
     fix: A bug fix
     docs: Documentation changes
     style: Code style changes (formatting, indentation, etc.)
     refactor: Code refactoring or restructuring
     test: Adding or modifying tests
     chore: Maintenance tasks, build system updates, etc.
     <subject>: A concise description of the commit. Use imperative verbs and keep it under 50 characters.
     <body>: A detailed explanation of the changes. Include relevant information, context, and any additional details about the commit. It can be multiple lines.
     <footer>: Additional information related to the commit, such as references to issue trackers or related pull requests.
```

## 🧪 Testing

```bash
# Ejecutar todos los tests
npm run test

# Ejecutar tests en modo watch
npm run test:watch

# Ejecutar tests con cobertura
npm run test:cov

# Ejecutar tests end-to-end
npm run test:e2e
```

---

## 📦 Build para Producción

```bash
# Compilar el proyecto
npm run build

# Ejecutar en producción
npm run start:prod
```

---

## 🤝 Contribuir

Este proyecto sigue el modelo de ramificación Git Flow:

- **master:** Código listo para producción
- **develop:** Rama principal de desarrollo
- **feature/<nombre>:** Para nuevas funcionalidades
- **bugfix/<nombre>:** Para corrección de bugs
- **hotfix/<nombre>:** Para correcciones críticas en producción
- **release/<version>:** Para marcar un punto de release

### Convención de Commits

```bash
<type>: [JIRA-123] Descripción breve

Descripción detallada (opcional)

Tipos de commit:
- feat: Nueva funcionalidad
- fix: Corrección de bug
- docs: Cambios en documentación
- style: Cambios de formato (sin afectar código)
- refactor: Refactorización de código
- test: Agregar o modificar tests
- chore: Tareas de mantenimiento
```

---

## 📄 Licencia

Este proyecto es privado y no tiene licencia pública.

