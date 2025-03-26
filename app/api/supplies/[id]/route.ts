import { NextResponse } from "next/server";
import { db } from "@/db/index";
import { eq } from "drizzle-orm";
import { stock, supplies, supplyDetails } from "@/db/schema";

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const supply = await db.query.supplies.findFirst({
      where: eq(supplies.id, parseInt(params.id)),
      with: {
        details: {
          with: {
            produit: true,
          },
        },
        fournisseur: true,
      },
    });

    if (!supply) {
      return NextResponse.json({ error: "Supply not found" }, { status: 404 });
    }

    return NextResponse.json(supply);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch supply" },
      { status: 500 }
    );
  }
}


export async function DELETE(
    request: Request,
    { params }: { params: { id: string } }
  ) {
    try {
      await db.transaction(async (tx) => {
        // Get supply details first
        const details = await tx.select()
          .from(supplyDetails)
          .where(eq(supplyDetails.supplyId, parseInt(params.id)));
  
        // Delete supply (cascade will delete details)
        await tx.delete(supplies)
          .where(eq(supplies.id, parseInt(params.id)));
  
        // Update stock for each detail
        await Promise.all(details.map(async (detail) => {
          const [existingStock] = await tx.select()
            .from(stock)
            .where(eq(stock.produitId, detail.produitId));
  
          if (existingStock) {
            const newQuantity = (existingStock.quantite ?? 0) - detail.quantity;
            await tx.update(stock)
              .set({ quantite: newQuantity < 0 ? 0 : newQuantity })
              .where(eq(stock.produitId, detail.produitId));
          }
        }));
      });
  
      return NextResponse.json({ message: "Supply deleted successfully" });
    } catch (error) {
      return NextResponse.json(
        { error: "Failed to delete supply" },
        { status: 500 }
      );
    }
  }