-- Add meeting_time column to prospects table
ALTER TABLE "prospects" ADD COLUMN IF NOT EXISTS "meeting_time" timestamp;

