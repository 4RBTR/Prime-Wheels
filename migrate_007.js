import { Client } from 'pg';
import fs from 'fs';

async function runMigration() {
  const connectionString = process.env.DATABASE_URL;
  if (!connectionString) {
    console.error("DATABASE_URL is not set in .env.local");
    process.exit(1);
  }

  const client = new Client({ connectionString });
  
  try {
    await client.connect();
    console.log("Connected to Supabase PostgreSQL database.");
    
    const sql = fs.readFileSync('supabase/migrations/007_inventory_enhancements.sql', 'utf8');
    
    console.log("Executing migration 007...");
    await client.query(sql);
    console.log("Migration 007 executed successfully!");
    
  } catch (error) {
    console.error("Error executing migration:", error);
  } finally {
    await client.end();
  }
}

runMigration();
