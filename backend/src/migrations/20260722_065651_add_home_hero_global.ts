import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_home_hero_blocks_product_spotlight_image_side" AS ENUM('right', 'left');
  CREATE TABLE "home_hero_blocks_split_hero_panels" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"image_id" integer NOT NULL,
  	"url" varchar NOT NULL
  );
  
  CREATE TABLE "home_hero_blocks_split_hero_panels_locales" (
  	"eyebrow" varchar,
  	"title" varchar NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "home_hero_blocks_split_hero" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"block_name" varchar
  );
  
  CREATE TABLE "home_hero_blocks_product_spotlight" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"image_side" "enum_home_hero_blocks_product_spotlight_image_side" DEFAULT 'right',
  	"product_id" integer NOT NULL,
  	"stat_value" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "home_hero_blocks_product_spotlight_locales" (
  	"eyebrow" varchar,
  	"summary" varchar,
  	"stat_label" varchar,
  	"cta_label" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "home_hero" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  ALTER TABLE "home_hero_blocks_split_hero_panels" ADD CONSTRAINT "home_hero_blocks_split_hero_panels_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "home_hero_blocks_split_hero_panels" ADD CONSTRAINT "home_hero_blocks_split_hero_panels_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."home_hero_blocks_split_hero"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "home_hero_blocks_split_hero_panels_locales" ADD CONSTRAINT "home_hero_blocks_split_hero_panels_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."home_hero_blocks_split_hero_panels"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "home_hero_blocks_split_hero" ADD CONSTRAINT "home_hero_blocks_split_hero_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."home_hero"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "home_hero_blocks_product_spotlight" ADD CONSTRAINT "home_hero_blocks_product_spotlight_product_id_products_id_fk" FOREIGN KEY ("product_id") REFERENCES "public"."products"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "home_hero_blocks_product_spotlight" ADD CONSTRAINT "home_hero_blocks_product_spotlight_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."home_hero"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "home_hero_blocks_product_spotlight_locales" ADD CONSTRAINT "home_hero_blocks_product_spotlight_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."home_hero_blocks_product_spotlight"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "home_hero_blocks_split_hero_panels_order_idx" ON "home_hero_blocks_split_hero_panels" USING btree ("_order");
  CREATE INDEX "home_hero_blocks_split_hero_panels_parent_id_idx" ON "home_hero_blocks_split_hero_panels" USING btree ("_parent_id");
  CREATE INDEX "home_hero_blocks_split_hero_panels_image_idx" ON "home_hero_blocks_split_hero_panels" USING btree ("image_id");
  CREATE UNIQUE INDEX "home_hero_blocks_split_hero_panels_locales_locale_parent_id_" ON "home_hero_blocks_split_hero_panels_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "home_hero_blocks_split_hero_order_idx" ON "home_hero_blocks_split_hero" USING btree ("_order");
  CREATE INDEX "home_hero_blocks_split_hero_parent_id_idx" ON "home_hero_blocks_split_hero" USING btree ("_parent_id");
  CREATE INDEX "home_hero_blocks_split_hero_path_idx" ON "home_hero_blocks_split_hero" USING btree ("_path");
  CREATE INDEX "home_hero_blocks_product_spotlight_order_idx" ON "home_hero_blocks_product_spotlight" USING btree ("_order");
  CREATE INDEX "home_hero_blocks_product_spotlight_parent_id_idx" ON "home_hero_blocks_product_spotlight" USING btree ("_parent_id");
  CREATE INDEX "home_hero_blocks_product_spotlight_path_idx" ON "home_hero_blocks_product_spotlight" USING btree ("_path");
  CREATE INDEX "home_hero_blocks_product_spotlight_product_idx" ON "home_hero_blocks_product_spotlight" USING btree ("product_id");
  CREATE UNIQUE INDEX "home_hero_blocks_product_spotlight_locales_locale_parent_id_" ON "home_hero_blocks_product_spotlight_locales" USING btree ("_locale","_parent_id");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   DROP TABLE "home_hero_blocks_split_hero_panels" CASCADE;
  DROP TABLE "home_hero_blocks_split_hero_panels_locales" CASCADE;
  DROP TABLE "home_hero_blocks_split_hero" CASCADE;
  DROP TABLE "home_hero_blocks_product_spotlight" CASCADE;
  DROP TABLE "home_hero_blocks_product_spotlight_locales" CASCADE;
  DROP TABLE "home_hero" CASCADE;
  DROP TYPE "public"."enum_home_hero_blocks_product_spotlight_image_side";`)
}
