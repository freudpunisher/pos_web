CREATE TABLE "supplies" (
	"id" serial PRIMARY KEY NOT NULL,
	"fournisseur_id" integer NOT NULL,
	"reference" varchar(50) NOT NULL,
	"supply_date" timestamp DEFAULT now(),
	"created_at" timestamp DEFAULT now(),
	CONSTRAINT "supplies_reference_unique" UNIQUE("reference")
);
--> statement-breakpoint
CREATE TABLE "supply_details" (
	"id" serial PRIMARY KEY NOT NULL,
	"supply_id" integer NOT NULL,
	"produit_id" integer NOT NULL,
	"quantity" integer NOT NULL,
	"price_per_unit" numeric(10, 2) NOT NULL,
	"total_price" numeric(10, 2) NOT NULL
);
--> statement-breakpoint
ALTER TABLE "produits" DROP CONSTRAINT "produits_barcode_unique";--> statement-breakpoint
ALTER TABLE "supplies" ADD CONSTRAINT "supplies_fournisseur_id_fournisseurs_id_fk" FOREIGN KEY ("fournisseur_id") REFERENCES "public"."fournisseurs"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "supply_details" ADD CONSTRAINT "supply_details_supply_id_supplies_id_fk" FOREIGN KEY ("supply_id") REFERENCES "public"."supplies"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "supply_details" ADD CONSTRAINT "supply_details_produit_id_produits_id_fk" FOREIGN KEY ("produit_id") REFERENCES "public"."produits"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "produits" DROP COLUMN "barcode";