import React from "react";

export const Footer: React.FC = () => {
  return (
    <footer className="bg-gray-800 mt-auto">
      <div className="container mx-auto px-4 py-6">
        <div className="text-center text-gray-400">
          <p>&copy; 2025 ft_transcendence Tous droits réservés.</p>
          <p className="text-sm mt-2">
            Développé avec React, TypeScript et Tailwind CSS
          </p>
        </div>
      </div>
    </footer>
  );
};
