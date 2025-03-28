import { NextResponse } from "next/server";
import { db } from "@/db";
import { fournisseurs } from "@/db/schema";
import { eq } from "drizzle-orm";

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  const id = parseInt(params.id);
  if (isNaN(id)) {
    return NextResponse.json({ error: "Invalid ID" }, { status: 400 });
  }
  try {
    const found = await db.select().from(fournisseurs).where(eq(fournisseurs.id, id));
    if (!found.length) {
      return NextResponse.json({ error: "Fournisseur not found" }, { status: 404 });
    }
    return NextResponse.json(found[0]);
  } catch (error) {
    return NextResponse.json({ error: "Error fetching fournisseur" }, { status: 500 });
  }
}

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  const id = parseInt(params.id);
  if (isNaN(id)) {
    return NextResponse.json({ error: "Invalid ID" }, { status: 400 });
  }
  try {
    const body = await request.json();
    const { first_name, last_name, address, contact_person, email, phone_number } = body;
    
    const updated = await db
      .update(fournisseurs)
      .set({
        first_name,
        last_name,
        address,
        contact_person,
        email,
        phone_number,
        updated_at: new Date(),
      })
      .where(eq(fournisseurs.id, id))
      .returning();
      
    if (!updated.length) {
      return NextResponse.json({ error: "Fournisseur not found" }, { status: 404 });
    }
    return NextResponse.json(updated[0]);
  } catch (error) {
    return NextResponse.json({ error: "Error updating fournisseur" }, { status: 500 });
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  const id = parseInt(params.id);
  if (isNaN(id)) {
    return NextResponse.json({ error: "Invalid ID" }, { status: 400 });
  }
  try {
    const deleted = await db
      .delete(fournisseurs)
      .where(eq(fournisseurs.id, id))
      .returning();
    if (!deleted.length) {
      return NextResponse.json({ error: "Fournisseur not found" }, { status: 404 });
    }
    return NextResponse.json({ message: "Fournisseur deleted successfully" });
  } catch (error) {
    return NextResponse.json({ error: "Error deleting fournisseur" }, { status: 500 });
  }
}
