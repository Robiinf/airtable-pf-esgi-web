// src/app/page.jsx
import { fetchPublishedProjects } from "@/lib/projects";

export default async function HomePage() {
  const projects = await fetchPublishedProjects();

  return (
    <main className="p-6">
      <h1 className="text-3xl font-bold mb-6">Projets publiés</h1>

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
    </main>
  );
}
