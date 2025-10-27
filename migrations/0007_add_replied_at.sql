-- Add replied_at column to prospects table
ALTER TABLE "prospects" ADD COLUMN IF NOT EXISTS "replied_at" timestamp;
