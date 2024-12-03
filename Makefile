build:
	docker-compose build

build-force:
	docker-compose build --no-cache

pull:
	docker pull jpyles0524/gemini-rec-search-api:042bd339f3afb70e7cc39e1e9910a81a215db2f4

up:
	docker-compose up -d --force-recreate

down:
	docker-compose down

build-ext:
	npm run build