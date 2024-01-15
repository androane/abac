FROM python:3.12

ENV PYTHONUNBUFFERED 1

RUN apt-get update && apt-get install -y \
    sudo && \
    apt-get install -y \
    gcc \
    git \
    postgresql-client \
    postgresql-contrib \
    build-essential

RUN curl https://raw.githubusercontent.com/django/django/master/extras/django_bash_completion > /root/django_bash_completion
RUN echo ". /root/django_bash_completion" >> /root/.bashrc
# Bash shell for dockerfile.
SHELL ["/bin/bash", "-l", "-c"]

# Our code location
RUN mkdir -p /abac/django
WORKDIR /abac/django
COPY requirements.txt /abac/django/
RUN pip install -r requirements.txt --no-cache-dir
RUN pip cache purge
COPY . /abac/django
