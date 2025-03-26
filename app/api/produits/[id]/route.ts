// app/api/produits/[id]/route.ts
import { NextResponse } from "next/server"
import { db } from "@/db"
import { produits } from "@/db/schema"
import { eq } from "drizzle-orm"

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const id = parseInt(params.id)
    await db.delete(produits).where(eq(produits.id, id))
    return NextResponse.json({ message: "Product deleted successfully" })
  } catch (error) {
    return NextResponse.json({ error: "Error deleting product" }, { status: 500 })
  }
}

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const id = parseInt(params.id)
    const body = await request.json() // Parse the request body

    // Update the product in the database
    await db
      .update(produits)
      .set({
        code: body.code,
        nom: body.nom,
        familleId: body.familleId,
        type_produit: body.type_produit,
        description: body.description,
      })
      .where(eq(produits.id, id))

    return NextResponse.json({ message: "Product updated successfully" })
  } catch (error) {
    return NextResponse.json({ error: "Error updating product" }, { status: 500 })
  }
}