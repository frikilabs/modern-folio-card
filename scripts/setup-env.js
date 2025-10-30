/**
 * Script interactivo para configurar el .env
 * Ejecutar con: node scripts/setup-env.js
 */

import * as fs from 'fs';
import * as path from 'path';
import * as readline from 'readline';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

function question(prompt) {
  return new Promise((resolve) => {
    rl.question(prompt, resolve);
  });
}

async function setup() {
  console.log('\n🔧 Configuración de Airtable para vCards\n');
  console.log('=' .repeat(60));

  console.log('\n📋 Necesitamos dos datos de Airtable:\n');
  console.log('1. Personal Access Token');
  console.log('   - Ve a: https://airtable.com/create/tokens');
  console.log('   - Crea un nuevo token con permisos:');
  console.log('     • data.records:read');
  console.log('     • data.records:write');
  console.log('     • schema.bases:read');
  console.log('');
  console.log('2. Base ID');
  console.log('   - Abre tu base en Airtable');
  console.log('   - Busca en la URL: https://airtable.com/[BASE_ID]/...');
  console.log('   - Copia el BASE_ID\n');
  console.log('=' .repeat(60) + '\n');

  const token = await question('Ingresa tu Personal Access Token: ');
  const baseId = await question('Ingresa tu Base ID: ');

  if (!token || !baseId) {
    console.log('\n❌ Error: Debes proporcionar ambos valores\n');
    rl.close();
    process.exit(1);
  }

  // Actualizar .env
  const envPath = path.join(__dirname, '..', '.env');
  let envContent = fs.readFileSync(envPath, 'utf-8');

  envContent = envContent.replace(
    /VITE_AIRTABLE_TOKEN=.*/,
    `VITE_AIRTABLE_TOKEN=${token}`
  );
  envContent = envContent.replace(
    /VITE_AIRTABLE_BASE_ID=.*/,
    `VITE_AIRTABLE_BASE_ID=${baseId}`
  );

  fs.writeFileSync(envPath, envContent);

  console.log('\n✅ Archivo .env actualizado correctamente!\n');
  console.log('Próximo paso: Ejecuta el análisis de tu base');
  console.log('Comando: node scripts/analyze-airtable.js\n');

  rl.close();
}

setup();
