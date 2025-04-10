"use client";
import { useState, useEffect } from "react";
import { fetchPublishedProjects } from "@/lib/client-services";
import Link from "next/link";

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
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Portfolio ESGI - IW</h1>
        <Link
          href="/login"
          className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded transition-colors duration-200 flex items-center"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5 mr-2"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-6-3a2 2 0 11-4 0 2 2 0 014 0zm-2 4a5 5 0 00-4.546 2.916A5.986 5.986 0 0010 16a5.986 5.986 0 004.546-2.084A5 5 0 0010 11z"
              clipRule="evenodd"
            />
          </svg>
          Connexion
        </Link>
      </div>

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
