import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_pages_blocks_highlight_variant" AS ENUM('right', 'left');
  CREATE TYPE "public"."enum__pages_v_blocks_highlight_variant" AS ENUM('right', 'left');
  CREATE TYPE "public"."enum_posts_blocks_highlight_variant" AS ENUM('right', 'left');
  CREATE TYPE "public"."enum__posts_v_blocks_highlight_variant" AS ENUM('right', 'left');
  CREATE TYPE "public"."enum_categories_blocks_highlight_variant" AS ENUM('right', 'left');
  CREATE TYPE "public"."enum_post_categories_blocks_highlight_variant" AS ENUM('right', 'left');
  CREATE TYPE "public"."enum_brands_blocks_highlight_variant" AS ENUM('right', 'left');
  CREATE TYPE "public"."enum_products_blocks_highlight_variant" AS ENUM('right', 'left');
  CREATE TYPE "public"."enum__products_v_blocks_highlight_variant" AS ENUM('right', 'left');
  CREATE TABLE "pages_blocks_highlight_gallery" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"image_id" integer
  );
  
  CREATE TABLE "pages_blocks_highlight" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"variant" "enum_pages_blocks_highlight_variant" DEFAULT 'right',
  	"cta_url" varchar,
  	"main_image_id" integer,
  	"block_name" varchar
  );
  
  CREATE TABLE "pages_blocks_highlight_locales" (
  	"badge" varchar,
  	"heading" varchar,
  	"body" varchar,
  	"cta_label" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "_pages_v_blocks_highlight_gallery" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"image_id" integer,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_highlight" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"variant" "enum__pages_v_blocks_highlight_variant" DEFAULT 'right',
  	"cta_url" varchar,
  	"main_image_id" integer,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_highlight_locales" (
  	"badge" varchar,
  	"heading" varchar,
  	"body" varchar,
  	"cta_label" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "posts_blocks_highlight_gallery" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"image_id" integer
  );
  
  CREATE TABLE "posts_blocks_highlight" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"variant" "enum_posts_blocks_highlight_variant" DEFAULT 'right',
  	"cta_url" varchar,
  	"main_image_id" integer,
  	"block_name" varchar
  );
  
  CREATE TABLE "posts_blocks_highlight_locales" (
  	"badge" varchar,
  	"heading" varchar,
  	"body" varchar,
  	"cta_label" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "_posts_v_blocks_highlight_gallery" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"image_id" integer,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_posts_v_blocks_highlight" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"variant" "enum__posts_v_blocks_highlight_variant" DEFAULT 'right',
  	"cta_url" varchar,
  	"main_image_id" integer,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_posts_v_blocks_highlight_locales" (
  	"badge" varchar,
  	"heading" varchar,
  	"body" varchar,
  	"cta_label" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "categories_blocks_highlight_gallery" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"image_id" integer NOT NULL
  );
  
  CREATE TABLE "categories_blocks_highlight" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"variant" "enum_categories_blocks_highlight_variant" DEFAULT 'right',
  	"cta_url" varchar,
  	"main_image_id" integer NOT NULL,
  	"block_name" varchar
  );
  
  CREATE TABLE "categories_blocks_highlight_locales" (
  	"badge" varchar,
  	"heading" varchar NOT NULL,
  	"body" varchar,
  	"cta_label" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "post_categories_blocks_highlight_gallery" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"image_id" integer NOT NULL
  );
  
  CREATE TABLE "post_categories_blocks_highlight" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"variant" "enum_post_categories_blocks_highlight_variant" DEFAULT 'right',
  	"cta_url" varchar,
  	"main_image_id" integer NOT NULL,
  	"block_name" varchar
  );
  
  CREATE TABLE "post_categories_blocks_highlight_locales" (
  	"badge" varchar,
  	"heading" varchar NOT NULL,
  	"body" varchar,
  	"cta_label" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "brands_blocks_highlight_gallery" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"image_id" integer NOT NULL
  );
  
  CREATE TABLE "brands_blocks_highlight" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"variant" "enum_brands_blocks_highlight_variant" DEFAULT 'right',
  	"cta_url" varchar,
  	"main_image_id" integer NOT NULL,
  	"block_name" varchar
  );
  
  CREATE TABLE "brands_blocks_highlight_locales" (
  	"badge" varchar,
  	"heading" varchar NOT NULL,
  	"body" varchar,
  	"cta_label" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "products_blocks_highlight_gallery" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"image_id" integer
  );
  
  CREATE TABLE "products_blocks_highlight" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"variant" "enum_products_blocks_highlight_variant" DEFAULT 'right',
  	"cta_url" varchar,
  	"main_image_id" integer,
  	"block_name" varchar
  );
  
  CREATE TABLE "products_blocks_highlight_locales" (
  	"badge" varchar,
  	"heading" varchar,
  	"body" varchar,
  	"cta_label" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "_products_v_blocks_highlight_gallery" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"image_id" integer,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_products_v_blocks_highlight" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"variant" "enum__products_v_blocks_highlight_variant" DEFAULT 'right',
  	"cta_url" varchar,
  	"main_image_id" integer,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_products_v_blocks_highlight_locales" (
  	"badge" varchar,
  	"heading" varchar,
  	"body" varchar,
  	"cta_label" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  ALTER TABLE "pages_blocks_highlight_gallery" ADD CONSTRAINT "pages_blocks_highlight_gallery_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "pages_blocks_highlight_gallery" ADD CONSTRAINT "pages_blocks_highlight_gallery_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_highlight"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_highlight" ADD CONSTRAINT "pages_blocks_highlight_main_image_id_media_id_fk" FOREIGN KEY ("main_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "pages_blocks_highlight" ADD CONSTRAINT "pages_blocks_highlight_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_highlight_locales" ADD CONSTRAINT "pages_blocks_highlight_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_highlight"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_highlight_gallery" ADD CONSTRAINT "_pages_v_blocks_highlight_gallery_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_highlight_gallery" ADD CONSTRAINT "_pages_v_blocks_highlight_gallery_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_highlight"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_highlight" ADD CONSTRAINT "_pages_v_blocks_highlight_main_image_id_media_id_fk" FOREIGN KEY ("main_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_highlight" ADD CONSTRAINT "_pages_v_blocks_highlight_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_highlight_locales" ADD CONSTRAINT "_pages_v_blocks_highlight_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_highlight"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "posts_blocks_highlight_gallery" ADD CONSTRAINT "posts_blocks_highlight_gallery_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "posts_blocks_highlight_gallery" ADD CONSTRAINT "posts_blocks_highlight_gallery_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."posts_blocks_highlight"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "posts_blocks_highlight" ADD CONSTRAINT "posts_blocks_highlight_main_image_id_media_id_fk" FOREIGN KEY ("main_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "posts_blocks_highlight" ADD CONSTRAINT "posts_blocks_highlight_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."posts"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "posts_blocks_highlight_locales" ADD CONSTRAINT "posts_blocks_highlight_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."posts_blocks_highlight"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_posts_v_blocks_highlight_gallery" ADD CONSTRAINT "_posts_v_blocks_highlight_gallery_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_posts_v_blocks_highlight_gallery" ADD CONSTRAINT "_posts_v_blocks_highlight_gallery_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_posts_v_blocks_highlight"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_posts_v_blocks_highlight" ADD CONSTRAINT "_posts_v_blocks_highlight_main_image_id_media_id_fk" FOREIGN KEY ("main_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_posts_v_blocks_highlight" ADD CONSTRAINT "_posts_v_blocks_highlight_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_posts_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_posts_v_blocks_highlight_locales" ADD CONSTRAINT "_posts_v_blocks_highlight_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_posts_v_blocks_highlight"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "categories_blocks_highlight_gallery" ADD CONSTRAINT "categories_blocks_highlight_gallery_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "categories_blocks_highlight_gallery" ADD CONSTRAINT "categories_blocks_highlight_gallery_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."categories_blocks_highlight"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "categories_blocks_highlight" ADD CONSTRAINT "categories_blocks_highlight_main_image_id_media_id_fk" FOREIGN KEY ("main_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "categories_blocks_highlight" ADD CONSTRAINT "categories_blocks_highlight_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."categories"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "categories_blocks_highlight_locales" ADD CONSTRAINT "categories_blocks_highlight_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."categories_blocks_highlight"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "post_categories_blocks_highlight_gallery" ADD CONSTRAINT "post_categories_blocks_highlight_gallery_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "post_categories_blocks_highlight_gallery" ADD CONSTRAINT "post_categories_blocks_highlight_gallery_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."post_categories_blocks_highlight"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "post_categories_blocks_highlight" ADD CONSTRAINT "post_categories_blocks_highlight_main_image_id_media_id_fk" FOREIGN KEY ("main_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "post_categories_blocks_highlight" ADD CONSTRAINT "post_categories_blocks_highlight_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."post_categories"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "post_categories_blocks_highlight_locales" ADD CONSTRAINT "post_categories_blocks_highlight_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."post_categories_blocks_highlight"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "brands_blocks_highlight_gallery" ADD CONSTRAINT "brands_blocks_highlight_gallery_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "brands_blocks_highlight_gallery" ADD CONSTRAINT "brands_blocks_highlight_gallery_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."brands_blocks_highlight"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "brands_blocks_highlight" ADD CONSTRAINT "brands_blocks_highlight_main_image_id_media_id_fk" FOREIGN KEY ("main_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "brands_blocks_highlight" ADD CONSTRAINT "brands_blocks_highlight_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."brands"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "brands_blocks_highlight_locales" ADD CONSTRAINT "brands_blocks_highlight_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."brands_blocks_highlight"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "products_blocks_highlight_gallery" ADD CONSTRAINT "products_blocks_highlight_gallery_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "products_blocks_highlight_gallery" ADD CONSTRAINT "products_blocks_highlight_gallery_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."products_blocks_highlight"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "products_blocks_highlight" ADD CONSTRAINT "products_blocks_highlight_main_image_id_media_id_fk" FOREIGN KEY ("main_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "products_blocks_highlight" ADD CONSTRAINT "products_blocks_highlight_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."products"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "products_blocks_highlight_locales" ADD CONSTRAINT "products_blocks_highlight_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."products_blocks_highlight"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_products_v_blocks_highlight_gallery" ADD CONSTRAINT "_products_v_blocks_highlight_gallery_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_products_v_blocks_highlight_gallery" ADD CONSTRAINT "_products_v_blocks_highlight_gallery_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_products_v_blocks_highlight"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_products_v_blocks_highlight" ADD CONSTRAINT "_products_v_blocks_highlight_main_image_id_media_id_fk" FOREIGN KEY ("main_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_products_v_blocks_highlight" ADD CONSTRAINT "_products_v_blocks_highlight_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_products_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_products_v_blocks_highlight_locales" ADD CONSTRAINT "_products_v_blocks_highlight_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_products_v_blocks_highlight"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "pages_blocks_highlight_gallery_order_idx" ON "pages_blocks_highlight_gallery" USING btree ("_order");
  CREATE INDEX "pages_blocks_highlight_gallery_parent_id_idx" ON "pages_blocks_highlight_gallery" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_highlight_gallery_image_idx" ON "pages_blocks_highlight_gallery" USING btree ("image_id");
  CREATE INDEX "pages_blocks_highlight_order_idx" ON "pages_blocks_highlight" USING btree ("_order");
  CREATE INDEX "pages_blocks_highlight_parent_id_idx" ON "pages_blocks_highlight" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_highlight_path_idx" ON "pages_blocks_highlight" USING btree ("_path");
  CREATE INDEX "pages_blocks_highlight_main_image_idx" ON "pages_blocks_highlight" USING btree ("main_image_id");
  CREATE UNIQUE INDEX "pages_blocks_highlight_locales_locale_parent_id_unique" ON "pages_blocks_highlight_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "_pages_v_blocks_highlight_gallery_order_idx" ON "_pages_v_blocks_highlight_gallery" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_highlight_gallery_parent_id_idx" ON "_pages_v_blocks_highlight_gallery" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_highlight_gallery_image_idx" ON "_pages_v_blocks_highlight_gallery" USING btree ("image_id");
  CREATE INDEX "_pages_v_blocks_highlight_order_idx" ON "_pages_v_blocks_highlight" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_highlight_parent_id_idx" ON "_pages_v_blocks_highlight" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_highlight_path_idx" ON "_pages_v_blocks_highlight" USING btree ("_path");
  CREATE INDEX "_pages_v_blocks_highlight_main_image_idx" ON "_pages_v_blocks_highlight" USING btree ("main_image_id");
  CREATE UNIQUE INDEX "_pages_v_blocks_highlight_locales_locale_parent_id_unique" ON "_pages_v_blocks_highlight_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "posts_blocks_highlight_gallery_order_idx" ON "posts_blocks_highlight_gallery" USING btree ("_order");
  CREATE INDEX "posts_blocks_highlight_gallery_parent_id_idx" ON "posts_blocks_highlight_gallery" USING btree ("_parent_id");
  CREATE INDEX "posts_blocks_highlight_gallery_image_idx" ON "posts_blocks_highlight_gallery" USING btree ("image_id");
  CREATE INDEX "posts_blocks_highlight_order_idx" ON "posts_blocks_highlight" USING btree ("_order");
  CREATE INDEX "posts_blocks_highlight_parent_id_idx" ON "posts_blocks_highlight" USING btree ("_parent_id");
  CREATE INDEX "posts_blocks_highlight_path_idx" ON "posts_blocks_highlight" USING btree ("_path");
  CREATE INDEX "posts_blocks_highlight_main_image_idx" ON "posts_blocks_highlight" USING btree ("main_image_id");
  CREATE UNIQUE INDEX "posts_blocks_highlight_locales_locale_parent_id_unique" ON "posts_blocks_highlight_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "_posts_v_blocks_highlight_gallery_order_idx" ON "_posts_v_blocks_highlight_gallery" USING btree ("_order");
  CREATE INDEX "_posts_v_blocks_highlight_gallery_parent_id_idx" ON "_posts_v_blocks_highlight_gallery" USING btree ("_parent_id");
  CREATE INDEX "_posts_v_blocks_highlight_gallery_image_idx" ON "_posts_v_blocks_highlight_gallery" USING btree ("image_id");
  CREATE INDEX "_posts_v_blocks_highlight_order_idx" ON "_posts_v_blocks_highlight" USING btree ("_order");
  CREATE INDEX "_posts_v_blocks_highlight_parent_id_idx" ON "_posts_v_blocks_highlight" USING btree ("_parent_id");
  CREATE INDEX "_posts_v_blocks_highlight_path_idx" ON "_posts_v_blocks_highlight" USING btree ("_path");
  CREATE INDEX "_posts_v_blocks_highlight_main_image_idx" ON "_posts_v_blocks_highlight" USING btree ("main_image_id");
  CREATE UNIQUE INDEX "_posts_v_blocks_highlight_locales_locale_parent_id_unique" ON "_posts_v_blocks_highlight_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "categories_blocks_highlight_gallery_order_idx" ON "categories_blocks_highlight_gallery" USING btree ("_order");
  CREATE INDEX "categories_blocks_highlight_gallery_parent_id_idx" ON "categories_blocks_highlight_gallery" USING btree ("_parent_id");
  CREATE INDEX "categories_blocks_highlight_gallery_image_idx" ON "categories_blocks_highlight_gallery" USING btree ("image_id");
  CREATE INDEX "categories_blocks_highlight_order_idx" ON "categories_blocks_highlight" USING btree ("_order");
  CREATE INDEX "categories_blocks_highlight_parent_id_idx" ON "categories_blocks_highlight" USING btree ("_parent_id");
  CREATE INDEX "categories_blocks_highlight_path_idx" ON "categories_blocks_highlight" USING btree ("_path");
  CREATE INDEX "categories_blocks_highlight_main_image_idx" ON "categories_blocks_highlight" USING btree ("main_image_id");
  CREATE UNIQUE INDEX "categories_blocks_highlight_locales_locale_parent_id_unique" ON "categories_blocks_highlight_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "post_categories_blocks_highlight_gallery_order_idx" ON "post_categories_blocks_highlight_gallery" USING btree ("_order");
  CREATE INDEX "post_categories_blocks_highlight_gallery_parent_id_idx" ON "post_categories_blocks_highlight_gallery" USING btree ("_parent_id");
  CREATE INDEX "post_categories_blocks_highlight_gallery_image_idx" ON "post_categories_blocks_highlight_gallery" USING btree ("image_id");
  CREATE INDEX "post_categories_blocks_highlight_order_idx" ON "post_categories_blocks_highlight" USING btree ("_order");
  CREATE INDEX "post_categories_blocks_highlight_parent_id_idx" ON "post_categories_blocks_highlight" USING btree ("_parent_id");
  CREATE INDEX "post_categories_blocks_highlight_path_idx" ON "post_categories_blocks_highlight" USING btree ("_path");
  CREATE INDEX "post_categories_blocks_highlight_main_image_idx" ON "post_categories_blocks_highlight" USING btree ("main_image_id");
  CREATE UNIQUE INDEX "post_categories_blocks_highlight_locales_locale_parent_id_un" ON "post_categories_blocks_highlight_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "brands_blocks_highlight_gallery_order_idx" ON "brands_blocks_highlight_gallery" USING btree ("_order");
  CREATE INDEX "brands_blocks_highlight_gallery_parent_id_idx" ON "brands_blocks_highlight_gallery" USING btree ("_parent_id");
  CREATE INDEX "brands_blocks_highlight_gallery_image_idx" ON "brands_blocks_highlight_gallery" USING btree ("image_id");
  CREATE INDEX "brands_blocks_highlight_order_idx" ON "brands_blocks_highlight" USING btree ("_order");
  CREATE INDEX "brands_blocks_highlight_parent_id_idx" ON "brands_blocks_highlight" USING btree ("_parent_id");
  CREATE INDEX "brands_blocks_highlight_path_idx" ON "brands_blocks_highlight" USING btree ("_path");
  CREATE INDEX "brands_blocks_highlight_main_image_idx" ON "brands_blocks_highlight" USING btree ("main_image_id");
  CREATE UNIQUE INDEX "brands_blocks_highlight_locales_locale_parent_id_unique" ON "brands_blocks_highlight_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "products_blocks_highlight_gallery_order_idx" ON "products_blocks_highlight_gallery" USING btree ("_order");
  CREATE INDEX "products_blocks_highlight_gallery_parent_id_idx" ON "products_blocks_highlight_gallery" USING btree ("_parent_id");
  CREATE INDEX "products_blocks_highlight_gallery_image_idx" ON "products_blocks_highlight_gallery" USING btree ("image_id");
  CREATE INDEX "products_blocks_highlight_order_idx" ON "products_blocks_highlight" USING btree ("_order");
  CREATE INDEX "products_blocks_highlight_parent_id_idx" ON "products_blocks_highlight" USING btree ("_parent_id");
  CREATE INDEX "products_blocks_highlight_path_idx" ON "products_blocks_highlight" USING btree ("_path");
  CREATE INDEX "products_blocks_highlight_main_image_idx" ON "products_blocks_highlight" USING btree ("main_image_id");
  CREATE UNIQUE INDEX "products_blocks_highlight_locales_locale_parent_id_unique" ON "products_blocks_highlight_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "_products_v_blocks_highlight_gallery_order_idx" ON "_products_v_blocks_highlight_gallery" USING btree ("_order");
  CREATE INDEX "_products_v_blocks_highlight_gallery_parent_id_idx" ON "_products_v_blocks_highlight_gallery" USING btree ("_parent_id");
  CREATE INDEX "_products_v_blocks_highlight_gallery_image_idx" ON "_products_v_blocks_highlight_gallery" USING btree ("image_id");
  CREATE INDEX "_products_v_blocks_highlight_order_idx" ON "_products_v_blocks_highlight" USING btree ("_order");
  CREATE INDEX "_products_v_blocks_highlight_parent_id_idx" ON "_products_v_blocks_highlight" USING btree ("_parent_id");
  CREATE INDEX "_products_v_blocks_highlight_path_idx" ON "_products_v_blocks_highlight" USING btree ("_path");
  CREATE INDEX "_products_v_blocks_highlight_main_image_idx" ON "_products_v_blocks_highlight" USING btree ("main_image_id");
  CREATE UNIQUE INDEX "_products_v_blocks_highlight_locales_locale_parent_id_unique" ON "_products_v_blocks_highlight_locales" USING btree ("_locale","_parent_id");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   DROP TABLE "pages_blocks_highlight_gallery" CASCADE;
  DROP TABLE "pages_blocks_highlight" CASCADE;
  DROP TABLE "pages_blocks_highlight_locales" CASCADE;
  DROP TABLE "_pages_v_blocks_highlight_gallery" CASCADE;
  DROP TABLE "_pages_v_blocks_highlight" CASCADE;
  DROP TABLE "_pages_v_blocks_highlight_locales" CASCADE;
  DROP TABLE "posts_blocks_highlight_gallery" CASCADE;
  DROP TABLE "posts_blocks_highlight" CASCADE;
  DROP TABLE "posts_blocks_highlight_locales" CASCADE;
  DROP TABLE "_posts_v_blocks_highlight_gallery" CASCADE;
  DROP TABLE "_posts_v_blocks_highlight" CASCADE;
  DROP TABLE "_posts_v_blocks_highlight_locales" CASCADE;
  DROP TABLE "categories_blocks_highlight_gallery" CASCADE;
  DROP TABLE "categories_blocks_highlight" CASCADE;
  DROP TABLE "categories_blocks_highlight_locales" CASCADE;
  DROP TABLE "post_categories_blocks_highlight_gallery" CASCADE;
  DROP TABLE "post_categories_blocks_highlight" CASCADE;
  DROP TABLE "post_categories_blocks_highlight_locales" CASCADE;
  DROP TABLE "brands_blocks_highlight_gallery" CASCADE;
  DROP TABLE "brands_blocks_highlight" CASCADE;
  DROP TABLE "brands_blocks_highlight_locales" CASCADE;
  DROP TABLE "products_blocks_highlight_gallery" CASCADE;
  DROP TABLE "products_blocks_highlight" CASCADE;
  DROP TABLE "products_blocks_highlight_locales" CASCADE;
  DROP TABLE "_products_v_blocks_highlight_gallery" CASCADE;
  DROP TABLE "_products_v_blocks_highlight" CASCADE;
  DROP TABLE "_products_v_blocks_highlight_locales" CASCADE;
  DROP TYPE "public"."enum_pages_blocks_highlight_variant";
  DROP TYPE "public"."enum__pages_v_blocks_highlight_variant";
  DROP TYPE "public"."enum_posts_blocks_highlight_variant";
  DROP TYPE "public"."enum__posts_v_blocks_highlight_variant";
  DROP TYPE "public"."enum_categories_blocks_highlight_variant";
  DROP TYPE "public"."enum_post_categories_blocks_highlight_variant";
  DROP TYPE "public"."enum_brands_blocks_highlight_variant";
  DROP TYPE "public"."enum_products_blocks_highlight_variant";
  DROP TYPE "public"."enum__products_v_blocks_highlight_variant";`)
}
