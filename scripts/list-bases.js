/**
 * Script para listar todas las bases disponibles con el token
 * Ejecutar con: node scripts/list-bases.js
 */

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

console.log('\n🔍 Listando bases de Airtable disponibles...\n');

if (!TOKEN) {
  console.error('❌ Error: Token no configurado en .env');
  process.exit(1);
}

async function listBases() {
  try {
    // API endpoint para listar bases
    const response = await fetch('https://api.airtable.com/v0/meta/bases', {
      headers: {
        'Authorization': `Bearer ${TOKEN}`,
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    const data = await response.json();

    console.log(`✅ Encontradas ${data.bases.length} base(s):\n`);
    console.log('=' .repeat(80));

    data.bases.forEach((base, index) => {
      console.log(`\n${index + 1}. Nombre: ${base.name}`);
      console.log(`   ID: ${base.id}`);
      console.log(`   Permisos: ${base.permissionLevel}`);
    });

    console.log('\n' + '=' .repeat(80));
    console.log('\n💡 Copia el ID de la base que quieres usar y actualiza VITE_AIRTABLE_BASE_ID en tu .env\n');

    return data.bases;

  } catch (error) {
    console.error('\n❌ Error:', error.message);

    if (error.message.includes('401')) {
      console.error('\n💡 El token no es válido o no tiene los permisos correctos');
      console.error('   Asegúrate de que tenga el permiso: schema.bases:read\n');
    }

    process.exit(1);
  }
}

listBases();
