import { airtableApi } from "@/lib/airtable";
import { NextResponse } from "next/server";

export async function GET(request, { params }) {
  const { slug } = params;

  try {
    // 1. Chercher le projet par slug
    const response = await airtableApi.get("/Projects", {
      params: {
        filterByFormula: `Slug = '${slug}'`,
        maxRecords: 1,
      },
    });

    const record = response.data.records[0];
    if (!record) {
      return NextResponse.json({ error: "Projet non trouvé" }, { status: 404 });
    }

    const project = {
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
    };

    // 2. Résoudre les authors
    const authorsData = await Promise.all(
      (project.authors || []).map(async (id) => {
        const res = await airtableApi.get(`/Students/${id}`);
        return {
          id,
          firstname: res.data.fields.Firstname,
          lastname: res.data.fields.Lastname,
          class: res.data.fields.Class,
        };
      })
    );

    // 3. Résoudre les stacks
    const stacksData = await Promise.all(
      (project.stacks || []).map(async (id) => {
        const res = await airtableApi.get(`/Stacks/${id}`);
        return {
          id,
          name: res.data.fields.Name,
          logo: res.data.fields.Logo?.[0]?.url || "",
        };
      })
    );

    return NextResponse.json({
      ...project,
      authors: authorsData,
      stacks: stacksData,
    });
  } catch (error) {
    console.error("Erreur lors de la récupération du projet:", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
