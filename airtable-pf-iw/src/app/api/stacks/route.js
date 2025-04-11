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

export async function POST(request) {
  const { Name, Logo } = await request.json();

  try {
    const response = await airtableApi.post("/Stacks", {
      fields: {
        Name: Name,
        Logo: Logo ? [{ url: Logo }] : [],
      },
    });

    return NextResponse.json(response.data);
  } catch (error) {
    console.error("Erreur lors de la création du stack:", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}

export async function PUT(request) {
  const { id, Name, Logo } = await request.json();

  console.error({ id, Name, Logo });

  try {
    const response = await airtableApi.patch(`/Stacks/${id}`, {
      fields: {
        Name: Name,
        Logo: Logo ? [{ url: Logo }] : [],
      },
    });

    return NextResponse.json(response.data);
  } catch (error) {
    console.error("Erreur lors de la mise à jour du stack:", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
export async function DELETE(request) {
  const { id } = await request.json();

  try {
    await airtableApi.delete(`/Stacks/${id}`);
    return NextResponse.json({ message: "Stack supprimé" });
  } catch (error) {
    console.error("Erreur lors de la suppression du stack:", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
