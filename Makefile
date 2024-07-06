

dev-pg:
	docker-compose up -d postgres
	docker-compose logs -f postgres

dev-api:
	pnpm i
	pnpm run start:dev:api

dev-app:
	pnpm i
	pnpm run start:app

docker_id ?= alialfredji

app_name ?= starterapp
version ?= latest

docker-build:
	docker build -t $(docker_id)/$(app_name):$(version) .

docker-deploy:
	docker build -t $(docker_id)/$(app_name):$(version) .
	docker push $(docker_id)/$(app_name):$(version)
