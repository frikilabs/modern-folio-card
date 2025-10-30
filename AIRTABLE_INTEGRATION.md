# Integración de Airtable - Vcard Frikilabs

## ✅ Conexión Exitosa

Tu proyecto está ahora conectado a tu base de Airtable **"Vcard - Frikilabs"** (`app1zpsyVcRE1Cg1L`).

## 📊 Estructura de tu Base de Airtable

### Tablas Detectadas

#### 1. **Configuracion**
Contiene los datos del perfil y la sección "Sobre mí"

| Campo | Tipo | Descripción |
|-------|------|-------------|
| `Nombre` | Texto | Nombre completo de la persona |
| `Puesto/Texto` | Texto multilínea | Título o descripción del puesto |
| `FondoCabecera` | Attachments | Imagen de fondo del perfil |
| `FotoPerfil` | Attachments | Foto de perfil/avatar |
| `SobreMi` | Texto multilínea | Descripción "Sobre mí" |

**Uso en componentes:** `ProfileCard` + `AboutCard`

#### 2. **Contacto**
Información de contacto

| Campo | Tipo | Descripción |
|-------|------|-------------|
| `NombreTarjeta` | Texto | Nombre de la tarjeta de contacto |
| `Email` | Collaborator | Email de contacto |
| `Whatsapp` | Teléfono | Número de WhatsApp |
| `Web` | URL | Sitio web |

**Uso en componentes:** `ContactCard`

#### 3. **Redes**
Redes sociales

| Campo | Tipo | Descripción |
|-------|------|-------------|
| `Name` | Texto | Nombre de la red social (LinkedIn, Twitter, etc.) |
| `Link` | URL | URL del perfil social |

**Uso en componentes:** `SocialCard`

#### 4. **Galeria**
Galería de imágenes

| Campo | Tipo | Descripción |
|-------|------|-------------|
| `Nombre` | Texto | Nombre/descripción del conjunto de imágenes |
| `Galeria` | Attachments | Imágenes de la galería |

**Uso en componentes:** `GalleryCard`

#### 5. **Videos**
Videos

| Campo | Tipo | Descripción |
|-------|------|-------------|
| `Nombre` | Texto | Título del video |
| `Descripción` | Texto multilínea | Descripción del video |
| `Link` | URL | URL del video (YouTube, Vimeo, etc.) |

**Uso en componentes:** `VideoCard`

## 🚀 Cómo Usar los Datos

### Ejemplo 1: Mostrar Perfil

```tsx
import { useConfig } from '@/hooks/useAirtable';
import { mapConfigToProfile } from '@/utils/airtable-mappers';
import { ProfileCard } from '@/components/ProfileCard';

function Profile() {
  const { data: config, isLoading } = useConfig();

  if (isLoading) return <div>Cargando...</div>;

  const profileData = mapConfigToProfile(config);

  if (!profileData) return null;

  return (
    <ProfileCard
      name={profileData.name}
      title={profileData.title}
      company={profileData.company}
      avatarUrl={profileData.avatarUrl}
      backgroundUrl={profileData.backgroundUrl}
    />
  );
}
```

### Ejemplo 2: Mostrar "Sobre Mí"

```tsx
import { useConfig } from '@/hooks/useAirtable';
import { mapConfigToAbout } from '@/utils/airtable-mappers';
import { AboutCard } from '@/components/AboutCard';

function About() {
  const { data: config } = useConfig();
  const paragraphs = mapConfigToAbout(config);

  return (
    <AboutCard>
      {paragraphs.map((p, i) => (
        <p key={i}>{p}</p>
      ))}
    </AboutCard>
  );
}
```

### Ejemplo 3: Mostrar Contacto

```tsx
import { useContact } from '@/hooks/useAirtable';
import { mapContactData } from '@/utils/airtable-mappers';

function Contact() {
  const { data: contact } = useContact();
  const contactItems = mapContactData(contact);

  return (
    <div>
      {contactItems.map((item, i) => (
        <a key={i} href={item.href}>
          {item.label}: {item.value}
        </a>
      ))}
    </div>
  );
}
```

### Ejemplo 4: Mostrar Redes Sociales

```tsx
import { useSocial } from '@/hooks/useAirtable';
import { mapSocialData } from '@/utils/airtable-mappers';

function Social() {
  const { data: social } = useSocial();
  const socialItems = mapSocialData(social || []);

  return (
    <div>
      {socialItems.map((item, i) => (
        <a key={i} href={item.url} target="_blank" rel="noopener noreferrer">
          {item.name}
        </a>
      ))}
    </div>
  );
}
```

### Ejemplo 5: Mostrar Galería

```tsx
import { useGallery } from '@/hooks/useAirtable';
import { mapGalleryData } from '@/utils/airtable-mappers';

function Gallery() {
  const { data: gallery } = useGallery();
  const images = mapGalleryData(gallery || []);

  return (
    <div className="grid grid-cols-3 gap-4">
      {images.map((img, i) => (
        <img key={i} src={img.url} alt={img.alt} />
      ))}
    </div>
  );
}
```

### Ejemplo 6: Mostrar Videos

```tsx
import { useVideos } from '@/hooks/useAirtable';
import { mapVideoData } from '@/utils/airtable-mappers';

function Videos() {
  const { data: videos } = useVideos();
  const videoItems = mapVideoData(videos || []);

  return (
    <div>
      {videoItems.map((video, i) => (
        <div key={i}>
          <h3>{video.title}</h3>
          <p>{video.description}</p>
          <a href={video.videoUrl}>Ver video</a>
        </div>
      ))}
    </div>
  );
}
```

## 🔄 Operaciones CRUD

### Actualizar Configuración

```tsx
import { useUpdateConfig } from '@/hooks/useAirtable';

function EditProfile() {
  const updateConfig = useUpdateConfig();

  const handleUpdate = (configId: string) => {
    updateConfig.mutate({
      id: configId,
      fields: {
        Nombre: 'Nuevo Nombre',
        'Puesto/Texto': 'Nueva Descripción',
      }
    });
  };

  return <button onClick={() => handleUpdate('recXXXXX')}>Actualizar</button>;
}
```

### Crear Red Social

```tsx
import { useCreateSocial } from '@/hooks/useAirtable';

function AddSocial() {
  const createSocial = useCreateSocial();

  const handleCreate = () => {
    createSocial.mutate({
      Name: 'Instagram',
      Link: 'https://instagram.com/usuario'
    });
  };

  return <button onClick={handleCreate}>Agregar Red Social</button>;
}
```

### Eliminar un Video

```tsx
import { useDeleteVideo } from '@/hooks/useAirtable';

function DeleteVideoButton({ videoId }: { videoId: string }) {
  const deleteVideo = useDeleteVideo();

  return (
    <button onClick={() => deleteVideo.mutate(videoId)}>
      Eliminar
    </button>
  );
}
```

## 📚 Hooks Disponibles

### Lectura de Datos (Queries)
- `useConfig()` - Obtiene configuración (Profile + About)
- `useContact()` - Obtiene contacto
- `useSocial()` - Obtiene todas las redes sociales
- `useGallery()` - Obtiene galería
- `useVideos()` - Obtiene videos

### Modificación de Datos (Mutations)
- `useUpdateConfig()` - Actualiza configuración
- `useUpdateContact()` - Actualiza contacto
- `useCreateSocial()` - Crea red social
- `useUpdateSocial()` - Actualiza red social
- `useDeleteSocial()` - Elimina red social
- `useCreateGallery()` - Crea item de galería
- `useDeleteGallery()` - Elimina item de galería
- `useCreateVideo()` - Crea video
- `useUpdateVideo()` - Actualiza video
- `useDeleteVideo()` - Elimina video

## 🎨 Funciones de Mapeo

- `mapConfigToProfile(config)` - Configuracion → ProfileCard props
- `mapConfigToAbout(config)` - Configuracion → Array de párrafos
- `mapContactData(contact)` - Contacto → Array de items de contacto
- `mapSocialData(social[])` - Redes → Array de redes sociales
- `mapGalleryData(gallery[])` - Galeria → Array de imágenes
- `mapVideoData(videos[])` - Videos → Array de videos

## ⚠️ Notas Importantes

### Campo Email (Collaborator)
El campo `Email` en la tabla **Contacto** es de tipo `Collaborator` en Airtable. Esto significa que:
- Se guarda como un objeto: `{ id, email, name }`
- El mapper extrae automáticamente el `email` del objeto
- Si necesitas un campo de texto simple, puedes cambiar el tipo en Airtable

### Attachments (Imágenes)
Los campos de tipo `multipleAttachments` retornan un array de objetos con esta estructura:
```typescript
{
  id: string,
  url: string,
  filename: string,
  size: number,
  type: string,
  thumbnails?: {
    small: { url, width, height },
    large: { url, width, height },
    full: { url, width, height }
  }
}
```

### Caché de React Query
- Los datos se cachean por **5 minutos**
- Después de una mutación, el caché se invalida automáticamente
- Para refrescar manualmente: `queryClient.invalidateQueries()`

## 🔧 Archivos Generados

- **[.env](.env)** - Configuración con credenciales
- **[airtable-schema.json](airtable-schema.json)** - Schema completo de tu base
- **[airtable-mapping.json](airtable-mapping.json)** - Mapeo de tablas
- **[src/types/airtable.ts](src/types/airtable.ts)** - Tipos TypeScript
- **[src/lib/airtable.ts](src/lib/airtable.ts)** - Cliente de Airtable
- **[src/services/airtable.service.ts](src/services/airtable.service.ts)** - Servicios CRUD
- **[src/utils/airtable-mappers.ts](src/utils/airtable-mappers.ts)** - Funciones de mapeo
- **[src/hooks/useAirtable.ts](src/hooks/useAirtable.ts)** - Hooks de React Query

## 🐛 Troubleshooting

### Los datos no se muestran
1. Verifica que tienes al menos un registro en cada tabla de Airtable
2. Abre la consola del navegador y revisa si hay errores
3. Verifica que el [.env](.env) tenga las credenciales correctas

### Error 401 Unauthorized
- Verifica que el token tenga los permisos correctos
- Regenera el token si es necesario

### Error 404 Not Found
- Verifica que el Base ID sea correcto
- Asegúrate de que el token tenga acceso a esta base

### Campos undefined
- Revisa que los nombres de los campos en Airtable coincidan exactamente (case-sensitive)
- Verifica que los registros tengan datos en esos campos

## 📞 Próximos Pasos

1. **Agregar datos de prueba** en Airtable si aún no lo has hecho
2. **Probar los hooks** en tus componentes actuales
3. **Ajustar los mappers** si necesitas transformaciones adicionales
4. **Agregar validación** con Zod si lo deseas
5. **Crear un panel de administración** para gestionar los datos (opcional)

¿Necesitas ayuda para integrar esto en tus componentes existentes?
