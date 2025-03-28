import { NextResponse } from "next/server";
import { db } from "../../../db";
import { supplies, supplyDetails, stock, fournisseurs, produits } from "../../../db/schema";
import { eq } from "drizzle-orm";

// POST - Create supply with details
export async function POST(request: Request) {
  try {
    const { fournisseurId, reference, details } = await request.json();

    const result = await db.transaction(async (tx) => {
      // Create supply
      const [newSupply] = await tx.insert(supplies)
        .values({
          fournisseurId,
          reference,
        })
        .returning();

      // Create supply details and update stock
      await Promise.all(details.map(async (detail: any) => {
        // Create detail
        await tx.insert(supplyDetails).values({
          supplyId: newSupply.id as any, // Ensure compatibility with expected type
          produitId: detail.produitId as any,
          quantity: detail.quantity as any,
          price_per_unit: detail.price_per_unit.toString(),
          total_price: (detail.quantity * detail.price_per_unit).toString(),
        });

        // Update stock
        const [existingStock] = await tx.select()
          .from(stock)
          .where(eq(stock.produitId, detail.produitId));

        if (existingStock) {
          await tx.update(stock)
            .set({ quantite: existingStock.quantite + detail.quantity })
            .where(eq(stock.produitId, detail.produitId));
        } else {
          await tx.insert(stock).values({
            produitId: detail.produitId,
            quantite: detail.quantity,
          });
        }
      }));

      return newSupply;
    });

    return NextResponse.json(result, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to create supply" },
      { status: 500 }
    );
  }
}

// GET - Get all supplies with details
export async function GET() {
  try {
    // Fetch supplies data with details, fournisseur and produit (name)
    const rawSupplies = await db
      .select({
        id: supplies.id,
        reference: supplies.reference,
        supply_date: supplies.supply_date,
        created_at: supplies.created_at,
        details: {
          id: supplyDetails.id,
          supplyId: supplyDetails.supplyId,
          produitId: supplyDetails.produitId,
          quantity: supplyDetails.quantity,
          price_per_unit: supplyDetails.price_per_unit,
          produit: produits.nom,         // Add the product name from the produits table
          
         
        },
        fournisseur: {
          id: fournisseurs.id,
          first_name: fournisseurs.first_name,
          last_name: fournisseurs.last_name,
        },
      })
      .from(supplies)
      // Join supplyDetails on supply id
      .leftJoin(supplyDetails, eq(supplyDetails.supplyId, supplies.id))
      // Join fournisseurs on fournisseur id from supplies
      .leftJoin(fournisseurs, eq(supplies.fournisseurId, fournisseurs.id))
      // Join produits on produitId in supplyDetails
      .leftJoin(produits, eq(supplyDetails.produitId, produits.id));

    // Group the results by supply ID.
    const groupedSupplies = rawSupplies.reduce((acc, item) => {
      let supply = acc.find((s) => s.id === item.id);
      if (!supply) {
        supply = {
          id: item.id,
          reference: item.reference,
          supply_date: item.supply_date,
          created_at: item.created_at,
          fournisseur: item.fournisseur,
          details: [],
        };
        acc.push(supply);
      }
      // Add detail if it exists and not already added
      if (
        item.details &&
        !supply.details.some((d: { id: any }) => d.id === item.details.id)
      ) {
        supply.details.push(item.details);
      }
      return acc;
    }, [] as any[]);

    return NextResponse.json(groupedSupplies);
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Failed to fetch supplies" },
      { status: 500 }
    );
  }
}