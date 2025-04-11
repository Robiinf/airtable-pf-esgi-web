"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  fetchStacks,
  createStack,
  updateStack,
  deleteStack,
} from "@/lib/client-services";

export default function AdminStacks() {
  const [stacks, setStacks] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [currentStack, setCurrentStack] = useState({
    id: null,
    Name: "",
    Logo: "",
  });
  const [isEditing, setIsEditing] = useState(false);

  // Charger les stacks au chargement de la page
  useEffect(() => {
    loadStacks();
  }, []);

  async function loadStacks() {
    try {
      setIsLoading(true);
      const data = await fetchStacks();
      setStacks(data);
      setError(null);
    } catch (err) {
      setError("Impossible de charger les stacks");
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (isEditing) {
        // Mise à jour d'un stack existant
        await updateStack({
          id: currentStack.id,
          Name: currentStack.Name,
          Logo: currentStack.Logo,
        });
      } else {
        // Création d'un nouveau stack
        await createStack({
          Name: currentStack.Name,
          Logo: currentStack.Logo,
        });
      }

      // Réinitialiser le formulaire et recharger les stacks
      setCurrentStack({ id: null, Name: "", Logo: "" });
      setShowForm(false);
      setIsEditing(false);
      loadStacks();
    } catch (err) {
      setError(isEditing ? "Échec de la mise à jour" : "Échec de la création");
      console.error(err);
    }
  };

  const handleEdit = (stack) => {
    setCurrentStack({
      id: stack.id,
      Name: stack.Name,
      Logo: stack.Logo || "",
    });
    setIsEditing(true);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm("Êtes-vous sûr de vouloir supprimer ce stack ?")) {
      try {
        await deleteStack(id);
        loadStacks();
      } catch (err) {
        setError("Échec de la suppression");
        console.error(err);
      }
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="mb-6 flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold mb-2">Gestion des stacks</h1>
          <Link href="/admin" className="text-blue-500 hover:underline">
            ← Retour au tableau de bord
          </Link>
        </div>
        <button
          onClick={() => {
            setCurrentStack({ id: null, Name: "", Logo: "" });
            setIsEditing(false);
            setShowForm(!showForm);
          }}
          className="bg-green-500 hover:bg-green-600 text-white font-medium py-2 px-4 rounded"
        >
          {showForm ? "Annuler" : "Ajouter une stack"}
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
            {isEditing ? "Modifier la stack" : "Ajouter une stack"}
          </h2>
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label className="block text-gray-700 mb-2" htmlFor="name">
                Nom du stack
              </label>
              <input
                type="text"
                id="name"
                value={currentStack.Name}
                onChange={(e) =>
                  setCurrentStack({ ...currentStack, Name: e.target.value })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 mb-2" htmlFor="Logo">
                URL de l'icône
              </label>
              <input
                type="url"
                id="Logo"
                value={currentStack.Logo}
                onChange={(e) =>
                  setCurrentStack({ ...currentStack, Logo: e.target.value })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="https://exemple.com/icon.png"
              />
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
        <div className="bg-white shadow rounded-lg overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Nom
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Icône
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {stacks.length === 0 ? (
                <tr>
                  <td
                    colSpan="3"
                    className="px-6 py-4 text-center text-gray-500"
                  >
                    Aucun stack disponible
                  </td>
                </tr>
              ) : (
                stacks.map((stack) => (
                  <tr key={stack.id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {stack.Name}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {stack.Logo ? (
                        <img
                          src={stack.Logo}
                          alt={stack.Name}
                          className="h-8 w-8 object-contain"
                        />
                      ) : (
                        <span className="text-gray-400">Aucune icône</span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <button
                        onClick={() => handleEdit(stack)}
                        className="text-indigo-600 hover:text-indigo-900 mr-4"
                      >
                        Modifier
                      </button>
                      <button
                        onClick={() => handleDelete(stack.id)}
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
