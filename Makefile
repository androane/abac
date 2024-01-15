
.PHONY: build
build :
	docker-compose build --ssh default=${HOME}/.ssh/id_rsa

.PHONY: up
up :
	docker-compose up --force-recreate

.PHONY: down
down :
	docker-compose down

.PHONY: django
django :
	docker-compose exec django /bin/bash

