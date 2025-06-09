import React, { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

export const ProfilePage: React.FC = () => {
  const { user, updateProfile } = useAuth();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: user?.username || "",
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    try {
      await updateProfile(formData);
      setSuccess("Profil mis à jour avec succès");
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleStartGame = () => {
    navigate("/game/1");
  };

  if (!user) {
    return (
      <div className="text-center">
        <h2 className="text-2xl font-bold mb-4">Profil non disponible</h2>
        <p className="text-gray-400">
          Veuillez vous connecter pour accéder à votre profil.
        </p>
      </div>
    );
  }

  const memberSinceYear = user.createdAt
    ? new Date(user.createdAt).getFullYear()
    : "N/A";

  return (
    <div className="max-w-md mx-auto bg-gray-800 rounded-lg shadow-lg">
      <div className="p-8">
        <h2 className="text-2xl font-bold text-center mb-6">
          Profil du Joueur
        </h2>

        <div className="flex flex-col items-center mb-8">
          <div className="relative w-24 h-24 rounded-full bg-gray-600 flex items-center justify-center text-5xl mb-4">
            👤
            <button className="absolute bottom-0 right-0 bg-gray-700 p-1 rounded-full border border-gray-500 hover:bg-gray-600 transition-colors text-sm">
              ✏️
            </button>
          </div>
          <h3 className="text-xl font-bold mb-1">{user?.username}</h3>
          <p className="text-gray-400 text-sm mb-4">
            Joueur depuis {memberSinceYear}
          </p>
          <div className="flex space-x-2">
            <span className="bg-blue-600 px-3 py-1 rounded-full text-sm font-medium">
              Niveau 1
            </span>
            <span className="bg-green-600 px-3 py-1 rounded-full text-sm font-medium">
              Débutant
            </span>
          </div>
        </div>

        <hr className="border-gray-700 my-6" />

        <h3 className="text-xl font-semibold mb-4 text-center">
          Statistiques de Jeu
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center mb-8">
          <div className="p-4 bg-gray-700 rounded-lg">
            <p className="text-2xl font-bold text-blue-400">0</p>
            <p className="text-sm text-gray-400">Victoires</p>
          </div>
          <div className="p-4 bg-gray-700 rounded-lg">
            <p className="text-2xl font-bold text-red-400">0</p>
            <p className="text-sm text-gray-400">Défaites</p>
          </div>
          <div className="p-4 bg-gray-700 rounded-lg">
            <p className="text-2xl font-bold text-purple-400">0%</p>
            <p className="text-sm text-gray-400">Ratio V/D</p>
          </div>
          <div className="p-4 bg-gray-700 rounded-lg">
            <p className="text-2xl font-bold text-green-400">0</p>
            <p className="text-sm text-gray-400">Parties Jouées</p>
          </div>
        </div>

        <hr className="border-gray-700 my-6" />

        <h3 className="text-xl font-semibold mb-4 text-center">
          Parties Récentes
        </h3>
        <div className="text-center text-gray-400 mb-6">
          <p>Aucune partie récente</p>
        </div>
        <button
          onClick={handleStartGame}
          className="w-full bg-primary hover:bg-blue-600 py-3 rounded-lg font-medium transition-colors"
        >
          Commencer à jouer
        </button>

        <h3 className="text-xl font-semibold mt-8 mb-4 text-center">
          Mettre à jour le Profil
        </h3>
        {success && (
          <div className="bg-green-600 text-white p-3 rounded-lg mb-4">
            {success}
          </div>
        )}
        {error && (
          <div className="bg-red-600 text-white p-3 rounded-lg mb-4">
            {error}
          </div>
        )}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label
              htmlFor="username"
              className="block text-sm font-medium mb-2"
            >
              Nom d'utilisateur
            </label>
            <input
              type="text"
              id="username"
              name="username"
              value={formData.username}
              onChange={handleChange}
              className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 focus:outline-none focus:border-primary"
              required
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-primary hover:bg-blue-600 disabled:bg-gray-600 py-2 rounded-lg font-medium transition-colors"
          >
            {loading ? "Mise à jour..." : "Mettre à jour"}
          </button>
        </form>
      </div>
    </div>
  );
};
