import React from "react";
import { useNavigate } from "react-router-dom";
import type { Game } from "../../types";

interface GameCardProps {
  game: Game;
}

export const GameCard: React.FC<GameCardProps> = ({ game }) => {
  const navigate = useNavigate();

  return (
    <div className="bg-gray-800 rounded-lg shadow-lg overflow-hidden hover:transform hover:scale-105 transition-all duration-300">
      <div className="h-48 bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
        <img
          src={game.image}
          alt={game.title}
          className="h-full object-cover"
          onError={(e) => {
            (e.currentTarget as HTMLImageElement).src = "/images/default.jpg";
          }}
        />
      </div>

      <div className="p-6">
        <h3 className="text-xl font-bold mb-2">{game.title}</h3>
        <p className="text-gray-400 mb-4">{game.description}</p>

        <div className="flex justify-between items-center">
          <span className="bg-accent text-black px-3 py-1 rounded-full text-sm font-medium">
            {game.category}
          </span>

          <button
            onClick={() => navigate(`/game/${game.id}`)}
            disabled={!game.playable}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              game.playable
                ? "bg-primary hover:bg-blue-600 text-white"
                : "bg-gray-600 text-gray-400 cursor-not-allowed"
            }`}
          >
            {game.playable ? "Jouer" : "Bientôt"}
          </button>
        </div>
      </div>
    </div>
  );
};
