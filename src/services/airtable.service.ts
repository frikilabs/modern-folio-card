import { getTable } from '@/lib/airtable';
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
  AirtableRecord,
} from '@/types/airtable';

// Tipo genérico para los campos de cualquier tabla
type TableFields =
  | ConfigFields
  | ContactFields
  | SocialFields
  | GalleryFields
  | VideoFields
  | ExperienceFields
  | SobreMiFields
  | UbicacionFields
  | PosicionTarjetaFields;

/**
 * Clase base para operaciones CRUD en Airtable
 */
class AirtableService<T extends TableFields> {
  private tableName: 'config' | 'contact' | 'social' | 'gallery' | 'videos' | 'experience' | 'sobremi' | 'ubicacion' | 'posiciontarjeta';

  constructor(tableName: typeof this.tableName) {
    this.tableName = tableName;
  }

  /**
   * Obtener todos los registros de una tabla
   * @param sort - Campo para ordenar (opcional)
   * @param order - Orden ascendente o descendente (opcional)
   */
  async getAll(sort?: keyof T, order: 'asc' | 'desc' = 'asc'): Promise<AirtableRecord<T>[]> {
    try {
      const table = getTable(this.tableName);

      // Construir opciones de selección solo si hay sort
      const selectOptions: any = {};
      if (sort) {
        selectOptions.sort = [{ field: sort as string, direction: order }];
      }

      const records = await table.select(selectOptions).all();

      return records.map(record => ({
        id: record.id,
        fields: record.fields as T,
        createdTime: record._rawJson.createdTime,
      }));
    } catch (error) {
      console.error(`Error fetching all records from ${this.tableName}:`, error);
      throw error;
    }
  }

  /**
   * Obtener un registro por ID
   * @param id - ID del registro en Airtable
   */
  async getById(id: string): Promise<AirtableRecord<T> | null> {
    try {
      const table = getTable(this.tableName);
      const record = await table.find(id);

      return {
        id: record.id,
        fields: record.fields as T,
        createdTime: record._rawJson.createdTime,
      };
    } catch (error) {
      console.error(`Error fetching record ${id} from ${this.tableName}:`, error);
      return null;
    }
  }

  /**
   * Crear un nuevo registro
   * @param fields - Campos del nuevo registro
   */
  async create(fields: Partial<T>): Promise<AirtableRecord<T>> {
    try {
      const table = getTable(this.tableName);
      const record = await table.create(fields as any);

      return {
        id: record.id,
        fields: record.fields as T,
        createdTime: record._rawJson.createdTime,
      };
    } catch (error) {
      console.error(`Error creating record in ${this.tableName}:`, error);
      throw error;
    }
  }

  /**
   * Actualizar un registro existente
   * @param id - ID del registro
   * @param fields - Campos a actualizar
   */
  async update(id: string, fields: Partial<T>): Promise<AirtableRecord<T>> {
    try {
      const table = getTable(this.tableName);
      const record = await table.update(id, fields as any);

      return {
        id: record.id,
        fields: record.fields as T,
        createdTime: record._rawJson.createdTime,
      };
    } catch (error) {
      console.error(`Error updating record ${id} in ${this.tableName}:`, error);
      throw error;
    }
  }

  /**
   * Eliminar un registro
   * @param id - ID del registro
   */
  async delete(id: string): Promise<boolean> {
    try {
      const table = getTable(this.tableName);
      await table.destroy(id);
      return true;
    } catch (error) {
      console.error(`Error deleting record ${id} from ${this.tableName}:`, error);
      return false;
    }
  }

  /**
   * Buscar registros con filtro
   * @param filterFormula - Fórmula de filtro de Airtable
   */
  async find(filterFormula: string): Promise<AirtableRecord<T>[]> {
    try {
      const table = getTable(this.tableName);
      const records = await table.select({
        filterByFormula: filterFormula,
      }).all();

      return records.map(record => ({
        id: record.id,
        fields: record.fields as T,
        createdTime: record._rawJson.createdTime,
      }));
    } catch (error) {
      console.error(`Error finding records in ${this.tableName}:`, error);
      throw error;
    }
  }
}

// Instancias específicas para cada tabla (basadas en tu estructura de Airtable)
export const configService = new AirtableService<ConfigFields>('config');
export const contactService = new AirtableService<ContactFields>('contact');
export const socialService = new AirtableService<SocialFields>('social');
export const galleryService = new AirtableService<GalleryFields>('gallery');
export const videoService = new AirtableService<VideoFields>('videos');
export const experienceService = new AirtableService<ExperienceFields>('experience');
export const sobreMiService = new AirtableService<SobreMiFields>('sobremi');
export const ubicacionService = new AirtableService<UbicacionFields>('ubicacion');
export const posicionTarjetaService = new AirtableService<PosicionTarjetaFields>('posiciontarjeta');

// Exportar la clase base para usos personalizados
export default AirtableService;
