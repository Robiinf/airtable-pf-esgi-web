"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  fetchStudents,
  createStudent,
  updateStudent,
  deleteStudent,
} from "@/lib/client-services";
import { fetchAllClasses } from "@/lib/classes";

export default function AdminStudents() {
  const [students, setStudents] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [currentStudent, setCurrentStudent] = useState({
    id: null,
    Firstname: "",
    Lastname: "",
    Email: "",
    Class: "",
  });
  const [isEditing, setIsEditing] = useState(false);
  const [classes, setClasses] = useState([]);

  // Charger les étudiants au chargement de la page
  useEffect(() => {
    loadStudents();
    setClasses(fetchAllClasses());
  }, []);

  async function loadStudents() {
    try {
      setIsLoading(true);
      const data = await fetchStudents();
      setStudents(data);
      setError(null);
    } catch (err) {
      setError("Impossible de charger les étudiants");
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (isEditing) {
        // Mise à jour d'un étudiant existant
        await updateStudent({
          id: currentStudent.id,
          Firstname: currentStudent.Firstname,
          Lastname: currentStudent.Lastname,
          Email: currentStudent.Email,
          Class: currentStudent.Class,
        });
      } else {
        // Création d'un nouvel étudiant
        await createStudent({
          Firstname: currentStudent.Firstname,
          Lastname: currentStudent.Lastname,
          Email: currentStudent.Email,
          Class: currentStudent.Class,
        });
      }

      // Réinitialiser le formulaire et recharger les étudiants
      setCurrentStudent({
        id: null,
        Firstname: "",
        Lastname: "",
        Email: "",
        Class: "",
      });
      setShowForm(false);
      setIsEditing(false);
      loadStudents();
    } catch (err) {
      setError(isEditing ? "Échec de la mise à jour" : "Échec de la création");
      console.error(err);
    }
  };

  const handleEdit = (student) => {
    setCurrentStudent({
      id: student.id,
      Firstname: student.Firstname,
      Lastname: student.Lastname,
      Email: student.Email || "",
      Class: student.Class || "",
    });
    setIsEditing(true);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm("Êtes-vous sûr de vouloir supprimer cet étudiant ?")) {
      try {
        await deleteStudent(id);
        loadStudents();
      } catch (err) {
        setError("Échec de la suppression");
        console.error(err);
      }
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold mb-2">Gestion des étudiants</h1>
          <Link href="/admin" className="text-blue-500 hover:underline">
            ← Retour au tableau de bord
          </Link>
        </div>

        <button
          onClick={() => {
            setCurrentStudent({
              id: null,
              Firstname: "",
              Lastname: "",
              Email: "",
              Class: "",
            });
            setIsEditing(false);
            setShowForm(!showForm);
          }}
          className="bg-green-500 hover:bg-green-600 text-white font-medium py-2 px-4 rounded"
        >
          {showForm ? "Annuler" : "Ajouter un étudiant"}
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
            {isEditing ? "Modifier l'étudiant" : "Ajouter un étudiant"}
          </h2>
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label className="block text-gray-700 mb-2" htmlFor="firstname">
                Prénom
              </label>
              <input
                type="text"
                id="firstname"
                value={currentStudent.Firstname}
                onChange={(e) =>
                  setCurrentStudent({
                    ...currentStudent,
                    Firstname: e.target.value,
                  })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Prénom de l'étudiant"
                required
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 mb-2" htmlFor="lastname">
                Nom
              </label>
              <input
                type="text"
                id="lastname"
                value={currentStudent.Lastname}
                onChange={(e) =>
                  setCurrentStudent({
                    ...currentStudent,
                    Lastname: e.target.value,
                  })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Nom de l'étudiant"
                required
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 mb-2" htmlFor="email">
                Email
              </label>
              <input
                type="email"
                id="email"
                value={currentStudent.Email}
                onChange={(e) =>
                  setCurrentStudent({
                    ...currentStudent,
                    Email: e.target.value,
                  })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="email@example.com"
                required
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 mb-2" htmlFor="class">
                Classe
              </label>
              <select
                id="class"
                value={currentStudent.Class}
                onChange={(e) =>
                  setCurrentStudent({
                    ...currentStudent,
                    Class: e.target.value,
                  })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              >
                <option value="">Sélectionner une classe</option>
                {classes.map((classOption) => (
                  <option key={classOption.value} value={classOption.value}>
                    {classOption.label}
                  </option>
                ))}
              </select>
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
                  Prénom
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Nom
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Email
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Classe
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {students.length === 0 ? (
                <tr>
                  <td
                    colSpan="5"
                    className="px-6 py-4 text-center text-gray-500"
                  >
                    Aucun étudiant disponible
                  </td>
                </tr>
              ) : (
                students.map((student) => (
                  <tr key={student.id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {student.Firstname}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {student.Lastname}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {student.Email || (
                        <span className="text-gray-400">-</span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {student.Class || (
                        <span className="text-gray-400">-</span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <button
                        onClick={() => handleEdit(student)}
                        className="text-indigo-600 hover:text-indigo-900 mr-4"
                      >
                        Modifier
                      </button>
                      <button
                        onClick={() => handleDelete(student.id)}
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
