import { NextResponse } from "next/server";
import { db } from "@/db";
import { supplyDetails } from "@/db/schema";

export async function GET() {
  try {
    const allSupplyDetails = await db.select().from(supplyDetails);
    return NextResponse.json(allSupplyDetails);
  } catch (error) {
    return NextResponse.json({ error: "Error fetching supply details" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { supplyId, produitId, quantity, price_per_unit, total_price } = body;
    
    if (!supplyId || !produitId || quantity === undefined || price_per_unit === undefined || total_price === undefined) {
      return NextResponse.json(
        { error: "supplyId, produitId, quantity, price_per_unit, and total_price are required" },
        { status: 400 }
      );
    }

    const newSupplyDetail = await db
      .insert(supplyDetails)
      .values({
        supplyId,
        produitId,
        quantity,
        price_per_unit,
        total_price,
      })
      .returning();

    return NextResponse.json(newSupplyDetail[0]);
  } catch (error) {
    return NextResponse.json({ error: "Error creating supply detail" }, { status: 500 });
  }
}
