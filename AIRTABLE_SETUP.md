# Configuración de Airtable para vCards

Este proyecto está configurado para usar Airtable como backend para almacenar y gestionar todos los datos de las tarjetas de presentación.

## 📋 Requisitos Previos

1. Una cuenta de Airtable (puedes crear una gratis en [airtable.com](https://airtable.com))
2. Node.js instalado en tu sistema

## 🔑 Paso 1: Obtener las Credenciales de Airtable

### Personal Access Token

1. Ve a [https://airtable.com/create/tokens](https://airtable.com/create/tokens)
2. Haz clic en "Create new token"
3. Dale un nombre descriptivo (ej: "vCards App")
4. En "Scopes", selecciona:
   - `data.records:read`
   - `data.records:write`
   - `schema.bases:read`
5. En "Access", selecciona la base que vas a usar
6. Copia el token generado

### Base ID

1. Abre tu base de Airtable en el navegador
2. La URL se verá así: `https://airtable.com/[BASE_ID]/...`
3. Copia el `BASE_ID` de la URL

## 🗂️ Paso 2: Estructura de Tablas en Airtable

Crea las siguientes tablas en tu base de Airtable con estos campos:

### Tabla: **Profiles**
| Campo | Tipo | Descripción |
|-------|------|-------------|
| `name` | Single line text | Nombre completo |
| `title` | Single line text | Título profesional |
| `company` | Single line text | Empresa |
| `location` | Single line text | Ubicación (opcional) |
| `avatarUrl` | URL | URL de la foto de perfil (opcional) |
| `backgroundUrl` | URL | URL de la imagen de fondo (opcional) |

### Tabla: **About**
| Campo | Tipo | Descripción |
|-------|------|-------------|
| `content` | Long text | Contenido completo (separar párrafos con \n) |
| `paragraph1` | Long text | Primer párrafo (alternativa) |
| `paragraph2` | Long text | Segundo párrafo (alternativa) |
| `paragraph3` | Long text | Tercer párrafo (alternativa) |

### Tabla: **Contact**
| Campo | Tipo | Descripción |
|-------|------|-------------|
| `email` | Email | Email de contacto |
| `phone` | Phone number | Teléfono |
| `website` | URL | Sitio web |

### Tabla: **Social**
| Campo | Tipo | Descripción |
|-------|------|-------------|
| `platform` | Single select | LinkedIn, Twitter, Instagram, Facebook, GitHub |
| `url` | URL | URL del perfil social |
| `displayOrder` | Number | Orden de visualización (opcional, 1, 2, 3...) |

### Tabla: **Experience**
| Campo | Tipo | Descripción |
|-------|------|-------------|
| `period` | Single line text | Período (ej: "2020 - Presente") |
| `title` | Single line text | Título del puesto |
| `description` | Long text | Descripción del puesto |
| `displayOrder` | Number | Orden cronológico (opcional, 1, 2, 3...) |

### Tabla: **Gallery**
| Campo | Tipo | Descripción |
|-------|------|-------------|
| `imageUrl` | URL o Attachment | URL o archivo de la imagen |
| `alt` | Single line text | Texto alternativo |
| `displayOrder` | Number | Orden de visualización (opcional, 1, 2, 3...) |

### Tabla: **Videos**
| Campo | Tipo | Descripción |
|-------|------|-------------|
| `videoUrl` | URL | URL del video (YouTube, Vimeo, etc.) |
| `title` | Single line text | Título del video |
| `description` | Long text | Descripción (opcional) |
| `thumbnailUrl` | URL | Miniatura personalizada (opcional) |
| `displayOrder` | Number | Orden de visualización (opcional, 1, 2, 3...) |

## ⚙️ Paso 3: Configurar Variables de Entorno

1. Copia el contenido de `.env.example` a `.env`:
   ```bash
   cp .env.example .env
   ```

2. Abre el archivo `.env` y completa con tus valores:
   ```env
   VITE_AIRTABLE_TOKEN=tu_token_aquí
   VITE_AIRTABLE_BASE_ID=tu_base_id_aquí

   # Nombres de las tablas (ajusta si usaste nombres diferentes)
   VITE_AIRTABLE_PROFILES_TABLE=Profiles
   VITE_AIRTABLE_ABOUT_TABLE=About
   VITE_AIRTABLE_CONTACT_TABLE=Contact
   VITE_AIRTABLE_SOCIAL_TABLE=Social
   VITE_AIRTABLE_EXPERIENCE_TABLE=Experience
   VITE_AIRTABLE_GALLERY_TABLE=Gallery
   VITE_AIRTABLE_VIDEOS_TABLE=Videos
   ```

3. **IMPORTANTE**: Asegúrate de que `.env` esté en tu `.gitignore` para no subir tus credenciales al repositorio.

## 🚀 Paso 4: Usar los Hooks en tus Componentes

### Ejemplo básico - Obtener datos

```tsx
import { useProfile, useExperience } from '@/hooks/useAirtable';
import { mapProfileData, mapExperienceData } from '@/utils/airtable-mappers';

function MyComponent() {
  const { data: profile, isLoading } = useProfile();
  const { data: experiences } = useExperience();

  if (isLoading) return <div>Cargando...</div>;

  const profileData = mapProfileData(profile);
  const experienceData = mapExperienceData(experiences || []);

  return (
    <div>
      <h1>{profileData?.name}</h1>
      {/* Renderizar experiencias */}
    </div>
  );
}
```

### Ejemplo - Crear un nuevo registro

```tsx
import { useCreateExperience } from '@/hooks/useAirtable';

function AddExperience() {
  const createExperience = useCreateExperience();

  const handleSubmit = () => {
    createExperience.mutate({
      period: "2024 - Presente",
      title: "Nuevo Puesto",
      description: "Descripción del nuevo puesto",
      displayOrder: 1
    });
  };

  return <button onClick={handleSubmit}>Agregar Experiencia</button>;
}
```

### Ejemplo - Actualizar un registro

```tsx
import { useUpdateProfile } from '@/hooks/useAirtable';

function EditProfile({ profileId }: { profileId: string }) {
  const updateProfile = useUpdateProfile();

  const handleUpdate = () => {
    updateProfile.mutate({
      id: profileId,
      fields: {
        name: "Nuevo Nombre",
        title: "Nuevo Título"
      }
    });
  };

  return <button onClick={handleUpdate}>Actualizar Perfil</button>;
}
```

### Ejemplo - Eliminar un registro

```tsx
import { useDeleteExperience } from '@/hooks/useAirtable';

function DeleteButton({ experienceId }: { experienceId: string }) {
  const deleteExperience = useDeleteExperience();

  const handleDelete = () => {
    deleteExperience.mutate(experienceId);
  };

  return <button onClick={handleDelete}>Eliminar</button>;
}
```

## 📚 Servicios Disponibles

Si necesitas usar los servicios directamente (sin hooks):

```tsx
import {
  profileService,
  aboutService,
  contactService,
  socialService,
  experienceService,
  galleryService,
  videoService
} from '@/services/airtable.service';

// Ejemplo de uso directo
const profiles = await profileService.getAll();
const profile = await profileService.getById('recXXXXXXXXXXXXXX');
await profileService.create({ name: 'Juan', title: 'Developer' });
await profileService.update('recXXXXXXXXXXXXXX', { name: 'Nuevo Nombre' });
await profileService.delete('recXXXXXXXXXXXXXX');
```

## 🔍 Funciones de Mapeo

Las funciones de mapeo convierten los datos de Airtable al formato que esperan tus componentes:

- `mapProfileData()` - Para ProfileCard
- `mapAboutData()` - Para AboutCard
- `mapContactData()` - Para ContactCard
- `mapSocialData()` - Para SocialCard
- `mapExperienceData()` - Para ExperienceCard
- `mapGalleryData()` - Para GalleryCard
- `mapVideoData()` - Para VideoCard

## ⚠️ Notas Importantes

1. **Caché de React Query**: Los datos se cachean por 5 minutos para mejorar el rendimiento
2. **Límites de API**: Airtable tiene límites de tasa (5 requests/segundo)
3. **Validación**: Asegúrate de validar los datos antes de crear/actualizar registros
4. **Manejo de Errores**: Todos los métodos lanzan errores que debes capturar

## 🐛 Troubleshooting

### "Airtable configuration is missing"
- Verifica que tu archivo `.env` tenga los valores correctos
- Reinicia el servidor de desarrollo después de cambiar `.env`

### "401 Unauthorized"
- Verifica que tu token tenga los permisos correctos
- Asegúrate de que el token tenga acceso a la base específica

### "404 Not Found"
- Verifica que el `BASE_ID` sea correcto
- Verifica que los nombres de las tablas coincidan exactamente

### Los datos no se actualizan
- React Query cachea los datos. Usa `queryClient.invalidateQueries()` para forzar actualización
- O espera 5 minutos para que expire el caché

## 📞 Soporte

Si necesitas ayuda adicional, consulta la [documentación oficial de Airtable](https://airtable.com/developers/web/api/introduction).
