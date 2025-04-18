import { NextResponse } from "next/server";
import { airtableApi } from "@/lib/airtable";

// GET /api/admin/projects - Récupérer tous les projets (y compris non publiés)
export async function GET(request) {
  try {
    // Récupérer tous les projets
    const res = await airtableApi.get("/Projects");

    // Récupérer les stacks et les étudiants en parallèle
    const [stacksRes, studentsRes] = await Promise.all([
      airtableApi.get("/Stacks"),
      airtableApi.get("/Students"),
    ]);

    // Créer un dictionnaire pour les recherches rapides
    const stacksMap = stacksRes.data.records.reduce((acc, record) => {
      acc[record.id] = record.fields.Name || "";
      return acc;
    }, {});

    const studentsMap = studentsRes.data.records.reduce((acc, record) => {
      acc[record.id] = `${record.fields.Firstname || ""} ${
        record.fields.Lastname || ""
      }`;
      return acc;
    }, {});

    // Transformer les données pour le format souhaité
    const projects = res.data.records.map((record) => {
      const project = {
        id: record.id,
        Name: record.fields.Name || "",
        Description: record.fields.Description || "",
        Published: record.fields.Published || false,
        Likes: record.fields.Likes || 0,
        Slug: record.fields.Slug || "",
        Stacks: record.fields.Stacks || [],
        Authors: record.fields.Authors || [],
        Assets: (record.fields.Assets || []).map((asset) => asset.url),
      };

      // Ajouter les noms des stacks pour l'affichage
      project.StacksNames = project.Stacks.map(
        (id) => stacksMap[id] || "Stack inconnu"
      );

      // Ajouter les noms des auteurs pour l'affichage
      project.AuthorsNames = project.Authors.map(
        (id) => studentsMap[id] || "Auteur inconnu"
      );

      return project;
    });

    return NextResponse.json(projects);
  } catch (error) {
    console.error("Erreur lors de la récupération des projets:", error);
    return NextResponse.json(
      { message: "Impossible de récupérer les projets" },
      { status: 500 }
    );
  }
}

// POST /api/admin/projects - Créer un nouveau projet
export async function POST(request) {
  try {
    const data = await request.json();

    // Validation des données
    if (!data.Name) {
      return NextResponse.json(
        { message: "Le nom du projet est requis" },
        { status: 400 }
      );
    }

    // Préparation des données pour Airtable
    // Sans inclure le slug ou les likes qui sont gérés par Airtable
    const fields = {
      Name: data.Name,
      Description: data.Description || "",
      Published: data.Published || false,
    };

    // Ajout des relations s'ils existent
    if (data.Stacks && data.Stacks.length > 0) {
      fields.Stacks = data.Stacks;
    }

    if (data.Authors && data.Authors.length > 0) {
      fields.Authors = data.Authors;
    }

    // Ajout des assets s'ils existent
    if (data.Assets && data.Assets.length > 0) {
      fields.Assets = data.Assets.map((url) => ({ url }));
    }

    // Création du projet dans Airtable
    const res = await airtableApi.post("/Projects", {
      records: [{ fields }],
    });

    const createdProject = res.data.records[0];

    return NextResponse.json({
      id: createdProject.id,
      ...createdProject.fields,
    });
  } catch (error) {
    console.error("Erreur lors de la création du projet:", error);
    return NextResponse.json(
      { message: "Impossible de créer le projet" },
      { status: 500 }
    );
  }
}

// PUT /api/admin/projects - Mettre à jour un projet existant
export async function PUT(request) {
  try {
    const data = await request.json();

    // Validation des données
    if (!data.id || !data.Name) {
      return NextResponse.json(
        { message: "ID et nom sont requis" },
        { status: 400 }
      );
    }

    // Préparation des données pour Airtable
    // Ne pas inclure Likes pour ne pas les écraser
    const fields = {
      Name: data.Name,
      Description: data.Description || "",
      Published: data.Published || false,
    };

    // Ajout des relations s'ils existent
    if (data.Stacks !== undefined) {
      fields.Stacks = data.Stacks;
    }

    if (data.Authors !== undefined) {
      fields.Authors = data.Authors;
    }

    // Ajout des assets s'ils existent
    if (data.Assets !== undefined) {
      fields.Assets = data.Assets.map((url) => ({ url }));
    }

    // Mise à jour du projet dans Airtable
    const res = await airtableApi.patch("/Projects", {
      records: [
        {
          id: data.id,
          fields,
        },
      ],
    });

    const updatedProject = res.data.records[0];

    return NextResponse.json({
      id: updatedProject.id,
      ...updatedProject.fields,
    });
  } catch (error) {
    console.error("Erreur lors de la mise à jour du projet:", error);
    return NextResponse.json(
      { message: "Impossible de mettre à jour le projet" },
      { status: 500 }
    );
  }
}

// DELETE /api/admin/projects - Supprimer un projet
export async function DELETE(request) {
  try {
    const data = await request.json();

    // Validation de l'ID
    if (!data.id) {
      return NextResponse.json(
        { message: "ID du projet requis" },
        { status: 400 }
      );
    }

    // Suppression du projet dans Airtable
    await airtableApi.delete(`/Projects/${data.id}`);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Erreur lors de la suppression du projet:", error);
    return NextResponse.json(
      { message: "Impossible de supprimer le projet" },
      { status: 500 }
    );
  }
}
