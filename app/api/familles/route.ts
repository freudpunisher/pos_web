import { NextResponse } from "next/server"
import { db } from "@/db"
import { familles } from "@/db/schema"
import { eq } from "drizzle-orm"

export async function GET() {
  try {
    const allFamilles = await db.select().from(familles)
    return NextResponse.json(allFamilles)
  } catch (error) {
    return NextResponse.json({ error: "Error fetching familles" }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { nom } = body

    if (!nom) {
      return NextResponse.json({ error: "Name is required" }, { status: 400 })
    }

    const newFamille = await db.insert(familles).values({
      nom,
    }).returning()

    return NextResponse.json(newFamille[0])
  } catch (error) {
    return NextResponse.json({ error: "Error creating famille" }, { status: 500 })
  }
}
