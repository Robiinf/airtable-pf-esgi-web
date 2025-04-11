// src/lib/client-services.js

export async function fetchPublishedProjects() {
  try {
    const response = await fetch("/api/projects");

    if (!response.ok) {
      throw new Error("Erreur lors de la récupération des projets");
    }

    return await response.json();
  } catch (error) {
    console.error("Erreur:", error);
    return [];
  }
}

export async function fetchStacks() {
  try {
    const response = await fetch("/api/stacks");

    if (!response.ok) {
      throw new Error("Erreur lors de la récupération des stacks");
    }

    return await response.json();
  } catch (error) {
    console.error("Erreur:", error);
    return [];
  }
}

export async function fetchProjectBySlug(slug) {
  try {
    const response = await fetch(`/api/projects/${slug}`);

    if (!response.ok) {
      if (response.status === 404) {
        return null;
      }
      throw new Error("Erreur lors de la récupération du projet");
    }

    return await response.json();
  } catch (error) {
    console.error("Erreur:", error);
    return null;
  }
}

export async function loginAdmin(email, password) {
  try {
    const response = await fetch("/api/auth/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Échec de la connexion");
    }

    return data;
  } catch (error) {
    console.error("Erreur de connexion:", error);
    throw error;
  }
}

export async function fetchAuth() {
  try {
    const response = await fetch("/api/me");

    if (!response.ok) {
      throw new Error("Erreur lors de la vérification de l'authentification");
    }

    return await response.json();
  } catch (error) {
    console.error("Erreur:", error);
    return { isAdmin: false };
  }
}
