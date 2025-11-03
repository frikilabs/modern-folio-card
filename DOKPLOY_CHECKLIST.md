# ✅ Checklist: Configuración Actual en Dokploy

Este archivo contiene los **pasos exactos** para configurar el deployment actual en Dokploy (cliente en `holaa.shop/edgarmtz`).

---

## 📍 FASE 3: Configurar Dokploy (Deployment Actual)

### Paso 1: Acceder al Panel de Dokploy

1. Abre tu panel de Dokploy
2. Busca la aplicación actual: `modern-folio-card` (o como esté nombrada)
3. Accede a la aplicación

### Paso 2: Activar "Strip Path" en Domain Configuration

**Ubicación**: Application → Domains → [Tu dominio actual]

**Configuración ANTES:**
```
Domain Configuration:
├─ Host: holaa.shop
├─ Path: /edgarmtz
├─ Strip Path: ❌ DESACTIVADO ← AQUÍ
├─ Container Port: 3000
├─ Internal Path: /
└─ Forward Path: ...
```

**Configuración DESPUÉS:**
```
Domain Configuration:
├─ Host: holaa.shop
├─ Path: /edgarmtz
├─ Strip Path: ✅ ACTIVADO ← CAMBIO AQUÍ
├─ Container Port: 3000
├─ Internal Path: /
└─ Forward Path: ...
```

1. Haz clic en el toggle de "Strip Path" para **ACTIVARLO**
2. Guarda los cambios

---

### Paso 3: Configurar Variables de Entorno

**Ubicación**: Application → Environment → Edit

1. Abre la sección de variables de entorno
2. Reemplaza o añade lo siguiente:

```env
# ===== Airtable Configuration =====
VITE_AIRTABLE_TOKEN=pat_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
VITE_AIRTABLE_BASE_ID=app_xxxxxxxxxxxxxxxxxxxx

# ===== Base Path Configuration =====
VITE_BASE_PATH=/edgarmtz/
```

**Donde:**
- `VITE_AIRTABLE_TOKEN`: Copia el valor de tu archivo `.env` local (línea 5)
- `VITE_AIRTABLE_BASE_ID`: Copia el valor de tu archivo `.env` local (línea 8)
- `VITE_BASE_PATH`: **IMPORTANTE** - Usa `/edgarmtz/` (con barras al inicio y final)

3. **Guarda** los cambios

---

### Paso 4: Hacer Rebuild (Redeploy)

**Ubicación**: Application → Deployments

1. Busca el botón **"Deploy"** (o similar)
2. Haz clic para iniciar el rebuild
3. Espera a que termine (2-3 minutos aproximadamente)
4. Verifica que el status sea **"Success"** o **"Running"**

**Alternativa por CLI** (si tienes acceso):
```bash
dokploy deploy --app=<app-id>
```

---

### Paso 5: Verificar que Funciona

1. Abre tu navegador
2. Ve a: `https://holaa.shop/edgarmtz`
3. Abre la **Consola del Navegador** (F12 o Cmd+Option+J en Mac)
4. En la pestaña **"Console"**, verifica que **NO hay errores rojo**
5. En la pestaña **"Network"**, verifica que los assets cargan correctamente:
   - Los archivos `.js` y `.css` deben estar con status **200**
   - NO deben ser **404**

**Si ves errores 404 de assets:**
- Vuelve a Paso 2 y verifica que "Strip Path" está **ACTIVADO**
- Ve a Paso 3 y verifica que `VITE_BASE_PATH=/edgarmtz/` está configurado
- Haz Rebuild nuevamente

---

## 🎯 Resumen Visual

```
┌─────────────────────────────────────┐
│  Tu Aplikación en Dokploy (ACTUAL)  │
├─────────────────────────────────────┤
│ Dominio: holaa.shop                 │
│ Path: /edgarmtz                     │
├─────────────────────────────────────┤
│ 🔧 CAMBIOS REQUERIDOS:              │
├─────────────────────────────────────┤
│ 1. ✅ Strip Path: ACTIVAR           │
│ 2. ✅ VITE_BASE_PATH=/edgarmtz/     │
│ 3. ✅ Tokens de Airtable (copiar)   │
│ 4. ✅ Rebuild                       │
│ 5. ✅ Verificar funcionamiento      │
└─────────────────────────────────────┘
```

---

## ⚠️ Notas Importantes

**¿Por qué "Strip Path"?**
- El navegador pide: `/edgarmtz/page`
- Dokploy lo envía a tu app como: `/page` (cuando Strip Path está activado)
- Vite sabe que está en `/edgarmtz/` gracias a `VITE_BASE_PATH`
- Vite busca assets en: `/edgarmtz/assets/` ✅

**¿Por qué `VITE_BASE_PATH=/edgarmtz/`?**
- Vite usa esto durante la compilación (npm run build)
- Reemplaza todas las referencias de assets para usar la ruta correcta
- Importante tener la barra al inicio (`/`) y al final (`/`)

**¿Por qué hay que Rebuild?**
- Las variables `VITE_*` se "inyectan" durante la compilación
- Cambiar el `.env` en runtime NO actualiza la app
- Por eso necesitas hacer un nuevo Build (Rebuild/Deploy)

---

## ✅ Checklist Completo

- [ ] Paso 1: Accedido al Panel de Dokploy
- [ ] Paso 2: Activado "Strip Path"
- [ ] Paso 3: Variables de Entorno configuradas
  - [ ] VITE_AIRTABLE_TOKEN ✓
  - [ ] VITE_AIRTABLE_BASE_ID ✓
  - [ ] VITE_BASE_PATH=/edgarmtz/ ✓
- [ ] Paso 4: Rebuild completado
- [ ] Paso 5: Verificado que funciona en `holaa.shop/edgarmtz`
  - [ ] Página carga sin errores
  - [ ] CSS se ve correctamente
  - [ ] Consola sin errores 404
  - [ ] Datos de Airtable cargan

---

## 🆘 Si algo falla

**Síntoma: 404 - Failed to load resource**
- Verifica Strip Path está **ON**
- Verifica `VITE_BASE_PATH=/edgarmtz/`
- Haz Rebuild

**Síntoma: CSS sin aplicar (MIME type error)**
- Mismo que arriba

**Síntoma: Página blanca sin datos**
- Verifica que VITE_AIRTABLE_TOKEN es válido
- Verifica que VITE_AIRTABLE_BASE_ID es correcto
- Haz Rebuild

**Síntoma: Rebuild falla**
- Revisa los logs en Dokploy → Deployments
- Intenta de nuevo (problemas temporales de conectividad)

---

**¡Listo para comenzar!** 🚀
