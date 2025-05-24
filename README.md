# ft_transcendence

A real-time multiplayer Pong game web application.

## Prerequisites

- Docker
- Docker Compose

## Getting Started

1. Clone the repository:
```bash
git clone <repository-url>
cd ft_transcendence
```

2. Start the development environment:
```bash
docker-compose up --build
```

This will start:
- Frontend at http://localhost:3000
- Backend at http://localhost:8000
- SQLite database stored in a persistent volume

## Project Structure

```
ft_transcendence/
├── frontend/           # React + TypeScript + Tailwind CSS frontend
├── backend/           # Fastify backend
├── docker-compose.yml # Docker compose configuration
└── README.md         # This file
```

## Development

- The frontend and backend directories are mounted as volumes, so any changes will trigger hot-reload
- The SQLite database file is persisted in a Docker volume

## Security Features

- HTTPS enabled for all connections
- Password hashing
- SQL injection protection
- XSS attack protection
- Form validation
- Protected API routes

## Technologies

- Frontend: TypeScript, React, Tailwind CSS
- Backend: Node.js, Fastify
- Database: SQLite
- Container: Docker 