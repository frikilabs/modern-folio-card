/**
 * Script para probar la conexión y ver los datos actuales
 */

import Airtable from 'airtable';
import * as fs from 'fs';
import * as path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Cargar variables de entorno
const envPath = path.join(__dirname, '..', '.env');
const envContent = fs.readFileSync(envPath, 'utf-8');

const config = {};
envContent.split('\n').forEach(line => {
  const match = line.match(/^([^#][^=]+)=(.*)$/);
  if (match) {
    const key = match[1].trim();
    const value = match[2].trim();
    config[key] = value;
  }
});

const TOKEN = config.VITE_AIRTABLE_TOKEN;
const BASE_ID = config.VITE_AIRTABLE_BASE_ID;

console.log('🔍 Probando conexión y leyendo datos...\n');

Airtable.configure({ apiKey: TOKEN });
const base = Airtable.base(BASE_ID);

async function testConnection() {
  try {
    console.log('📋 Tabla: Configuracion\n');

    const records = await base('Configuracion').select().all();

    console.log(`✅ Total de registros: ${records.length}\n`);

    if (records.length === 0) {
      console.log('⚠️  No hay registros en la tabla Configuracion');
      console.log('\n💡 Para que funcione tu app, necesitas agregar al menos 1 registro con:');
      console.log('   - Nombre: Tu nombre completo');
      console.log('   - Puesto/Texto: Tu título o descripción');
      console.log('   - FotoPerfil: Sube una imagen (opcional)');
      console.log('   - FondoCabecera: Sube una imagen de fondo (opcional)');
      console.log('   - SobreMi: Tu descripción personal\n');
    } else {
      records.forEach((record, index) => {
        console.log(`📄 Registro ${index + 1} (ID: ${record.id}):`);
        console.log('   Campos:');
        console.log(`   - Nombre: ${record.fields.Nombre || '(vacío)'}`);
        console.log(`   - Puesto/Texto: ${record.fields['Puesto/Texto'] || '(vacío)'}`);
        console.log(`   - FotoPerfil: ${record.fields.FotoPerfil ? `${record.fields.FotoPerfil.length} imagen(es)` : '(vacío)'}`);
        console.log(`   - FondoCabecera: ${record.fields.FondoCabecera ? `${record.fields.FondoCabecera.length} imagen(es)` : '(vacío)'}`);
        console.log(`   - SobreMi: ${record.fields.SobreMi ? `${record.fields.SobreMi.substring(0, 50)}...` : '(vacío)'}`);
        console.log('');
      });
    }

  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

testConnection();
