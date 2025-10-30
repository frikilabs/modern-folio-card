import Airtable from 'airtable';
import type { AirtableConfig } from '@/types/airtable';

// Configuración desde variables de entorno (basada en tu estructura real de Airtable)
const config: AirtableConfig = {
  token: import.meta.env.VITE_AIRTABLE_TOKEN || '',
  baseId: import.meta.env.VITE_AIRTABLE_BASE_ID || '',
  tables: {
    config: import.meta.env.VITE_AIRTABLE_CONFIG_TABLE || 'Configuracion',
    contact: import.meta.env.VITE_AIRTABLE_CONTACT_TABLE || 'Contacto',
    social: import.meta.env.VITE_AIRTABLE_SOCIAL_TABLE || 'Redes',
    gallery: import.meta.env.VITE_AIRTABLE_GALLERY_TABLE || 'Galeria',
    videos: import.meta.env.VITE_AIRTABLE_VIDEOS_TABLE || 'Videos',
    experience: import.meta.env.VITE_AIRTABLE_EXPERIENCE_TABLE || 'Experiencia',
    sobremi: import.meta.env.VITE_AIRTABLE_SOBREMI_TABLE || 'SobreMi',
    ubicacion: import.meta.env.VITE_AIRTABLE_UBICACION_TABLE || 'Ubicacion',
    posiciontarjeta: import.meta.env.VITE_AIRTABLE_POSICION_TABLE || 'PosicionTarjeta',
    colaborar: import.meta.env.VITE_AIRTABLE_COLABORAR_TABLE || 'Colaborar',
  },
};

// Validar configuración
if (!config.token || !config.baseId) {
  console.warn('⚠️ Airtable configuration is missing. Please check your .env file.');
}

// Configurar Airtable
Airtable.configure({
  apiKey: config.token,
});

// Crear instancia de la base
const base = Airtable.base(config.baseId);

// Exportar base y configuración
export { base, config };

// Helper para obtener una tabla específica
export const getTable = (tableName: keyof typeof config.tables) => {
  return base(config.tables[tableName]);
};
