"use client";
import { useState, useEffect } from "react";
import { fetchPublishedProjects } from "@/lib/client-services";

export default function HomePage() {
  const [projects, setProjects] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function loadData() {
      try {
        setIsLoading(true);
        const projectsData = await fetchPublishedProjects();
        console.log("Projets récupérés:", projectsData);
        setProjects(projectsData);
        setError(null);
      } catch (err) {
        console.error("Erreur lors du chargement:", err);
        setError("Impossible de charger les projets");
      } finally {
        setIsLoading(false);
      }
    }

    loadData();
  }, []);

  return (
    <main className="p-6">
      <h1 className="text-3xl font-bold mb-6">Portfolio ESGI - IW</h1>
      {isLoading ? (
        <div className="text-center p-8">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-gray-300 border-t-blue-600 mb-2"></div>
          <p>Chargement des projets...</p>
        </div>
      ) : error ? (
        <div className="p-6 text-red-500 text-center">{error}</div>
      ) : (
        <>
          {projects.length === 0 ? (
            <p>Aucun projet trouvé</p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
              {projects.map((project) => (
                <a
                  key={project.id}
                  href={`/projects/${project.slug}`}
                  className="border rounded-lg p-4 hover:shadow-lg transition"
                >
                  <h2 className="text-xl font-semibold">{project.name}</h2>
                  <p className="text-sm text-gray-600 line-clamp-2 mt-1">
                    {project.description}
                  </p>
                </a>
              ))}
            </div>
          )}
        </>
      )}
    </main>
  );
}
