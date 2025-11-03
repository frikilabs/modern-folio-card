# 🔧 React Router Fix: Subpath Deployments

## El Problema 🔴

Cuando tu aplicación está en una **subruta** como `/edgarmtz/`, React Router no sabía dónde estaba realmente la app.

### Antes (Incorrecto)

```typescript
// src/App.tsx
<BrowserRouter>  {/* ❌ Sin basename */}
  <Routes>
    <Route path="/" element={<Index />} />
  </Routes>
</BrowserRouter>
```

**Lo que pasaba:**
```
Usuario accede a: holaa.shop/edgarmtz
     ↓
React Router recibe: /edgarmtz
     ↓
React Router busca ruta: "/"
     ↓
NO ENCUENTRA /edgarmtz en sus rutas
     ↓
Muestra 404 ❌
```

---

## La Solución ✅

Usar el prop `basename` de `BrowserRouter`:

### Después (Correcto)

```typescript
// src/App.tsx
<BrowserRouter basename={import.meta.env.VITE_BASE_PATH || "/"}>
  {/* ✅ Con basename */}
  <Routes>
    <Route path="/" element={<Index />} />
  </Routes>
</BrowserRouter>
```

**Ahora funciona:**
```
Usuario accede a: holaa.shop/edgarmtz
     ↓
React Router recibe: /edgarmtz
     ↓
basename le dice: "la app está en /edgarmtz/"
     ↓
React Router traduce /edgarmtz → /
     ↓
Encuentra ruta "/" en sus Routes
     ↓
Carga Index.tsx ✅
```

---

## 📊 Cómo Funciona `basename`

### Ejemplo 1: Root Domain

```
VITE_BASE_PATH=/

Usuario: example.com
Router receives: /
Routes: path="/"
Match: ✅
```

### Ejemplo 2: Subpath Deployment (Tu caso)

```
VITE_BASE_PATH=/edgarmtz/

Usuario: holaa.shop/edgarmtz
Router receives: /edgarmtz
basename tells router: "your app lives in /edgarmtz"
Router strips /edgarmtz and sees: /
Routes: path="/"
Match: ✅
```

### Ejemplo 3: Multi-Client

```
Cliente 1: juan.com
basename=/
Ruta: juan.com/ ✅

Cliente 2: maria.com/cliente2
basename=/cliente2/
Ruta: maria.com/cliente2/ ✅

Cliente 3: pedro.mitienda.com
basename=/
Ruta: pedro.mitienda.com/ ✅
```

---

## 🔍 Cambios Específicos

### 1. src/App.tsx (Línea 20)

**Antes:**
```typescript
<BrowserRouter>
```

**Después:**
```typescript
<BrowserRouter basename={import.meta.env.VITE_BASE_PATH || "/"}>
```

### 2. src/pages/NotFound.tsx (Línea 16)

**Antes:**
```typescript
<a href="/" className="...">
```

**Después:**
```typescript
import { Link } from "react-router-dom";

<Link to="/" className="...">
```

**Por qué:** `<Link>` de React Router entiende el `basename` y traduce las rutas correctamente.

---

## 🧪 Cómo Verificar Que Funciona

### En Desarrollo Local

```bash
# Asegúrate que VITE_BASE_PATH esté en .env
VITE_BASE_PATH=/

npm run dev
# Accede a: http://localhost:8080/
# Debería cargar Index.tsx ✅
```

### En Dokploy (Tu Caso)

1. **Después de hacer Rebuild**, accede a:
   ```
   https://holaa.shop/edgarmtz
   ```

2. **Abre la consola (F12)** y verifica:
   - ✅ NO hay errores 404
   - ✅ NO hay errores de tipo "Cannot find route"
   - ✅ La página carga correctamente
   - ✅ Los datos de Airtable aparecen

3. **Navega internamente** (si hay más rutas):
   - Los links deben funcionar correctamente
   - Las URLs deben respetar el `/edgarmtz` base path

---

## 🔗 Referencia de React Router

### Documentación Oficial
- [BrowserRouter basename](https://reactrouter.com/en/main/route/browser-router#basename)

### Cómo React Router Maneja Paths

```typescript
// Con basename="/edgarmtz"

<Link to="/">            // → /edgarmtz/
<Link to="/about">       // → /edgarmtz/about
<Link to="../other">     // → /edgarmtz/../other (relativo)

navigate("/")            // → /edgarmtz/
navigate("/about")       // → /edgarmtz/about
```

---

## 🎯 Resumen

| Aspecto | Antes | Después |
|---------|-------|---------|
| **Router Basename** | ❌ No configurado | ✅ `import.meta.env.VITE_BASE_PATH` |
| **Link Tag** | `<a href="/...">` | `<Link to="/...">` |
| **Rutas en Subpath** | ❌ 404 Error | ✅ Funciona |
| **Rutas en Root** | ✅ Funciona | ✅ Sigue funcionando |
| **Multi-Cliente** | ❌ No soportado | ✅ Completamente soportado |

---

## ✅ Estado Actual

```
✅ React Router configurado para subpaths
✅ VITE_BASE_PATH es respetado por el router
✅ Soporta deployments en / o en /subruta/
✅ Listo para múltiples clientes
✅ Pusheado a GitHub
```

---

## 🚀 Próximo Paso

Ya que está arreglado, ahora:

1. **En Dokploy**, haz un nuevo **Rebuild**
2. Accede a `holaa.shop/edgarmtz`
3. Verifica que carga sin errores 404
4. Echa un vistazo a la consola (F12) - no debe haber errores

**Cambios en GitHub:** ✅ Commit `6252eea`

---

*Última actualización: Noviembre 2024*
