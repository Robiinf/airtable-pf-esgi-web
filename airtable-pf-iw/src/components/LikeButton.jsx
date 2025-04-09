"use client";
import { useState, useEffect } from "react";
import axios from "axios";

export default function LikeButton({ projectId, initialLikes }) {
  const [liked, setLiked] = useState(false);
  const [likes, setLikes] = useState(initialLikes);

  useEffect(() => {
    const storedLikes = JSON.parse(
      localStorage.getItem("likedProjects") || "[]"
    );
    setLiked(storedLikes.includes(projectId));
  }, [projectId]);

  const handleLike = async () => {
    const storedLikes = JSON.parse(
      localStorage.getItem("likedProjects") || "[]"
    );
    const alreadyLiked = storedLikes.includes(projectId);

    try {
      const response = await axios.patch(`/api/projects/${projectId}/like`, {
        increment: !alreadyLiked,
      });

      setLikes(response.data.likes);

      const updatedLikes = alreadyLiked
        ? storedLikes.filter((id) => id !== projectId)
        : [...storedLikes, projectId];

      localStorage.setItem("likedProjects", JSON.stringify(updatedLikes));
      setLiked(!alreadyLiked);
    } catch (error) {
      console.error("Erreur lors du like :", error);
    }
  };

  return (
    <button
      onClick={handleLike}
      className={`flex items-center gap-2 px-4 py-2 rounded-lg ${
        liked ? "bg-red-100 text-red-600" : "bg-gray-100"
      }`}
    >
      <span>{liked ? "❤️" : "🤍"}</span>
      <span>{likes}</span>
    </button>
  );
}
