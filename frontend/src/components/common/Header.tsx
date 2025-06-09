import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

export const Header: React.FC = () => {
  const { user, logout, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <header className="bg-gray-800 shadow-lg">
      <div className="container mx-auto px-4 py-4">
        <div className="flex justify-between items-center">
          <Link
            to="/"
            className="text-2xl font-bold text-primary hover:text-blue-300 transition-colors"
          >
            ft_transcendence
          </Link>

          <nav className="hidden md:flex space-x-6">
            <Link to="/" className="hover:text-primary transition-colors">
              Accueil
            </Link>
          </nav>

          <div className="flex items-center space-x-4">
            {isAuthenticated ? (
              <>
                <span className="text-sm text-gray-300">
                  Bonjour, {user?.username}
                </span>
                <Link
                  to="/profile"
                  className="bg-primary hover:bg-blue-600 px-4 py-2 rounded-lg transition-colors"
                >
                  Profil
                </Link>
                <button
                  onClick={handleLogout}
                  className="bg-red-600 hover:bg-red-700 px-4 py-2 rounded-lg transition-colors"
                >
                  Déconnexion
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="hover:text-primary transition-colors"
                >
                  Connexion
                </Link>
                <Link
                  to="/register"
                  className="bg-primary hover:bg-blue-600 px-4 py-2 rounded-lg transition-colors"
                >
                  Inscription
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
