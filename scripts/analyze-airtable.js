/**
 * Script para analizar la estructura de la base de Airtable
 * Ejecutar con: node scripts/analyze-airtable.js
 */

import Airtable from 'airtable';
import * as fs from 'fs';
import * as path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Cargar variables de entorno manualmente
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

console.log('🔍 Analizando base de Airtable...\n');
console.log(`Token: ${TOKEN ? '✅ Configurado' : '❌ Falta'}`);
console.log(`Base ID: ${BASE_ID ? '✅ Configurado' : '❌ Falta'}\n`);

if (!TOKEN || !BASE_ID) {
  console.error('❌ Error: Token o Base ID no configurado en .env');
  process.exit(1);
}

// Configurar Airtable
Airtable.configure({
  apiKey: TOKEN,
});

const base = Airtable.base(BASE_ID);

async function analyzeTables() {
  console.log('📊 Obteniendo metadatos de la base...\n');

  // Endpoint para obtener el schema de la base
  const schemaUrl = `https://api.airtable.com/v0/meta/bases/${BASE_ID}/tables`;

  try {
    const response = await fetch(schemaUrl, {
      headers: {
        'Authorization': `Bearer ${TOKEN}`,
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    const data = await response.json();

    console.log(`✅ Base conectada exitosamente!`);
    console.log(`📋 Total de tablas encontradas: ${data.tables.length}\n`);
    console.log('=' .repeat(80));

    const schema = {
      baseId: BASE_ID,
      tables: [],
      summary: {},
    };

    for (const table of data.tables) {
      console.log(`\n📁 TABLA: ${table.name}`);
      console.log(`   ID: ${table.id}`);
      console.log(`   Descripción: ${table.description || 'Sin descripción'}`);
      console.log(`   Vista primaria: ${table.primaryFieldId}`);
      console.log(`\n   📝 Campos (${table.fields.length}):`);

      const tableInfo = {
        name: table.name,
        id: table.id,
        description: table.description,
        fields: [],
      };

      for (const field of table.fields) {
        const fieldInfo = {
          name: field.name,
          id: field.id,
          type: field.type,
          options: field.options || {},
        };

        tableInfo.fields.push(fieldInfo);

        let optionsStr = '';
        if (field.type === 'singleSelect' && field.options?.choices) {
          const choices = field.options.choices.map(c => c.name).join(', ');
          optionsStr = ` [Opciones: ${choices}]`;
        } else if (field.type === 'multipleSelects' && field.options?.choices) {
          const choices = field.options.choices.map(c => c.name).join(', ');
          optionsStr = ` [Opciones: ${choices}]`;
        } else if (field.type === 'multipleRecordLinks' && field.options?.linkedTableId) {
          optionsStr = ` [Link a tabla: ${field.options.linkedTableId}]`;
        }

        console.log(`      - ${field.name}: ${field.type}${optionsStr}`);
      }

      schema.tables.push(tableInfo);
      schema.summary[table.name] = {
        fieldCount: table.fields.length,
        fields: table.fields.map(f => f.name),
      };

      console.log('\n' + '-'.repeat(80));
    }

    // Guardar schema en archivo JSON
    const outputPath = path.join(__dirname, '..', 'airtable-schema.json');
    fs.writeFileSync(outputPath, JSON.stringify(schema, null, 2));
    console.log(`\n💾 Schema guardado en: airtable-schema.json`);

    // Generar reporte de mapeo
    console.log('\n\n' + '='.repeat(80));
    console.log('📋 RESUMEN DE MAPEO');
    console.log('='.repeat(80));

    const mapping = generateMapping(schema);

    console.log('\n✅ Análisis completado!');
    console.log('\nPróximos pasos:');
    console.log('1. Revisa el archivo airtable-schema.json con la estructura completa');
    console.log('2. Verifica el mapeo sugerido arriba');
    console.log('3. Los archivos TypeScript se actualizarán automáticamente\n');

    return { schema, mapping };

  } catch (error) {
    console.error('\n❌ Error al conectar con Airtable:', error.message);

    if (error.message.includes('401')) {
      console.error('\n💡 Posibles soluciones:');
      console.error('   - Verifica que el token sea válido');
      console.error('   - Asegúrate de que el token tenga permisos: schema.bases:read');
    } else if (error.message.includes('404')) {
      console.error('\n💡 Posibles soluciones:');
      console.error('   - Verifica que el BASE_ID sea correcto');
      console.error('   - Asegúrate de que el token tenga acceso a esta base');
    }

    process.exit(1);
  }
}

function generateMapping(schema) {
  console.log('\n🔄 Generando mapeo inteligente...\n');

  const expectedTables = {
    profile: ['profile', 'profiles', 'perfil', 'perfiles', 'user', 'users'],
    about: ['about', 'acerca', 'bio', 'biography', 'descripcion'],
    contact: ['contact', 'contacto', 'contacts', 'contactos'],
    social: ['social', 'redes', 'social media', 'redes sociales', 'links'],
    experience: ['experience', 'experiencia', 'work', 'trabajo', 'career'],
    gallery: ['gallery', 'galeria', 'galería', 'images', 'imagenes', 'photos', 'fotos'],
    videos: ['video', 'videos', 'vídeos'],
  };

  const mapping = {};
  const unmapped = [];

  for (const table of schema.tables) {
    const tableName = table.name.toLowerCase();
    let matched = false;

    for (const [category, keywords] of Object.entries(expectedTables)) {
      if (keywords.some(keyword => tableName.includes(keyword))) {
        mapping[category] = {
          tableName: table.name,
          tableId: table.id,
          fields: table.fields,
        };
        matched = true;
        console.log(`✅ ${category.toUpperCase().padEnd(12)} -> "${table.name}"`);
        break;
      }
    }

    if (!matched) {
      unmapped.push(table.name);
    }
  }

  if (unmapped.length > 0) {
    console.log('\n⚠️  Tablas no mapeadas automáticamente:');
    unmapped.forEach(name => console.log(`   - ${name}`));
  }

  // Detectar campos faltantes o diferentes
  console.log('\n\n📝 Verificando campos esperados vs reales...\n');

  for (const [category, info] of Object.entries(mapping)) {
    console.log(`\n${category.toUpperCase()} (${info.tableName}):`);
    const fieldNames = info.fields.map(f => f.name);

    // Mostrar todos los campos encontrados
    console.log(`   Campos encontrados: ${fieldNames.join(', ')}`);
  }

  return mapping;
}

// Ejecutar análisis
analyzeTables().then(({ schema, mapping }) => {
  // Aquí podrías guardar el mapping en un archivo para uso posterior
  const mappingPath = path.join(__dirname, '..', 'airtable-mapping.json');
  fs.writeFileSync(mappingPath, JSON.stringify(mapping, null, 2));
  console.log(`💾 Mapeo guardado en: airtable-mapping.json\n`);
}).catch(error => {
  console.error('❌ Error fatal:', error);
  process.exit(1);
});
