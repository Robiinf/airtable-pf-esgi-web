import { airtableApi } from "@/lib/airtable";

export async function PATCH(req, { params }) {
  const { id } = params;
  const body = await req.json();
  const increment = body.increment;

  try {
    // Récupérer le projet actuel
    const res = await airtableApi.get(`/Projects/${id}`);
    const currentLikes = res.data.fields.Likes || 0;

    // Incrémenter ou décrémenter
    const newLikes = increment
      ? currentLikes + 1
      : Math.max(0, currentLikes - 1);

    // Update Airtable
    const update = await airtableApi.patch(`/Projects/${id}`, {
      fields: { Likes: newLikes },
    });

    return Response.json({ success: true, likes: newLikes });
  } catch (err) {
    console.error(err);
    return new Response("Erreur Airtable", { status: 500 });
  }
}
