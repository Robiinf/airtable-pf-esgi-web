// src/lib/client-services.js

export async function fetchPublishedProjects(searchTerm = "") {
  try {
    const query = searchTerm ? `?filter=${encodeURIComponent(searchTerm)}` : "";

    const response = await fetch(`/api/projects${query}`);

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

export async function createStack(stackData) {
  try {
    const response = await fetch("/api/stacks", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(stackData),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || "Erreur lors de la création du stack");
    }

    return await response.json();
  } catch (error) {
    console.error("Erreur:", error);
    throw error;
  }
}

export async function updateStack(stackData) {
  try {
    const response = await fetch(`/api/stacks`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(stackData),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(
        error.message || "Erreur lors de la mise à jour du stack"
      );
    }

    return await response.json();
  } catch (error) {
    console.error("Erreur:", error);
    throw error;
  }
}

export async function deleteStack(id) {
  try {
    const response = await fetch(`/api/stacks/${id}`, {
      method: "DELETE",
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(
        error.message || "Erreur lors de la suppression du stack"
      );
    }

    return await response.json();
  } catch (error) {
    console.error("Erreur:", error);
    throw error;
  }
}
