"use client";

import { useState, useEffect } from "react";
import { fetchProjectBySlug } from "@/lib/client-services";
import { useParams } from "next/navigation";
import LikeButton from "@/components/LikeButton";
import Image from "next/image";

export default function ProjectPage() {
  const [project, setProject] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const params = useParams();
  const { slug } = params;

  useEffect(() => {
    async function loadProject() {
      try {
        setIsLoading(true);
        const projectData = await fetchProjectBySlug(slug);

        if (!projectData) {
          setError("Projet non trouvé");
        } else {
          setProject(projectData);
          setError(null);
        }
      } catch (err) {
        console.error("Erreur lors du chargement:", err);
        setError("Impossible de charger ce projet");
      } finally {
        setIsLoading(false);
      }
    }

    if (slug) {
      loadProject();
    }
  }, [slug]);

  return (
    <main className="p-6 max-w-4xl mx-auto">
      {isLoading ? (
        <div className="text-center p-8">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-gray-300 border-t-blue-600 mb-2"></div>
          <p>Chargement du projet...</p>
        </div>
      ) : error ? (
        <div className="p-6 text-red-500 text-center">{error}</div>
      ) : (
        <>
          <h1 className="text-3xl font-bold mb-2">{project.name}</h1>
          <p className="text-gray-700 mb-6">{project.description}</p>

          {/* Afficher les stacks */}
          {project.stacks && project.stacks.length > 0 && (
            <div className="mb-6">
              <h2 className="text-xl font-semibold mb-2">
                Technologies utilisées
              </h2>
              <div className="flex flex-wrap gap-2">
                {project.stacks.map((stack) => (
                  <span
                    key={stack.id}
                    className="bg-gray-100 rounded-full px-3 py-1 text-sm flex items-center"
                  >
                    {stack.name}
                    {stack.logo && (
                      <Image
                        src={stack.logo}
                        alt={stack.name}
                        width={20}
                        height={20}
                        className="inline-block ml-1"
                      />
                    )}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Afficher les auteurs */}
          {project.authors && project.authors.length > 0 && (
            <div className="mb-6">
              <h2 className="text-xl font-semibold mb-2">Auteurs</h2>
              <ul className="list-disc pl-5">
                {project.authors.map((author) => (
                  <li key={author.id}>
                    {author.firstname} {author.lastname}{" "}
                    {author.class && `(${author.class})`}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Afficher les images */}
          {project.assets && project.assets.length > 0 && (
            <div className="mb-6">
              <h2 className="text-xl font-semibold mb-2">Images du projet</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {project.assets.map((asset, index) => (
                  <div
                    key={index}
                    className="overflow-hidden rounded-lg shadow-lg"
                  >
                    <img
                      src={asset.url}
                      alt={`${project.name} - image ${index + 1}`}
                      className="w-full h-48 object-cover"
                    />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Bouton Like */}
          <div className="mt-6">
            <LikeButton projectId={project.slug} initialLikes={project.likes} />
          </div>

          {/* Lien retour */}
          <div className="mt-6">
            <a
              href="/"
              className="text-blue-500 hover:underline flex items-center"
            >
              ← Retour à la liste des projets
            </a>
          </div>
        </>
      )}
    </main>
  );
}
