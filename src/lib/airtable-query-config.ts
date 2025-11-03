/**
 * Optimized React Query configuration for Airtable
 * Implements smart caching, retry logic, and performance enhancements
 */

import { DefaultOptions } from '@tanstack/react-query';

/**
 * Cache time configurations (in milliseconds)
 * Different data types have different invalidation rates
 */
export const CACHE_TIMES = {
  // Static/infrequently changing data - longer cache
  STATIC: 1000 * 60 * 30, // 30 minutes (config, about, locations)

  // Moderately changing data - medium cache
  MODERATE: 1000 * 60 * 10, // 10 minutes (galleries, videos, experiences)

  // Frequently changing data - shorter cache
  FREQUENT: 1000 * 60 * 5, // 5 minutes (social, contact, personalization)

  // Real-time data - minimal cache
  REALTIME: 1000 * 30, // 30 seconds (position, collaboration data)
} as const;

/**
 * Query key factory for consistent and maintainable cache keys
 */
export const queryKeyFactory = {
  all: () => ['airtable'],

  config: () => [...queryKeyFactory.all(), 'config'],
  contact: () => [...queryKeyFactory.all(), 'contact'],
  social: () => [...queryKeyFactory.all(), 'social'],
  gallery: () => [...queryKeyFactory.all(), 'gallery'],
  videos: () => [...queryKeyFactory.all(), 'videos'],
  experience: () => [...queryKeyFactory.all(), 'experience'],
  sobremi: () => [...queryKeyFactory.all(), 'sobremi'],
  ubicacion: () => [...queryKeyFactory.all(), 'ubicacion'],
  posiciontarjeta: () => [...queryKeyFactory.all(), 'posiciontarjeta'],
  colaborar: () => [...queryKeyFactory.all(), 'colaborar'],
  personalizacion: () => [...queryKeyFactory.all(), 'personalizacion'],
} as const;

/**
 * Default React Query options optimized for Airtable
 */
export const airtableQueryOptions: DefaultOptions = {
  queries: {
    // Smart retry logic: exponential backoff with max 3 retries
    retry: (failureCount, error: any) => {
      // Don't retry 4xx errors (auth, not found, etc)
      if (error?.statusCode >= 400 && error?.statusCode < 500) {
        return false;
      }
      // Retry up to 3 times for other errors
      return failureCount < 3;
    },

    // Exponential backoff: 1s, 2s, 4s
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),

    // Default stale time (can be overridden per query)
    staleTime: CACHE_TIMES.MODERATE,

    // Keep previous data while fetching new data (better UX)
    placeholderData: (previousData) => previousData,

    // Network error recovery
    networkMode: 'online',

    // Don't refetch on window focus by default (Airtable can be slow)
    refetchOnWindowFocus: false,

    // Don't refetch on reconnect (we have proper error handling)
    refetchOnReconnect: false,

    // Garbage collection after 10 minutes
    gcTime: 1000 * 60 * 10,
  },

  mutations: {
    // Similar retry logic for mutations
    retry: (failureCount, error: any) => {
      if (error?.statusCode >= 400 && error?.statusCode < 500) {
        return false;
      }
      return failureCount < 3;
    },
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
    networkMode: 'online',
  },
};

/**
 * Cache invalidation strategies for different operations
 */
export const cacheInvalidationStrategies = {
  onConfigUpdate: (queryClient: any) => {
    queryClient.invalidateQueries({ queryKey: queryKeyFactory.config() });
  },

  onSocialChange: (queryClient: any) => {
    queryClient.invalidateQueries({ queryKey: queryKeyFactory.social() });
  },

  onGalleryChange: (queryClient: any) => {
    queryClient.invalidateQueries({ queryKey: queryKeyFactory.gallery() });
  },

  onVideoChange: (queryClient: any) => {
    queryClient.invalidateQueries({ queryKey: queryKeyFactory.videos() });
  },

  onExperienceChange: (queryClient: any) => {
    queryClient.invalidateQueries({ queryKey: queryKeyFactory.experience() });
  },

  onPositionChange: (queryClient: any) => {
    queryClient.invalidateQueries({ queryKey: queryKeyFactory.posiciontarjeta() });
  },
} as const;
