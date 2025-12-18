# 🏍️ Catálogo de Motos Auteco - Sistema Multi-Asesor

Sistema de catálogo inteligente con personalización dinámica por asesor comercial e integración con Chatwoot.

## 🌟 Características

- ✅ **Una sola instancia** - Un contenedor para todos los asesores
- ✅ **Routing dinámico** - URLs personalizadas: `autorunai.tech/juan-pablo`
- ✅ **Base de datos** - Asesores gestionados desde NocoDB (agregar/editar sin rebuild)
- ✅ **Rastreo de conversaciones** - Mensajes de interés llegan a la conversación original
- ✅ **Integración Chatwoot** - Chat en vivo con asignación automática
- ✅ **Responsive** - Optimizado para móvil y escritorio

## 🏗️ Arquitectura

```
┌─────────────────┐
│  autorunai.tech │
│  (Traefik SSL)  │
└────────┬────────┘
         │
         ├─ /juan-pablo?cid=1712  ──→  Catálogo personalizado + rastreo conversación
         ├─ /nathalia?cid=1713    ──→  Catálogo personalizado + rastreo conversación
         └─ /                     ──→  Catálogo general
                │
                ↓
         ┌─────────────┐
         │   Docker    │
         │  (Nginx)    │
         └──────┬──────┘
                │
                ↓
         ┌─────────────┐         ┌──────────────┐
         │   NocoDB    │←────────│   Asesores   │
         │  (Datos)    │         │  (Tabla DB)  │
         └─────────────┘         └──────────────┘
                │
                ↓
         ┌─────────────┐
         │  Chatwoot   │
         │   (Chat)    │
         └─────────────┘
```

## 🚀 Inicio Rápido

### 1. Clonar el repositorio

```bash
cd /opt
git clone [repo-url] catalogo-serviautec
cd catalogo-serviautec
```

### 2. Configurar variables de entorno

```bash
cp .env.example .env
nano .env
```

**Variables requeridas:**

```env
# NocoDB - Base de datos de asesores
VITE_NOCODB_BASE_URL=https://nocodb.autorunai.tech
VITE_NOCODB_TOKEN=tu_token_aqui
VITE_NOCODB_BASE_ID=tu_base_id

# Chatwoot - Chat en vivo
VITE_CHATWOOT_BASE_URL=https://chatwoot.autorunai.tech
VITE_CHATWOOT_API_TOKEN=tu_api_token
VITE_CHATWOOT_ACCOUNT_ID=1
VITE_CHATWOOT_WEBSITE_TOKEN=tu_website_token

# Aplicación
VITE_APP_ENV=production
VITE_APP_URL=https://autorunai.tech
```

### 3. Build y Deploy

```bash
# Build de la imagen
docker-compose build

# Iniciar contenedor
docker-compose up -d

# Ver logs
docker-compose logs -f
```

### 4. Verificar

```bash
curl https://autorunai.tech
```

## 👤 Gestión de Asesores

### Agregar un Nuevo Asesor

Los asesores se gestionan desde **NocoDB** - no requiere rebuild ni restart de Docker.

1. Accede a NocoDB: `https://nocodb.autorunai.tech`
2. Abre la tabla de **Asesores**
3. Agrega nuevo registro:

| Campo | Valor | Ejemplo |
|-------|-------|---------|
| `Aseror` | Nombre completo | "Juan Pablo Pérez" |
| `Phone` | Teléfono WhatsApp (sin +57) | "3114319886" |
| `Slug` | URL slug (único, lowercase, sin espacios) | "juan-pablo" |
| `Id` | ID numérico único | `4` |

4. Guardar - **Listo** ✅ (sin restart necesario)

### URLs de Asesores

Una vez agregados en NocoDB, cada asesor tiene su URL personalizada:

- **Juan Pablo**: `https://autorunai.tech/juan-pablo`
- **Nathalia**: `https://autorunai.tech/nathalia`
- **Carlos**: `https://autorunai.tech/carlos`

## 💬 Flujo de Conversación con Rastreo

### Problema Resuelto

Cuando un asesor enviaba el catálogo, los clientes al hacer clic en "Me interesa" creaban **nuevas conversaciones** en lugar de continuar en la conversación original.

### Solución Implementada

1. **Asesor** inicia conversación con cliente → Conversación #1712
2. **Asesor** envía enlace con canned response `/catalogo`:
   ```
   📋 ¡Mira nuestro catálogo aquí!
   👉 https://autorunai.tech/juan-pablo?cid=1712
   ```
3. **Cliente** hace clic en enlace con `?cid=1712`
4. **Cliente** navega catálogo y hace clic en "Me interesa"
5. **Sistema** envía mensaje directamente a conversación #1712 via API ✅

### Configurar Canned Response en Chatwoot

La respuesta rápida YA está creada en Chatwoot con el shortcode `/catalogo`.

Para usarla:
1. Asesor está en conversación con cliente
2. Escribe `/catalogo` en el chat
3. Chatwoot autocompleta con el enlace incluyendo el conversation ID
4. Cliente recibe enlace con rastreo automático

**Formato del Canned Response:**
```
📋 ¡Mira nuestro catálogo actualizado aquí!

👉 https://autorunai.tech/juan-pablo?cid={{conversation.id}}

Explora todas nuestras motos disponibles y déjame saber si te interesa alguna. ¡Tu mensaje llegará directo a este chat! 🏍️
```

> **Nota:** El `{{conversation.id}}` es reemplazado automáticamente por Chatwoot con el ID real de la conversación.

## 🔧 Comandos Útiles

### Docker

```bash
# Ver estado del contenedor
docker ps -a | grep auteco

# Ver logs en tiempo real
docker-compose logs -f

# Restart del contenedor
docker-compose restart

# Rebuild completo (solo si cambias código)
docker-compose up -d --build

# Detener contenedor
docker-compose down

# Ver uso de recursos
docker stats auteco-default
```

### Build Local (desarrollo)

```bash
# Instalar dependencias
npm install

# Desarrollo local
npm run dev

# Build de producción
npm run build

# Preview del build
npm run preview
```

## 📂 Estructura del Proyecto

```
catalogo-serviautec/
├── src/
│   ├── components/          # Componentes React
│   │   ├── MotoCard.tsx     # Card de moto individual
│   │   ├── Header.tsx       # Header con info del asesor
│   │   └── Footer.tsx       # Footer
│   ├── pages/               # Páginas
│   │   ├── Catalogo.tsx     # Página principal
│   │   └── MotoDetail.tsx   # Detalle de moto
│   ├── contexts/            # React contexts
│   │   └── AsesorContext.tsx # Contexto del asesor actual
│   ├── hooks/               # Custom hooks
│   │   ├── useChatwoot.ts   # Hook de Chatwoot
│   │   └── useConversationId.ts # Hook para rastreo de conversación
│   ├── services/            # Servicios
│   │   ├── asesores.service.ts # Servicio de asesores (NocoDB)
│   │   └── chatwoot-api.service.ts # API de Chatwoot
│   ├── utils/               # Utilidades
│   │   └── chatwoot.ts      # Funciones de Chatwoot
│   └── data/                # Datos estáticos
│       └── motos.ts         # Catálogo de motos
├── Dockerfile               # Configuración Docker
├── docker-compose.yml       # Orquestación Docker
├── nginx.conf               # Configuración Nginx
└── .env                     # Variables de entorno
```

## 🌐 Configuración de Traefik (Servidor)

El proyecto usa **Traefik** como reverse proxy con SSL automático.

### docker-compose.yml (ya configurado)

```yaml
services:
  auteco-default:
    build:
      context: .
      dockerfile: Dockerfile
    container_name: auteco-default
    restart: unless-stopped
    networks:
      - traefik_proxy
    labels:
      - "traefik.enable=true"
      - "traefik.docker.network=traefik_proxy"
      - "traefik.http.routers.auteco-default.rule=Host(`autorunai.tech`) || Host(`www.autorunai.tech`)"
      - "traefik.http.routers.auteco-default.entrypoints=websecure"
      - "traefik.http.routers.auteco-default.tls=true"
      - "traefik.http.routers.auteco-default.tls.certresolver=mytlschallenge"
      - "traefik.http.services.auteco-default.loadbalancer.server.port=80"

networks:
  traefik_proxy:
    external: true
```

### Verificar SSL

```bash
curl -I https://autorunai.tech
# HTTP/2 200
# certificate: valid
```

## 🧪 Testing

### Test del flujo completo

1. **Test sin conversation ID** (catálogo general):
   ```bash
   curl https://autorunai.tech
   ```
   - Debe mostrar catálogo general
   - Botón: "Me interesa esta moto"

2. **Test con asesor** (catálogo personalizado):
   ```bash
   curl https://autorunai.tech/juan-pablo
   ```
   - Debe mostrar "Catálogo de Juan Pablo"
   - Botón: "Me interesa - Hablar con Juan Pablo"

3. **Test con conversation ID** (rastreo):
   ```bash
   curl https://autorunai.tech/juan-pablo?cid=1712
   ```
   - Debe detectar conversationId en localStorage
   - Botón: "Me interesa - Continuar con el proceso"
   - Al hacer clic: mensaje va a conversación #1712

## 🐛 Troubleshooting

### El catálogo no carga

```bash
# Verificar que el contenedor esté corriendo
docker ps | grep auteco

# Ver logs para errores
docker logs auteco-default

# Verificar conectividad de red
docker exec auteco-default wget -q -O- http://localhost
```

### Asesores no aparecen

```bash
# Test de conexión a NocoDB
curl -H "xc-token: TU_TOKEN" \
  https://nocodb.autorunai.tech/api/v2/tables/TU_TABLE_ID/records

# Verificar variables de entorno en el contenedor
docker exec auteco-default env | grep VITE_NOCODB
```

### Chatwoot no se carga

```bash
# Verificar que el widget token sea correcto
docker exec auteco-default env | grep VITE_CHATWOOT_WEBSITE_TOKEN

# Test de carga del script
curl https://chatwoot.autorunai.tech/packs/js/sdk.js
```

### Mensajes no llegan a la conversación original

1. Verificar que el enlace tenga el parámetro `cid`:
   ```
   https://autorunai.tech/juan-pablo?cid=1712
   ```

2. Abrir DevTools → Console y buscar:
   ```
   📌 Conversación detectada desde URL: 1712
   ```

3. Si no aparece, verificar que el Canned Response esté usando `{{conversation.id}}`

## 📊 Monitoreo

### Logs en producción

```bash
# Seguir logs en tiempo real
docker-compose logs -f --tail=100

# Filtrar errores
docker-compose logs | grep -i error

# Logs de una fecha específica
docker-compose logs --since="2025-12-18T10:00:00"
```

### Métricas del contenedor

```bash
# CPU y memoria
docker stats auteco-default

# Espacio en disco
docker system df

# Salud del contenedor
docker inspect --format='{{.State.Health.Status}}' auteco-default
```

## 🔐 Seguridad

- ✅ HTTPS obligatorio via Traefik
- ✅ Tokens en variables de entorno (no en código)
- ✅ Healthcheck del contenedor
- ✅ Restart automático en caso de fallo
- ⚠️ **Importante**: Nunca commitear `.env` al repositorio

## 🚀 Actualizaciones

### Deploy de nuevos cambios

```bash
# 1. Pull cambios del repositorio
cd /opt/catalogo-serviautec
git pull

# 2. Rebuild de la imagen
docker-compose build

# 3. Restart con nueva imagen
docker-compose up -d

# 4. Verificar
docker-compose logs -f
```

### Actualizar datos de motos

Editar `src/data/motos.ts` y seguir los pasos de arriba.

### Agregar/editar asesores

No requiere deploy - editar directamente en NocoDB.

## 📞 Soporte

Para problemas o preguntas:
- Revisar logs: `docker-compose logs -f`
- Verificar variables de entorno en `.env`
- Consultar la sección de Troubleshooting

## 📝 Licencia

Proyecto privado - Auteco Colombia
