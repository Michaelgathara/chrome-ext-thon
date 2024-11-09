build:
	docker-compose build

build-force:
	docker-compose build --no-cache

up:
	docker-compose up -d --force-recreate

down:
	docker-compose down
