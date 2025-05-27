.PHONY: build run stop clean logs start

# Build the Docker images
build:
	docker build -t transcendance-backend ./backend
	docker build -t transcendance-frontend ./frontend

# Run the containers
run:
	docker run -d --name transcendance-backend -p 8000:8000 transcendance-backend
	docker run -d --name transcendance-frontend -p 3000:3000 transcendance-frontend

# Build and run the containers
start: build run

# Stop and remove the containers
stop:
	docker stop transcendance-backend transcendance-frontend || true
	docker rm transcendance-backend transcendance-frontend || true

# Clean up Docker images
clean: stop
	docker rmi transcendance-backend transcendance-frontend || true

# View logs
logs:
	docker logs -f transcendance-backend transcendance-frontend

# Restart the containers
restart: stop run

# Help command
help:
	@echo "Available commands:"
	@echo "  make build    - Build the Docker images"
	@echo "  make run      - Run the containers"
	@echo "  make start    - Build and run the containers"
	@echo "  make stop     - Stop and remove the containers"
	@echo "  make clean    - Remove containers and images"
	@echo "  make logs     - View container logs"
	@echo "  make restart  - Restart the containers" 