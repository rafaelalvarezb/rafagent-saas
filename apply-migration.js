/**
 * Script to apply the replied_at column migration
 */

import { neon } from '@neondatabase/serverless';

async function applyMigration() {
  // Get DATABASE_URL from environment
  const databaseUrl = process.env.DATABASE_URL;
  
  if (!databaseUrl) {
    console.error('❌ ERROR: DATABASE_URL environment variable not found');
    console.log('\nPlease set DATABASE_URL in your environment or create a .env file:');
    console.log('DATABASE_URL=postgresql://...');
    process.exit(1);
  }

  console.log('🔄 Connecting to database...');
  const sql = neon(databaseUrl);

  try {
    console.log('📝 Applying migration: Add replied_at column...');
    
    await sql`
      ALTER TABLE prospects 
      ADD COLUMN IF NOT EXISTS replied_at timestamp;
    `;
    
    console.log('✅ Migration applied successfully!');
    console.log('🎉 The replied_at column has been added to the prospects table.');
    
    // Verify the column was added
    const result = await sql`
      SELECT column_name, data_type 
      FROM information_schema.columns 
      WHERE table_name = 'prospects' 
      AND column_name = 'replied_at';
    `;
    
    if (result.length > 0) {
      console.log('✅ Verification: Column exists in database');
      console.log(`   Column: ${result[0].column_name}`);
      console.log(`   Type: ${result[0].data_type}`);
    }
    
    console.log('\n🚀 You can now restart your server and the error should be gone!');
    
  } catch (error) {
    console.error('❌ Migration failed:', error.message);
    process.exit(1);
  }
}

applyMigration();

