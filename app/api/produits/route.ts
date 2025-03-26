// app/api/products/route.ts
import { NextResponse } from "next/server"
import { db } from "@/db"
import { produits } from "@/db/schema"
import { eq } from "drizzle-orm"

export async function GET() {
  try {
    const allProducts = await db.select().from(produits)
    return NextResponse.json(allProducts)
  } catch (error) {
    return NextResponse.json({ error: "Error fetching products" }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const {
      code,
      nom,
      familleId,
     
      prix_vente,
     
      type_produit,
      description,
      
    } = body

    // Validate required fields
    if (!code || !nom || !familleId ) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      )
    }

    const newProduct = await db
      .insert(produits)
      .values({
        code,
        nom,
        familleId,
       
        prix_vente,
        
        type_produit,
        description,
       
      })
      .returning()

    return NextResponse.json(newProduct[0])
  } catch (error) {
    return NextResponse.json({ error: "Error creating product" }, { status: 500 })
  }
}

export async function DELETE(request: Request) {
  try {
    const body = await request.json()
    const { id } = body

    await db.delete(produits).where(eq(produits.id, id))
    return NextResponse.json({ message: "Product deleted successfully" })
  } catch (error) {
    return NextResponse.json({ error: "Error deleting product" }, { status: 500 })
  }
}