import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { PongGame } from "../components/games/pong/PongGame";
import { apiService } from "../services/api";
import type { Game } from "../types";

export const GamePage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [game, setGame] = useState<Game | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadGame = async () => {
      try {
        const games = await apiService.getGames();
        const foundGame = games.find((g) => g.id === id);
        setGame(foundGame || null);
      } catch (error) {
        console.error("Erreur lors du chargement du jeu:", error);
      } finally {
        setLoading(false);
      }
    };
    loadGame();
  }, [id]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!game) {
    return (
      <div className="text-center">
        <h2 className="text-2xl font-bold mb-4">Jeu non trouvé</h2>
        <p className="text-gray-400 mb-4">
          Le jeu demandé n'existe pas ou n'est plus disponible.
        </p>
        <Link
          to="/"
          className="bg-primary hover:bg-blue-600 px-6 py-3 rounded-lg font-medium transition-colors inline-block"
        >
          Retour à l'accueil
        </Link>
      </div>
    );
  }

  if (!game.playable) {
    return (
      <div className="text-center">
        <div className="mb-8">
          <div className="w-32 h-32 bg-gradient-to-br from-primary to-secondary rounded-full flex items-center justify-center mx-auto mb-6">
            <span className="text-4xl">🎮</span>
          </div>
          <h1 className="text-3xl font-bold mb-2">{game.title}</h1>
          <p className="text-gray-400 mb-4">{game.description}</p>
          <span className="bg-accent text-black px-4 py-2 rounded-full text-sm font-medium">
            {game.category}
          </span>
        </div>

        <div className="bg-gray-800 rounded-lg p-8 max-w-md mx-auto">
          <h3 className="text-xl font-bold mb-4">🚧 En développement</h3>
          <p className="text-gray-400 mb-6">
            Ce jeu n'est pas encore disponible. Nous travaillons dur pour le
            rendre jouable bientôt !
          </p>
          <Link
            to="/"
            className="bg-primary hover:bg-blue-600 px-6 py-3 rounded-lg font-medium transition-colors inline-block"
          >
            Découvrir d'autres jeux
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold mb-2">{game.title}</h1>
        <p className="text-gray-400 mb-4">{game.description}</p>
        <span className="bg-accent text-black px-4 py-2 rounded-full text-sm font-medium">
          {game.category}
        </span>
      </div>

      {/* Instructions */}
      <div className="bg-gray-800 rounded-lg p-6 mb-8 max-w-2xl mx-auto">
        <h3 className="text-lg font-semibold mb-3">📋 Instructions</h3>
        <ul className="text-gray-300 space-y-2">
          <li>• Déplacez votre souris pour contrôler la raquette bleue</li>
          <li>• Empêchez la balle de passer de votre côté</li>
          <li>
            • Marquez des points en faisant passer la balle du côté adverse
          </li>
          <li>• L'IA (raquette rouge) s'adapte à votre niveau</li>
        </ul>
      </div>

      {/* Rendu du jeu selon l'ID */}
      {game.id === "1" && <PongGame />}

      {/* Bouton retour */}
      <div className="text-center mt-8">
        <Link
          to="/"
          className="bg-gray-600 hover:bg-gray-700 px-6 py-3 rounded-lg font-medium transition-colors"
        >
          ← Retour aux jeux
        </Link>
      </div>
    </div>
  );
};
