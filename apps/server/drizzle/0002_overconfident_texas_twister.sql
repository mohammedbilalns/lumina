ALTER TABLE "user_preferences" ALTER COLUMN "user_id" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "user_preferences" ALTER COLUMN "category_id" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "articles" ADD COLUMN "featured_image" text NOT NULL;--> statement-breakpoint
ALTER TABLE "articles" ADD COLUMN "likes_count" integer DEFAULT 0 NOT NULL;--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "refresh_token" varchar(255);