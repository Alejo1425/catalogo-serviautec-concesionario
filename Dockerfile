# Multi-stage build para optimizar el tamaño de la imagen
FROM node:20-alpine AS builder

# Instalar dependencias de construcción
RUN apk add --no-cache libc6-compat

WORKDIR /app

# Copiar archivos de dependencias
COPY package*.json ./

# Instalar dependencias
RUN npm ci --legacy-peer-deps

# Copiar código fuente
COPY . .

# Argumentos para las variables de entorno (se pasan en build time)
ARG VITE_ASESOR_ID=default
ARG VITE_NOCODB_BASE_URL
ARG VITE_NOCODB_TOKEN
ARG VITE_NOCODB_BASE_ID
ARG VITE_CHATWOOT_BASE_URL
ARG VITE_CHATWOOT_API_TOKEN
ARG VITE_CHATWOOT_ACCOUNT_ID
ARG VITE_CHATWOOT_WEBSITE_TOKEN
ARG VITE_APP_ENV
ARG VITE_APP_URL
ARG VITE_DEFAULT_WHATSAPP

# Establecer variables de entorno para el build
ENV VITE_ASESOR_ID=$VITE_ASESOR_ID
ENV VITE_NOCODB_BASE_URL=$VITE_NOCODB_BASE_URL
ENV VITE_NOCODB_TOKEN=$VITE_NOCODB_TOKEN
ENV VITE_NOCODB_BASE_ID=$VITE_NOCODB_BASE_ID
ENV VITE_CHATWOOT_BASE_URL=$VITE_CHATWOOT_BASE_URL
ENV VITE_CHATWOOT_API_TOKEN=$VITE_CHATWOOT_API_TOKEN
ENV VITE_CHATWOOT_ACCOUNT_ID=$VITE_CHATWOOT_ACCOUNT_ID
ENV VITE_CHATWOOT_WEBSITE_TOKEN=$VITE_CHATWOOT_WEBSITE_TOKEN
ENV VITE_APP_ENV=$VITE_APP_ENV
ENV VITE_APP_URL=$VITE_APP_URL
ENV VITE_DEFAULT_WHATSAPP=$VITE_DEFAULT_WHATSAPP

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
