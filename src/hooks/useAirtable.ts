/**
 * Custom hooks para usar datos de Airtable con React Query
 * Basado en la estructura real de tu base "Vcard - Frikilabs"
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  configService,
  contactService,
  socialService,
  galleryService,
  videoService,
  experienceService,
  sobreMiService,
  ubicacionService,
  posicionTarjetaService,
  colaborarService,
  personalizacionService,
} from '@/services/airtable.service';
import { queryKeyFactory, CACHE_TIMES, cacheInvalidationStrategies } from '@/lib/airtable-query-config';
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
  PersonalizacionFields,
} from '@/types/airtable';

// Export query keys for consistency
export const QUERY_KEYS = {
  config: 'config',
  contact: 'contact',
  social: 'social',
  gallery: 'gallery',
  videos: 'videos',
  experience: 'experience',
  sobremi: 'sobremi',
  ubicacion: 'ubicacion',
  posiciontarjeta: 'posiciontarjeta',
  colaborar: 'colaborar',
  personalizacion: 'personalizacion',
} as const;

/**
 * Hook para obtener la configuración (Profile + About)
 * Retorna el primer registro que tenga datos (Nombre no vacío)
 * Optimizado: Static data, 30 minutes cache
 */
export const useConfig = () => {
  return useQuery({
    queryKey: queryKeyFactory.config(),
    queryFn: async () => {
      const configs = await configService.getAll();
      // Buscar el primer registro que tenga un Nombre
      const validConfig = configs.find(c => c.fields.Nombre && c.fields.Nombre.trim() !== '');
      return validConfig || configs[0] || null;
    },
    staleTime: CACHE_TIMES.STATIC, // 30 minutos - config doesn't change often
  });
};

/**
 * Hook para obtener información de contacto
 * Retorna el primer registro de la tabla Contacto
 * Optimizado: Frequent updates, 5 minutes cache
 */
export const useContact = () => {
  return useQuery({
    queryKey: queryKeyFactory.contact(),
    queryFn: async () => {
      const contacts = await contactService.getAll();
      return contacts[0] || null;
    },
    staleTime: CACHE_TIMES.FREQUENT,
  });
};

/**
 * Hook para obtener todas las redes sociales
 * Retorna todos los registros de la tabla Redes
 * Optimizado: Frequent updates, 5 minutes cache
 */
export const useSocial = () => {
  return useQuery({
    queryKey: queryKeyFactory.social(),
    queryFn: async () => {
      return await socialService.getAll();
    },
    staleTime: CACHE_TIMES.FREQUENT,
  });
};

/**
 * Hook para obtener la galería
 * Retorna todos los registros de la tabla Galeria
 * Optimizado: Moderate updates, 10 minutes cache
 */
export const useGallery = () => {
  return useQuery({
    queryKey: queryKeyFactory.gallery(),
    queryFn: async () => {
      return await galleryService.getAll();
    },
    staleTime: CACHE_TIMES.MODERATE,
  });
};

/**
 * Hook para obtener videos
 * Retorna todos los registros de la tabla Videos
 * Optimizado: Moderate updates, 10 minutes cache
 */
export const useVideos = () => {
  return useQuery({
    queryKey: queryKeyFactory.videos(),
    queryFn: async () => {
      return await videoService.getAll();
    },
    staleTime: CACHE_TIMES.MODERATE,
  });
};

// ========== MUTATION HOOKS ==========

/**
 * Hook para actualizar la configuración (Profile + About)
 */
export const useUpdateConfig = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, fields }: { id: string; fields: Partial<ConfigFields> }) =>
      configService.update(id, fields),
    onSuccess: () => {
      cacheInvalidationStrategies.onConfigUpdate(queryClient);
    },
  });
};

/**
 * Hook para actualizar la información de contacto
 */
export const useUpdateContact = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, fields }: { id: string; fields: Partial<ContactFields> }) =>
      contactService.update(id, fields),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.contact] });
    },
  });
};

/**
 * Hook para crear una red social
 */
export const useCreateSocial = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (fields: Partial<SocialFields>) =>
      socialService.create(fields),
    onSuccess: () => {
      cacheInvalidationStrategies.onSocialChange(queryClient);
    },
  });
};

/**
 * Hook para actualizar una red social
 */
export const useUpdateSocial = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, fields }: { id: string; fields: Partial<SocialFields> }) =>
      socialService.update(id, fields),
    onSuccess: () => {
      cacheInvalidationStrategies.onSocialChange(queryClient);
    },
  });
};

/**
 * Hook para eliminar una red social
 */
export const useDeleteSocial = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => socialService.delete(id),
    onSuccess: () => {
      cacheInvalidationStrategies.onSocialChange(queryClient);
    },
  });
};

/**
 * Hook para crear un item en la galería
 */
export const useCreateGallery = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (fields: Partial<GalleryFields>) =>
      galleryService.create(fields),
    onSuccess: () => {
      cacheInvalidationStrategies.onGalleryChange(queryClient);
    },
  });
};

/**
 * Hook para eliminar un item de la galería
 */
export const useDeleteGallery = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => galleryService.delete(id),
    onSuccess: () => {
      cacheInvalidationStrategies.onGalleryChange(queryClient);
    },
  });
};

/**
 * Hook para crear un video
 */
export const useCreateVideo = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (fields: Partial<VideoFields>) =>
      videoService.create(fields),
    onSuccess: () => {
      cacheInvalidationStrategies.onVideoChange(queryClient);
    },
  });
};

/**
 * Hook para actualizar un video
 */
export const useUpdateVideo = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, fields }: { id: string; fields: Partial<VideoFields> }) =>
      videoService.update(id, fields),
    onSuccess: () => {
      cacheInvalidationStrategies.onVideoChange(queryClient);
    },
  });
};

/**
 * Hook para eliminar un video
 */
export const useDeleteVideo = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => videoService.delete(id),
    onSuccess: () => {
      cacheInvalidationStrategies.onVideoChange(queryClient);
    },
  });
};

/**
 * Hook para obtener experiencias laborales
 * Retorna todos los registros de la tabla Experiencia ordenados por FechaInicio descendente
 * Optimizado: Moderate updates, 10 minutes cache
 */
export const useExperience = () => {
  return useQuery({
    queryKey: queryKeyFactory.experience(),
    queryFn: async () => {
      return await experienceService.getAll('FechaInicio' as keyof ExperienceFields, 'desc');
    },
    staleTime: CACHE_TIMES.MODERATE,
  });
};

/**
 * Hook para obtener información "Sobre Mí"
 * Retorna todos los registros de la tabla SobreMi
 * Optimizado: Static data, 30 minutes cache
 */
export const useSobreMi = () => {
  return useQuery({
    queryKey: queryKeyFactory.sobremi(),
    queryFn: async () => {
      return await sobreMiService.getAll();
    },
    staleTime: CACHE_TIMES.STATIC,
  });
};

/**
 * Hook para obtener información de Ubicación
 * Retorna el primer registro de la tabla Ubicacion
 * Optimizado: Static data, 30 minutes cache
 */
export const useUbicacion = () => {
  return useQuery({
    queryKey: queryKeyFactory.ubicacion(),
    queryFn: async () => {
      const ubicaciones = await ubicacionService.getAll();
      return ubicaciones[0] || null;
    },
    staleTime: CACHE_TIMES.STATIC,
  });
};

/**
 * Hook para obtener la posición y activación de tarjetas
 * Retorna los registros en el orden de Airtable (que determina el orden de renderizado)
 * Optimizado: Real-time data, 30 seconds cache (critical for layout)
 */
export const usePosicionTarjeta = () => {
  return useQuery({
    queryKey: queryKeyFactory.posiciontarjeta(),
    queryFn: async () => {
      return await posicionTarjetaService.getAll('Posicion' as keyof PosicionTarjetaFields, 'asc');
    },
    staleTime: CACHE_TIMES.REALTIME,
  });
};

/**
 * Hook para obtener los datos de Colaborar (CTACard)
 * Retorna el primer registro de la tabla Colaborar
 * Optimizado: Real-time data, 30 seconds cache (CTA important for conversions)
 */
export const useColaborar = () => {
  return useQuery({
    queryKey: queryKeyFactory.colaborar(),
    queryFn: async () => {
      const records = await colaborarService.getAll();
      return records[0] || null;
    },
    staleTime: CACHE_TIMES.REALTIME,
  });
};

/**
 * Hook para obtener los datos de Personalizacion
 * Retorna todos los registros de la tabla Personalizacion
 * que incluyen Background, FotoPerfil, ColorSubcabecera, etc.
 * Optimizado: Frequent updates, 5 minutes cache
 */
export const usePersonalizacion = () => {
  return useQuery({
    queryKey: queryKeyFactory.personalizacion(),
    queryFn: async () => {
      return await personalizacionService.getAll();
    },
    staleTime: CACHE_TIMES.FREQUENT,
  });
};
