import { pgTable, serial, text, integer, varchar, decimal, timestamp, unique } from "drizzle-orm/pg-core";

// Familles Table
export const familles = pgTable("familles", {
  id: serial("id").primaryKey(),
  nom: varchar("nom", { length: 100 }).notNull(),
});

// Produits Table
export const produits = pgTable("produits", {
  id: serial("id").primaryKey(),
  code: varchar("code", { length: 10 }).unique().notNull(),
  nom: varchar("nom", { length: 100 }).notNull(),
  familleId: integer("famille_id").references(() => familles.id, { onDelete: "cascade" }).notNull(),
  prix_achet: decimal("prix_achet", { precision: 10, scale: 2 }).default("0.00"),
  prix_vente: decimal("prix_vente", { precision: 10, scale: 2 }).default("0.00"),
  reduction: integer("reduction").default(0),
  niveau_alert: integer("niveau_alert").default(0),
  type_produit: integer("type_produit").default(0),
  description: text("description"),
  
  created_at: timestamp("created_at").defaultNow(),
  updated_at: timestamp("updated_at").defaultNow().notNull(),
});

// Unite Mesures Table
export const uniteMesures = pgTable("unite_mesures", {
  id: serial("id").primaryKey(),
  produitId: integer("produit_id").references(() => produits.id, { onDelete: "cascade" }),
  desigantion: varchar("desigantion", { length: 100 }).notNull(),
  code: varchar("code", { length: 100 }).notNull(),
  value_piece: decimal("value_piece", { precision: 10, scale: 2 }).default("0.0"),
  value_rapport: decimal("value_rapport", { precision: 10, scale: 2 }).default("0.0"),
  value_prix_vente: decimal("value_prix_vente", { precision: 10, scale: 2 }).default("0.0"),
});

// Stock Table
export const stock = pgTable("stock", {
  id: serial("id").primaryKey(),
  produitId: integer("produit_id").references(() => produits.id, { onDelete: "cascade" }).notNull(),
  quantite: integer("quantite").default(0),
  niveau_alert: integer("niveau_alert").default(0),
});

// Stock Initial Table
export const stockInitial = pgTable("stock_initial", {
  id: serial("id").primaryKey(),
  produitId: integer("produit_id").references(() => produits.id, { onDelete: "cascade" }).notNull(),
  quantite: integer("quantite").default(0),
  created_at: timestamp("created_at").defaultNow(),
});

// Fournisseurs Table
export const fournisseurs = pgTable("fournisseurs", {
  id: serial("id").primaryKey(),
  first_name: varchar("first_name", { length: 100 }).notNull(),
  last_name: varchar("last_name", { length: 100 }).notNull(),
  address: varchar("address", { length: 200 }).notNull(),
  contact_person: varchar("contact_person", { length: 100 }).notNull(),
  email: varchar("email", { length: 255 }).notNull(),
  phone_number: varchar("phone_number", { length: 20 }).unique().notNull(),
  created_at: timestamp("created_at").defaultNow(),
  updated_at: timestamp("updated_at").defaultNow().notNull(),
});

// Clients Table
export const clients = pgTable("clients", {
  id: serial("id").primaryKey(),
  code: varchar("code", { length: 10 }).unique(),
  first_name: varchar("first_name", { length: 100 }).notNull(),
  last_name: varchar("last_name", { length: 100 }).notNull(),
  email: varchar("email", { length: 255 }).notNull(),
  phone_number: varchar("phone_number", { length: 20 }).unique().notNull(),
  address: varchar("address", { length: 200 }),
  created_at: timestamp("created_at").defaultNow(),
  updated_at: timestamp("updated_at").defaultNow().notNull(),
});

// Tarif Cuisine Table
export const tarifCuisine = pgTable("tarif_cuisine", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 100 }).notNull(),
  description: varchar("description", { length: 255 }).notNull(),
  amount: decimal("amount", { precision: 10, scale: 2 }).default("0.00"),
  reduction: integer("reduction"),
  image: varchar("image", { length: 255 }),
  created_at: timestamp("created_at").defaultNow(),
  updated_at: timestamp("updated_at").defaultNow().notNull(),
});

export const supplies = pgTable("supplies", {
  id: serial("id").primaryKey(),
  fournisseurId: integer("fournisseur_id")
    .references(() => fournisseurs.id)
    .notNull(),
  reference: varchar("reference", { length: 50 }).unique().notNull(),
  supply_date: timestamp("supply_date").defaultNow(),
  created_at: timestamp("created_at").defaultNow(),
});

// Supply Details Table
export const supplyDetails = pgTable("supply_details", {
  id: serial("id").primaryKey(),
  supplyId: integer("supply_id")
    .references(() => supplies.id, { onDelete: "cascade" })
    .notNull(),
  produitId: integer("produit_id")
    .references(() => produits.id)
    .notNull(),
  quantity: integer("quantity").notNull(),
  price_per_unit: decimal("price_per_unit", { precision: 10, scale: 2 }).notNull(),
  total_price: decimal("total_price", { precision: 10, scale: 2 }).notNull(),
});



export const schema = {
  familles,
  produits,
  fournisseurs,
  supplyDetails,
  supplies,
  stock,
  // Include your other tables as well
};