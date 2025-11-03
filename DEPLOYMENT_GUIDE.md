# 🚀 Guía de Deployment en Dokploy (Multi-Cliente)

Esta guía te ayuda a desplegar la aplicación **Modern Folio Card** en **Dokploy** para múltiples clientes.

## 📋 Índice

1. [Arquitectura](#-arquitectura)
2. [Primer Deployment (Cliente Actual)](#-primer-deployment-cliente-actual)
3. [Nuevos Deployments (Clientes Adicionales)](#-nuevos-deployments-clientes-adicionales)
4. [Solución de Problemas](#-solución-de-problemas)
5. [Conceptos Clave](#-conceptos-clave)

---

## 🏗️ Arquitectura

La aplicación se despliega usando:

- **1 Repositorio** en GitHub: `dokploy-frikilas/modern-folio-card`
- **N Deployments** en Dokploy, cada uno sirviendo a un cliente diferente

```
┌─────────────────────────────────────────────┐
│         GitHub Repository (único)           │
│     dokploy-frikilas/modern-folio-card      │
└─────────────┬───────────────────────────────┘
              │
    ┌─────────┼─────────┐
    │         │         │
    ▼         ▼         ▼
┌────────┐ ┌────────┐ ┌────────┐
│ Deploy │ │ Deploy │ │ Deploy │
│Cliente1│ │Cliente2│ │Cliente3│
└────────┘ └────────┘ └────────┘
```

Cada deployment tiene **sus propias variables de entorno** (credenciales de Airtable).

---

## 📦 Primer Deployment (Cliente Actual)

Este es el cliente que ya está en `holaa.shop/edgarmtz`.

### Paso 1: Configurar en Dokploy

#### 1.1 Ir a la Aplicación Existente

En tu panel de Dokploy, busca la aplicación actual (probablemente llamada "modern-folio-card" o similar).

#### 1.2 Activar "Strip Path"

Navega a: **Application** → **Domains** → **tu dominio actual**

```
Domain Configuration:
├─ Host: holaa.shop
├─ Path: /edgarmtz
├─ Strip Path: ❌ DESACTIVADO → ✅ ACTIVAR
├─ Container Port: 3000
└─ Internal Path: /
```

**¿Por qué?**
- Sin "Strip Path": la app recibe `/edgarmtz/page` → busca assets en `/assets/`
- Con "Strip Path": la app recibe `/page` → busca assets en `/edgarmtz/assets/` (correcto)

#### 1.3 Configurar Variables de Entorno

Navega a: **Application** → **Environment** → **Edit**

Añade o actualiza:

```env
# Airtable Configuration (cliente actual)
VITE_AIRTABLE_TOKEN=pat_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
VITE_AIRTABLE_BASE_ID=app_xxxxxxxxxxxxxxxxxxxx

# Base path for subpath deployment
VITE_BASE_PATH=/edgarmtz/
```

**Nota**: Obtén estos valores de tu archivo `.env` local o directamente de Airtable.

#### 1.4 Hacer Rebuild

Navega a: **Application** → **Deployments** → **Deploy** (botón)

O si usas CLI de Dokploy:

```bash
dokploy deploy --app=<app-id>
```

#### 1.5 Verificar Funcionamiento

- Accede a: `https://holaa.shop/edgarmtz`
- Abre la consola del navegador (F12)
- Debe **NO** tener errores 404 de assets
- Las imágenes y estilos deben cargar correctamente

---

## 🆕 Nuevos Deployments (Clientes Adicionales)

Para cada nuevo cliente, crearás un **nuevo deployment** del mismo repositorio.

### Paso 1: Crear Nuevo Deployment en Dokploy

#### 1.1 Crear Aplicación

1. En Dokploy: **Applications** → **Create Application**
2. Selecciona:
   - **Repository**: `dokploy-frikilas/modern-folio-card`
   - **Branch**: `main` (o la que uses)
3. Dale un nombre descriptivo, ej: `modern-folio-card-cliente1`

#### 1.2 Configurar Dominio

En: **Application** → **Domains** → **Connect Domain**

```
Ejemplo para "Juan":
├─ Host: juan.ejemplo.com
├─ Path: / (raíz)
├─ Strip Path: ✅ ACTIVADO (o desactivado si usas root)
├─ Container Port: 3000
└─ Internal Path: /
```

**Opciones**:

**Opción A: Dominio raíz (recomendado)**
```
Domain: juan.ejemplo.com
Path: /
VITE_BASE_PATH: /
```

**Opción B: Subdominio**
```
Domain: example.com
Path: /juan
VITE_BASE_PATH: /juan/
Strip Path: ACTIVADO
```

#### 1.3 Configurar Variables de Entorno

En: **Application** → **Environment** → **Edit**

```env
# Airtable de JUAN
VITE_AIRTABLE_TOKEN=pat_juan_xxx_token_aqui
VITE_AIRTABLE_BASE_ID=app_juan_xxx_base_id_aqui

# Base path
VITE_BASE_PATH=/                    # Si usas dominio raíz
# VITE_BASE_PATH=/juan/             # Si usas subpath
```

#### 1.4 Deploy

Navega a: **Application** → **Deployments** → **Deploy**

Espera a que termine (unos 2-3 minutos).

#### 1.5 Verificar

- Accede a `https://juan.ejemplo.com`
- Abre F12 (consola)
- Verifica que NO hay errores 404
- Prueba que los datos de Airtable de Juan se cargan

---

## 🔄 Patrón para Múltiples Clientes

Repite el **Paso 1** para cada cliente:

### Cliente 2 (María)

```env
VITE_AIRTABLE_TOKEN=pat_maria_xxx
VITE_AIRTABLE_BASE_ID=app_maria_xxx
VITE_BASE_PATH=/maria/              # O / si usa dominio raíz
```

### Cliente 3 (Pedro)

```env
VITE_AIRTABLE_TOKEN=pat_pedro_xxx
VITE_AIRTABLE_BASE_ID=app_pedro_xxx
VITE_BASE_PATH=/
```

---

## 📋 Checklist de Deployment

Antes de hacer deploy, verifica:

- [ ] **Variables de Airtable**
  - [ ] `VITE_AIRTABLE_TOKEN` ✓
  - [ ] `VITE_AIRTABLE_BASE_ID` ✓

- [ ] **Base Path**
  - [ ] `VITE_BASE_PATH` configurado correctamente
  - [ ] Coincide con el "Path" del dominio

- [ ] **Strip Path (si aplica)**
  - [ ] Activado cuando usas `/subpath`
  - [ ] Desactivado cuando usas root `/`

- [ ] **Dockerfile**
  - [ ] Puerto 3000 correctamente expuesto
  - [ ] Build arguments configurados (si los usas)

---

## 🐛 Solución de Problemas

### Problema 1: Error 404 "Failed to load resource"

**Síntoma**: Accedes a `holaa.shop/edgarmtz` pero los assets (CSS, JS) dan 404.

**Causa**: `VITE_BASE_PATH` no está configurado, o "Strip Path" no está activado.

**Solución**:
1. Verifica `VITE_BASE_PATH=/edgarmtz/` en variables de entorno
2. Activa "Strip Path" en Domain Configuration
3. Haz Rebuild

### Problema 2: MIME type error (text/plain en lugar de text/css)

**Síntoma**: CSS no se aplica, consola muestra:
```
Resource interpreted as Stylesheet but transferred with MIME type text/plain
```

**Causa**: Assets se buscan en ruta incorrecta.

**Solución**: Mismo que Problema 1.

### Problema 3: Datos de Airtable no cargan

**Síntoma**: Página carga pero está vacía, sin datos.

**Causa**: Token o Base ID de Airtable incorrecto.

**Solución**:
1. Verifica credenciales en .env local
2. Abre Airtable y confirma que el token sigue siendo válido
3. Reconfirma el Base ID (URL de Airtable)
4. Haz Rebuild

### Problema 4: Docker build falla

**Síntoma**:
```
Error: npm ERR! code E404 Not Found - GET ...
```

**Causa**: Problema con dependencias o conexión a npm.

**Solución**:
1. Intenta nuevamente (problemas temporales de conectividad)
2. Verifica `package.json` está bien formado
3. Revisa logs de Dokploy en **Deployments**

---

## 💡 Conceptos Clave

### 1. Variables de Entorno en Vite

En Vite, accedes a variables de entorno con `import.meta.env`:

```typescript
const token = import.meta.env.VITE_AIRTABLE_TOKEN;  // ✅ Correcto
const token = process.env.VITE_AIRTABLE_TOKEN;     // ❌ Incorrecto
```

**Importante**: Las variables **DEBEN empezar con `VITE_`** para estar disponibles en el frontend.

### 2. Strip Path en Dokploy

```
Sin Strip Path:
  Request: /edgarmtz/page
  ↓
  App recibe: /edgarmtz/page
  Assets en: /edgarmtz/assets/ ✓

Con Strip Path:
  Request: /edgarmtz/page
  ↓
  App recibe: /page
  Vite busca en: /assets/ ❌ (debería ser /edgarmtz/assets/)
```

**Para deployments con subpath**:
- Activa "Strip Path"
- Configura `VITE_BASE_PATH=/edgarmtz/`
- Vite sabrá dónde buscar los assets

### 3. Build en Tiempo de Compilación

Las variables `VITE_*` se **reemplazan en tiempo de build**, no en tiempo de ejecución.

```
Build Stage:
  ↓
  Node.js lee .env
  ↓
  npm run build
  ↓
  Vite reemplaza import.meta.env.VITE_* con valores reales
  ↓
  Los assets finales (dist/) contienen los valores compilados
```

Por eso cada cliente necesita su propio **deploy**, no solo cambiar variables en runtime.

---

## 🔗 Referencias

- [Dokumentación de Vite - Variables de Entorno](https://vitejs.dev/guide/env-and-mode.html)
- [Documentación de Dokploy](https://dokploy.com/docs)
- [Airtable API Documentation](https://airtable.com/api)

---

## 📞 Soporte

Si tienes problemas:

1. Revisa los logs en Dokploy: **Application** → **Deployments** → **Logs**
2. Abre la consola del navegador (F12) para ver errores
3. Verifica las variables de entorno están correctas
4. Intenta hacer un nuevo Rebuild

---

**Última actualización**: Noviembre 2024
