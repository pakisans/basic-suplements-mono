import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_pages_blocks_capsule_tech_note_arrow" AS ENUM('up', 'down', 'none');
  CREATE TYPE "public"."enum__pages_v_blocks_capsule_tech_note_arrow" AS ENUM('up', 'down', 'none');
  CREATE TYPE "public"."enum_posts_blocks_capsule_tech_note_arrow" AS ENUM('up', 'down', 'none');
  CREATE TYPE "public"."enum__posts_v_blocks_capsule_tech_note_arrow" AS ENUM('up', 'down', 'none');
  CREATE TYPE "public"."enum_categories_blocks_capsule_tech_note_arrow" AS ENUM('up', 'down', 'none');
  CREATE TYPE "public"."enum_post_categories_blocks_capsule_tech_note_arrow" AS ENUM('up', 'down', 'none');
  CREATE TYPE "public"."enum_brands_blocks_capsule_tech_note_arrow" AS ENUM('up', 'down', 'none');
  CREATE TYPE "public"."enum_products_blocks_capsule_tech_note_arrow" AS ENUM('up', 'down', 'none');
  CREATE TYPE "public"."enum__products_v_blocks_capsule_tech_note_arrow" AS ENUM('up', 'down', 'none');
  CREATE TABLE "pages_blocks_capsule_tech_columns" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL
  );
  
  CREATE TABLE "pages_blocks_capsule_tech_columns_locales" (
  	"title" varchar,
  	"text" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "pages_blocks_capsule_tech" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"background_image_id" integer,
  	"note_pill" varchar,
  	"note_metric" varchar,
  	"note_metric_suffix" varchar,
  	"note_arrow" "enum_pages_blocks_capsule_tech_note_arrow" DEFAULT 'up',
  	"media_video_id" integer,
  	"media_video_url" varchar,
  	"media_image_id" integer,
  	"block_name" varchar
  );
  
  CREATE TABLE "pages_blocks_capsule_tech_locales" (
  	"label" varchar,
  	"heading" varchar,
  	"note_title" varchar,
  	"disclaimer" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "_pages_v_blocks_capsule_tech_columns" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_capsule_tech_columns_locales" (
  	"title" varchar,
  	"text" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "_pages_v_blocks_capsule_tech" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"background_image_id" integer,
  	"note_pill" varchar,
  	"note_metric" varchar,
  	"note_metric_suffix" varchar,
  	"note_arrow" "enum__pages_v_blocks_capsule_tech_note_arrow" DEFAULT 'up',
  	"media_video_id" integer,
  	"media_video_url" varchar,
  	"media_image_id" integer,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_capsule_tech_locales" (
  	"label" varchar,
  	"heading" varchar,
  	"note_title" varchar,
  	"disclaimer" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "posts_blocks_capsule_tech_columns" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL
  );
  
  CREATE TABLE "posts_blocks_capsule_tech_columns_locales" (
  	"title" varchar,
  	"text" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "posts_blocks_capsule_tech" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"background_image_id" integer,
  	"note_pill" varchar,
  	"note_metric" varchar,
  	"note_metric_suffix" varchar,
  	"note_arrow" "enum_posts_blocks_capsule_tech_note_arrow" DEFAULT 'up',
  	"media_video_id" integer,
  	"media_video_url" varchar,
  	"media_image_id" integer,
  	"block_name" varchar
  );
  
  CREATE TABLE "posts_blocks_capsule_tech_locales" (
  	"label" varchar,
  	"heading" varchar,
  	"note_title" varchar,
  	"disclaimer" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "_posts_v_blocks_capsule_tech_columns" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_posts_v_blocks_capsule_tech_columns_locales" (
  	"title" varchar,
  	"text" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "_posts_v_blocks_capsule_tech" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"background_image_id" integer,
  	"note_pill" varchar,
  	"note_metric" varchar,
  	"note_metric_suffix" varchar,
  	"note_arrow" "enum__posts_v_blocks_capsule_tech_note_arrow" DEFAULT 'up',
  	"media_video_id" integer,
  	"media_video_url" varchar,
  	"media_image_id" integer,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_posts_v_blocks_capsule_tech_locales" (
  	"label" varchar,
  	"heading" varchar,
  	"note_title" varchar,
  	"disclaimer" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "categories_blocks_capsule_tech_columns" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL
  );
  
  CREATE TABLE "categories_blocks_capsule_tech_columns_locales" (
  	"title" varchar NOT NULL,
  	"text" varchar NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "categories_blocks_capsule_tech" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"background_image_id" integer,
  	"note_pill" varchar,
  	"note_metric" varchar,
  	"note_metric_suffix" varchar,
  	"note_arrow" "enum_categories_blocks_capsule_tech_note_arrow" DEFAULT 'up',
  	"media_video_id" integer,
  	"media_video_url" varchar,
  	"media_image_id" integer,
  	"block_name" varchar
  );
  
  CREATE TABLE "categories_blocks_capsule_tech_locales" (
  	"label" varchar,
  	"heading" varchar NOT NULL,
  	"note_title" varchar,
  	"disclaimer" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "post_categories_blocks_capsule_tech_columns" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL
  );
  
  CREATE TABLE "post_categories_blocks_capsule_tech_columns_locales" (
  	"title" varchar NOT NULL,
  	"text" varchar NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "post_categories_blocks_capsule_tech" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"background_image_id" integer,
  	"note_pill" varchar,
  	"note_metric" varchar,
  	"note_metric_suffix" varchar,
  	"note_arrow" "enum_post_categories_blocks_capsule_tech_note_arrow" DEFAULT 'up',
  	"media_video_id" integer,
  	"media_video_url" varchar,
  	"media_image_id" integer,
  	"block_name" varchar
  );
  
  CREATE TABLE "post_categories_blocks_capsule_tech_locales" (
  	"label" varchar,
  	"heading" varchar NOT NULL,
  	"note_title" varchar,
  	"disclaimer" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "brands_blocks_capsule_tech_columns" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL
  );
  
  CREATE TABLE "brands_blocks_capsule_tech_columns_locales" (
  	"title" varchar NOT NULL,
  	"text" varchar NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "brands_blocks_capsule_tech" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"background_image_id" integer,
  	"note_pill" varchar,
  	"note_metric" varchar,
  	"note_metric_suffix" varchar,
  	"note_arrow" "enum_brands_blocks_capsule_tech_note_arrow" DEFAULT 'up',
  	"media_video_id" integer,
  	"media_video_url" varchar,
  	"media_image_id" integer,
  	"block_name" varchar
  );
  
  CREATE TABLE "brands_blocks_capsule_tech_locales" (
  	"label" varchar,
  	"heading" varchar NOT NULL,
  	"note_title" varchar,
  	"disclaimer" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "products_blocks_capsule_tech_columns" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL
  );
  
  CREATE TABLE "products_blocks_capsule_tech_columns_locales" (
  	"title" varchar,
  	"text" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "products_blocks_capsule_tech" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"background_image_id" integer,
  	"note_pill" varchar,
  	"note_metric" varchar,
  	"note_metric_suffix" varchar,
  	"note_arrow" "enum_products_blocks_capsule_tech_note_arrow" DEFAULT 'up',
  	"media_video_id" integer,
  	"media_video_url" varchar,
  	"media_image_id" integer,
  	"block_name" varchar
  );
  
  CREATE TABLE "products_blocks_capsule_tech_locales" (
  	"label" varchar,
  	"heading" varchar,
  	"note_title" varchar,
  	"disclaimer" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "_products_v_blocks_capsule_tech_columns" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_products_v_blocks_capsule_tech_columns_locales" (
  	"title" varchar,
  	"text" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "_products_v_blocks_capsule_tech" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"background_image_id" integer,
  	"note_pill" varchar,
  	"note_metric" varchar,
  	"note_metric_suffix" varchar,
  	"note_arrow" "enum__products_v_blocks_capsule_tech_note_arrow" DEFAULT 'up',
  	"media_video_id" integer,
  	"media_video_url" varchar,
  	"media_image_id" integer,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_products_v_blocks_capsule_tech_locales" (
  	"label" varchar,
  	"heading" varchar,
  	"note_title" varchar,
  	"disclaimer" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  ALTER TABLE "pages_blocks_capsule_tech_columns" ADD CONSTRAINT "pages_blocks_capsule_tech_columns_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_capsule_tech"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_capsule_tech_columns_locales" ADD CONSTRAINT "pages_blocks_capsule_tech_columns_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_capsule_tech_columns"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_capsule_tech" ADD CONSTRAINT "pages_blocks_capsule_tech_background_image_id_media_id_fk" FOREIGN KEY ("background_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "pages_blocks_capsule_tech" ADD CONSTRAINT "pages_blocks_capsule_tech_media_video_id_media_id_fk" FOREIGN KEY ("media_video_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "pages_blocks_capsule_tech" ADD CONSTRAINT "pages_blocks_capsule_tech_media_image_id_media_id_fk" FOREIGN KEY ("media_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "pages_blocks_capsule_tech" ADD CONSTRAINT "pages_blocks_capsule_tech_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_capsule_tech_locales" ADD CONSTRAINT "pages_blocks_capsule_tech_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_capsule_tech"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_capsule_tech_columns" ADD CONSTRAINT "_pages_v_blocks_capsule_tech_columns_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_capsule_tech"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_capsule_tech_columns_locales" ADD CONSTRAINT "_pages_v_blocks_capsule_tech_columns_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_capsule_tech_columns"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_capsule_tech" ADD CONSTRAINT "_pages_v_blocks_capsule_tech_background_image_id_media_id_fk" FOREIGN KEY ("background_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_capsule_tech" ADD CONSTRAINT "_pages_v_blocks_capsule_tech_media_video_id_media_id_fk" FOREIGN KEY ("media_video_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_capsule_tech" ADD CONSTRAINT "_pages_v_blocks_capsule_tech_media_image_id_media_id_fk" FOREIGN KEY ("media_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_capsule_tech" ADD CONSTRAINT "_pages_v_blocks_capsule_tech_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_capsule_tech_locales" ADD CONSTRAINT "_pages_v_blocks_capsule_tech_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_capsule_tech"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "posts_blocks_capsule_tech_columns" ADD CONSTRAINT "posts_blocks_capsule_tech_columns_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."posts_blocks_capsule_tech"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "posts_blocks_capsule_tech_columns_locales" ADD CONSTRAINT "posts_blocks_capsule_tech_columns_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."posts_blocks_capsule_tech_columns"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "posts_blocks_capsule_tech" ADD CONSTRAINT "posts_blocks_capsule_tech_background_image_id_media_id_fk" FOREIGN KEY ("background_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "posts_blocks_capsule_tech" ADD CONSTRAINT "posts_blocks_capsule_tech_media_video_id_media_id_fk" FOREIGN KEY ("media_video_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "posts_blocks_capsule_tech" ADD CONSTRAINT "posts_blocks_capsule_tech_media_image_id_media_id_fk" FOREIGN KEY ("media_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "posts_blocks_capsule_tech" ADD CONSTRAINT "posts_blocks_capsule_tech_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."posts"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "posts_blocks_capsule_tech_locales" ADD CONSTRAINT "posts_blocks_capsule_tech_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."posts_blocks_capsule_tech"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_posts_v_blocks_capsule_tech_columns" ADD CONSTRAINT "_posts_v_blocks_capsule_tech_columns_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_posts_v_blocks_capsule_tech"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_posts_v_blocks_capsule_tech_columns_locales" ADD CONSTRAINT "_posts_v_blocks_capsule_tech_columns_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_posts_v_blocks_capsule_tech_columns"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_posts_v_blocks_capsule_tech" ADD CONSTRAINT "_posts_v_blocks_capsule_tech_background_image_id_media_id_fk" FOREIGN KEY ("background_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_posts_v_blocks_capsule_tech" ADD CONSTRAINT "_posts_v_blocks_capsule_tech_media_video_id_media_id_fk" FOREIGN KEY ("media_video_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_posts_v_blocks_capsule_tech" ADD CONSTRAINT "_posts_v_blocks_capsule_tech_media_image_id_media_id_fk" FOREIGN KEY ("media_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_posts_v_blocks_capsule_tech" ADD CONSTRAINT "_posts_v_blocks_capsule_tech_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_posts_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_posts_v_blocks_capsule_tech_locales" ADD CONSTRAINT "_posts_v_blocks_capsule_tech_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_posts_v_blocks_capsule_tech"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "categories_blocks_capsule_tech_columns" ADD CONSTRAINT "categories_blocks_capsule_tech_columns_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."categories_blocks_capsule_tech"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "categories_blocks_capsule_tech_columns_locales" ADD CONSTRAINT "categories_blocks_capsule_tech_columns_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."categories_blocks_capsule_tech_columns"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "categories_blocks_capsule_tech" ADD CONSTRAINT "categories_blocks_capsule_tech_background_image_id_media_id_fk" FOREIGN KEY ("background_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "categories_blocks_capsule_tech" ADD CONSTRAINT "categories_blocks_capsule_tech_media_video_id_media_id_fk" FOREIGN KEY ("media_video_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "categories_blocks_capsule_tech" ADD CONSTRAINT "categories_blocks_capsule_tech_media_image_id_media_id_fk" FOREIGN KEY ("media_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "categories_blocks_capsule_tech" ADD CONSTRAINT "categories_blocks_capsule_tech_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."categories"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "categories_blocks_capsule_tech_locales" ADD CONSTRAINT "categories_blocks_capsule_tech_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."categories_blocks_capsule_tech"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "post_categories_blocks_capsule_tech_columns" ADD CONSTRAINT "post_categories_blocks_capsule_tech_columns_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."post_categories_blocks_capsule_tech"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "post_categories_blocks_capsule_tech_columns_locales" ADD CONSTRAINT "post_categories_blocks_capsule_tech_columns_locales_paren_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."post_categories_blocks_capsule_tech_columns"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "post_categories_blocks_capsule_tech" ADD CONSTRAINT "post_categories_blocks_capsule_tech_background_image_id_media_id_fk" FOREIGN KEY ("background_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "post_categories_blocks_capsule_tech" ADD CONSTRAINT "post_categories_blocks_capsule_tech_media_video_id_media_id_fk" FOREIGN KEY ("media_video_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "post_categories_blocks_capsule_tech" ADD CONSTRAINT "post_categories_blocks_capsule_tech_media_image_id_media_id_fk" FOREIGN KEY ("media_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "post_categories_blocks_capsule_tech" ADD CONSTRAINT "post_categories_blocks_capsule_tech_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."post_categories"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "post_categories_blocks_capsule_tech_locales" ADD CONSTRAINT "post_categories_blocks_capsule_tech_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."post_categories_blocks_capsule_tech"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "brands_blocks_capsule_tech_columns" ADD CONSTRAINT "brands_blocks_capsule_tech_columns_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."brands_blocks_capsule_tech"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "brands_blocks_capsule_tech_columns_locales" ADD CONSTRAINT "brands_blocks_capsule_tech_columns_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."brands_blocks_capsule_tech_columns"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "brands_blocks_capsule_tech" ADD CONSTRAINT "brands_blocks_capsule_tech_background_image_id_media_id_fk" FOREIGN KEY ("background_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "brands_blocks_capsule_tech" ADD CONSTRAINT "brands_blocks_capsule_tech_media_video_id_media_id_fk" FOREIGN KEY ("media_video_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "brands_blocks_capsule_tech" ADD CONSTRAINT "brands_blocks_capsule_tech_media_image_id_media_id_fk" FOREIGN KEY ("media_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "brands_blocks_capsule_tech" ADD CONSTRAINT "brands_blocks_capsule_tech_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."brands"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "brands_blocks_capsule_tech_locales" ADD CONSTRAINT "brands_blocks_capsule_tech_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."brands_blocks_capsule_tech"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "products_blocks_capsule_tech_columns" ADD CONSTRAINT "products_blocks_capsule_tech_columns_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."products_blocks_capsule_tech"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "products_blocks_capsule_tech_columns_locales" ADD CONSTRAINT "products_blocks_capsule_tech_columns_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."products_blocks_capsule_tech_columns"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "products_blocks_capsule_tech" ADD CONSTRAINT "products_blocks_capsule_tech_background_image_id_media_id_fk" FOREIGN KEY ("background_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "products_blocks_capsule_tech" ADD CONSTRAINT "products_blocks_capsule_tech_media_video_id_media_id_fk" FOREIGN KEY ("media_video_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "products_blocks_capsule_tech" ADD CONSTRAINT "products_blocks_capsule_tech_media_image_id_media_id_fk" FOREIGN KEY ("media_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "products_blocks_capsule_tech" ADD CONSTRAINT "products_blocks_capsule_tech_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."products"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "products_blocks_capsule_tech_locales" ADD CONSTRAINT "products_blocks_capsule_tech_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."products_blocks_capsule_tech"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_products_v_blocks_capsule_tech_columns" ADD CONSTRAINT "_products_v_blocks_capsule_tech_columns_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_products_v_blocks_capsule_tech"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_products_v_blocks_capsule_tech_columns_locales" ADD CONSTRAINT "_products_v_blocks_capsule_tech_columns_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_products_v_blocks_capsule_tech_columns"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_products_v_blocks_capsule_tech" ADD CONSTRAINT "_products_v_blocks_capsule_tech_background_image_id_media_id_fk" FOREIGN KEY ("background_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_products_v_blocks_capsule_tech" ADD CONSTRAINT "_products_v_blocks_capsule_tech_media_video_id_media_id_fk" FOREIGN KEY ("media_video_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_products_v_blocks_capsule_tech" ADD CONSTRAINT "_products_v_blocks_capsule_tech_media_image_id_media_id_fk" FOREIGN KEY ("media_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_products_v_blocks_capsule_tech" ADD CONSTRAINT "_products_v_blocks_capsule_tech_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_products_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_products_v_blocks_capsule_tech_locales" ADD CONSTRAINT "_products_v_blocks_capsule_tech_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_products_v_blocks_capsule_tech"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "pages_blocks_capsule_tech_columns_order_idx" ON "pages_blocks_capsule_tech_columns" USING btree ("_order");
  CREATE INDEX "pages_blocks_capsule_tech_columns_parent_id_idx" ON "pages_blocks_capsule_tech_columns" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "pages_blocks_capsule_tech_columns_locales_locale_parent_id_u" ON "pages_blocks_capsule_tech_columns_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "pages_blocks_capsule_tech_order_idx" ON "pages_blocks_capsule_tech" USING btree ("_order");
  CREATE INDEX "pages_blocks_capsule_tech_parent_id_idx" ON "pages_blocks_capsule_tech" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_capsule_tech_path_idx" ON "pages_blocks_capsule_tech" USING btree ("_path");
  CREATE INDEX "pages_blocks_capsule_tech_background_image_idx" ON "pages_blocks_capsule_tech" USING btree ("background_image_id");
  CREATE INDEX "pages_blocks_capsule_tech_media_media_video_idx" ON "pages_blocks_capsule_tech" USING btree ("media_video_id");
  CREATE INDEX "pages_blocks_capsule_tech_media_media_image_idx" ON "pages_blocks_capsule_tech" USING btree ("media_image_id");
  CREATE UNIQUE INDEX "pages_blocks_capsule_tech_locales_locale_parent_id_unique" ON "pages_blocks_capsule_tech_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "_pages_v_blocks_capsule_tech_columns_order_idx" ON "_pages_v_blocks_capsule_tech_columns" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_capsule_tech_columns_parent_id_idx" ON "_pages_v_blocks_capsule_tech_columns" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "_pages_v_blocks_capsule_tech_columns_locales_locale_parent_i" ON "_pages_v_blocks_capsule_tech_columns_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "_pages_v_blocks_capsule_tech_order_idx" ON "_pages_v_blocks_capsule_tech" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_capsule_tech_parent_id_idx" ON "_pages_v_blocks_capsule_tech" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_capsule_tech_path_idx" ON "_pages_v_blocks_capsule_tech" USING btree ("_path");
  CREATE INDEX "_pages_v_blocks_capsule_tech_background_image_idx" ON "_pages_v_blocks_capsule_tech" USING btree ("background_image_id");
  CREATE INDEX "_pages_v_blocks_capsule_tech_media_media_video_idx" ON "_pages_v_blocks_capsule_tech" USING btree ("media_video_id");
  CREATE INDEX "_pages_v_blocks_capsule_tech_media_media_image_idx" ON "_pages_v_blocks_capsule_tech" USING btree ("media_image_id");
  CREATE UNIQUE INDEX "_pages_v_blocks_capsule_tech_locales_locale_parent_id_unique" ON "_pages_v_blocks_capsule_tech_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "posts_blocks_capsule_tech_columns_order_idx" ON "posts_blocks_capsule_tech_columns" USING btree ("_order");
  CREATE INDEX "posts_blocks_capsule_tech_columns_parent_id_idx" ON "posts_blocks_capsule_tech_columns" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "posts_blocks_capsule_tech_columns_locales_locale_parent_id_u" ON "posts_blocks_capsule_tech_columns_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "posts_blocks_capsule_tech_order_idx" ON "posts_blocks_capsule_tech" USING btree ("_order");
  CREATE INDEX "posts_blocks_capsule_tech_parent_id_idx" ON "posts_blocks_capsule_tech" USING btree ("_parent_id");
  CREATE INDEX "posts_blocks_capsule_tech_path_idx" ON "posts_blocks_capsule_tech" USING btree ("_path");
  CREATE INDEX "posts_blocks_capsule_tech_background_image_idx" ON "posts_blocks_capsule_tech" USING btree ("background_image_id");
  CREATE INDEX "posts_blocks_capsule_tech_media_media_video_idx" ON "posts_blocks_capsule_tech" USING btree ("media_video_id");
  CREATE INDEX "posts_blocks_capsule_tech_media_media_image_idx" ON "posts_blocks_capsule_tech" USING btree ("media_image_id");
  CREATE UNIQUE INDEX "posts_blocks_capsule_tech_locales_locale_parent_id_unique" ON "posts_blocks_capsule_tech_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "_posts_v_blocks_capsule_tech_columns_order_idx" ON "_posts_v_blocks_capsule_tech_columns" USING btree ("_order");
  CREATE INDEX "_posts_v_blocks_capsule_tech_columns_parent_id_idx" ON "_posts_v_blocks_capsule_tech_columns" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "_posts_v_blocks_capsule_tech_columns_locales_locale_parent_i" ON "_posts_v_blocks_capsule_tech_columns_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "_posts_v_blocks_capsule_tech_order_idx" ON "_posts_v_blocks_capsule_tech" USING btree ("_order");
  CREATE INDEX "_posts_v_blocks_capsule_tech_parent_id_idx" ON "_posts_v_blocks_capsule_tech" USING btree ("_parent_id");
  CREATE INDEX "_posts_v_blocks_capsule_tech_path_idx" ON "_posts_v_blocks_capsule_tech" USING btree ("_path");
  CREATE INDEX "_posts_v_blocks_capsule_tech_background_image_idx" ON "_posts_v_blocks_capsule_tech" USING btree ("background_image_id");
  CREATE INDEX "_posts_v_blocks_capsule_tech_media_media_video_idx" ON "_posts_v_blocks_capsule_tech" USING btree ("media_video_id");
  CREATE INDEX "_posts_v_blocks_capsule_tech_media_media_image_idx" ON "_posts_v_blocks_capsule_tech" USING btree ("media_image_id");
  CREATE UNIQUE INDEX "_posts_v_blocks_capsule_tech_locales_locale_parent_id_unique" ON "_posts_v_blocks_capsule_tech_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "categories_blocks_capsule_tech_columns_order_idx" ON "categories_blocks_capsule_tech_columns" USING btree ("_order");
  CREATE INDEX "categories_blocks_capsule_tech_columns_parent_id_idx" ON "categories_blocks_capsule_tech_columns" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "categories_blocks_capsule_tech_columns_locales_locale_parent" ON "categories_blocks_capsule_tech_columns_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "categories_blocks_capsule_tech_order_idx" ON "categories_blocks_capsule_tech" USING btree ("_order");
  CREATE INDEX "categories_blocks_capsule_tech_parent_id_idx" ON "categories_blocks_capsule_tech" USING btree ("_parent_id");
  CREATE INDEX "categories_blocks_capsule_tech_path_idx" ON "categories_blocks_capsule_tech" USING btree ("_path");
  CREATE INDEX "categories_blocks_capsule_tech_background_image_idx" ON "categories_blocks_capsule_tech" USING btree ("background_image_id");
  CREATE INDEX "categories_blocks_capsule_tech_media_media_video_idx" ON "categories_blocks_capsule_tech" USING btree ("media_video_id");
  CREATE INDEX "categories_blocks_capsule_tech_media_media_image_idx" ON "categories_blocks_capsule_tech" USING btree ("media_image_id");
  CREATE UNIQUE INDEX "categories_blocks_capsule_tech_locales_locale_parent_id_uniq" ON "categories_blocks_capsule_tech_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "post_categories_blocks_capsule_tech_columns_order_idx" ON "post_categories_blocks_capsule_tech_columns" USING btree ("_order");
  CREATE INDEX "post_categories_blocks_capsule_tech_columns_parent_id_idx" ON "post_categories_blocks_capsule_tech_columns" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "post_categories_blocks_capsule_tech_columns_locales_locale_p" ON "post_categories_blocks_capsule_tech_columns_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "post_categories_blocks_capsule_tech_order_idx" ON "post_categories_blocks_capsule_tech" USING btree ("_order");
  CREATE INDEX "post_categories_blocks_capsule_tech_parent_id_idx" ON "post_categories_blocks_capsule_tech" USING btree ("_parent_id");
  CREATE INDEX "post_categories_blocks_capsule_tech_path_idx" ON "post_categories_blocks_capsule_tech" USING btree ("_path");
  CREATE INDEX "post_categories_blocks_capsule_tech_background_image_idx" ON "post_categories_blocks_capsule_tech" USING btree ("background_image_id");
  CREATE INDEX "post_categories_blocks_capsule_tech_media_media_video_idx" ON "post_categories_blocks_capsule_tech" USING btree ("media_video_id");
  CREATE INDEX "post_categories_blocks_capsule_tech_media_media_image_idx" ON "post_categories_blocks_capsule_tech" USING btree ("media_image_id");
  CREATE UNIQUE INDEX "post_categories_blocks_capsule_tech_locales_locale_parent_id" ON "post_categories_blocks_capsule_tech_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "brands_blocks_capsule_tech_columns_order_idx" ON "brands_blocks_capsule_tech_columns" USING btree ("_order");
  CREATE INDEX "brands_blocks_capsule_tech_columns_parent_id_idx" ON "brands_blocks_capsule_tech_columns" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "brands_blocks_capsule_tech_columns_locales_locale_parent_id_" ON "brands_blocks_capsule_tech_columns_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "brands_blocks_capsule_tech_order_idx" ON "brands_blocks_capsule_tech" USING btree ("_order");
  CREATE INDEX "brands_blocks_capsule_tech_parent_id_idx" ON "brands_blocks_capsule_tech" USING btree ("_parent_id");
  CREATE INDEX "brands_blocks_capsule_tech_path_idx" ON "brands_blocks_capsule_tech" USING btree ("_path");
  CREATE INDEX "brands_blocks_capsule_tech_background_image_idx" ON "brands_blocks_capsule_tech" USING btree ("background_image_id");
  CREATE INDEX "brands_blocks_capsule_tech_media_media_video_idx" ON "brands_blocks_capsule_tech" USING btree ("media_video_id");
  CREATE INDEX "brands_blocks_capsule_tech_media_media_image_idx" ON "brands_blocks_capsule_tech" USING btree ("media_image_id");
  CREATE UNIQUE INDEX "brands_blocks_capsule_tech_locales_locale_parent_id_unique" ON "brands_blocks_capsule_tech_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "products_blocks_capsule_tech_columns_order_idx" ON "products_blocks_capsule_tech_columns" USING btree ("_order");
  CREATE INDEX "products_blocks_capsule_tech_columns_parent_id_idx" ON "products_blocks_capsule_tech_columns" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "products_blocks_capsule_tech_columns_locales_locale_parent_i" ON "products_blocks_capsule_tech_columns_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "products_blocks_capsule_tech_order_idx" ON "products_blocks_capsule_tech" USING btree ("_order");
  CREATE INDEX "products_blocks_capsule_tech_parent_id_idx" ON "products_blocks_capsule_tech" USING btree ("_parent_id");
  CREATE INDEX "products_blocks_capsule_tech_path_idx" ON "products_blocks_capsule_tech" USING btree ("_path");
  CREATE INDEX "products_blocks_capsule_tech_background_image_idx" ON "products_blocks_capsule_tech" USING btree ("background_image_id");
  CREATE INDEX "products_blocks_capsule_tech_media_media_video_idx" ON "products_blocks_capsule_tech" USING btree ("media_video_id");
  CREATE INDEX "products_blocks_capsule_tech_media_media_image_idx" ON "products_blocks_capsule_tech" USING btree ("media_image_id");
  CREATE UNIQUE INDEX "products_blocks_capsule_tech_locales_locale_parent_id_unique" ON "products_blocks_capsule_tech_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "_products_v_blocks_capsule_tech_columns_order_idx" ON "_products_v_blocks_capsule_tech_columns" USING btree ("_order");
  CREATE INDEX "_products_v_blocks_capsule_tech_columns_parent_id_idx" ON "_products_v_blocks_capsule_tech_columns" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "_products_v_blocks_capsule_tech_columns_locales_locale_paren" ON "_products_v_blocks_capsule_tech_columns_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "_products_v_blocks_capsule_tech_order_idx" ON "_products_v_blocks_capsule_tech" USING btree ("_order");
  CREATE INDEX "_products_v_blocks_capsule_tech_parent_id_idx" ON "_products_v_blocks_capsule_tech" USING btree ("_parent_id");
  CREATE INDEX "_products_v_blocks_capsule_tech_path_idx" ON "_products_v_blocks_capsule_tech" USING btree ("_path");
  CREATE INDEX "_products_v_blocks_capsule_tech_background_image_idx" ON "_products_v_blocks_capsule_tech" USING btree ("background_image_id");
  CREATE INDEX "_products_v_blocks_capsule_tech_media_media_video_idx" ON "_products_v_blocks_capsule_tech" USING btree ("media_video_id");
  CREATE INDEX "_products_v_blocks_capsule_tech_media_media_image_idx" ON "_products_v_blocks_capsule_tech" USING btree ("media_image_id");
  CREATE UNIQUE INDEX "_products_v_blocks_capsule_tech_locales_locale_parent_id_uni" ON "_products_v_blocks_capsule_tech_locales" USING btree ("_locale","_parent_id");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   DROP TABLE "pages_blocks_capsule_tech_columns" CASCADE;
  DROP TABLE "pages_blocks_capsule_tech_columns_locales" CASCADE;
  DROP TABLE "pages_blocks_capsule_tech" CASCADE;
  DROP TABLE "pages_blocks_capsule_tech_locales" CASCADE;
  DROP TABLE "_pages_v_blocks_capsule_tech_columns" CASCADE;
  DROP TABLE "_pages_v_blocks_capsule_tech_columns_locales" CASCADE;
  DROP TABLE "_pages_v_blocks_capsule_tech" CASCADE;
  DROP TABLE "_pages_v_blocks_capsule_tech_locales" CASCADE;
  DROP TABLE "posts_blocks_capsule_tech_columns" CASCADE;
  DROP TABLE "posts_blocks_capsule_tech_columns_locales" CASCADE;
  DROP TABLE "posts_blocks_capsule_tech" CASCADE;
  DROP TABLE "posts_blocks_capsule_tech_locales" CASCADE;
  DROP TABLE "_posts_v_blocks_capsule_tech_columns" CASCADE;
  DROP TABLE "_posts_v_blocks_capsule_tech_columns_locales" CASCADE;
  DROP TABLE "_posts_v_blocks_capsule_tech" CASCADE;
  DROP TABLE "_posts_v_blocks_capsule_tech_locales" CASCADE;
  DROP TABLE "categories_blocks_capsule_tech_columns" CASCADE;
  DROP TABLE "categories_blocks_capsule_tech_columns_locales" CASCADE;
  DROP TABLE "categories_blocks_capsule_tech" CASCADE;
  DROP TABLE "categories_blocks_capsule_tech_locales" CASCADE;
  DROP TABLE "post_categories_blocks_capsule_tech_columns" CASCADE;
  DROP TABLE "post_categories_blocks_capsule_tech_columns_locales" CASCADE;
  DROP TABLE "post_categories_blocks_capsule_tech" CASCADE;
  DROP TABLE "post_categories_blocks_capsule_tech_locales" CASCADE;
  DROP TABLE "brands_blocks_capsule_tech_columns" CASCADE;
  DROP TABLE "brands_blocks_capsule_tech_columns_locales" CASCADE;
  DROP TABLE "brands_blocks_capsule_tech" CASCADE;
  DROP TABLE "brands_blocks_capsule_tech_locales" CASCADE;
  DROP TABLE "products_blocks_capsule_tech_columns" CASCADE;
  DROP TABLE "products_blocks_capsule_tech_columns_locales" CASCADE;
  DROP TABLE "products_blocks_capsule_tech" CASCADE;
  DROP TABLE "products_blocks_capsule_tech_locales" CASCADE;
  DROP TABLE "_products_v_blocks_capsule_tech_columns" CASCADE;
  DROP TABLE "_products_v_blocks_capsule_tech_columns_locales" CASCADE;
  DROP TABLE "_products_v_blocks_capsule_tech" CASCADE;
  DROP TABLE "_products_v_blocks_capsule_tech_locales" CASCADE;
  DROP TYPE "public"."enum_pages_blocks_capsule_tech_note_arrow";
  DROP TYPE "public"."enum__pages_v_blocks_capsule_tech_note_arrow";
  DROP TYPE "public"."enum_posts_blocks_capsule_tech_note_arrow";
  DROP TYPE "public"."enum__posts_v_blocks_capsule_tech_note_arrow";
  DROP TYPE "public"."enum_categories_blocks_capsule_tech_note_arrow";
  DROP TYPE "public"."enum_post_categories_blocks_capsule_tech_note_arrow";
  DROP TYPE "public"."enum_brands_blocks_capsule_tech_note_arrow";
  DROP TYPE "public"."enum_products_blocks_capsule_tech_note_arrow";
  DROP TYPE "public"."enum__products_v_blocks_capsule_tech_note_arrow";`)
}
