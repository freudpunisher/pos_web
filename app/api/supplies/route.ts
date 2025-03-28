import { NextResponse } from "next/server";
import { db } from "../../../db";
import { supplies, supplyDetails, stock, fournisseurs } from "../../../db/schema";
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
      const allSupplies = await db.select({
          id: supplies.id,
          reference: supplies.reference,
          supply_date: supplies.supply_date,
          created_at: supplies.created_at,
          details: {
            id: supplyDetails.id,
            supplyId: supplyDetails.supplyId,
            produitId: supplyDetails.produitId,
            quantity: supplyDetails.quantity,
            // price_per_unit: supplyDetails.price_per_unit,
            // total_price: supplyDetails.total_price,
          },
          fournisseur: {
            id: fournisseurs.id,
            first_name: fournisseurs.first_name,
            last_name: fournisseurs.last_name,
            // Add additional fournisseur fields if needed
          },
        })
        .from(supplies)
        // Join supply details on the supply id
        .leftJoin(supplyDetails, eq(supplyDetails.supplyId, supplies.id))
        // Join fournisseur on the fournisseur id from supplies
        .leftJoin(fournisseurs, eq(supplies.fournisseurId, fournisseurs.id));
  
      return NextResponse.json(allSupplies);
    } catch (error) {
      console.error(error);
      return NextResponse.json(
        { error: "Failed to fetch supplies" },
        { status: 500 }
      );
    }
  }