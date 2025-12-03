CREATE TABLE "activities" (
	"id" serial PRIMARY KEY NOT NULL,
	"display_id" varchar(50),
	"start_date" date,
	"start_time" time,
	"end_date" date,
	"end_time" time,
	"scheduling_status_id" integer,
	"scheduling_considerations" text,
	"title" varchar(500),
	"summary" text,
	"comments" text,
	"lead_organization" varchar(255),
	"venue" varchar(500),
	"venue_address" jsonb,
	"significance" text,
	"pitch_comments" text,
	"news_release_id" uuid,
	"entry_status_id" integer,
	"pitch_status_id" integer,
	"lead_org_id" uuid,
	"event_lead_org_id" uuid,
	"comms_lead_id" integer,
	"event_lead_id" integer,
	"event_lead_name" varchar(255),
	"videographer_user_id" integer,
	"graphics_id" integer,
	"owner_id" integer,
	"nr_distribution_id" integer,
	"premier_requested_id" integer,
	"contact_ministry_id" uuid,
	"videographer_id" integer,
	"city_id" integer,
	"is_all_day" boolean DEFAULT false NOT NULL,
	"oic_related" boolean DEFAULT false NOT NULL,
	"not_for_look_ahead" boolean DEFAULT false NOT NULL,
	"planning_report" boolean DEFAULT false NOT NULL,
	"thirty_sixty_ninety_report" boolean DEFAULT false NOT NULL,
	"is_active" boolean DEFAULT true NOT NULL,
	"is_confidential" boolean DEFAULT false NOT NULL,
	"is_issue" boolean DEFAULT false NOT NULL,
	"look_ahead_status" varchar(50),
	"look_ahead_section" varchar(50),
	"calendar_visibility" varchar(50),
	"hq_section" integer DEFAULT 0 NOT NULL,
	"created_date_time" timestamp with time zone,
	"created_by" integer,
	"last_updated_date_time" timestamp with time zone,
	"last_updated_by" integer,
	"row_version" bigint DEFAULT 0 NOT NULL,
	"row_guid" uuid
);
--> statement-breakpoint
CREATE TABLE "activity_history" (
	"id" serial PRIMARY KEY NOT NULL,
	"activity_id" integer NOT NULL,
	"user_id" integer NOT NULL,
	"action_type" varchar(50) NOT NULL,
	"changes" jsonb,
	"notes" text,
	"timestamp" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "system_users" (
	"id" serial PRIMARY KEY NOT NULL,
	"username" varchar(255) NOT NULL,
	"first_name" varchar(255),
	"last_name" varchar(255),
	"email" varchar(255),
	"role" varchar(50) DEFAULT 'ReadOnly' NOT NULL,
	"is_active" boolean DEFAULT true NOT NULL,
	"external_id" varchar(255),
	"ad_username" varchar(255),
	"ad_display_name" varchar(255),
	"ad_email" varchar(255),
	"ad_phone" varchar(50),
	"ad_division" varchar(255),
	"ad_department" varchar(255),
	"ad_job_title" varchar(255),
	"phone" varchar(50),
	"department" varchar(255),
	"notes" text,
	"last_login_date_time" timestamp with time zone,
	"created_date_time" timestamp with time zone,
	"created_by" integer,
	"last_updated_date_time" timestamp with time zone,
	"last_updated_by" integer,
	"timestamp" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "system_users_username_unique" UNIQUE("username")
);
--> statement-breakpoint
CREATE TABLE "ministries" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"sort_order" integer NOT NULL,
	"is_active" boolean DEFAULT true NOT NULL,
	"display_name" varchar(255),
	"abbreviation" varchar(50),
	"minister_name" varchar(255),
	"contact_user_id" integer,
	"second_contact_user_id" integer,
	"parent_id" uuid,
	"eod_last_run_user_id" integer,
	"timestamp" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "organizations" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" varchar(255) NOT NULL,
	"display_name" varchar(255),
	"organization_type" varchar(50),
	"ministry_id" uuid,
	"is_active" boolean DEFAULT true NOT NULL,
	"sort_order" integer DEFAULT 0 NOT NULL,
	"description" text,
	"timestamp" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "activity_statuses" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" varchar(255) NOT NULL,
	"display_name" varchar(255),
	"sort_order" integer DEFAULT 0 NOT NULL,
	"is_active" boolean DEFAULT true NOT NULL,
	"description" text,
	"timestamp" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "categories" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" varchar(255) NOT NULL,
	"display_name" varchar(255),
	"sort_order" integer DEFAULT 0 NOT NULL,
	"pitch_not_required" boolean DEFAULT false NOT NULL,
	"is_active" boolean DEFAULT true NOT NULL,
	"description" text,
	"timestamp" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "cities" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" varchar(255) NOT NULL,
	"display_name" varchar(255),
	"sort_order" integer DEFAULT 0 NOT NULL,
	"is_active" boolean DEFAULT true NOT NULL,
	"province" varchar(100),
	"timestamp" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "comms_materials" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" varchar(255) NOT NULL,
	"display_name" varchar(255),
	"sort_order" integer DEFAULT 0 NOT NULL,
	"is_active" boolean DEFAULT true NOT NULL,
	"description" text,
	"timestamp" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "communication_contacts" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" varchar(255) NOT NULL,
	"display_name" varchar(255),
	"sort_order" integer DEFAULT 0 NOT NULL,
	"is_active" boolean DEFAULT true NOT NULL,
	"email" varchar(255),
	"phone" varchar(50),
	"timestamp" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "event_planners" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" varchar(255) NOT NULL,
	"display_name" varchar(255),
	"sort_order" integer DEFAULT 0 NOT NULL,
	"is_active" boolean DEFAULT true NOT NULL,
	"email" varchar(255),
	"phone" varchar(50),
	"timestamp" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "government_representatives" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" varchar(255) NOT NULL,
	"display_name" varchar(255),
	"sort_order" integer DEFAULT 0 NOT NULL,
	"is_active" boolean DEFAULT true NOT NULL,
	"title" varchar(255),
	"email" varchar(255),
	"timestamp" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "pitch_statuses" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" varchar(255) NOT NULL,
	"display_name" varchar(255),
	"sort_order" integer DEFAULT 0 NOT NULL,
	"is_active" boolean DEFAULT true NOT NULL,
	"description" text,
	"timestamp" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "scheduling_statuses" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" varchar(255) NOT NULL,
	"display_name" varchar(255),
	"sort_order" integer DEFAULT 0 NOT NULL,
	"is_active" boolean DEFAULT true NOT NULL,
	"description" text,
	"timestamp" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "tags" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"key" varchar(100),
	"display_name" varchar(255),
	"sort_order" integer DEFAULT 0 NOT NULL,
	"is_active" boolean DEFAULT true NOT NULL
);
--> statement-breakpoint
CREATE TABLE "themes" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"key" varchar(100),
	"display_name" varchar(255),
	"sort_order" integer DEFAULT 0 NOT NULL,
	"is_active" boolean DEFAULT true NOT NULL,
	"timestamp" timestamp with time zone DEFAULT now() NOT NULL,
	"top_release_id" uuid,
	"feature_release_id" uuid
);
--> statement-breakpoint
CREATE TABLE "translated_languages" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" varchar(255) NOT NULL,
	"display_name" varchar(255),
	"sort_order" integer DEFAULT 0 NOT NULL,
	"is_active" boolean DEFAULT true NOT NULL,
	"description" text,
	"timestamp" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "videographers" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" varchar(255) NOT NULL,
	"display_name" varchar(255),
	"sort_order" integer DEFAULT 0 NOT NULL,
	"is_active" boolean DEFAULT true NOT NULL,
	"email" varchar(255),
	"phone" varchar(50),
	"timestamp" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "activity_can_edit_users" (
	"activity_id" integer NOT NULL,
	"user_id" integer NOT NULL,
	"is_active" boolean DEFAULT true NOT NULL,
	"created_date_time" timestamp with time zone DEFAULT now() NOT NULL,
	"created_by" integer NOT NULL,
	"last_updated_date_time" timestamp with time zone DEFAULT now() NOT NULL,
	"last_updated_by" integer NOT NULL,
	CONSTRAINT "activity_can_edit_users_activity_id_user_id_pk" PRIMARY KEY("activity_id","user_id")
);
--> statement-breakpoint
CREATE TABLE "activity_can_view_users" (
	"activity_id" integer NOT NULL,
	"user_id" integer NOT NULL,
	"is_active" boolean DEFAULT true NOT NULL,
	"created_date_time" timestamp with time zone DEFAULT now() NOT NULL,
	"created_by" integer NOT NULL,
	"last_updated_date_time" timestamp with time zone DEFAULT now() NOT NULL,
	"last_updated_by" integer NOT NULL,
	CONSTRAINT "activity_can_view_users_activity_id_user_id_pk" PRIMARY KEY("activity_id","user_id")
);
--> statement-breakpoint
CREATE TABLE "activity_categories" (
	"activity_id" integer NOT NULL,
	"category_id" integer NOT NULL,
	"is_active" boolean DEFAULT true NOT NULL,
	"created_date_time" timestamp with time zone DEFAULT now() NOT NULL,
	"created_by" integer NOT NULL,
	"last_updated_date_time" timestamp with time zone DEFAULT now() NOT NULL,
	"last_updated_by" integer NOT NULL,
	CONSTRAINT "activity_categories_activity_id_category_id_pk" PRIMARY KEY("activity_id","category_id")
);
--> statement-breakpoint
CREATE TABLE "activity_comms_materials" (
	"activity_id" integer NOT NULL,
	"comms_material_id" integer NOT NULL,
	"is_active" boolean DEFAULT true NOT NULL,
	"created_date_time" timestamp with time zone DEFAULT now() NOT NULL,
	"created_by" integer NOT NULL,
	"last_updated_date_time" timestamp with time zone DEFAULT now() NOT NULL,
	"last_updated_by" integer NOT NULL,
	CONSTRAINT "activity_comms_materials_activity_id_comms_material_id_pk" PRIMARY KEY("activity_id","comms_material_id")
);
--> statement-breakpoint
CREATE TABLE "activity_field_review_statuses" (
	"activity_id" integer NOT NULL,
	"field_name" varchar(100) NOT NULL,
	"review_status_id" integer NOT NULL,
	"requested_by" integer,
	"requested_at" timestamp with time zone,
	"reviewed_by" integer,
	"reviewed_at" timestamp with time zone,
	"notes" text,
	"created_date_time" timestamp with time zone DEFAULT now() NOT NULL,
	"created_by" integer,
	"last_updated_date_time" timestamp with time zone DEFAULT now() NOT NULL,
	"last_updated_by" integer,
	CONSTRAINT "activity_field_review_statuses_activity_id_field_name_pk" PRIMARY KEY("activity_id","field_name")
);
--> statement-breakpoint
CREATE TABLE "activity_joint_event_organizations" (
	"activity_id" integer NOT NULL,
	"organization_id" uuid NOT NULL,
	"is_active" boolean DEFAULT true NOT NULL,
	"created_date_time" timestamp with time zone DEFAULT now() NOT NULL,
	"created_by" integer NOT NULL,
	"last_updated_date_time" timestamp with time zone DEFAULT now() NOT NULL,
	"last_updated_by" integer NOT NULL,
	CONSTRAINT "activity_joint_event_organizations_activity_id_organization_id_pk" PRIMARY KEY("activity_id","organization_id")
);
--> statement-breakpoint
CREATE TABLE "activity_joint_organizations" (
	"activity_id" integer NOT NULL,
	"organization_id" uuid NOT NULL,
	"is_active" boolean DEFAULT true NOT NULL,
	"created_date_time" timestamp with time zone DEFAULT now() NOT NULL,
	"created_by" integer NOT NULL,
	"last_updated_date_time" timestamp with time zone DEFAULT now() NOT NULL,
	"last_updated_by" integer NOT NULL,
	CONSTRAINT "activity_joint_organizations_activity_id_organization_id_pk" PRIMARY KEY("activity_id","organization_id")
);
--> statement-breakpoint
CREATE TABLE "activity_related_entries" (
	"activity_id" integer NOT NULL,
	"related_activity_id" integer NOT NULL,
	"is_active" boolean DEFAULT true NOT NULL,
	"created_date_time" timestamp with time zone DEFAULT now() NOT NULL,
	"created_by" integer NOT NULL,
	"last_updated_date_time" timestamp with time zone DEFAULT now() NOT NULL,
	"last_updated_by" integer NOT NULL,
	CONSTRAINT "activity_related_entries_activity_id_related_activity_id_pk" PRIMARY KEY("activity_id","related_activity_id")
);
--> statement-breakpoint
CREATE TABLE "activity_representatives" (
	"id" serial PRIMARY KEY NOT NULL,
	"activity_id" integer NOT NULL,
	"representative_id" integer,
	"representative_name" varchar(255),
	"attending_status" varchar(50) NOT NULL,
	"is_active" boolean DEFAULT true NOT NULL,
	"created_date_time" timestamp with time zone DEFAULT now() NOT NULL,
	"created_by" integer NOT NULL,
	"last_updated_date_time" timestamp with time zone DEFAULT now() NOT NULL,
	"last_updated_by" integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE "activity_shared_with_organizations" (
	"activity_id" integer NOT NULL,
	"organization_id" uuid NOT NULL,
	"is_active" boolean DEFAULT true NOT NULL,
	"created_date_time" timestamp with time zone DEFAULT now() NOT NULL,
	"created_by" integer NOT NULL,
	"last_updated_date_time" timestamp with time zone DEFAULT now() NOT NULL,
	"last_updated_by" integer NOT NULL,
	CONSTRAINT "activity_shared_with_organizations_activity_id_organization_id_pk" PRIMARY KEY("activity_id","organization_id")
);
--> statement-breakpoint
CREATE TABLE "activity_tags" (
	"activity_id" integer NOT NULL,
	"tag_id" uuid NOT NULL,
	"is_active" boolean DEFAULT true NOT NULL,
	"created_date_time" timestamp with time zone DEFAULT now() NOT NULL,
	"created_by" integer NOT NULL,
	"last_updated_date_time" timestamp with time zone DEFAULT now() NOT NULL,
	"last_updated_by" integer NOT NULL,
	CONSTRAINT "activity_tags_activity_id_tag_id_pk" PRIMARY KEY("activity_id","tag_id")
);
--> statement-breakpoint
CREATE TABLE "activity_themes" (
	"activity_id" integer NOT NULL,
	"theme_id" uuid NOT NULL,
	"is_active" boolean DEFAULT true NOT NULL,
	"created_date_time" timestamp with time zone DEFAULT now() NOT NULL,
	"created_by" integer NOT NULL,
	"last_updated_date_time" timestamp with time zone DEFAULT now() NOT NULL,
	"last_updated_by" integer NOT NULL,
	CONSTRAINT "activity_themes_activity_id_theme_id_pk" PRIMARY KEY("activity_id","theme_id")
);
--> statement-breakpoint
CREATE TABLE "activity_translation_languages" (
	"activity_id" integer NOT NULL,
	"language_id" integer NOT NULL,
	"is_active" boolean DEFAULT true NOT NULL,
	"created_date_time" timestamp with time zone DEFAULT now() NOT NULL,
	"created_by" integer NOT NULL,
	"last_updated_date_time" timestamp with time zone DEFAULT now() NOT NULL,
	"last_updated_by" integer NOT NULL,
	CONSTRAINT "activity_translation_languages_activity_id_language_id_pk" PRIMARY KEY("activity_id","language_id")
);
--> statement-breakpoint
ALTER TABLE "activity_history" ADD CONSTRAINT "activity_history_activity_id_activities_id_fk" FOREIGN KEY ("activity_id") REFERENCES "public"."activities"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "activity_history" ADD CONSTRAINT "activity_history_user_id_system_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."system_users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "activity_can_edit_users" ADD CONSTRAINT "activity_can_edit_users_activity_id_activities_id_fk" FOREIGN KEY ("activity_id") REFERENCES "public"."activities"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "activity_can_edit_users" ADD CONSTRAINT "activity_can_edit_users_user_id_system_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."system_users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "activity_can_edit_users" ADD CONSTRAINT "activity_can_edit_users_created_by_system_users_id_fk" FOREIGN KEY ("created_by") REFERENCES "public"."system_users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "activity_can_edit_users" ADD CONSTRAINT "activity_can_edit_users_last_updated_by_system_users_id_fk" FOREIGN KEY ("last_updated_by") REFERENCES "public"."system_users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "activity_can_view_users" ADD CONSTRAINT "activity_can_view_users_activity_id_activities_id_fk" FOREIGN KEY ("activity_id") REFERENCES "public"."activities"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "activity_can_view_users" ADD CONSTRAINT "activity_can_view_users_user_id_system_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."system_users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "activity_can_view_users" ADD CONSTRAINT "activity_can_view_users_created_by_system_users_id_fk" FOREIGN KEY ("created_by") REFERENCES "public"."system_users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "activity_can_view_users" ADD CONSTRAINT "activity_can_view_users_last_updated_by_system_users_id_fk" FOREIGN KEY ("last_updated_by") REFERENCES "public"."system_users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "activity_categories" ADD CONSTRAINT "activity_categories_activity_id_activities_id_fk" FOREIGN KEY ("activity_id") REFERENCES "public"."activities"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "activity_categories" ADD CONSTRAINT "activity_categories_category_id_categories_id_fk" FOREIGN KEY ("category_id") REFERENCES "public"."categories"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "activity_categories" ADD CONSTRAINT "activity_categories_created_by_system_users_id_fk" FOREIGN KEY ("created_by") REFERENCES "public"."system_users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "activity_categories" ADD CONSTRAINT "activity_categories_last_updated_by_system_users_id_fk" FOREIGN KEY ("last_updated_by") REFERENCES "public"."system_users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "activity_comms_materials" ADD CONSTRAINT "activity_comms_materials_activity_id_activities_id_fk" FOREIGN KEY ("activity_id") REFERENCES "public"."activities"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "activity_comms_materials" ADD CONSTRAINT "activity_comms_materials_comms_material_id_comms_materials_id_fk" FOREIGN KEY ("comms_material_id") REFERENCES "public"."comms_materials"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "activity_comms_materials" ADD CONSTRAINT "activity_comms_materials_created_by_system_users_id_fk" FOREIGN KEY ("created_by") REFERENCES "public"."system_users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "activity_comms_materials" ADD CONSTRAINT "activity_comms_materials_last_updated_by_system_users_id_fk" FOREIGN KEY ("last_updated_by") REFERENCES "public"."system_users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "activity_field_review_statuses" ADD CONSTRAINT "activity_field_review_statuses_activity_id_activities_id_fk" FOREIGN KEY ("activity_id") REFERENCES "public"."activities"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "activity_field_review_statuses" ADD CONSTRAINT "activity_field_review_statuses_review_status_id_activity_statuses_id_fk" FOREIGN KEY ("review_status_id") REFERENCES "public"."activity_statuses"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "activity_field_review_statuses" ADD CONSTRAINT "activity_field_review_statuses_requested_by_system_users_id_fk" FOREIGN KEY ("requested_by") REFERENCES "public"."system_users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "activity_field_review_statuses" ADD CONSTRAINT "activity_field_review_statuses_reviewed_by_system_users_id_fk" FOREIGN KEY ("reviewed_by") REFERENCES "public"."system_users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "activity_field_review_statuses" ADD CONSTRAINT "activity_field_review_statuses_created_by_system_users_id_fk" FOREIGN KEY ("created_by") REFERENCES "public"."system_users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "activity_field_review_statuses" ADD CONSTRAINT "activity_field_review_statuses_last_updated_by_system_users_id_fk" FOREIGN KEY ("last_updated_by") REFERENCES "public"."system_users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "activity_joint_event_organizations" ADD CONSTRAINT "activity_joint_event_organizations_activity_id_activities_id_fk" FOREIGN KEY ("activity_id") REFERENCES "public"."activities"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "activity_joint_event_organizations" ADD CONSTRAINT "activity_joint_event_organizations_organization_id_organizations_id_fk" FOREIGN KEY ("organization_id") REFERENCES "public"."organizations"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "activity_joint_event_organizations" ADD CONSTRAINT "activity_joint_event_organizations_created_by_system_users_id_fk" FOREIGN KEY ("created_by") REFERENCES "public"."system_users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "activity_joint_event_organizations" ADD CONSTRAINT "activity_joint_event_organizations_last_updated_by_system_users_id_fk" FOREIGN KEY ("last_updated_by") REFERENCES "public"."system_users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "activity_joint_organizations" ADD CONSTRAINT "activity_joint_organizations_activity_id_activities_id_fk" FOREIGN KEY ("activity_id") REFERENCES "public"."activities"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "activity_joint_organizations" ADD CONSTRAINT "activity_joint_organizations_organization_id_organizations_id_fk" FOREIGN KEY ("organization_id") REFERENCES "public"."organizations"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "activity_joint_organizations" ADD CONSTRAINT "activity_joint_organizations_created_by_system_users_id_fk" FOREIGN KEY ("created_by") REFERENCES "public"."system_users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "activity_joint_organizations" ADD CONSTRAINT "activity_joint_organizations_last_updated_by_system_users_id_fk" FOREIGN KEY ("last_updated_by") REFERENCES "public"."system_users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "activity_related_entries" ADD CONSTRAINT "activity_related_entries_activity_id_activities_id_fk" FOREIGN KEY ("activity_id") REFERENCES "public"."activities"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "activity_related_entries" ADD CONSTRAINT "activity_related_entries_related_activity_id_activities_id_fk" FOREIGN KEY ("related_activity_id") REFERENCES "public"."activities"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "activity_related_entries" ADD CONSTRAINT "activity_related_entries_created_by_system_users_id_fk" FOREIGN KEY ("created_by") REFERENCES "public"."system_users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "activity_related_entries" ADD CONSTRAINT "activity_related_entries_last_updated_by_system_users_id_fk" FOREIGN KEY ("last_updated_by") REFERENCES "public"."system_users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "activity_representatives" ADD CONSTRAINT "activity_representatives_activity_id_activities_id_fk" FOREIGN KEY ("activity_id") REFERENCES "public"."activities"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "activity_representatives" ADD CONSTRAINT "activity_representatives_created_by_system_users_id_fk" FOREIGN KEY ("created_by") REFERENCES "public"."system_users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "activity_representatives" ADD CONSTRAINT "activity_representatives_last_updated_by_system_users_id_fk" FOREIGN KEY ("last_updated_by") REFERENCES "public"."system_users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "activity_shared_with_organizations" ADD CONSTRAINT "activity_shared_with_organizations_activity_id_activities_id_fk" FOREIGN KEY ("activity_id") REFERENCES "public"."activities"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "activity_shared_with_organizations" ADD CONSTRAINT "activity_shared_with_organizations_organization_id_organizations_id_fk" FOREIGN KEY ("organization_id") REFERENCES "public"."organizations"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "activity_shared_with_organizations" ADD CONSTRAINT "activity_shared_with_organizations_created_by_system_users_id_fk" FOREIGN KEY ("created_by") REFERENCES "public"."system_users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "activity_shared_with_organizations" ADD CONSTRAINT "activity_shared_with_organizations_last_updated_by_system_users_id_fk" FOREIGN KEY ("last_updated_by") REFERENCES "public"."system_users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "activity_tags" ADD CONSTRAINT "activity_tags_activity_id_activities_id_fk" FOREIGN KEY ("activity_id") REFERENCES "public"."activities"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "activity_tags" ADD CONSTRAINT "activity_tags_tag_id_tags_id_fk" FOREIGN KEY ("tag_id") REFERENCES "public"."tags"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "activity_tags" ADD CONSTRAINT "activity_tags_created_by_system_users_id_fk" FOREIGN KEY ("created_by") REFERENCES "public"."system_users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "activity_tags" ADD CONSTRAINT "activity_tags_last_updated_by_system_users_id_fk" FOREIGN KEY ("last_updated_by") REFERENCES "public"."system_users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "activity_themes" ADD CONSTRAINT "activity_themes_activity_id_activities_id_fk" FOREIGN KEY ("activity_id") REFERENCES "public"."activities"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "activity_themes" ADD CONSTRAINT "activity_themes_theme_id_themes_id_fk" FOREIGN KEY ("theme_id") REFERENCES "public"."themes"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "activity_themes" ADD CONSTRAINT "activity_themes_created_by_system_users_id_fk" FOREIGN KEY ("created_by") REFERENCES "public"."system_users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "activity_themes" ADD CONSTRAINT "activity_themes_last_updated_by_system_users_id_fk" FOREIGN KEY ("last_updated_by") REFERENCES "public"."system_users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "activity_translation_languages" ADD CONSTRAINT "activity_translation_languages_activity_id_activities_id_fk" FOREIGN KEY ("activity_id") REFERENCES "public"."activities"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "activity_translation_languages" ADD CONSTRAINT "activity_translation_languages_language_id_translated_languages_id_fk" FOREIGN KEY ("language_id") REFERENCES "public"."translated_languages"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "activity_translation_languages" ADD CONSTRAINT "activity_translation_languages_created_by_system_users_id_fk" FOREIGN KEY ("created_by") REFERENCES "public"."system_users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "activity_translation_languages" ADD CONSTRAINT "activity_translation_languages_last_updated_by_system_users_id_fk" FOREIGN KEY ("last_updated_by") REFERENCES "public"."system_users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "activity_history_activity_id_idx" ON "activity_history" USING btree ("activity_id");--> statement-breakpoint
CREATE INDEX "activity_history_user_id_idx" ON "activity_history" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "activity_history_timestamp_idx" ON "activity_history" USING btree ("timestamp");