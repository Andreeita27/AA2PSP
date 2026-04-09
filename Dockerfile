# Usamos una imagen oficial de Node ligera
FROM node:20-alpine

# IMPORTANTE: instalamos netcat para poder esperar a la BD, lo necesita el script
RUN apk add --no-cache netcat-openbsd

# Directorio de trabajo dentro del contenedor
WORKDIR /app

# Esta variable la defino aquí para que Prisma pueda ejecutar "generate" durante la construcción de la imagen sin fallar
# No necesita conectarse realmente a la base de datos en este paso, solo necesita que la variable exista
ENV DATABASE_URL="postgresql://postgres:postgres@postgres:5432/discord_db"

# Copiamos package.json y package-lock.json
# Esto permite aprovechar la caché de Docker (no reinstala dependencias si no cambian)
COPY package*.json ./

# Instalamos dependencias
RUN npm install

# Copiamos el resto del proyecto
COPY . .

# Generamos el cliente de Prisma (importante para la bd)
RUN npx prisma generate

# Compilamos el proyecto NestJS
RUN npm run build

# Damos permisos de ejecución al entrypoint
RUN chmod +x docker-entrypoint.sh

# Exponemos el puerto de la API
EXPOSE 3000

# Comando que se ejecuta al iniciar el contenedor, es el script de arranque
CMD ["./docker-entrypoint.sh"]