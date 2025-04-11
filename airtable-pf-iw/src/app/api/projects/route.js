import { airtableApi } from "@/lib/airtable";
import { NextResponse } from "next/server";

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const search = searchParams.get("filter")?.toLowerCase();

  let filterByFormula = "Published = TRUE()";

  if (search) {
    const escapedSearch = search.replace(/"/g, '\\"');
    filterByFormula = `AND(
      Published = TRUE(),
      OR(
        FIND(LOWER("${escapedSearch}"), LOWER(Name)) > 0,
        FIND(LOWER("${escapedSearch}"), LOWER(Description)) > 0
      )
    )`;
  }

  try {
    const response = await airtableApi.get("/Projects", {
      params: { filterByFormula },
    });

    const records = response.data.records.map((record) => ({
      id: record.id,
      name: record.fields.Name,
      description: record.fields.Description,
      likes: record.fields.Likes || 0,
      slug: record.fields.Slug,
      authors: record.fields.Authors || [],
      stacks: record.fields.Stacks || [],
      assets: (record.fields.Assets || []).map((file) => ({
        url: file.url,
      })),
    }));

    return NextResponse.json(records);
  } catch (error) {
    console.error("Erreur lors de la récupération des projets:", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
