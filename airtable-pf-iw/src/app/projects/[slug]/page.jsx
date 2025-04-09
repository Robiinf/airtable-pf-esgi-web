// app/projects/[slug]/page.jsx
import { fetchProjectBySlug } from "@/lib/projects";
import LikeButton from "@/components/LikeButton";
import Image from "next/image";

export default async function ProjectPage({ params }) {
  const project = await fetchProjectBySlug(params.slug);
  console.log("Project data:", project);
  if (!project)
    return <div className="text-center text-red-500">Projet introuvable.</div>;

  return (
    <div className="max-w-4xl mx-auto py-10 px-4 space-y-8">
      <h1 className="text-4xl font-bold text-center">{project.name}</h1>

      <p className="text-lg text-gray-700">{project.description}</p>

      {/* Stacks */}
      {project.stacks.length > 0 && (
        <div>
          <h2 className="text-xl font-semibold mb-2">Technologies utilisées</h2>
          <div className="flex flex-wrap gap-4">
            {project.stacks.map((stack) => (
              <div
                key={stack.id}
                className="flex items-center gap-2 bg-gray-100 px-3 py-2 rounded-lg"
              >
                {stack.logo && (
                  <Image
                    src={stack.logo}
                    alt={stack.name}
                    width={24}
                    height={24}
                    className="rounded"
                  />
                )}
                <span className="text-sm">{stack.name}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Authors */}
      <div>
        <h2 className="text-xl font-semibold mb-2">Équipe projet</h2>
        <ul className="list-disc list-inside text-gray-800">
          {project.authors.map((author) => (
            <li key={author.id}>
              {author.firstname} {author.lastname} ({author.class})
            </li>
          ))}
        </ul>
      </div>

      {/* Assets */}
      {project.assets.length > 0 && (
        <div>
          <h2 className="text-xl font-semibold mb-2">Visuels / Assets</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {project.assets.map((asset, i) => (
              <Image
                key={i}
                src={asset.url}
                alt={`Asset ${i + 1}`}
                width={600}
                height={400}
                className="rounded-lg shadow-md"
              />
            ))}
          </div>
        </div>
      )}

      {/* Likes */}
      <div className="mt-6">
        <LikeButton projectId={project.id} initialLikes={project.likes} />
      </div>
    </div>
  );
}
