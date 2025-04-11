import { NextResponse } from "next/server";
import { airtableApi } from "@/lib/airtable";

// GET /api/students - Récupérer tous les étudiants
export async function GET(request) {
  try {
    const res = await airtableApi.get("/Students");

    // Transformer les données pour le format souhaité
    const students = res.data.records.map((record) => ({
      id: record.id,
      Firstname: record.fields.Firstname || "",
      Lastname: record.fields.Lastname || "",
      Email: record.fields.Email || "",
      Class: record.fields.Class || "",
    }));

    return NextResponse.json(students);
  } catch (error) {
    console.error("Erreur lors de la récupération des étudiants:", error);
    return NextResponse.json(
      { message: "Impossible de récupérer les étudiants" },
      { status: 500 }
    );
  }
}

// POST /api/students - Créer un nouvel étudiant
export async function POST(request) {
  try {
    const data = await request.json();

    // Validation des données
    if (!data.Firstname || !data.Lastname) {
      return NextResponse.json(
        { message: "Le prénom et le nom sont requis" },
        { status: 400 }
      );
    }

    // Création de l'étudiant dans Airtable
    const res = await airtableApi.post("/Students", {
      records: [
        {
          fields: {
            Firstname: data.Firstname,
            Lastname: data.Lastname,
            Email: data.Email || "",
            Class: data.Class || "",
          },
        },
      ],
    });

    const createdStudent = res.data.records[0];

    return NextResponse.json({
      id: createdStudent.id,
      ...createdStudent.fields,
    });
  } catch (error) {
    console.error("Erreur lors de la création de l'étudiant:", error);
    return NextResponse.json(
      { message: "Impossible de créer l'étudiant" },
      { status: 500 }
    );
  }
}

// PUT /api/students - Mettre à jour un étudiant existant
export async function PUT(request) {
  try {
    const data = await request.json();

    // Validation des données
    if (!data.id || !data.Firstname || !data.Lastname) {
      return NextResponse.json(
        { message: "ID, prénom et nom sont requis" },
        { status: 400 }
      );
    }

    // Mise à jour de l'étudiant dans Airtable
    const res = await airtableApi.patch("/Students", {
      records: [
        {
          id: data.id,
          fields: {
            Firstname: data.Firstname,
            Lastname: data.Lastname,
            Email: data.Email || "",
            Class: data.Class || "",
          },
        },
      ],
    });

    const updatedStudent = res.data.records[0];

    return NextResponse.json({
      id: updatedStudent.id,
      ...updatedStudent.fields,
    });
  } catch (error) {
    console.error("Erreur lors de la mise à jour de l'étudiant:", error);
    return NextResponse.json(
      { message: "Impossible de mettre à jour l'étudiant" },
      { status: 500 }
    );
  }
}

// DELETE /api/students - Supprimer un étudiant
export async function DELETE(request) {
  try {
    const data = await request.json();

    // Validation de l'ID
    if (!data.id) {
      return NextResponse.json(
        { message: "ID de l'étudiant requis" },
        { status: 400 }
      );
    }

    // Suppression de l'étudiant dans Airtable
    await airtableApi.delete(`/Students/${data.id}`);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Erreur lors de la suppression de l'étudiant:", error);
    return NextResponse.json(
      { message: "Impossible de supprimer l'étudiant" },
      { status: 500 }
    );
  }
}
