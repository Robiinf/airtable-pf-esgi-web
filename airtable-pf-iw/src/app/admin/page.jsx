"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function AdminDashboard() {
  const router = useRouter();

  const handleLogout = async () => {
    try {
      const response = await fetch("/api/auth/logout", {
        method: "POST",
      });

      if (response.ok) {
        router.push("/login");
        router.refresh();
      }
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Panneau d'administration</h1>
        <button
          onClick={handleLogout}
          className="bg-red-500 hover:bg-red-600 text-white font-medium py-2 px-4 rounded"
        >
          Déconnexion
        </button>
      </div>
      <div className="mb-6">
        <Link href="/" className="text-blue-500 hover:underline">
          ← Retour à l'accueil
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="bg-white shadow rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-4">Gestion des projets</h2>
          <p className="text-gray-600 mb-4">
            Ajoutez, modifiez ou supprimez les projets du portfolio.
          </p>
          <Link
            href="/admin/projects"
            className="inline-block bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-4 rounded"
          >
            Gérer les projets
          </Link>
        </div>

        {/* Vous pouvez ajouter d'autres cartes pour différentes sections d'administration */}
      </div>
    </div>
  );
}
