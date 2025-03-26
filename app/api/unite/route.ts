import { NextResponse } from "next/server"
import { db } from "@/db"
import { uniteMesures } from "@/db/schema"
import { eq } from "drizzle-orm"

export async function GET() {
  try {
    const allUniteMesures = await db.select().from(uniteMesures)
    return NextResponse.json(allUniteMesures)
  } catch (error) {
    return NextResponse.json({ error: "Error fetching unités de mesure" }, { status: 500 })
  }
}

export async function POST(request: Request) {
    try {
      const body = await request.json();
      const { produitId, desigantion, code, value_piece, value_rapport, value_prix_vente } = body;
  
      if (!produitId || !desigantion || !code) {
        return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
      }
  
      const newUniteMesure = await db
        .insert(uniteMesures)
        .values({
          produitId,
          desigantion,
          code,
          value_piece,
          value_rapport,
          value_prix_vente,
        })
        .returning();
  
      return NextResponse.json(newUniteMesure[0]);
    } catch (error) {
      return NextResponse.json({ error: "Error creating unité de mesure" }, { status: 500 });
    }
  }
  
export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const id = parseInt(params.id)
    await db.delete(uniteMesures).where(eq(uniteMesures.id, id))
    return NextResponse.json({ message: "Unité de mesure deleted successfully" })
  } catch (error) {
    return NextResponse.json({ error: "Error deleting unité de mesure" }, { status: 500 })
  }
}