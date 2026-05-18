import { Client } from 'pg';

const DIRECT_URL = "postgresql://postgres.cdgyitdulfvuzzhpbolr:KIKPROJECT2026@aws-1-ap-southeast-1.pooler.supabase.com:5432/postgres";

async function checkSchema() {
  const client = new Client({
    connectionString: DIRECT_URL,
  });

  try {
    await client.connect();
    console.log('Connected. Checking users table columns...');
    const result = await client.query(`
      SELECT column_name, data_type 
      FROM information_schema.columns 
      WHERE table_name = 'users';
    `);
    
    console.log(result.rows);
  } catch (err) {
    console.error('Error:', err);
  } finally {
    await client.end();
  }
}

checkSchema();
