# Multi-stage build para optimizar el tamaño de la imagen
FROM node:20-alpine AS builder

# Instalar dependencias de construcción
RUN apk add --no-cache libc6-compat

WORKDIR /app

# Copiar archivos de dependencias
COPY package*.json ./
COPY bun.lockb ./

# Instalar dependencias
RUN npm ci --legacy-peer-deps

# Copiar código fuente
COPY . .

# Argumento para el ID del asesor (se puede pasar en build time)
ARG VITE_ASESOR_ID=default

# Establecer variable de entorno para el build
ENV VITE_ASESOR_ID=$VITE_ASESOR_ID

# Construir la aplicación
RUN npm run build

# Etapa de producción con Nginx
FROM nginx:alpine

# Copiar archivos compilados
COPY --from=builder /app/dist /usr/share/nginx/html

# Copiar configuración de Nginx
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Exponer puerto 80
EXPOSE 80

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
    CMD wget --quiet --tries=1 --spider http://127.0.0.1:80/ || exit 1

CMD ["nginx", "-g", "daemon off;"]
