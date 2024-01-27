.PHONY: build
build :
	docker-compose build

.PHONY: up
up :
	docker-compose up --force-recreate

.PHONY: down
down :
	docker-compose down

.PHONY: django
django :
	docker-compose exec django /bin/bash

.PHONY: makemigrations
makemigrations :
	docker-compose exec django ./manage.py makemigrations

.PHONY: migrate
migrate :
	docker-compose exec django ./manage.py migrate

.PHONY: sp
sp :
	docker-compose exec django ./manage.py shell_plus
