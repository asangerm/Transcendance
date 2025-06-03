# Commande par défaut: lance Docker Compose
all: up

up:
	docker-compose up --build

down:
	docker-compose down

restart: down up

clean: down
	docker-compose down --volumes --remove-orphans --rmi all

fclean: clean
	docker system prune -af

.PHONY: all up down restart clean fclean