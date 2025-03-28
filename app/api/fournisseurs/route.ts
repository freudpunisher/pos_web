import { NextResponse } from "next/server";
import { db } from "@/db";
import { fournisseurs } from "@/db/schema";

export async function GET() {
  try {
    const allFournisseurs = await db.select().from(fournisseurs);
    return NextResponse.json(allFournisseurs);
  } catch (error) {
    return NextResponse.json({ error: "Error fetching fournisseurs" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { first_name, last_name, address, contact_person, email, phone_number } = body;
    
    if (!first_name || !last_name || !address || !contact_person || !email || !phone_number) {
      return NextResponse.json(
        { error: "first_name, last_name, address, contact_person, email, and phone_number are required" },
        { status: 400 }
      );
    }

    const newFournisseur = await db
      .insert(fournisseurs)
      .values({
        first_name,
        last_name,
        address,
        contact_person,
        email,
        phone_number,
      })
      .returning();

    return NextResponse.json(newFournisseur[0]);
  } catch (error) {
    return NextResponse.json({ error: "Error creating fournisseur" }, { status: 500 });
  }
}
