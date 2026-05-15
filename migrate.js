import { Client } from 'pg';
import fs from 'fs';
import path from 'path';

const DIRECT_URL = "postgresql://postgres.cdgyitdulfvuzzhpbolr:KIKPROJECT2026@aws-1-ap-southeast-1.pooler.supabase.com:5432/postgres";

async function runMigration() {
  const client = new Client({
    connectionString: DIRECT_URL,
  });

  try {
    await client.connect();
    console.log('Connected to Supabase PostgreSQL database.');

    const sqlFilePath = path.join(process.cwd(), 'supabase', 'migrations', '003_bookings_transactions.sql');
    const sql = fs.readFileSync(sqlFilePath, 'utf-8');

    console.log('Executing migration...');
    await client.query(sql);
    console.log('Migration executed successfully.');
  } catch (err) {
    console.error('Error executing migration:', err);
  } finally {
    await client.end();
  }
}

runMigration();
