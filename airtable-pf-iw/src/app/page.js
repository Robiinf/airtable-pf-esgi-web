"use client";
import { useState, useEffect } from "react";
import { fetchPublishedProjects, fetchAuth } from "@/lib/client-services";
import Link from "next/link";

export default function HomePage() {
  const [projects, setProjects] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    async function loadData() {
      try {
        setIsLoading(true);
        const projectsData = await fetchPublishedProjects(searchTerm);
        setProjects(projectsData);
        setError(null);

        const data = await fetchAuth();
        setIsAdmin(data.isAdmin);
      } catch (err) {
        console.error("Erreur lors du chargement:", err);
        setError("Impossible de charger les projets");
      } finally {
        setIsLoading(false);
      }
    }

    loadData();
  }, [searchTerm]);

  return (
    <main className="min-h-screen bg-gray-50 text-gray-800 p-6 md:p-10">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-10">
        <h1 className="text-4xl font-bold tracking-tight">
          🎓 Portfolio ESGI IW
        </h1>

        {isAdmin ? (
          <Link
            href="/admin"
            className="bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded-xl shadow transition"
          >
            Backoffice
          </Link>
        ) : (
          <Link
            href="/login"
            className="flex items-center bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-xl shadow transition"
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
        )}
      </div>

      <div className="w-full max-w-xl mx-auto mb-10">
        <input
          type="text"
          placeholder="🔍 Rechercher un projet par mot-clé..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full px-4 py-3 border border-gray-300 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
        />
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center py-10">
          <div className="animate-spin rounded-full h-10 w-10 border-4 border-gray-300 border-t-blue-500 mr-3"></div>
          <p className="text-lg">Chargement des projets...</p>
        </div>
      ) : error ? (
        <div className="text-red-500 text-center">{error}</div>
      ) : projects.length === 0 ? (
        <p className="text-center text-gray-600">Aucun projet trouvé</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((project) => (
            <a
              key={project.id}
              href={`/projects/${project.slug}`}
              className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm hover:shadow-md transition duration-200 hover:-translate-y-1"
            >
              <div className="mb-4">
                {project.assets && project.assets[0] ? (
                  <img
                    src={project.assets[0].url}
                    alt={project.name}
                    className="w-full h-48 object-cover rounded-lg"
                  />
                ) : (
                  <div className="h-48 bg-gray-200 rounded-lg flex items-center justify-center">
                    <span className="text-gray-500">Aucune image</span>
                  </div>
                )}
              </div>

              <h2 className="text-xl font-semibold mb-2">{project.name}</h2>
              <p className="text-gray-600 text-sm line-clamp-2">
                {project.description}
              </p>

              <div className="flex justify-between items-center mt-4">
                <span className="text-sm text-gray-500">
                  {project.likes} Likes
                </span>
              </div>
            </a>
          ))}
        </div>
      )}
    </main>
  );
}
