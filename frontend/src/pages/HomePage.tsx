import React, { useState, useEffect } from "react";
import { GameCard } from "../components/games/GameCard";
import { apiService } from "../services/api";
import type { Game } from "../types";

export const HomePage: React.FC = () => {
  const [games, setGames] = useState<Game[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadGames = async () => {
      try {
        const gamesData = await apiService.getGames();
        setGames(gamesData);
      } catch (error) {
        console.error("Erreur lors du chargement des jeux:", error);
      } finally {
        setLoading(false);
      }
    };
    loadGames();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div>
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-4">
          Bienvenue sur Gaming Platform
        </h1>
        <p className="text-xl text-gray-400">
          Découvrez nos jeux classiques revisités
        </p>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
        {games.map((game) => (
          <GameCard key={game.id} game={game} />
        ))}
      </div>
    </div>
  );
};
