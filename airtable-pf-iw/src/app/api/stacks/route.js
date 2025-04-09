import { airtableApi } from "@/lib/airtable";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const res = await airtableApi.get("/Stacks");
    const stacks = res.data.records.map((record) => ({
      id: record.id,
      Name: record.fields.Name,
      Logo: record.fields.Logo?.[0]?.url || "",
    }));

    return NextResponse.json(stacks);
  } catch (error) {
    console.error("Erreur lors de la récupération des stacks:", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
