// src/app/projects/[slug]/page.jsx
import { fetchProjectBySlug } from "@/lib/projects";

export default async function ProjectPage({ params }) {
  const project = await fetchProjectBySlug(params.slug);

  if (!project) return <div>Projet introuvable.</div>;

  return (
    <main className="p-6">
      <h1 className="text-3xl font-bold mb-4">{project.name}</h1>
      <p className="text-lg mb-6">{project.description}</p>

      <h2 className="text-xl font-semibold mb-2">Stacks utilisées</h2>
      <div className="flex gap-4 mb-6">
        {project.stacks.map((stack) => (
          <div key={stack.id} className="flex items-center gap-2">
            <img src={stack.logo} alt={stack.name} className="w-6 h-6" />
            <span>{stack.name}</span>
          </div>
        ))}
      </div>

      <h2 className="text-xl font-semibold mb-2">Auteurs</h2>
      <ul className="list-disc ml-6 mb-6">
        {project.authors.map((author) => (
          <li key={author.id}>
            {author.firstname} {author.lastname} – {author.class}
          </li>
        ))}
      </ul>

      {project.assets && project.assets.length > 0 && (
        <>
          <h2 className="text-xl font-semibold mb-2">Visuels</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {project.assets.map((asset, index) => (
              <img
                key={index}
                src={asset.url}
                alt={`Asset ${index + 1}`}
                className="w-full rounded shadow"
              />
            ))}
          </div>
        </>
      )}
    </main>
  );
}
