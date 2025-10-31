// Tipos base de Airtable
export interface AirtableRecord<T> {
  id: string;
  fields: T;
  createdTime: string;
}

// Tipo para attachments de Airtable
export interface AirtableAttachment {
  id: string;
  url: string;
  filename: string;
  size: number;
  type: string;
  thumbnails?: {
    small?: { url: string; width: number; height: number };
    large?: { url: string; width: number; height: number };
    full?: { url: string; width: number; height: number };
  };
}

// Tipo para colaboradores de Airtable
export interface AirtableCollaborator {
  id: string;
  email: string;
  name?: string;
}

// TABLA: Configuracion (Profile + About combinados)
export interface ConfigFields {
  Nombre: string;
  'Puesto/Texto': string;
  FondoCabecera?: AirtableAttachment[];
  FotoPerfil?: AirtableAttachment[];
  SobreMi?: string;
  GoogleMaps?: string;
}

// TABLA: Contacto
export interface ContactFields {
  NombreTarjeta: string;
  Email?: AirtableCollaborator;
  Telefono?: string;
  Whatsapp?: string;
  Web?: string;
}

// TABLA: Redes (Social)
export interface SocialFields {
  Name: string;
  Link?: string;
  Activo?: boolean;
}

// TABLA: Galeria
export interface GalleryFields {
  Nombre: string;
  Galeria?: AirtableAttachment[];
}

// TABLA: Videos
export interface VideoFields {
  Nombre: string;
  Descripción?: string;
  Link: string;
}

// TABLA: Experiencia
export interface ExperienceFields {
  NombrePuesto: string;
  DescripcionPuesto?: string;
  FechaInicio?: string;
  FechaFinal?: string;
}

// TABLA: SobreMi
export interface SobreMiFields {
  Nombre: string;
  Descripcion?: string;
}

// TABLA: Ubicacion
export interface UbicacionFields {
  Nombre: string;
  'Url Navegador'?: string;
}

// TABLA: PosicionTarjeta
export interface PosicionTarjetaFields {
  Nombre: string;
  Activado?: boolean;
  Posicion?: number;
}

// TABLA: Colaborar
export interface ColaborarFields {
  Titulo: string;
  Texto?: string;
  NomBtnA?: string;
  NomBtnB?: string;
  URLA?: string;
  URLB?: string;
}

// TABLA: Personalizacion
export interface PersonalizacionFields {
  Name: string;
  Imagen?: AirtableAttachment[];
  Color?: string;
  Color2?: string;
}

// Tipos de records completos
export type ConfigRecord = AirtableRecord<ConfigFields>;
export type ContactRecord = AirtableRecord<ContactFields>;
export type SocialRecord = AirtableRecord<SocialFields>;
export type GalleryRecord = AirtableRecord<GalleryFields>;
export type VideoRecord = AirtableRecord<VideoFields>;
export type ExperienceRecord = AirtableRecord<ExperienceFields>;
export type SobreMiRecord = AirtableRecord<SobreMiFields>;
export type UbicacionRecord = AirtableRecord<UbicacionFields>;
export type PosicionTarjetaRecord = AirtableRecord<PosicionTarjetaFields>;
export type ColaborarRecord = AirtableRecord<ColaborarFields>;
export type PersonalizacionRecord = AirtableRecord<PersonalizacionFields>;

// Tipo para operaciones CRUD
export interface AirtableConfig {
  token: string;
  baseId: string;
  tables: {
    config: string;
    contact: string;
    social: string;
    gallery: string;
    videos: string;
    experience: string;
    sobremi: string;
    ubicacion: string;
    posiciontarjeta: string;
    colaborar: string;
    personalizacion: string;
  };
}
