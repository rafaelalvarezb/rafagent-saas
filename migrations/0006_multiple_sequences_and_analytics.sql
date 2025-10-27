-- Add sequenceId to prospects table
ALTER TABLE "prospects" ADD COLUMN "sequence_id" varchar;
ALTER TABLE "prospects" ADD COLUMN "email_opened" boolean DEFAULT false;
ALTER TABLE "prospects" ADD COLUMN "email_opened_at" timestamp;

-- Add meeting and reminder templates to sequences table
ALTER TABLE "sequences" ADD COLUMN "meeting_title" text DEFAULT '${companyName} & Google';
ALTER TABLE "sequences" ADD COLUMN "meeting_description" text;
ALTER TABLE "sequences" ADD COLUMN "reminder_enabled" boolean DEFAULT true;
ALTER TABLE "sequences" ADD COLUMN "reminder_timing" text DEFAULT '24h';
ALTER TABLE "sequences" ADD COLUMN "reminder_subject" text DEFAULT 'Reminder: Meeting Tomorrow';
ALTER TABLE "sequences" ADD COLUMN "reminder_body" text DEFAULT 'Hi ${contactName},

This is a friendly reminder about our meeting scheduled for tomorrow.

Looking forward to speaking with you!

Best,
${yourName}';

-- Add foreign key constraint
ALTER TABLE "prospects" ADD CONSTRAINT "prospects_sequence_id_sequences_id_fk" FOREIGN KEY ("sequence_id") REFERENCES "public"."sequences"("id") ON DELETE set null ON UPDATE no action;

