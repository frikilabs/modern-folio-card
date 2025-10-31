/**
 * Utilidades para mapear datos de Airtable a los formatos de componentes
 * Basado en la estructura real de tu base de Airtable "Vcard - Frikilabs"
 */

import type {
  ConfigFields,
  ContactFields,
  SocialFields,
  GalleryFields,
  VideoFields,
  ExperienceFields,
  SobreMiFields,
  UbicacionFields,
  PosicionTarjetaFields,
  ColaborarFields,
  AirtableRecord,
  AirtableAttachment,
} from '@/types/airtable';

// Helper para obtener la primera imagen de un array de attachments
const getFirstImageUrl = (attachments?: AirtableAttachment[]): string | undefined => {
  if (!attachments || attachments.length === 0) return undefined;
  return attachments[0]?.url;
};

// Helper para obtener todas las URLs de attachments
const getAttachmentUrls = (attachments?: AirtableAttachment[]): string[] => {
  if (!attachments) return [];
  return attachments.map(att => att.url);
};

/**
 * Mapea los datos de Config (Configuracion) a ProfileCard
 * La tabla "Configuracion" contiene tanto los datos del perfil como "Sobre mí"
 */
export const mapConfigToProfile = (record: AirtableRecord<ConfigFields> | null) => {
  if (!record) return null;

  return {
    name: record.fields.Nombre || '',
    title: record.fields['Puesto/Texto'] || '',
    company: '', // No está en tu schema, podrías agregar este campo
    location: '', // No está en tu schema, podrías agregar este campo
    avatarUrl: getFirstImageUrl(record.fields.FotoPerfil),
    backgroundUrl: getFirstImageUrl(record.fields.FondoCabecera),
  };
};

/**
 * Mapea los datos de Config (Configuracion) a AboutCard
 * El campo "SobreMi" contiene el texto "Sobre mí"
 */
export const mapConfigToAbout = (record: AirtableRecord<ConfigFields> | null): string[] => {
  if (!record || !record.fields.SobreMi) return [];

  // Si el contenido tiene saltos de línea, separar en párrafos
  return record.fields.SobreMi
    .split('\n')
    .map(p => p.trim())
    .filter(p => p !== '');
};

/**
 * Mapea los datos de Config (Configuracion) a LocationCard
 * El campo "GoogleMaps" contiene la URL del mapa de Google Maps
 * Retorna la URL si existe y no está vacía, de lo contrario retorna null
 */
export const mapConfigToLocation = (record: AirtableRecord<ConfigFields> | null): string | null => {
  if (!record || !record.fields.GoogleMaps) return null;

  const mapsUrl = record.fields.GoogleMaps.trim();
  return mapsUrl !== '' ? mapsUrl : null;
};

/**
 * Mapea los datos de Contacto a ContactCard
 * Nota: El campo "Email" es de tipo Collaborator en Airtable
 * Filtra los campos vacíos para que no se muestren
 */
export const mapContactData = (record: AirtableRecord<ContactFields> | null) => {
  if (!record) return { title: 'Contacto', items: [] };

  const items = [];

  // Email - es un objeto Collaborator
  if (record.fields.Email) {
    const email = typeof record.fields.Email === 'object' && record.fields.Email !== null
      ? record.fields.Email.email
      : '';
    if (email) {
      items.push({
        type: 'email' as const,
        label: 'Email',
        value: email,
        href: `mailto:${email}`,
      });
    }
  }

  // Teléfono
  if (record.fields.Telefono && record.fields.Telefono.trim() !== '') {
    items.push({
      type: 'phone' as const,
      label: 'Teléfono',
      value: record.fields.Telefono,
      href: `tel:${record.fields.Telefono.replace(/\D/g, '')}`,
    });
  }

  // WhatsApp
  if (record.fields.Whatsapp && record.fields.Whatsapp.trim() !== '') {
    items.push({
      type: 'whatsapp' as const,
      label: 'WhatsApp',
      value: record.fields.Whatsapp,
      href: `https://wa.me/${record.fields.Whatsapp.replace(/\D/g, '')}`,
    });
  }

  // Web
  if (record.fields.Web && record.fields.Web.trim() !== '') {
    items.push({
      type: 'web' as const,
      label: 'Sitio Web',
      value: record.fields.Web,
      href: record.fields.Web.startsWith('http')
        ? record.fields.Web
        : `https://${record.fields.Web}`,
    });
  }

  return {
    title: record.fields.NombreTarjeta || 'Contacto',
    items,
  };
};

/**
 * Mapea los datos de Redes (Social) a SocialCard
 * Campo "Name" es el nombre de la plataforma
 * Campo "Link" es la URL del perfil
 * Campo "Activo" determina si se muestra la red (checkbox)
 * - Si Activo es false o undefined, la red se oculta completamente
 * - Si Activo es true pero no hay Link, se muestra el icono sin enlace
 * - Si Activo es true y hay Link, se muestra el icono con enlace
 */
export const mapSocialData = (records: AirtableRecord<SocialFields>[]) => {
  return records
    .filter(record => record.fields.Activo === true) // Solo redes explícitamente activas
    .map(record => ({
      name: record.fields.Name || '',
      url: record.fields.Link || '',
      hasLink: !!(record.fields.Link && record.fields.Link.trim() !== ''),
    }));
};

/**
 * Mapea los datos de Galeria a GalleryCard
 * El campo "Galeria" es un array de attachments (multipleAttachments)
 * Solo incluye archivos de imagen válidos (jpg, jpeg, png, webp, etc.)
 * Excluye GIFs y otros formatos no soportados
 */
export const mapGalleryData = (records: AirtableRecord<GalleryFields>[]) => {
  const allImages: Array<{ url: string; alt: string }> = [];

  // Extensiones de imagen válidas (sin GIF)
  const validImageExtensions = ['jpg', 'jpeg', 'png', 'webp', 'avif', 'bmp', 'svg'];

  // Tipos MIME válidos
  const validMimeTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/avif', 'image/bmp', 'image/svg+xml'];

  records.forEach(record => {
    if (record.fields.Galeria && record.fields.Galeria.length > 0) {
      record.fields.Galeria.forEach((attachment) => {
        // Verificar extensión del archivo
        const extension = attachment.filename.split('.').pop()?.toLowerCase();
        const isValidExtension = extension && validImageExtensions.includes(extension);

        // Verificar tipo MIME
        const isValidMimeType = attachment.type && validMimeTypes.includes(attachment.type.toLowerCase());

        // Solo agregar si es una imagen válida (no GIF)
        if (isValidExtension || isValidMimeType) {
          allImages.push({
            url: attachment.url,
            alt: record.fields.Nombre || attachment.filename || 'Gallery image',
          });
        }
      });
    }
  });

  return allImages;
};

/**
 * Mapea los datos de Videos a VideoCard
 * Campo "Link" contiene la URL del video (YouTube, Vimeo, etc.)
 * Campo "Nombre" se usa como título del video
 * Campo "Descripción" es opcional - solo se incluye si tiene contenido
 * Solo incluye videos que tengan Link válido
 */
export const mapVideoData = (records: AirtableRecord<VideoFields>[]) => {
  return records
    .filter(record => record.fields.Link && record.fields.Link.trim() !== '') // Solo videos con Link
    .map(record => {
      const hasDescription = record.fields.Descripción && record.fields.Descripción.trim() !== '';

      return {
        videoUrl: record.fields.Link || '',
        title: record.fields.Nombre || 'Video sin título',
        description: hasDescription ? record.fields.Descripción : undefined,
        // Para YouTube, extraer el ID del video
        videoId: getYouTubeVideoId(record.fields.Link || ''),
      };
    });
};

/**
 * Utilidad para extraer ID de video de YouTube
 */
export const getYouTubeVideoId = (url: string): string | null => {
  if (!url) return null;

  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
  const match = url.match(regExp);
  return (match && match[2].length === 11) ? match[2] : null;
};

/**
 * Utilidad para extraer ID de video de Vimeo
 */
export const getVimeoVideoId = (url: string): string | null => {
  if (!url) return null;

  const regExp = /vimeo\.com\/(\d+)/;
  const match = url.match(regExp);
  return match ? match[1] : null;
};

/**
 * Determinar el tipo de plataforma de video
 */
export const getVideoPlatform = (url: string): 'youtube' | 'vimeo' | 'other' => {
  if (url.includes('youtube.com') || url.includes('youtu.be')) {
    return 'youtube';
  }
  if (url.includes('vimeo.com')) {
    return 'vimeo';
  }
  return 'other';
};

/**
 * Mapea los datos de Experiencia a ExperienceCard
 * Campo "NombrePuesto" es el título del puesto
 * Campo "DescripcionPuesto" es la descripción (opcional)
 * Campos "FechaInicio" y "FechaFinal" determinan el periodo
 * Si FechaFinal está vacía, se muestra "Presente"
 */
export const mapExperienceData = (records: AirtableRecord<ExperienceFields>[]) => {
  return records
    .filter(record => record.fields.NombrePuesto && record.fields.NombrePuesto.trim() !== '')
    .map(record => {
      // Formatear el periodo
      let period = '';

      if (record.fields.FechaInicio) {
        const fechaInicio = new Date(record.fields.FechaInicio);
        const inicioYear = fechaInicio.getFullYear();

        if (record.fields.FechaFinal) {
          const fechaFinal = new Date(record.fields.FechaFinal);
          const finalYear = fechaFinal.getFullYear();
          period = `${inicioYear} - ${finalYear}`;
        } else {
          period = `${inicioYear} - Presente`;
        }
      } else {
        period = 'Fecha no especificada';
      }

      return {
        period,
        title: record.fields.NombrePuesto,
        description: record.fields.DescripcionPuesto || '',
      };
    });
};

/**
 * Mapea los datos de SobreMi a AboutCard
 * Campo "Nombre" determina el título de la tarjeta
 * Campo "Descripcion" es el contenido de texto
 * Retorna el título y párrafos de descripción
 */
export const mapSobreMiData = (records: AirtableRecord<SobreMiFields>[]) => {
  if (records.length === 0) return { title: 'Acerca de Mí', paragraphs: [] };

  const record = records[0]; // Tomar el primer registro
  const title = record.fields.Nombre || 'Acerca de Mí';

  // Si el contenido tiene saltos de línea, separar en párrafos
  const paragraphs = record.fields.Descripcion
    ? record.fields.Descripcion
        .split('\n')
        .map(p => p.trim())
        .filter(p => p !== '')
    : [];

  return { title, paragraphs };
};

/**
 * Mapea los datos de Ubicacion a LocationCard
 * Campo "Nombre" determina el título de la tarjeta
 * Campo "Url Navegador" contiene la URL del mapa
 * Retorna el título y la URL si existe
 */
export const mapUbicacionData = (record: AirtableRecord<UbicacionFields> | null): { title: string; url: string | null } => {
  if (!record) return { title: 'Ubicación', url: null };

  const title = record.fields.Nombre || 'Ubicación';
  const url = record.fields['Url Navegador']?.trim() || null;

  return { title, url };
};

/**
 * Mapea los datos de PosicionTarjeta para determinar orden y visibilidad
 * Campo "Nombre" contiene el nombre del componente (ej: "AboutCard.tsx")
 * Campo "Activado" determina si se muestra la tarjeta (true/false)
 * Campo "Posicion" determina el orden (número ascendente)
 * IMPORTANTE: unchecked checkbox = undefined (no false)
 * Retorna array ordenado con nombres de componentes activos
 */
export const mapPosicionTarjetaData = (records: AirtableRecord<PosicionTarjetaFields>[]): string[] => {
  return records
    .filter(record => record.fields.Activado === true) // Solo tarjetas explícitamente activadas
    .map(record => record.fields.Nombre?.trim() || '') // Limpiar espacios en blanco
    .filter(nombre => nombre !== '' && nombre !== 'ProfileCard.tsx'); // Excluir ProfileCard (siempre se renderiza primero)
};

/**
 * Mapea los datos de Colaborar a CTACard
 * Campo "Titulo" es el título de la tarjeta
 * Campo "Texto" es el texto descriptivo
 * Campo "NomBtnA" es el texto del botón primario
 * Campo "NomBtnB" es el texto del botón secundario
 * Campo "URLA" es el enlace del botón primario
 * Campo "URLB" es el enlace del botón secundario
 */
export const mapColaborarData = (record: AirtableRecord<ColaborarFields> | null) => {
  if (!record) return null;

  return {
    title: record.fields.Titulo || 'Colaborar',
    description: record.fields.Texto || '',
    primaryButton: {
      label: record.fields.NomBtnA || '',
      url: record.fields.URLA || '',
    },
    secondaryButton: {
      label: record.fields.NomBtnB || '',
      url: record.fields.URLB || '',
    },
  };
};
