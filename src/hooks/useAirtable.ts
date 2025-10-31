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

// Query keys
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
 */
export const useConfig = () => {
  return useQuery({
    queryKey: [QUERY_KEYS.config],
    queryFn: async () => {
      const configs = await configService.getAll();
      // Buscar el primer registro que tenga un Nombre
      const validConfig = configs.find(c => c.fields.Nombre && c.fields.Nombre.trim() !== '');
      return validConfig || configs[0] || null;
    },
    staleTime: 1000 * 60 * 5, // 5 minutos
  });
};

/**
 * Hook para obtener información de contacto
 * Retorna el primer registro de la tabla Contacto
 */
export const useContact = () => {
  return useQuery({
    queryKey: [QUERY_KEYS.contact],
    queryFn: async () => {
      const contacts = await contactService.getAll();
      return contacts[0] || null;
    },
    staleTime: 1000 * 60 * 5,
  });
};

/**
 * Hook para obtener todas las redes sociales
 * Retorna todos los registros de la tabla Redes
 */
export const useSocial = () => {
  return useQuery({
    queryKey: [QUERY_KEYS.social],
    queryFn: async () => {
      return await socialService.getAll();
    },
    staleTime: 1000 * 60 * 5,
  });
};

/**
 * Hook para obtener la galería
 * Retorna todos los registros de la tabla Galeria
 */
export const useGallery = () => {
  return useQuery({
    queryKey: [QUERY_KEYS.gallery],
    queryFn: async () => {
      return await galleryService.getAll();
    },
    staleTime: 1000 * 60 * 5,
  });
};

/**
 * Hook para obtener videos
 * Retorna todos los registros de la tabla Videos
 */
export const useVideos = () => {
  return useQuery({
    queryKey: [QUERY_KEYS.videos],
    queryFn: async () => {
      return await videoService.getAll();
    },
    staleTime: 1000 * 60 * 5,
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
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.config] });
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
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.social] });
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
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.social] });
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
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.social] });
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
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.gallery] });
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
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.gallery] });
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
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.videos] });
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
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.videos] });
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
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.videos] });
    },
  });
};

/**
 * Hook para obtener experiencias laborales
 * Retorna todos los registros de la tabla Experiencia ordenados por FechaInicio descendente
 */
export const useExperience = () => {
  return useQuery({
    queryKey: [QUERY_KEYS.experience],
    queryFn: async () => {
      return await experienceService.getAll('FechaInicio' as keyof ExperienceFields, 'desc');
    },
    staleTime: 1000 * 60 * 5,
  });
};

/**
 * Hook para obtener información "Sobre Mí"
 * Retorna todos los registros de la tabla SobreMi
 */
export const useSobreMi = () => {
  return useQuery({
    queryKey: [QUERY_KEYS.sobremi],
    queryFn: async () => {
      return await sobreMiService.getAll();
    },
    staleTime: 1000 * 60 * 5,
  });
};

/**
 * Hook para obtener información de Ubicación
 * Retorna el primer registro de la tabla Ubicacion
 */
export const useUbicacion = () => {
  return useQuery({
    queryKey: [QUERY_KEYS.ubicacion],
    queryFn: async () => {
      const ubicaciones = await ubicacionService.getAll();
      return ubicaciones[0] || null;
    },
    staleTime: 1000 * 60 * 5,
  });
};

/**
 * Hook para obtener la posición y activación de tarjetas
 * Retorna los registros en el orden de Airtable (que determina el orden de renderizado)
 */
export const usePosicionTarjeta = () => {
  return useQuery({
    queryKey: [QUERY_KEYS.posiciontarjeta],
    queryFn: async () => {
      return await posicionTarjetaService.getAll('Posicion' as keyof PosicionTarjetaFields, 'asc');
    },
    staleTime: 1000 * 60 * 5,
  });
};

/**
 * Hook para obtener los datos de Colaborar (CTACard)
 * Retorna el primer registro de la tabla Colaborar
 */
export const useColaborar = () => {
  return useQuery({
    queryKey: [QUERY_KEYS.colaborar],
    queryFn: async () => {
      const records = await colaborarService.getAll();
      return records[0] || null;
    },
    staleTime: 1000 * 60 * 5,
  });
};

/**
 * Hook para obtener los datos de Personalizacion
 * Retorna todos los registros de la tabla Personalizacion
 * que incluyen Background, FotoPerfil, ColorSubcabecera, etc.
 */
export const usePersonalizacion = () => {
  return useQuery({
    queryKey: [QUERY_KEYS.personalizacion],
    queryFn: async () => {
      return await personalizacionService.getAll();
    },
    staleTime: 1000 * 60 * 5,
  });
};
