docker-compose down;
docker-compose up -d postgres;
docker-compose exec postgres psql postgres://postgres:postgres@postgres:5432/postgres -c 'DROP DATABASE IF EXISTS "templra_db";';
docker-compose exec postgres psql postgres://postgres:postgres@postgres:5432/postgres -c 'CREATE DATABASE "templra_db";';
docker-compose up -d;

