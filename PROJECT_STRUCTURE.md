# 📂 Structure du projet Transcendance

Voici une proposition d'organisation des dossiers et fichiers pour un projet 42 complet avec frontend, backend et dossiers partagés.

```
transcendance/
├── client/                   # Frontend React
│   ├── public/              # Fichiers statiques
│   ├── src/
│   │   ├── assets/          # Images, icônes, etc.
│   │   ├── components/      # Composants réutilisables
│   │   ├── pages/           # Pages principales
│   │   ├── hooks/           # Hooks custom
│   │   ├── services/        # Requêtes API
│   │   ├── types/           # Types spécifiques au frontend
│   │   └── App.tsx
│   └── tailwind.config.js
│
├── server/                  # Backend NestJS
│   ├── src/
│   │   ├── auth/            # Authentification + 2FA
│   │   ├── user/            # Gestion des utilisateurs
│   │   ├── game/            # Logique du jeu
│   │   ├── chat/            # WebSocket/chat
│   │   ├── ranking/         # Classement, scores
│   │   ├── database/        # Connexion, migrations
│   │   └── main.ts
│   └── test/                # Fichiers de test unitaires
│
├── shared/                  # Types et constantes partagés
│   ├── constants.ts
│   ├── types.ts
│   └── config.ts
│
├── docs/                    # Documentation technique
│   ├── architecture.md
│   ├── api.md
│   └── README.md
│
├── docker-compose.yml       # Stack complète (Postgres, client, server)
├── README.md
├── CONTRIBUTING.md
├── LICENSE
└── CODE_OF_CONDUCT.md
```
