import { NextResponse } from "next/server"
import { db } from "@/db"
import { familles } from "@/db/schema"
import { eq } from "drizzle-orm"

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const id = parseInt(params.id)
    await db.delete(familles).where(eq(familles.id, id))
    return NextResponse.json({ message: "Famille deleted successfully" })
  } catch (error) {
    return NextResponse.json({ error: "Error deleting famille" }, { status: 500 })
  }
}