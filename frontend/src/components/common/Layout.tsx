import React from "react";
import { Header } from "./Header";
import { Footer } from "./Footer";
import { Outlet } from "react-router-dom";

interface LayoutProps {
  // children: ReactNode; // 'children' n'est plus directement passé
}

export const Layout: React.FC<LayoutProps> = () => {
  return (
    <div className="min-h-screen flex flex-col bg-gray-900 text-white">
      <Header />
      <main className="flex-1 container mx-auto px-4 py-8">
        <Outlet /> {/* Les routes enfants seront rendues ici */}
      </main>
      <Footer />
    </div>
  );
};
