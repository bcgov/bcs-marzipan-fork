ALTER TABLE "activities" ADD COLUMN "graphics_user_id" integer;--> statement-breakpoint
ALTER TABLE "activities" DROP COLUMN "videographer_user_id";--> statement-breakpoint
ALTER TABLE "activities" DROP COLUMN "graphics_id";--> statement-breakpoint
ALTER TABLE "activities" DROP COLUMN "videographer_id";