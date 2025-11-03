# Modern Folio Card - Multi-Cliente Profile Generator

Un generador de tarjetas de perfil moderno (vCards) con Airtable como backend, diseñado para servir múltiples clientes desde una única instancia de código.

## 🎯 Características

- **Multi-Cliente**: Despliega una sola aplicación para múltiples clientes con sus propios datos de Airtable
- **Fully Typed**: TypeScript en todo el proyecto
- **Moderno**: React 18 + Vite + Tailwind CSS + shadcn/ui
- **Escalable**: Airtable como base de datos (sin servidor backend)
- **Componentes**: Tarjetas de contacto, redes sociales, galería, videos, experiencia, ubicación y más

## 🚀 Inicio Rápido (Desarrollo Local)

### Requisitos
- Node.js 20+ ([instalar con nvm](https://github.com/nvm-sh/nvm#installing-and-updating))
- npm o pnpm

### Setup

```sh
# 1. Clonar el repositorio
git clone <REPO_URL>
cd modern-folio-card

# 2. Instalar dependencias
npm install

# 3. Crear archivo .env local (basado en .env.example)
cp .env.example .env

# 4. Configurar variables de Airtable en .env
# Abre tu base en Airtable y obtén:
# - VITE_AIRTABLE_TOKEN: https://airtable.com/create/tokens
# - VITE_AIRTABLE_BASE_ID: De la URL https://airtable.com/[BASE_ID]/...

# 5. Iniciar servidor de desarrollo
npm run dev
# Accede a: http://localhost:8080
```

## 🔧 Tecnologías

- **Frontend**: React 18 + TypeScript
- **Build**: Vite con SWC
- **Estilos**: Tailwind CSS + shadcn/ui
- **Base de Datos**: Airtable API
- **Routing**: React Router
- **Formularios**: React Hook Form + Zod
- **Estado**: TanStack React Query
- **Deploy**: Docker + Dokploy

## 📊 Variables de Entorno

```env
# REQUERIDAS - Credenciales de Airtable
VITE_AIRTABLE_TOKEN=pat_xxx...          # Personal Access Token
VITE_AIRTABLE_BASE_ID=app_xxx...        # ID de tu base en Airtable

# OPCIONAL - Nombres de tablas (estos son los valores por defecto)
VITE_AIRTABLE_CONFIG_TABLE=Configuracion
VITE_AIRTABLE_CONTACT_TABLE=Contacto
VITE_AIRTABLE_SOCIAL_TABLE=Redes
VITE_AIRTABLE_GALLERY_TABLE=Galeria
VITE_AIRTABLE_VIDEOS_TABLE=Videos
VITE_AIRTABLE_EXPERIENCE_TABLE=Experiencia
VITE_AIRTABLE_SOBREMI_TABLE=SobreMi
VITE_AIRTABLE_UBICACION_TABLE=Ubicacion
VITE_AIRTABLE_POSICION_TABLE=PosicionTarjeta
VITE_AIRTABLE_COLABORAR_TABLE=Colaborar
VITE_AIRTABLE_PERSONALIZACION_TABLE=Personalizacion

# OPCIONAL - Para deployments con subrutas
VITE_BASE_PATH=/                        # "/" para raíz, "/app/" para subruta
```

## 🌐 Deployment en Dokploy (Multi-Cliente)

Este proyecto está diseñado para **desplegarse múltiples veces en Dokploy**, cada instancia sirviendo a un cliente diferente.

### Arquitectura Multi-Cliente

```
1 Repositorio en GitHub
    ↓
N Deployments en Dokploy (uno por cliente)
    ├─ Cliente 1: juan.ejemplo.com
    ├─ Cliente 2: maria.ejemplo.com
    └─ Cliente 3: pedro.ejemplo.com
```

Cada deployment tiene sus **propias credenciales de Airtable** sin necesidad de clonar el repositorio.

### Pasos para Desplegar un Cliente

**Ver archivo `DEPLOYMENT_GUIDE.md` para instrucciones detalladas en Dokploy.**

Resumen rápido:

1. En Dokploy, crear un nuevo **Application** desde este repositorio
2. Configurar **Environment Variables**:
   ```
   VITE_AIRTABLE_TOKEN=token_del_cliente
   VITE_AIRTABLE_BASE_ID=base_id_del_cliente
   VITE_BASE_PATH=/                    # O /cliente/ si usas subrutas
   ```
3. Conectar un **Dominio**
4. Hacer **Deploy**

### Ejemplo: Cliente "Juan"

Si quieres que "Juan" acceda desde `juan.ejemplo.com`:

```
Domain: juan.ejemplo.com
Env Variables:
  VITE_AIRTABLE_TOKEN=pat_juan_xxx...
  VITE_AIRTABLE_BASE_ID=app_juan_xxx...
  VITE_BASE_PATH=/
```

## 🛠️ Desarrollo

### Scripts

```sh
npm run dev      # Inicia servidor de desarrollo (puerto 8080)
npm run build    # Build para producción
npm run preview  # Preview del build (puerto 3000)
npm run lint     # Ejecutar ESLint
```

### Estructura del Proyecto

```
src/
├── components/       # Componentes de UI (Card, Contact, etc.)
├── pages/           # Páginas de la aplicación
├── hooks/           # Custom hooks (useAirtable, useToast, etc.)
├── services/        # Servicios de Airtable (CRUD)
├── lib/            # Configuración de Airtable y utilidades
├── types/          # Definiciones de tipos TypeScript
├── utils/          # Funciones auxiliares
├── App.tsx         # Componente raíz
├── main.tsx        # Punto de entrada
└── index.css       # Estilos globales
```

## 🐳 Docker

El proyecto incluye un `Dockerfile` multi-stage optimizado:

```sh
# Build y ejecutar con Docker
docker build -t modern-folio-card .
docker run -p 3000:3000 \
  -e VITE_AIRTABLE_TOKEN=xxx \
  -e VITE_AIRTABLE_BASE_ID=xxx \
  modern-folio-card
```

## 🔐 Seguridad

- **Nunca commits variables de entorno** (usa `.env` local, no en GitHub)
- Las credenciales de Airtable se cargan **en tiempo de compilación** (Vite)
- El archivo `.env` está en `.gitignore`

## 📝 Documentación Adicional

- `DEPLOYMENT_GUIDE.md` - Instrucciones detalladas para Dokploy
- `.env.example` - Template de variables de entorno
- `src/lib/airtable.ts` - Configuración central de Airtable

## 📄 Licencia

Este proyecto es privado. Para más información, contacta al equipo de desarrollo.
