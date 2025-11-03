/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_AIRTABLE_TOKEN: string;
  readonly VITE_AIRTABLE_BASE_ID: string;
  readonly VITE_AIRTABLE_CONFIG_TABLE: string;
  readonly VITE_AIRTABLE_CONTACT_TABLE: string;
  readonly VITE_AIRTABLE_SOCIAL_TABLE: string;
  readonly VITE_AIRTABLE_GALLERY_TABLE: string;
  readonly VITE_AIRTABLE_VIDEOS_TABLE: string;
  readonly VITE_AIRTABLE_EXPERIENCE_TABLE: string;
  readonly VITE_AIRTABLE_SOBREMI_TABLE: string;
  readonly VITE_AIRTABLE_UBICACION_TABLE: string;
  readonly VITE_AIRTABLE_POSICION_TABLE: string;
  readonly VITE_AIRTABLE_COLABORAR_TABLE: string;
  readonly VITE_AIRTABLE_PERSONALIZACION_TABLE: string;
  readonly VITE_BASE_PATH: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
