NAME_IMG = frontend-app
NAME_CONTAINER = my-frontend

.PHONY: all build run stop clean fclean re

all: build run

build:
	docker build -t $(NAME_IMG) .

run:
	docker run -p 3000:3000 --name $(NAME_CONTAINER) $(NAME_IMG)

stop:
	docker stop $(NAME_CONTAINER) || true

clean:
	docker stop $(NAME_CONTAINER) || true
	docker rm $(NAME_CONTAINER) || true

fclean:
	docker stop $(NAME_CONTAINER) || true
	docker rm $(NAME_CONTAINER) || true
	docker rmi $(NAME_IMG) || true

re: fclean all 