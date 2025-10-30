const Airtable = require('airtable');

const token = 'patFMZeZlszuFAPPu.c56b941cb93b15a7f33662a44e455e6cb212eee1380aeb12981ea17c99c7533c';
const baseId = 'app1zpsyVcRE1Cg1L';
const tableName = 'PosicionTarjeta';

const base = new Airtable({ apiKey: token }).base(baseId);

console.log(`🔍 Fetching records from table: ${tableName}\n`);

base(tableName)
  .select({
    sort: [{ field: 'Posicion', direction: 'asc' }]
  })
  .all()
  .then(records => {
    console.log(`✅ Found ${records.length} records\n`);

    if (records.length === 0) {
      console.log('❌ No records found in PosicionTarjeta table!');
      return;
    }

    console.log('--- All Records (sorted by Posicion) ---');
    records.forEach((record, index) => {
      const nombre = record.fields.Nombre;
      const activado = record.fields.Activado;
      const posicion = record.fields.Posicion;

      console.log(`${index + 1}. Nombre: ${nombre}`);
      console.log(`   Activado: ${activado === true ? '✓ YES' : '✗ NO (or undefined)'}`);
      console.log(`   Posicion: ${posicion || 'NOT SET'}`);
      console.log('');
    });

    console.log('--- Active Cards Only ---');
    const activeCards = records
      .filter(r => r.fields.Activado === true)
      .map(r => r.fields.Nombre);

    console.log('Active cards array:', activeCards);

    if (activeCards.length === 0) {
      console.log('\n❌ WARNING: No cards are marked as Activado=true!');
      console.log('Make sure to check the "Activado" checkbox in Airtable for the cards you want to show.');
    }
  })
  .catch(err => {
    console.error('❌ Error fetching data:', err.message);
    if (err.statusCode === 404) {
      console.error('\n⚠️  Table "PosicionTarjeta" not found!');
      console.error('Please verify the table name in Airtable matches exactly (case-sensitive)');
    }
  });
