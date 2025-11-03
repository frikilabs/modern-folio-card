# 🚀 Quick Start - Multi-Cliente Setup

**Objetivo**: Transformar tu aplicación de un deployment único para un cliente a **múltiples deployments para múltiples clientes**.

---

## 📚 Documentación Disponible

| Documento | Propósito | Para Quién |
|-----------|----------|-----------|
| **README.md** | Descripción general y setup local | Todos |
| **DOKPLOY_CHECKLIST.md** | ⚡ **LEER PRIMERO** - Pasos para configurar cliente actual | Tu implementación ahora |
| **DEPLOYMENT_GUIDE.md** | Guía completa para nuevos deployments | Implementar después |

---

## ⚡ Plan de Ejecución (4 Fases)

### Fase 1 ✅ COMPLETADA
**Auditar el código y preparar el repositorio**

- [x] Encontrados archivos que usan tokens de Airtable
- [x] Verificado que usan `import.meta.env` (sintaxis Vite correcta)
- [x] Identificados todos los cambios necesarios

**Cambios hechos:**
- ✅ vite.config.ts: `process.env` → `import.meta.env`
- ✅ .env.example: Añadido VITE_BASE_PATH
- ✅ vite-env.d.ts: Tipos TypeScript para variables de entorno
- ✅ README.md: Guía de deployment multi-cliente
- ✅ DEPLOYMENT_GUIDE.md: Instrucciones detalladas

**Status en GitHub**: ✅ Pusheado a `main`

---

### Fase 2 ✅ COMPLETADA
**Preparar repositorio**

- [x] Código actualizado en GitHub
- [x] Documentación lista
- [x] Variables de entorno tipadas

**Siguiente**: Configurar Dokploy

---

### Fase 3 🔄 PRÓXIMO PASO
**Configurar tu deployment actual en Dokploy**

**⚡ Lee**: [`DOKPLOY_CHECKLIST.md`](./DOKPLOY_CHECKLIST.md)

**Tareas**:
1. Activar "Strip Path" en Domain Configuration
2. Añadir variables de entorno:
   - `VITE_AIRTABLE_TOKEN`
   - `VITE_AIRTABLE_BASE_ID`
   - `VITE_BASE_PATH=/edgarmtz/`
3. Hacer Rebuild
4. Verificar que funciona en `holaa.shop/edgarmtz`

**Tiempo estimado**: 10 minutos

**Resultado esperado**: `holaa.shop/edgarmtz` funciona correctamente sin errores 404

---

### Fase 4 🔮 DESPUÉS
**Crear deployments adicionales para nuevos clientes**

**📖 Lee**: [`DEPLOYMENT_GUIDE.md`](./DEPLOYMENT_GUIDE.md)

**Patrón**:
```
Para cada nuevo cliente:
1. Crear nuevo Application en Dokploy (mismo repo)
2. Configurar dominio (ej: juan.ejemplo.com)
3. Configurar variables de entorno (credenciales del cliente)
4. Deploy
5. Verificar funcionamiento
```

**Tiempo por cliente**: 5-10 minutos

---

## 🎯 Arquitectura Final

```
GitHub (1 Repositorio)
└─ dokploy-frikilas/modern-folio-card
   ├─ Código genérico
   ├─ Sin credenciales hardcodeadas
   └─ Listo para N deployments

Dokploy (N Deployments)
├─ Cliente 1 (Actual: edgarmtz)
│  ├─ Dominio: holaa.shop/edgarmtz
│  ├─ VITE_AIRTABLE_TOKEN: token_cliente1
│  └─ VITE_AIRTABLE_BASE_ID: base_id_cliente1
│
├─ Cliente 2 (Nuevo)
│  ├─ Dominio: juan.ejemplo.com
│  ├─ VITE_AIRTABLE_TOKEN: token_cliente2
│  └─ VITE_AIRTABLE_BASE_ID: base_id_cliente2
│
└─ Cliente 3 (Nuevo)
   ├─ Dominio: maria.ejemplo.com
   ├─ VITE_AIRTABLE_TOKEN: token_cliente3
   └─ VITE_AIRTABLE_BASE_ID: base_id_cliente3
```

---

## 📋 Checklist Rápido

### ✅ Hoy (Fase 3)

- [ ] Leo `DOKPLOY_CHECKLIST.md`
- [ ] Activo "Strip Path" en Dokploy
- [ ] Configuro variables de entorno
- [ ] Hago Rebuild
- [ ] Verifico que `holaa.shop/edgarmtz` funciona
- [ ] Confirmo que NO hay errores 404

### 🔮 Mañana (Fase 4)

- [ ] Leo `DEPLOYMENT_GUIDE.md`
- [ ] Creo nuevo Application en Dokploy
- [ ] Configuro cliente 2 con sus credenciales
- [ ] Verifico funcionamiento
- [ ] Repito para cliente 3, 4, N...

---

## 🔑 Conceptos Clave

### Variables de Entorno en Vite

```typescript
// ✅ CORRECTO (Vite)
const token = import.meta.env.VITE_AIRTABLE_TOKEN;

// ❌ INCORRECTO (React normal)
const token = process.env.VITE_AIRTABLE_TOKEN;
```

**Importante**: Variables **DEBEN empezar con `VITE_`** para estar disponibles en frontend.

### Build en Tiempo de Compilación

```
npm run build
   ↓
Vite lee .env
   ↓
Reemplaza import.meta.env.VITE_* con valores reales
   ↓
Genera dist/ con variables compiladas
   ↓
Docker copia dist/ al contenedor
```

**Por eso**: Cada cliente necesita su propio **Build/Deploy**, no solo cambiar variables.

### Strip Path en Dokploy

```
SIN Strip Path:
  /edgarmtz/page → app recibe /edgarmtz/page → busca assets en /assets/ ❌

CON Strip Path:
  /edgarmtz/page → app recibe /page → busca assets en /assets/ ❌ (sin VITE_BASE_PATH)

CON Strip Path + VITE_BASE_PATH=/edgarmtz/:
  /edgarmtz/page → app recibe /page → busca assets en /edgarmtz/assets/ ✅
```

---

## 📞 ¿Necesitas Ayuda?

**Antes de proseguir a Fase 3:**
- ¿Entiendes la arquitectura multi-cliente?
- ¿Sabes dónde acceder a Dokploy?
- ¿Tienes tus credenciales de Airtable a mano?

Si respondiste "no" a alguna, revisa:
1. README.md (conceptos generales)
2. DEPLOYMENT_GUIDE.md (arquitectura detallada)
3. DOKPLOY_CHECKLIST.md (pasos específicos)

---

## 🚀 ¡Comenzamos!

**Siguiente paso**: Abre [`DOKPLOY_CHECKLIST.md`](./DOKPLOY_CHECKLIST.md) y sigue los 5 pasos.

**Tiempo estimado**: 10 minutos

**Resultado**: Tu aplicación actual funcionando correctamente en `holaa.shop/edgarmtz` ✅

---

*Última actualización: Nov 2024*
