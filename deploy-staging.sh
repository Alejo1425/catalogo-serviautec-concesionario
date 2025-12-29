#!/bin/bash

# Script para desplegar cambios de la rama develop al ambiente de staging
# Uso: ./deploy-staging.sh

set -e

echo "🚀 Iniciando deployment de staging..."

# Verificar que estamos en el directorio correcto
cd /root/opt/catalogo-serviautec

# Obtener cambios de la rama develop
echo "📥 Obteniendo cambios de la rama develop..."
git fetch origin
git checkout develop
git pull origin develop

# Construir la imagen del contenedor
echo "🔨 Construyendo imagen de Docker..."
docker compose build auteco-staging

# Detener el contenedor anterior
echo "⏹️  Deteniendo contenedor anterior..."
docker compose stop auteco-staging 2>/dev/null || true
docker compose rm -f auteco-staging 2>/dev/null || true

# Iniciar el nuevo contenedor
echo "▶️  Iniciando nuevo contenedor staging..."
docker compose up -d auteco-staging

# Esperar a que el contenedor esté saludable
echo "⏳ Esperando a que el contenedor esté listo..."
sleep 5

# Verificar que el contenedor está corriendo
if docker ps | grep -q "auteco-staging"; then
    echo "✅ Deployment de staging completado exitosamente!"
    echo "🌐 Staging disponible en: https://dev.autorunai.tech"
    docker logs auteco-staging --tail 20
else
    echo "❌ Error: El contenedor staging no está corriendo"
    docker logs auteco-staging --tail 50
    exit 1
fi
