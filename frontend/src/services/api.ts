import type { User, Game } from "../types";

class ApiService {
  private baseURL = "http://localhost:3001/api";

  // Auth endpoints
  async login(email: string, password: string) {
    if (email === "test@test.com" && password === "password") {
      return {
        user: {
          id: "1",
          email,
          username: "TestUser",
          createdAt: new Date().toISOString(),
        },
        token: "fake-jwt-token",
      };
    }
    throw new Error("Identifiants incorrects");
  }

  async register(email: string, username: string, password: string) {
    return {
      user: {
        id: "2",
        email,
        username,
        createdAt: new Date().toISOString(),
      },
      token: "fake-jwt-token",
    };
  }

  async getProfile(token: string): Promise<User> {
    return {
      id: "1",
      email: "test@test.com",
      username: "TestUser",
      createdAt: new Date().toISOString(),
    };
  }

  async updateProfile(token: string, data: Partial<User>): Promise<User> {
    return { ...data, id: "1" } as User;
  }

  // Games endpoints
  async getGames(): Promise<Game[]> {
    return [
      {
        id: "1",
        title: "Pong Classic",
        description:
          "Le jeu de ping-pong classique revisité. Affrontez l'IA dans ce jeu rétro!",
        image: "/images/pong.jpg",
        category: "Arcade",
        playable: true,
      },
      {
        id: "2",
        title: "jeux2 (Bientôt)",
        description: "miaou miaou miaou",
        image: "/images/jeux2.jpg",
        category: "Arcade",
        playable: false,
      },
    ];
  }
}

export const apiService = new ApiService();
