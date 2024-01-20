.PHONY: up
up :
	docker-compose up --force-recreate

.PHONY: down
down :
	docker-compose down

.PHONY: django
django :
	docker-compose exec django /bin/bash

.PHONY: sp
sp :
	docker-compose exec django ./manage.py shell_plus
