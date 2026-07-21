import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_pages_blocks_product_spotlight_image_side" AS ENUM('right', 'left');
  CREATE TYPE "public"."enum__pages_v_blocks_product_spotlight_image_side" AS ENUM('right', 'left');
  CREATE TYPE "public"."enum_posts_blocks_product_spotlight_image_side" AS ENUM('right', 'left');
  CREATE TYPE "public"."enum__posts_v_blocks_product_spotlight_image_side" AS ENUM('right', 'left');
  CREATE TYPE "public"."enum_categories_blocks_product_spotlight_image_side" AS ENUM('right', 'left');
  CREATE TYPE "public"."enum_post_categories_blocks_product_spotlight_image_side" AS ENUM('right', 'left');
  CREATE TYPE "public"."enum_brands_blocks_product_spotlight_image_side" AS ENUM('right', 'left');
  CREATE TYPE "public"."enum_products_blocks_product_spotlight_image_side" AS ENUM('right', 'left');
  CREATE TYPE "public"."enum__products_v_blocks_product_spotlight_image_side" AS ENUM('right', 'left');
  CREATE TABLE "pages_blocks_product_spotlight" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"image_side" "enum_pages_blocks_product_spotlight_image_side" DEFAULT 'right',
  	"product_id" integer,
  	"stat_value" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "pages_blocks_product_spotlight_locales" (
  	"eyebrow" varchar,
  	"summary" varchar,
  	"stat_label" varchar,
  	"cta_label" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "_pages_v_blocks_product_spotlight" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"image_side" "enum__pages_v_blocks_product_spotlight_image_side" DEFAULT 'right',
  	"product_id" integer,
  	"stat_value" varchar,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_product_spotlight_locales" (
  	"eyebrow" varchar,
  	"summary" varchar,
  	"stat_label" varchar,
  	"cta_label" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "posts_blocks_product_spotlight" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"image_side" "enum_posts_blocks_product_spotlight_image_side" DEFAULT 'right',
  	"product_id" integer,
  	"stat_value" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "posts_blocks_product_spotlight_locales" (
  	"eyebrow" varchar,
  	"summary" varchar,
  	"stat_label" varchar,
  	"cta_label" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "_posts_v_blocks_product_spotlight" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"image_side" "enum__posts_v_blocks_product_spotlight_image_side" DEFAULT 'right',
  	"product_id" integer,
  	"stat_value" varchar,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_posts_v_blocks_product_spotlight_locales" (
  	"eyebrow" varchar,
  	"summary" varchar,
  	"stat_label" varchar,
  	"cta_label" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "categories_blocks_product_spotlight" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"image_side" "enum_categories_blocks_product_spotlight_image_side" DEFAULT 'right',
  	"product_id" integer NOT NULL,
  	"stat_value" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "categories_blocks_product_spotlight_locales" (
  	"eyebrow" varchar,
  	"summary" varchar,
  	"stat_label" varchar,
  	"cta_label" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "post_categories_blocks_product_spotlight" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"image_side" "enum_post_categories_blocks_product_spotlight_image_side" DEFAULT 'right',
  	"product_id" integer NOT NULL,
  	"stat_value" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "post_categories_blocks_product_spotlight_locales" (
  	"eyebrow" varchar,
  	"summary" varchar,
  	"stat_label" varchar,
  	"cta_label" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "brands_blocks_product_spotlight" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"image_side" "enum_brands_blocks_product_spotlight_image_side" DEFAULT 'right',
  	"product_id" integer NOT NULL,
  	"stat_value" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "brands_blocks_product_spotlight_locales" (
  	"eyebrow" varchar,
  	"summary" varchar,
  	"stat_label" varchar,
  	"cta_label" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "products_blocks_product_spotlight" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"image_side" "enum_products_blocks_product_spotlight_image_side" DEFAULT 'right',
  	"product_id" integer,
  	"stat_value" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "products_blocks_product_spotlight_locales" (
  	"eyebrow" varchar,
  	"summary" varchar,
  	"stat_label" varchar,
  	"cta_label" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "_products_v_blocks_product_spotlight" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"image_side" "enum__products_v_blocks_product_spotlight_image_side" DEFAULT 'right',
  	"product_id" integer,
  	"stat_value" varchar,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_products_v_blocks_product_spotlight_locales" (
  	"eyebrow" varchar,
  	"summary" varchar,
  	"stat_label" varchar,
  	"cta_label" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  ALTER TABLE "pages_blocks_product_spotlight" ADD CONSTRAINT "pages_blocks_product_spotlight_product_id_products_id_fk" FOREIGN KEY ("product_id") REFERENCES "public"."products"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "pages_blocks_product_spotlight" ADD CONSTRAINT "pages_blocks_product_spotlight_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_product_spotlight_locales" ADD CONSTRAINT "pages_blocks_product_spotlight_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_product_spotlight"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_product_spotlight" ADD CONSTRAINT "_pages_v_blocks_product_spotlight_product_id_products_id_fk" FOREIGN KEY ("product_id") REFERENCES "public"."products"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_product_spotlight" ADD CONSTRAINT "_pages_v_blocks_product_spotlight_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_product_spotlight_locales" ADD CONSTRAINT "_pages_v_blocks_product_spotlight_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_product_spotlight"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "posts_blocks_product_spotlight" ADD CONSTRAINT "posts_blocks_product_spotlight_product_id_products_id_fk" FOREIGN KEY ("product_id") REFERENCES "public"."products"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "posts_blocks_product_spotlight" ADD CONSTRAINT "posts_blocks_product_spotlight_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."posts"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "posts_blocks_product_spotlight_locales" ADD CONSTRAINT "posts_blocks_product_spotlight_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."posts_blocks_product_spotlight"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_posts_v_blocks_product_spotlight" ADD CONSTRAINT "_posts_v_blocks_product_spotlight_product_id_products_id_fk" FOREIGN KEY ("product_id") REFERENCES "public"."products"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_posts_v_blocks_product_spotlight" ADD CONSTRAINT "_posts_v_blocks_product_spotlight_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_posts_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_posts_v_blocks_product_spotlight_locales" ADD CONSTRAINT "_posts_v_blocks_product_spotlight_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_posts_v_blocks_product_spotlight"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "categories_blocks_product_spotlight" ADD CONSTRAINT "categories_blocks_product_spotlight_product_id_products_id_fk" FOREIGN KEY ("product_id") REFERENCES "public"."products"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "categories_blocks_product_spotlight" ADD CONSTRAINT "categories_blocks_product_spotlight_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."categories"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "categories_blocks_product_spotlight_locales" ADD CONSTRAINT "categories_blocks_product_spotlight_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."categories_blocks_product_spotlight"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "post_categories_blocks_product_spotlight" ADD CONSTRAINT "post_categories_blocks_product_spotlight_product_id_products_id_fk" FOREIGN KEY ("product_id") REFERENCES "public"."products"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "post_categories_blocks_product_spotlight" ADD CONSTRAINT "post_categories_blocks_product_spotlight_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."post_categories"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "post_categories_blocks_product_spotlight_locales" ADD CONSTRAINT "post_categories_blocks_product_spotlight_locales_parent_i_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."post_categories_blocks_product_spotlight"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "brands_blocks_product_spotlight" ADD CONSTRAINT "brands_blocks_product_spotlight_product_id_products_id_fk" FOREIGN KEY ("product_id") REFERENCES "public"."products"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "brands_blocks_product_spotlight" ADD CONSTRAINT "brands_blocks_product_spotlight_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."brands"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "brands_blocks_product_spotlight_locales" ADD CONSTRAINT "brands_blocks_product_spotlight_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."brands_blocks_product_spotlight"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "products_blocks_product_spotlight" ADD CONSTRAINT "products_blocks_product_spotlight_product_id_products_id_fk" FOREIGN KEY ("product_id") REFERENCES "public"."products"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "products_blocks_product_spotlight" ADD CONSTRAINT "products_blocks_product_spotlight_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."products"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "products_blocks_product_spotlight_locales" ADD CONSTRAINT "products_blocks_product_spotlight_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."products_blocks_product_spotlight"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_products_v_blocks_product_spotlight" ADD CONSTRAINT "_products_v_blocks_product_spotlight_product_id_products_id_fk" FOREIGN KEY ("product_id") REFERENCES "public"."products"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_products_v_blocks_product_spotlight" ADD CONSTRAINT "_products_v_blocks_product_spotlight_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_products_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_products_v_blocks_product_spotlight_locales" ADD CONSTRAINT "_products_v_blocks_product_spotlight_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_products_v_blocks_product_spotlight"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "pages_blocks_product_spotlight_order_idx" ON "pages_blocks_product_spotlight" USING btree ("_order");
  CREATE INDEX "pages_blocks_product_spotlight_parent_id_idx" ON "pages_blocks_product_spotlight" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_product_spotlight_path_idx" ON "pages_blocks_product_spotlight" USING btree ("_path");
  CREATE INDEX "pages_blocks_product_spotlight_product_idx" ON "pages_blocks_product_spotlight" USING btree ("product_id");
  CREATE UNIQUE INDEX "pages_blocks_product_spotlight_locales_locale_parent_id_uniq" ON "pages_blocks_product_spotlight_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "_pages_v_blocks_product_spotlight_order_idx" ON "_pages_v_blocks_product_spotlight" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_product_spotlight_parent_id_idx" ON "_pages_v_blocks_product_spotlight" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_product_spotlight_path_idx" ON "_pages_v_blocks_product_spotlight" USING btree ("_path");
  CREATE INDEX "_pages_v_blocks_product_spotlight_product_idx" ON "_pages_v_blocks_product_spotlight" USING btree ("product_id");
  CREATE UNIQUE INDEX "_pages_v_blocks_product_spotlight_locales_locale_parent_id_u" ON "_pages_v_blocks_product_spotlight_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "posts_blocks_product_spotlight_order_idx" ON "posts_blocks_product_spotlight" USING btree ("_order");
  CREATE INDEX "posts_blocks_product_spotlight_parent_id_idx" ON "posts_blocks_product_spotlight" USING btree ("_parent_id");
  CREATE INDEX "posts_blocks_product_spotlight_path_idx" ON "posts_blocks_product_spotlight" USING btree ("_path");
  CREATE INDEX "posts_blocks_product_spotlight_product_idx" ON "posts_blocks_product_spotlight" USING btree ("product_id");
  CREATE UNIQUE INDEX "posts_blocks_product_spotlight_locales_locale_parent_id_uniq" ON "posts_blocks_product_spotlight_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "_posts_v_blocks_product_spotlight_order_idx" ON "_posts_v_blocks_product_spotlight" USING btree ("_order");
  CREATE INDEX "_posts_v_blocks_product_spotlight_parent_id_idx" ON "_posts_v_blocks_product_spotlight" USING btree ("_parent_id");
  CREATE INDEX "_posts_v_blocks_product_spotlight_path_idx" ON "_posts_v_blocks_product_spotlight" USING btree ("_path");
  CREATE INDEX "_posts_v_blocks_product_spotlight_product_idx" ON "_posts_v_blocks_product_spotlight" USING btree ("product_id");
  CREATE UNIQUE INDEX "_posts_v_blocks_product_spotlight_locales_locale_parent_id_u" ON "_posts_v_blocks_product_spotlight_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "categories_blocks_product_spotlight_order_idx" ON "categories_blocks_product_spotlight" USING btree ("_order");
  CREATE INDEX "categories_blocks_product_spotlight_parent_id_idx" ON "categories_blocks_product_spotlight" USING btree ("_parent_id");
  CREATE INDEX "categories_blocks_product_spotlight_path_idx" ON "categories_blocks_product_spotlight" USING btree ("_path");
  CREATE INDEX "categories_blocks_product_spotlight_product_idx" ON "categories_blocks_product_spotlight" USING btree ("product_id");
  CREATE UNIQUE INDEX "categories_blocks_product_spotlight_locales_locale_parent_id" ON "categories_blocks_product_spotlight_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "post_categories_blocks_product_spotlight_order_idx" ON "post_categories_blocks_product_spotlight" USING btree ("_order");
  CREATE INDEX "post_categories_blocks_product_spotlight_parent_id_idx" ON "post_categories_blocks_product_spotlight" USING btree ("_parent_id");
  CREATE INDEX "post_categories_blocks_product_spotlight_path_idx" ON "post_categories_blocks_product_spotlight" USING btree ("_path");
  CREATE INDEX "post_categories_blocks_product_spotlight_product_idx" ON "post_categories_blocks_product_spotlight" USING btree ("product_id");
  CREATE UNIQUE INDEX "post_categories_blocks_product_spotlight_locales_locale_pare" ON "post_categories_blocks_product_spotlight_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "brands_blocks_product_spotlight_order_idx" ON "brands_blocks_product_spotlight" USING btree ("_order");
  CREATE INDEX "brands_blocks_product_spotlight_parent_id_idx" ON "brands_blocks_product_spotlight" USING btree ("_parent_id");
  CREATE INDEX "brands_blocks_product_spotlight_path_idx" ON "brands_blocks_product_spotlight" USING btree ("_path");
  CREATE INDEX "brands_blocks_product_spotlight_product_idx" ON "brands_blocks_product_spotlight" USING btree ("product_id");
  CREATE UNIQUE INDEX "brands_blocks_product_spotlight_locales_locale_parent_id_uni" ON "brands_blocks_product_spotlight_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "products_blocks_product_spotlight_order_idx" ON "products_blocks_product_spotlight" USING btree ("_order");
  CREATE INDEX "products_blocks_product_spotlight_parent_id_idx" ON "products_blocks_product_spotlight" USING btree ("_parent_id");
  CREATE INDEX "products_blocks_product_spotlight_path_idx" ON "products_blocks_product_spotlight" USING btree ("_path");
  CREATE INDEX "products_blocks_product_spotlight_product_idx" ON "products_blocks_product_spotlight" USING btree ("product_id");
  CREATE UNIQUE INDEX "products_blocks_product_spotlight_locales_locale_parent_id_u" ON "products_blocks_product_spotlight_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "_products_v_blocks_product_spotlight_order_idx" ON "_products_v_blocks_product_spotlight" USING btree ("_order");
  CREATE INDEX "_products_v_blocks_product_spotlight_parent_id_idx" ON "_products_v_blocks_product_spotlight" USING btree ("_parent_id");
  CREATE INDEX "_products_v_blocks_product_spotlight_path_idx" ON "_products_v_blocks_product_spotlight" USING btree ("_path");
  CREATE INDEX "_products_v_blocks_product_spotlight_product_idx" ON "_products_v_blocks_product_spotlight" USING btree ("product_id");
  CREATE UNIQUE INDEX "_products_v_blocks_product_spotlight_locales_locale_parent_i" ON "_products_v_blocks_product_spotlight_locales" USING btree ("_locale","_parent_id");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   DROP TABLE "pages_blocks_product_spotlight" CASCADE;
  DROP TABLE "pages_blocks_product_spotlight_locales" CASCADE;
  DROP TABLE "_pages_v_blocks_product_spotlight" CASCADE;
  DROP TABLE "_pages_v_blocks_product_spotlight_locales" CASCADE;
  DROP TABLE "posts_blocks_product_spotlight" CASCADE;
  DROP TABLE "posts_blocks_product_spotlight_locales" CASCADE;
  DROP TABLE "_posts_v_blocks_product_spotlight" CASCADE;
  DROP TABLE "_posts_v_blocks_product_spotlight_locales" CASCADE;
  DROP TABLE "categories_blocks_product_spotlight" CASCADE;
  DROP TABLE "categories_blocks_product_spotlight_locales" CASCADE;
  DROP TABLE "post_categories_blocks_product_spotlight" CASCADE;
  DROP TABLE "post_categories_blocks_product_spotlight_locales" CASCADE;
  DROP TABLE "brands_blocks_product_spotlight" CASCADE;
  DROP TABLE "brands_blocks_product_spotlight_locales" CASCADE;
  DROP TABLE "products_blocks_product_spotlight" CASCADE;
  DROP TABLE "products_blocks_product_spotlight_locales" CASCADE;
  DROP TABLE "_products_v_blocks_product_spotlight" CASCADE;
  DROP TABLE "_products_v_blocks_product_spotlight_locales" CASCADE;
  DROP TYPE "public"."enum_pages_blocks_product_spotlight_image_side";
  DROP TYPE "public"."enum__pages_v_blocks_product_spotlight_image_side";
  DROP TYPE "public"."enum_posts_blocks_product_spotlight_image_side";
  DROP TYPE "public"."enum__posts_v_blocks_product_spotlight_image_side";
  DROP TYPE "public"."enum_categories_blocks_product_spotlight_image_side";
  DROP TYPE "public"."enum_post_categories_blocks_product_spotlight_image_side";
  DROP TYPE "public"."enum_brands_blocks_product_spotlight_image_side";
  DROP TYPE "public"."enum_products_blocks_product_spotlight_image_side";
  DROP TYPE "public"."enum__products_v_blocks_product_spotlight_image_side";`)
}
