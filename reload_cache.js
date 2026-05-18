import { Client } from 'pg';

const DIRECT_URL = "postgresql://postgres.cdgyitdulfvuzzhpbolr:KIKPROJECT2026@aws-1-ap-southeast-1.pooler.supabase.com:5432/postgres";

async function reloadCache() {
  const client = new Client({
    connectionString: DIRECT_URL,
  });

  try {
    await client.connect();
    console.log('Connected to Supabase PostgreSQL database.');
    
    console.log('Reloading PostgREST schema cache...');
    await client.query("NOTIFY pgrst, 'reload schema';");
    console.log('Cache reloaded successfully.');
  } catch (err) {
    console.error('Error reloading cache:', err);
  } finally {
    await client.end();
  }
}

reloadCache();
