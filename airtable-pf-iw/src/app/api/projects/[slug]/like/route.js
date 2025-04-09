import { airtableApi } from "@/lib/airtable";

export async function PATCH(req, { params }) {
  const { slug } = params;
  const body = await req.json();
  const increment = body.increment;

  try {
    // Nous devons d'abord trouver l'ID du projet correspondant au slug
    const projectResponse = await airtableApi.get("/Projects", {
      params: {
        filterByFormula: `Slug = '${slug}'`,
        maxRecords: 1,
      },
    });

    if (!projectResponse.data.records.length) {
      return new Response("Projet non trouvé", { status: 404 });
    }

    const projectId = projectResponse.data.records[0].id;
    const currentLikes = projectResponse.data.records[0].fields.Likes || 0;

    // Incrémenter ou décrémenter
    const newLikes = increment
      ? currentLikes + 1
      : Math.max(0, currentLikes - 1);

    // Update Airtable
    const update = await airtableApi.patch(`/Projects/${projectId}`, {
      fields: { Likes: newLikes },
    });

    return Response.json({ success: true, likes: newLikes });
  } catch (err) {
    console.error(err);
    return new Response("Erreur Airtable", { status: 500 });
  }
}
