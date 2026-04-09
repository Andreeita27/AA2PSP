#!/bin/sh

# Espera a que PostgreSQL esté disponible
echo "Esperando a la base de datos..."

# nc = netcat → comprueba si el puerto está abierto
while ! nc -z postgres 5432; do
  sleep 1
done

echo "Base de datos lista"

# Ejecutamos migraciones de Prisma en producción
npx prisma migrate deploy

# Arrancamos la aplicación
npm run start:dev

# Como Docker arranca todo a la vez, Nest puede intentar conectarse a antes de que la bd esté lista
# En este script espera al puerto 5432