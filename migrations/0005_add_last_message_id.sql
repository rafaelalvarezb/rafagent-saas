-- Add last_message_id column to prospects table for proper email threading
ALTER TABLE "prospects" ADD COLUMN "last_message_id" text;

