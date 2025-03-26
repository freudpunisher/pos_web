CREATE TABLE "clients" (
	"id" serial PRIMARY KEY NOT NULL,
	"code" varchar(10),
	"first_name" varchar(100) NOT NULL,
	"last_name" varchar(100) NOT NULL,
	"email" varchar(255) NOT NULL,
	"phone_number" varchar(20) NOT NULL,
	"address" varchar(200),
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "clients_code_unique" UNIQUE("code"),
	CONSTRAINT "clients_phone_number_unique" UNIQUE("phone_number")
);
--> statement-breakpoint
CREATE TABLE "familles" (
	"id" serial PRIMARY KEY NOT NULL,
	"nom" varchar(100) NOT NULL
);
--> statement-breakpoint
CREATE TABLE "fournisseurs" (
	"id" serial PRIMARY KEY NOT NULL,
	"first_name" varchar(100) NOT NULL,
	"last_name" varchar(100) NOT NULL,
	"address" varchar(200) NOT NULL,
	"contact_person" varchar(100) NOT NULL,
	"email" varchar(255) NOT NULL,
	"phone_number" varchar(20) NOT NULL,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "fournisseurs_phone_number_unique" UNIQUE("phone_number")
);
--> statement-breakpoint
CREATE TABLE "produits" (
	"id" serial PRIMARY KEY NOT NULL,
	"code" varchar(10) NOT NULL,
	"nom" varchar(100) NOT NULL,
	"famille_id" integer NOT NULL,
	"prix_achet" numeric(10, 2) DEFAULT '0.00',
	"prix_vente" numeric(10, 2) DEFAULT '0.00',
	"reduction" integer DEFAULT 0,
	"niveau_alert" integer DEFAULT 0,
	"type_produit" integer DEFAULT 0,
	"description" text,
	"barcode" varchar(100) NOT NULL,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "produits_code_unique" UNIQUE("code"),
	CONSTRAINT "produits_barcode_unique" UNIQUE("barcode")
);
--> statement-breakpoint
CREATE TABLE "stock" (
	"id" serial PRIMARY KEY NOT NULL,
	"produit_id" integer NOT NULL,
	"quantite" integer DEFAULT 0,
	"niveau_alert" integer DEFAULT 0
);
--> statement-breakpoint
CREATE TABLE "stock_initial" (
	"id" serial PRIMARY KEY NOT NULL,
	"produit_id" integer NOT NULL,
	"quantite" integer DEFAULT 0,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "tarif_cuisine" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" varchar(100) NOT NULL,
	"description" varchar(255) NOT NULL,
	"amount" numeric(10, 2) DEFAULT '0.00',
	"reduction" integer,
	"image" varchar(255),
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "unite_mesures" (
	"id" serial PRIMARY KEY NOT NULL,
	"produit_id" integer,
	"desigantion" varchar(100) NOT NULL,
	"code" varchar(100) NOT NULL,
	"value_piece" numeric(10, 2) DEFAULT '0.0',
	"value_rapport" numeric(10, 2) DEFAULT '0.0',
	"value_prix_vente" numeric(10, 2) DEFAULT '0.0'
);
--> statement-breakpoint
ALTER TABLE "produits" ADD CONSTRAINT "produits_famille_id_familles_id_fk" FOREIGN KEY ("famille_id") REFERENCES "public"."familles"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "stock" ADD CONSTRAINT "stock_produit_id_produits_id_fk" FOREIGN KEY ("produit_id") REFERENCES "public"."produits"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "stock_initial" ADD CONSTRAINT "stock_initial_produit_id_produits_id_fk" FOREIGN KEY ("produit_id") REFERENCES "public"."produits"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "unite_mesures" ADD CONSTRAINT "unite_mesures_produit_id_produits_id_fk" FOREIGN KEY ("produit_id") REFERENCES "public"."produits"("id") ON DELETE cascade ON UPDATE no action;