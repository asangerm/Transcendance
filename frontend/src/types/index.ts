export interface User {
  id: string;
  email: string;
  username: string;
  createdAt: string;
}

export interface Game {
  id: string;
  title: string;
  description: string;
  image: string;
  category: string;
  playable: boolean;
}

export interface AuthContextType {
  user: User | null;
  token: string | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<any>;
  register: (email: string, username: string, password: string) => Promise<any>;
  logout: () => void;
  updateProfile: (data: Partial<User>) => Promise<User>;
  isAuthenticated: boolean;
}

export interface GameState {
  ball: { x: number; y: number; dx: number; dy: number };
  playerPaddle: { y: number };
  aiPaddle: { y: number };
  score: { player: number; ai: number };
  gameRunning: boolean;
}
