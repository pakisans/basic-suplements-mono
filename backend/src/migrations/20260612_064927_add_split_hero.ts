import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

// Only the splitHero block tables are created here. header_top_bar and the stats
// "label" column already exist in the database (applied earlier), so they are
// intentionally excluded to avoid "already exists" errors. The snapshot JSON
// still reflects the full schema for future migrate:create diffs.
export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
  CREATE TABLE "pages_blocks_split_hero_panels" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"image_id" integer,
  	"url" varchar
  );
  CREATE TABLE "pages_blocks_split_hero_panels_locales" (
  	"eyebrow" varchar,
  	"title" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  CREATE TABLE "pages_blocks_split_hero" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"block_name" varchar
  );
  CREATE TABLE "_pages_v_blocks_split_hero_panels" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"image_id" integer,
  	"url" varchar,
  	"_uuid" varchar
  );
  CREATE TABLE "_pages_v_blocks_split_hero_panels_locales" (
  	"eyebrow" varchar,
  	"title" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  CREATE TABLE "_pages_v_blocks_split_hero" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  CREATE TABLE "posts_blocks_split_hero_panels" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"image_id" integer,
  	"url" varchar
  );
  CREATE TABLE "posts_blocks_split_hero_panels_locales" (
  	"eyebrow" varchar,
  	"title" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  CREATE TABLE "posts_blocks_split_hero" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"block_name" varchar
  );
  CREATE TABLE "_posts_v_blocks_split_hero_panels" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"image_id" integer,
  	"url" varchar,
  	"_uuid" varchar
  );
  CREATE TABLE "_posts_v_blocks_split_hero_panels_locales" (
  	"eyebrow" varchar,
  	"title" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  CREATE TABLE "_posts_v_blocks_split_hero" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  CREATE TABLE "categories_blocks_split_hero_panels" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"image_id" integer NOT NULL,
  	"url" varchar NOT NULL
  );
  CREATE TABLE "categories_blocks_split_hero_panels_locales" (
  	"eyebrow" varchar,
  	"title" varchar NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  CREATE TABLE "categories_blocks_split_hero" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"block_name" varchar
  );
  CREATE TABLE "post_categories_blocks_split_hero_panels" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"image_id" integer NOT NULL,
  	"url" varchar NOT NULL
  );
  CREATE TABLE "post_categories_blocks_split_hero_panels_locales" (
  	"eyebrow" varchar,
  	"title" varchar NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  CREATE TABLE "post_categories_blocks_split_hero" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"block_name" varchar
  );
  CREATE TABLE "brands_blocks_split_hero_panels" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"image_id" integer NOT NULL,
  	"url" varchar NOT NULL
  );
  CREATE TABLE "brands_blocks_split_hero_panels_locales" (
  	"eyebrow" varchar,
  	"title" varchar NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  CREATE TABLE "brands_blocks_split_hero" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"block_name" varchar
  );
  CREATE TABLE "products_blocks_split_hero_panels" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"image_id" integer,
  	"url" varchar
  );
  CREATE TABLE "products_blocks_split_hero_panels_locales" (
  	"eyebrow" varchar,
  	"title" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  CREATE TABLE "products_blocks_split_hero" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"block_name" varchar
  );
  CREATE TABLE "_products_v_blocks_split_hero_panels" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"image_id" integer,
  	"url" varchar,
  	"_uuid" varchar
  );
  CREATE TABLE "_products_v_blocks_split_hero_panels_locales" (
  	"eyebrow" varchar,
  	"title" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  CREATE TABLE "_products_v_blocks_split_hero" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  ALTER TABLE "pages_blocks_split_hero_panels" ADD CONSTRAINT "pages_blocks_split_hero_panels_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "pages_blocks_split_hero_panels" ADD CONSTRAINT "pages_blocks_split_hero_panels_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_split_hero"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_split_hero_panels_locales" ADD CONSTRAINT "pages_blocks_split_hero_panels_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_split_hero_panels"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_split_hero" ADD CONSTRAINT "pages_blocks_split_hero_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_split_hero_panels" ADD CONSTRAINT "_pages_v_blocks_split_hero_panels_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_split_hero_panels" ADD CONSTRAINT "_pages_v_blocks_split_hero_panels_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_split_hero"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_split_hero_panels_locales" ADD CONSTRAINT "_pages_v_blocks_split_hero_panels_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_split_hero_panels"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_split_hero" ADD CONSTRAINT "_pages_v_blocks_split_hero_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "posts_blocks_split_hero_panels" ADD CONSTRAINT "posts_blocks_split_hero_panels_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "posts_blocks_split_hero_panels" ADD CONSTRAINT "posts_blocks_split_hero_panels_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."posts_blocks_split_hero"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "posts_blocks_split_hero_panels_locales" ADD CONSTRAINT "posts_blocks_split_hero_panels_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."posts_blocks_split_hero_panels"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "posts_blocks_split_hero" ADD CONSTRAINT "posts_blocks_split_hero_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."posts"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_posts_v_blocks_split_hero_panels" ADD CONSTRAINT "_posts_v_blocks_split_hero_panels_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_posts_v_blocks_split_hero_panels" ADD CONSTRAINT "_posts_v_blocks_split_hero_panels_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_posts_v_blocks_split_hero"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_posts_v_blocks_split_hero_panels_locales" ADD CONSTRAINT "_posts_v_blocks_split_hero_panels_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_posts_v_blocks_split_hero_panels"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_posts_v_blocks_split_hero" ADD CONSTRAINT "_posts_v_blocks_split_hero_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_posts_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "categories_blocks_split_hero_panels" ADD CONSTRAINT "categories_blocks_split_hero_panels_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "categories_blocks_split_hero_panels" ADD CONSTRAINT "categories_blocks_split_hero_panels_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."categories_blocks_split_hero"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "categories_blocks_split_hero_panels_locales" ADD CONSTRAINT "categories_blocks_split_hero_panels_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."categories_blocks_split_hero_panels"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "categories_blocks_split_hero" ADD CONSTRAINT "categories_blocks_split_hero_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."categories"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "post_categories_blocks_split_hero_panels" ADD CONSTRAINT "post_categories_blocks_split_hero_panels_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "post_categories_blocks_split_hero_panels" ADD CONSTRAINT "post_categories_blocks_split_hero_panels_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."post_categories_blocks_split_hero"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "post_categories_blocks_split_hero_panels_locales" ADD CONSTRAINT "post_categories_blocks_split_hero_panels_locales_parent_i_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."post_categories_blocks_split_hero_panels"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "post_categories_blocks_split_hero" ADD CONSTRAINT "post_categories_blocks_split_hero_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."post_categories"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "brands_blocks_split_hero_panels" ADD CONSTRAINT "brands_blocks_split_hero_panels_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "brands_blocks_split_hero_panels" ADD CONSTRAINT "brands_blocks_split_hero_panels_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."brands_blocks_split_hero"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "brands_blocks_split_hero_panels_locales" ADD CONSTRAINT "brands_blocks_split_hero_panels_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."brands_blocks_split_hero_panels"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "brands_blocks_split_hero" ADD CONSTRAINT "brands_blocks_split_hero_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."brands"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "products_blocks_split_hero_panels" ADD CONSTRAINT "products_blocks_split_hero_panels_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "products_blocks_split_hero_panels" ADD CONSTRAINT "products_blocks_split_hero_panels_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."products_blocks_split_hero"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "products_blocks_split_hero_panels_locales" ADD CONSTRAINT "products_blocks_split_hero_panels_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."products_blocks_split_hero_panels"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "products_blocks_split_hero" ADD CONSTRAINT "products_blocks_split_hero_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."products"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_products_v_blocks_split_hero_panels" ADD CONSTRAINT "_products_v_blocks_split_hero_panels_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_products_v_blocks_split_hero_panels" ADD CONSTRAINT "_products_v_blocks_split_hero_panels_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_products_v_blocks_split_hero"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_products_v_blocks_split_hero_panels_locales" ADD CONSTRAINT "_products_v_blocks_split_hero_panels_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_products_v_blocks_split_hero_panels"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_products_v_blocks_split_hero" ADD CONSTRAINT "_products_v_blocks_split_hero_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_products_v"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "pages_blocks_split_hero_panels_order_idx" ON "pages_blocks_split_hero_panels" USING btree ("_order");
  CREATE INDEX "pages_blocks_split_hero_panels_parent_id_idx" ON "pages_blocks_split_hero_panels" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_split_hero_panels_image_idx" ON "pages_blocks_split_hero_panels" USING btree ("image_id");
  CREATE UNIQUE INDEX "pages_blocks_split_hero_panels_locales_locale_parent_id_uniq" ON "pages_blocks_split_hero_panels_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "pages_blocks_split_hero_order_idx" ON "pages_blocks_split_hero" USING btree ("_order");
  CREATE INDEX "pages_blocks_split_hero_parent_id_idx" ON "pages_blocks_split_hero" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_split_hero_path_idx" ON "pages_blocks_split_hero" USING btree ("_path");
  CREATE INDEX "_pages_v_blocks_split_hero_panels_order_idx" ON "_pages_v_blocks_split_hero_panels" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_split_hero_panels_parent_id_idx" ON "_pages_v_blocks_split_hero_panels" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_split_hero_panels_image_idx" ON "_pages_v_blocks_split_hero_panels" USING btree ("image_id");
  CREATE UNIQUE INDEX "_pages_v_blocks_split_hero_panels_locales_locale_parent_id_u" ON "_pages_v_blocks_split_hero_panels_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "_pages_v_blocks_split_hero_order_idx" ON "_pages_v_blocks_split_hero" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_split_hero_parent_id_idx" ON "_pages_v_blocks_split_hero" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_split_hero_path_idx" ON "_pages_v_blocks_split_hero" USING btree ("_path");
  CREATE INDEX "posts_blocks_split_hero_panels_order_idx" ON "posts_blocks_split_hero_panels" USING btree ("_order");
  CREATE INDEX "posts_blocks_split_hero_panels_parent_id_idx" ON "posts_blocks_split_hero_panels" USING btree ("_parent_id");
  CREATE INDEX "posts_blocks_split_hero_panels_image_idx" ON "posts_blocks_split_hero_panels" USING btree ("image_id");
  CREATE UNIQUE INDEX "posts_blocks_split_hero_panels_locales_locale_parent_id_uniq" ON "posts_blocks_split_hero_panels_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "posts_blocks_split_hero_order_idx" ON "posts_blocks_split_hero" USING btree ("_order");
  CREATE INDEX "posts_blocks_split_hero_parent_id_idx" ON "posts_blocks_split_hero" USING btree ("_parent_id");
  CREATE INDEX "posts_blocks_split_hero_path_idx" ON "posts_blocks_split_hero" USING btree ("_path");
  CREATE INDEX "_posts_v_blocks_split_hero_panels_order_idx" ON "_posts_v_blocks_split_hero_panels" USING btree ("_order");
  CREATE INDEX "_posts_v_blocks_split_hero_panels_parent_id_idx" ON "_posts_v_blocks_split_hero_panels" USING btree ("_parent_id");
  CREATE INDEX "_posts_v_blocks_split_hero_panels_image_idx" ON "_posts_v_blocks_split_hero_panels" USING btree ("image_id");
  CREATE UNIQUE INDEX "_posts_v_blocks_split_hero_panels_locales_locale_parent_id_u" ON "_posts_v_blocks_split_hero_panels_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "_posts_v_blocks_split_hero_order_idx" ON "_posts_v_blocks_split_hero" USING btree ("_order");
  CREATE INDEX "_posts_v_blocks_split_hero_parent_id_idx" ON "_posts_v_blocks_split_hero" USING btree ("_parent_id");
  CREATE INDEX "_posts_v_blocks_split_hero_path_idx" ON "_posts_v_blocks_split_hero" USING btree ("_path");
  CREATE INDEX "categories_blocks_split_hero_panels_order_idx" ON "categories_blocks_split_hero_panels" USING btree ("_order");
  CREATE INDEX "categories_blocks_split_hero_panels_parent_id_idx" ON "categories_blocks_split_hero_panels" USING btree ("_parent_id");
  CREATE INDEX "categories_blocks_split_hero_panels_image_idx" ON "categories_blocks_split_hero_panels" USING btree ("image_id");
  CREATE UNIQUE INDEX "categories_blocks_split_hero_panels_locales_locale_parent_id" ON "categories_blocks_split_hero_panels_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "categories_blocks_split_hero_order_idx" ON "categories_blocks_split_hero" USING btree ("_order");
  CREATE INDEX "categories_blocks_split_hero_parent_id_idx" ON "categories_blocks_split_hero" USING btree ("_parent_id");
  CREATE INDEX "categories_blocks_split_hero_path_idx" ON "categories_blocks_split_hero" USING btree ("_path");
  CREATE INDEX "post_categories_blocks_split_hero_panels_order_idx" ON "post_categories_blocks_split_hero_panels" USING btree ("_order");
  CREATE INDEX "post_categories_blocks_split_hero_panels_parent_id_idx" ON "post_categories_blocks_split_hero_panels" USING btree ("_parent_id");
  CREATE INDEX "post_categories_blocks_split_hero_panels_image_idx" ON "post_categories_blocks_split_hero_panels" USING btree ("image_id");
  CREATE UNIQUE INDEX "post_categories_blocks_split_hero_panels_locales_locale_pare" ON "post_categories_blocks_split_hero_panels_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "post_categories_blocks_split_hero_order_idx" ON "post_categories_blocks_split_hero" USING btree ("_order");
  CREATE INDEX "post_categories_blocks_split_hero_parent_id_idx" ON "post_categories_blocks_split_hero" USING btree ("_parent_id");
  CREATE INDEX "post_categories_blocks_split_hero_path_idx" ON "post_categories_blocks_split_hero" USING btree ("_path");
  CREATE INDEX "brands_blocks_split_hero_panels_order_idx" ON "brands_blocks_split_hero_panels" USING btree ("_order");
  CREATE INDEX "brands_blocks_split_hero_panels_parent_id_idx" ON "brands_blocks_split_hero_panels" USING btree ("_parent_id");
  CREATE INDEX "brands_blocks_split_hero_panels_image_idx" ON "brands_blocks_split_hero_panels" USING btree ("image_id");
  CREATE UNIQUE INDEX "brands_blocks_split_hero_panels_locales_locale_parent_id_uni" ON "brands_blocks_split_hero_panels_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "brands_blocks_split_hero_order_idx" ON "brands_blocks_split_hero" USING btree ("_order");
  CREATE INDEX "brands_blocks_split_hero_parent_id_idx" ON "brands_blocks_split_hero" USING btree ("_parent_id");
  CREATE INDEX "brands_blocks_split_hero_path_idx" ON "brands_blocks_split_hero" USING btree ("_path");
  CREATE INDEX "products_blocks_split_hero_panels_order_idx" ON "products_blocks_split_hero_panels" USING btree ("_order");
  CREATE INDEX "products_blocks_split_hero_panels_parent_id_idx" ON "products_blocks_split_hero_panels" USING btree ("_parent_id");
  CREATE INDEX "products_blocks_split_hero_panels_image_idx" ON "products_blocks_split_hero_panels" USING btree ("image_id");
  CREATE UNIQUE INDEX "products_blocks_split_hero_panels_locales_locale_parent_id_u" ON "products_blocks_split_hero_panels_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "products_blocks_split_hero_order_idx" ON "products_blocks_split_hero" USING btree ("_order");
  CREATE INDEX "products_blocks_split_hero_parent_id_idx" ON "products_blocks_split_hero" USING btree ("_parent_id");
  CREATE INDEX "products_blocks_split_hero_path_idx" ON "products_blocks_split_hero" USING btree ("_path");
  CREATE INDEX "_products_v_blocks_split_hero_panels_order_idx" ON "_products_v_blocks_split_hero_panels" USING btree ("_order");
  CREATE INDEX "_products_v_blocks_split_hero_panels_parent_id_idx" ON "_products_v_blocks_split_hero_panels" USING btree ("_parent_id");
  CREATE INDEX "_products_v_blocks_split_hero_panels_image_idx" ON "_products_v_blocks_split_hero_panels" USING btree ("image_id");
  CREATE UNIQUE INDEX "_products_v_blocks_split_hero_panels_locales_locale_parent_i" ON "_products_v_blocks_split_hero_panels_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "_products_v_blocks_split_hero_order_idx" ON "_products_v_blocks_split_hero" USING btree ("_order");
  CREATE INDEX "_products_v_blocks_split_hero_parent_id_idx" ON "_products_v_blocks_split_hero" USING btree ("_parent_id");
  CREATE INDEX "_products_v_blocks_split_hero_path_idx" ON "_products_v_blocks_split_hero" USING btree ("_path");
`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
  DROP TABLE "pages_blocks_split_hero_panels" CASCADE;
  DROP TABLE "pages_blocks_split_hero_panels_locales" CASCADE;
  DROP TABLE "pages_blocks_split_hero" CASCADE;
  DROP TABLE "_pages_v_blocks_split_hero_panels" CASCADE;
  DROP TABLE "_pages_v_blocks_split_hero_panels_locales" CASCADE;
  DROP TABLE "_pages_v_blocks_split_hero" CASCADE;
  DROP TABLE "posts_blocks_split_hero_panels" CASCADE;
  DROP TABLE "posts_blocks_split_hero_panels_locales" CASCADE;
  DROP TABLE "posts_blocks_split_hero" CASCADE;
  DROP TABLE "_posts_v_blocks_split_hero_panels" CASCADE;
  DROP TABLE "_posts_v_blocks_split_hero_panels_locales" CASCADE;
  DROP TABLE "_posts_v_blocks_split_hero" CASCADE;
  DROP TABLE "categories_blocks_split_hero_panels" CASCADE;
  DROP TABLE "categories_blocks_split_hero_panels_locales" CASCADE;
  DROP TABLE "categories_blocks_split_hero" CASCADE;
  DROP TABLE "post_categories_blocks_split_hero_panels" CASCADE;
  DROP TABLE "post_categories_blocks_split_hero_panels_locales" CASCADE;
  DROP TABLE "post_categories_blocks_split_hero" CASCADE;
  DROP TABLE "brands_blocks_split_hero_panels" CASCADE;
  DROP TABLE "brands_blocks_split_hero_panels_locales" CASCADE;
  DROP TABLE "brands_blocks_split_hero" CASCADE;
  DROP TABLE "products_blocks_split_hero_panels" CASCADE;
  DROP TABLE "products_blocks_split_hero_panels_locales" CASCADE;
  DROP TABLE "products_blocks_split_hero" CASCADE;
  DROP TABLE "_products_v_blocks_split_hero_panels" CASCADE;
  DROP TABLE "_products_v_blocks_split_hero_panels_locales" CASCADE;
  DROP TABLE "_products_v_blocks_split_hero" CASCADE;
`)
}
