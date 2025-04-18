"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  fetchAllProjects,
  createProject,
  updateProject,
  deleteProject,
  fetchStacks,
  fetchStudents,
} from "@/lib/client-services";

export default function AdminProjects() {
  const [projects, setProjects] = useState([]);
  const [stacks, setStacks] = useState([]);
  const [students, setStudents] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [currentProject, setCurrentProject] = useState({
    id: null,
    Name: "",
    Description: "",
    Published: false,
    Stacks: [],
    Authors: [],
    Assets: [],
  });
  const [isEditing, setIsEditing] = useState(false);
  const [newAssetUrl, setNewAssetUrl] = useState("");

  // Charger les projets, stacks et étudiants au chargement de la page
  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    try {
      setIsLoading(true);
      const [projectsData, stacksData, studentsData] = await Promise.all([
        fetchAllProjects(),
        fetchStacks(),
        fetchStudents(),
      ]);

      setProjects(projectsData);
      setStacks(stacksData);
      setStudents(studentsData);
      setError(null);
    } catch (err) {
      console.error("Erreur lors du chargement des données:", err);
      setError("Impossible de charger les données");
    } finally {
      setIsLoading(false);
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (isEditing) {
        // Mise à jour d'un projet existant
        await updateProject(currentProject);
      } else {
        // Création d'un nouveau projet
        await createProject(currentProject);
      }

      // Réinitialiser le formulaire et recharger les projets
      setCurrentProject({
        id: null,
        Name: "",
        Description: "",
        Published: false,
        Stacks: [],
        Authors: [],
        Assets: [],
      });
      setShowForm(false);
      setIsEditing(false);
      loadData();
    } catch (err) {
      setError(isEditing ? "Échec de la mise à jour" : "Échec de la création");
      console.error(err);
    }
  };

  const handleEdit = (project) => {
    setCurrentProject({
      id: project.id,
      Name: project.Name || "",
      Description: project.Description || "",
      Published: project.Published || false,
      Stacks: project.Stacks || [],
      Authors: project.Authors || [],
      Assets: project.Assets || [],
    });
    setIsEditing(true);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm("Êtes-vous sûr de vouloir supprimer ce projet ?")) {
      try {
        await deleteProject(id);
        loadData();
      } catch (err) {
        setError("Échec de la suppression");
        console.error(err);
      }
    }
  };

  const handleStackChange = (stackId) => {
    setCurrentProject((prev) => {
      const newStacks = prev.Stacks.includes(stackId)
        ? prev.Stacks.filter((id) => id !== stackId)
        : [...prev.Stacks, stackId];

      return { ...prev, Stacks: newStacks };
    });
  };

  const handleAuthorChange = (authorId) => {
    setCurrentProject((prev) => {
      const newAuthors = prev.Authors.includes(authorId)
        ? prev.Authors.filter((id) => id !== authorId)
        : [...prev.Authors, authorId];

      return { ...prev, Authors: newAuthors };
    });
  };

  const handleAddAsset = () => {
    if (newAssetUrl.trim()) {
      setCurrentProject((prev) => ({
        ...prev,
        Assets: [...prev.Assets, newAssetUrl],
      }));
      setNewAssetUrl("");
    }
  };

  const handleRemoveAsset = (index) => {
    setCurrentProject((prev) => ({
      ...prev,
      Assets: prev.Assets.filter((_, i) => i !== index),
    }));
  };

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold mb-2">Gestion des projets</h1>
          <Link href="/admin" className="text-blue-500 hover:underline">
            ← Retour au tableau de bord
          </Link>
        </div>
        <button
          onClick={() => {
            setCurrentProject({
              id: null,
              Name: "",
              Description: "",
              Published: false,
              Stacks: [],
              Authors: [],
              Assets: [],
            });
            setIsEditing(false);
            setShowForm(!showForm);
          }}
          className="bg-green-500 hover:bg-green-600 text-white font-medium py-2 px-4 rounded"
        >
          {showForm ? "Annuler" : "Ajouter un projet"}
        </button>
      </div>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      {showForm && (
        <div className="bg-white shadow rounded-lg p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">
            {isEditing ? "Modifier le projet" : "Ajouter un projet"}
          </h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Nom du projet */}
            <div>
              <label className="block text-gray-700 mb-2" htmlFor="name">
                Nom du projet *
              </label>
              <input
                type="text"
                id="name"
                value={currentProject.Name}
                onChange={(e) =>
                  setCurrentProject({ ...currentProject, Name: e.target.value })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Nom du projet"
                required
              />
            </div>

            {/* Description */}
            <div>
              <label className="block text-gray-700 mb-2" htmlFor="description">
                Description
              </label>
              <textarea
                id="description"
                value={currentProject.Description}
                onChange={(e) =>
                  setCurrentProject({
                    ...currentProject,
                    Description: e.target.value,
                  })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Description du projet"
                rows={4}
              />
            </div>

            {/* Si en mode édition, afficher le slug en lecture seule */}
            {isEditing && currentProject.Slug && (
              <div>
                <label className="block text-gray-700 mb-2" htmlFor="slug">
                  Slug (généré automatiquement)
                </label>
                <input
                  type="text"
                  id="slug"
                  value={currentProject.Slug}
                  className="w-full px-3 py-2 bg-gray-100 border border-gray-300 rounded-md"
                  disabled
                />
              </div>
            )}

            {/* Publication */}
            <div className="flex items-center">
              <input
                type="checkbox"
                id="published"
                checked={currentProject.Published}
                onChange={(e) =>
                  setCurrentProject({
                    ...currentProject,
                    Published: e.target.checked,
                  })
                }
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <label htmlFor="published" className="ml-2 block text-gray-700">
                Publier ce projet
              </label>
            </div>

            {/* Stacks */}
            <div>
              <label className="block text-gray-700 mb-2">
                Technologies utilisées
              </label>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
                {stacks.map((stack) => (
                  <div key={stack.id} className="flex items-center">
                    <input
                      type="checkbox"
                      id={`stack-${stack.id}`}
                      checked={currentProject.Stacks.includes(stack.id)}
                      onChange={() => handleStackChange(stack.id)}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                    <label
                      htmlFor={`stack-${stack.id}`}
                      className="ml-2 block text-gray-700"
                    >
                      {stack.Name}
                    </label>
                  </div>
                ))}
              </div>
            </div>

            {/* Auteurs */}
            <div>
              <label className="block text-gray-700 mb-2">Auteurs</label>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                {students.map((student) => (
                  <div key={student.id} className="flex items-center">
                    <input
                      type="checkbox"
                      id={`author-${student.id}`}
                      checked={currentProject.Authors.includes(student.id)}
                      onChange={() => handleAuthorChange(student.id)}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                    <label
                      htmlFor={`author-${student.id}`}
                      className="ml-2 block text-gray-700"
                    >
                      {student.Firstname} {student.Lastname}
                    </label>
                  </div>
                ))}
              </div>
            </div>

            {/* Assets */}
            <div>
              <label className="block text-gray-700 mb-2">
                Images du projet
              </label>
              <div className="flex mb-2">
                <input
                  type="url"
                  value={newAssetUrl}
                  onChange={(e) => setNewAssetUrl(e.target.value)}
                  placeholder="URL de l'image"
                  className="flex-grow px-3 py-2 border border-gray-300 rounded-l-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <button
                  type="button"
                  onClick={handleAddAsset}
                  className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-r-md"
                >
                  Ajouter
                </button>
              </div>

              {currentProject.Assets.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-2">
                  {currentProject.Assets.map((url, index) => (
                    <div key={index} className="relative group">
                      <img
                        src={url}
                        alt={`Asset ${index + 1}`}
                        className="w-full h-32 object-cover rounded border border-gray-300"
                      />
                      <button
                        type="button"
                        onClick={() => handleRemoveAsset(index)}
                        className="absolute top-2 right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        ✕
                      </button>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500 text-sm italic">
                  Aucune image ajoutée
                </p>
              )}
            </div>

            <div className="flex justify-end">
              <button
                type="submit"
                className="bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-4 rounded"
              >
                {isEditing ? "Mettre à jour" : "Créer"}
              </button>
            </div>
          </form>
        </div>
      )}

      {isLoading ? (
        <div className="flex justify-center items-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-4 border-blue-500 border-t-transparent"></div>
        </div>
      ) : (
        <div className="bg-white shadow rounded-lg overflow-hidden overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Nom
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Slug
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Statut
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Likes
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Technologies
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Auteurs
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {projects.length === 0 ? (
                <tr>
                  <td
                    colSpan="7"
                    className="px-6 py-4 text-center text-gray-500"
                  >
                    Aucun projet disponible
                  </td>
                </tr>
              ) : (
                projects.map((project) => (
                  <tr key={project.id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {project.Name}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      {project.Slug}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          project.Published
                            ? "bg-green-100 text-green-800"
                            : "bg-red-100 text-red-800"
                        }`}
                      >
                        {project.Published ? "Publié" : "Brouillon"}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      {project.Likes || 0}
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm line-clamp-2">
                        {project.StacksNames &&
                        project.StacksNames.length > 0 ? (
                          project.StacksNames.join(", ")
                        ) : (
                          <span className="text-gray-400">-</span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm line-clamp-2">
                        {project.AuthorsNames &&
                        project.AuthorsNames.length > 0 ? (
                          project.AuthorsNames.join(", ")
                        ) : (
                          <span className="text-gray-400">-</span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <button
                        onClick={() => handleEdit(project)}
                        className="text-indigo-600 hover:text-indigo-900 mr-4"
                      >
                        Modifier
                      </button>
                      <button
                        onClick={() => handleDelete(project.id)}
                        className="text-red-600 hover:text-red-900"
                      >
                        Supprimer
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
