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
    const response = await fetch(`/api/stacks`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ id }),
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

export async function fetchStudents() {
  try {
    const response = await fetch("/api/students");

    if (!response.ok) {
      throw new Error("Erreur lors de la récupération des étudiants");
    }

    return await response.json();
  } catch (error) {
    console.error("Erreur:", error);
    return [];
  }
}

export async function createStudent(studentData) {
  try {
    const response = await fetch("/api/students", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(studentData),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(
        error.message || "Erreur lors de la création de l'étudiant"
      );
    }

    return await response.json();
  } catch (error) {
    console.error("Erreur:", error);
    throw error;
  }
}

export async function updateStudent(studentData) {
  try {
    const response = await fetch(`/api/students`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(studentData),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(
        error.message || "Erreur lors de la mise à jour de l'étudiant"
      );
    }

    return await response.json();
  } catch (error) {
    console.error("Erreur:", error);
    throw error;
  }
}

export async function deleteStudent(id) {
  try {
    const response = await fetch(`/api/students`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ id }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(
        error.message || "Erreur lors de la suppression de l'étudiant"
      );
    }

    return await response.json();
  } catch (error) {
    console.error("Erreur:", error);
    throw error;
  }
}

export async function fetchAllProjects() {
  try {
    const response = await fetch("/api/admin/projects");

    if (!response.ok) {
      throw new Error("Erreur lors de la récupération des projets");
    }

    return await response.json();
  } catch (error) {
    console.error("Erreur:", error);
    return [];
  }
}

export async function createProject(projectData) {
  try {
    const response = await fetch("/api/admin/projects", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(projectData),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || "Erreur lors de la création du projet");
    }

    return await response.json();
  } catch (error) {
    console.error("Erreur:", error);
    throw error;
  }
}

export async function updateProject(projectData) {
  try {
    const response = await fetch(`/api/admin/projects`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(projectData),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(
        error.message || "Erreur lors de la mise à jour du projet"
      );
    }

    return await response.json();
  } catch (error) {
    console.error("Erreur:", error);
    throw error;
  }
}

export async function deleteProject(id) {
  try {
    const response = await fetch(`/api/admin/projects`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ id }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(
        error.message || "Erreur lors de la suppression du projet"
      );
    }

    return await response.json();
  } catch (error) {
    console.error("Erreur:", error);
    throw error;
  }
}
