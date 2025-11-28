-- Create mailboxes table for multiple Gmail accounts per user
CREATE TABLE IF NOT EXISTS "mailboxes" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" varchar NOT NULL,
	"email" text NOT NULL,
	"display_name" text,
	"google_access_token" text,
	"google_refresh_token" text,
	"google_token_expiry" timestamp,
	"is_active" boolean DEFAULT true,
	"daily_send_limit" integer DEFAULT 25,
	"emails_sent_today" integer DEFAULT 0,
	"last_reset_date" timestamp,
	"warmup_status" text DEFAULT 'not_started',
	"warmup_start_date" timestamp,
	"warmup_current_day" integer DEFAULT 0,
	"reputation_score" real DEFAULT 0,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now(),
	CONSTRAINT "mailboxes_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action
);

