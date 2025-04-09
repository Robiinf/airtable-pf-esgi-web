// src/lib/projects.js
import { airtableApi } from "./airtable";

// 🔧 Utilitaire pour transformer une entrée de record en objet projet complet
function formatProject(record) {
  return {
    id: record.id,
    name: record.fields.Name,
    description: record.fields.Description,
    slug: record.fields.Slug,
    authors: record.fields.Authors || [],
    stacks: record.fields.Stacks || [],
    assets: (record.fields.Assets || []).map((file) => ({
      url: file.url,
    })),
  };
}

// 📥 Récupère tous les projets publiés
export async function fetchPublishedProjects() {
  const response = await airtableApi.get("/Projects", {
    params: {
      filterByFormula: "Published = TRUE()",
    },
  });

  const records = response.data.records;

  return records.map(formatProject);
}

// 📥 Récupère un seul projet avec les infos liées
export async function fetchProjectBySlug(slug) {
  // 1. Chercher le projet par slug
  const response = await airtableApi.get("/Projects", {
    params: {
      filterByFormula: `Slug = '${slug}'`,
      maxRecords: 1,
    },
  });

  const record = response.data.records[0];
  if (!record) return null;

  const project = formatProject(record);

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

  return {
    ...project,
    authors: authorsData,
    stacks: stacksData,
  };
}
