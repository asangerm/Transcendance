# 🕹️ Transcendance

> Projet de développement d’un jeu multijoueur en ligne, réalisé dans le cadre de l’École 42.

## 📌 Objectif

Créer un jeu de ping-pong en ligne avec matchmaking, chat en temps réel, système de classement, gestion de comptes utilisateurs et un backend sécurisé.

## 🚀 Fonctionnalités

- 🎮 Jeu en ligne 1v1
- 🧑‍🤝‍🧑 Système de login OAuth
- 🧵 Chat global et privé
- 🏆 Classement des joueurs
- 🛡️ Sécurité JWT & 2FA
- ⚙️ CI/CD via GitHub Actions

## 🧱 Stack technique

| Frontend | Backend  | Infra/CI         |
|----------|----------|------------------|
| React    | NestJS   | Docker           |
| Tailwind | TypeORM  | GitHub Actions   |
| WebSocket| PostgreSQL |                 |

## 📂 Structure du projet

    /client      → frontend React
    /server      → backend NestJS
    /shared      → types, config communs
    /docs        → documentation technique

## 📊 Gestion des modules

    📊 [Voir le tableau Google Sheets](https://docs.google.com/spreadsheets/d/14Mzw_ATNZ2kGa5tiQ0BoNGbKqMgrd8GDxE_yPBFLGqM/edit?usp=sharing)

## 🔧 Installation (dev)

```bash
# Clone le repo
git clone https://github.com/votre-repo/transcendance.git
cd transcendence

# Lance Docker
docker compose up --build
```

### Accès :
- Frontend : http://localhost:3000  
- Backend : http://localhost:4000

## 📸 Captures d'écran

_Ajoutez ici quelques captures du jeu (login, match, scoreboard...)._

## 🙌 Contributeurs

- @pseudo1 (frontend)
- @pseudo2 (backend)
- @pseudo3 (infra/devops)
- @pseudo4 (UI/UX)
- @pseudo5 (testing)

---

## 🤝 Contribution

Voir [`CONTRIBUTING.md`](./CONTRIBUTING.md) pour les bonnes pratiques, les conventions de nommage et le workflow Git.

## 📄 Licence

Ce projet est sous licence MIT.
