# Etapa 1: Construcción con Node
FROM node:18-alpine AS build
WORKDIR /app

# Copiar dependencias e instalar
COPY package*.json ./
RUN npm install

# Copiar el código y compilar para producción
COPY . .
RUN npm run build

# Etapa 2: Servidor web con Nginx
FROM nginx:alpine
# Copiar el build de React a la carpeta pública de Nginx
COPY --from=build /app/build /usr/share/nginx/html
# Copiar la configuración personalizada para las rutas
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]