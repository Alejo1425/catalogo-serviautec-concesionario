# 🏍️ Auteco Bike Buddy - Catálogo Multi-tenant

Sistema de catálogo de motos Auteco con soporte multi-tenant para múltiples asesores. Cada asesor tiene su propio subdominio personalizado.

## 🚀 Características

- ✅ **Multi-tenant** - Un código, múltiples asesores
- ✅ **Subdominios personalizados** - Cada asesor tiene su URL única
- ✅ **Docker + Traefik** - Despliegue profesional con HTTPS automático
- ✅ **CI/CD con GitHub Actions** - Deploy automático a staging y producción
- ✅ **Git Flow** - Workflow profesional con ramas develop y master
- ✅ **Entornos separados** - Staging para pruebas, Production para clientes
- ✅ **React + TypeScript + Vite** - Stack moderno y rápido
- ✅ **TailwindCSS + shadcn/ui** - UI componentes profesionales
- ✅ **Fácil de escalar** - Agregar nuevos asesores en minutos

## 🌐 Entornos

| Entorno | Rama Git | URLs |
|---------|----------|------|
| **Producción** | `master` | [juan.autorunai.tech](https://juan.autorunai.tech)<br>[autorunai.tech](https://autorunai.tech) |
| **Staging** | `develop` | [staging-juan.autorunai.tech](https://staging-juan.autorunai.tech)<br>[staging.autorunai.tech](https://staging.autorunai.tech) |

## 📚 Documentación

- **[WORKFLOW.md](./WORKFLOW.md)** - Guía completa del flujo de trabajo Git y CI/CD
- **[GITHUB_SECRETS_SETUP.md](./GITHUB_SECRETS_SETUP.md)** - Cómo configurar los secrets de GitHub
- **[DEPLOYMENT.md](./DEPLOYMENT.md)** - Instrucciones de despliegue manual

## 📋 Requisitos

- Node.js 20+
- Docker y Docker Compose
- Servidor con Traefik configurado
- DNS configurado para subdominios

## 🛠️ Instalación Local

```bash
# Clonar repositorio
git clone https://github.com/TU_USUARIO/catalogo-serviautec-concesionario.git
cd catalogo-serviautec-concesionario

# Instalar dependencias
npm install

# Copiar variables de entorno
cp .env.example .env

# Ejecutar en desarrollo
npm run dev
```

## 🐳 Despliegue con Docker

### Opción 1: Despliegue Automático

```bash
# Hacer ejecutable el script
chmod +x deploy.sh

# Editar servidor en deploy.sh si es necesario
# Luego ejecutar
./deploy.sh
```

### Opción 2: Despliegue Manual

```bash
# En tu servidor (xx.xx.xx.xxx)
git clone https://github.com/TU_USUARIO/auteco-bike-buddy.git
cd auteco-bike-buddy

# Asegurar que la red de Traefik existe
docker network create traefik_proxy

# Construir y levantar contenedores
docker-compose build
docker-compose up -d

# Ver logs
docker-compose logs -f
```

## 👥 Agregar un Nuevo Asesor

### Método 1: Script Automático (Recomendado)

```bash
chmod +x add-asesor.sh
./add-asesor.sh pedro "Pedro Ramírez" pedro@tuUrl.com "+57 300 345 6789" "573003456789"
```

### Método 2: Manual

1. **Editar [src/config/asesor.ts](src/config/asesor.ts)**:

```typescript
pedro: {
  id: 'pedro',
  nombre: 'Pedro Ramírez',
  email: 'pedro@tuUrl.com',
  telefono: '+57 300 345 6789',
  whatsapp: '573003456789',
  urlSubdominio: 'pedro.tuUrl.com',
  colorPrimario: '#1a56db',
  colorSecundario: '#0e7490',
},
```

2. **Editar [docker-compose.yml](docker-compose.yml)**:

```yaml
auteco-pedro:
  build:
    context: .
    dockerfile: Dockerfile
    args:
      VITE_ASESOR_ID: pedro
  container_name: auteco-pedro
  restart: unless-stopped
  networks:
    - traefik_proxy
  labels:
    - "traefik.enable=true"
    - "traefik.http.routers.auteco-pedro.rule=Host(`pedro.tuUrl.com`)"
    - "traefik.http.routers.auteco-pedro.entrypoints=websecure"
    - "traefik.http.routers.auteco-pedro.tls=true"
    - "traefik.http.routers.auteco-pedro.tls.certresolver=letsencrypt"
    - "traefik.http.services.auteco-pedro.loadbalancer.server.port=80"
```

3. **Configurar DNS**:
   - Crear registro A: `pedro.tuUrl.com` → `xx.xx.xx.xxx`

4. **Desplegar**:

```bash
./deploy.sh
```

## 🌐 URLs Disponibles

- **Juan**: https://juan.tuUrl.com
- **María**: https://maria.tuUrl.com
- **Default**: https://tuUrl.com

## 📁 Estructura del Proyecto

```
auteco-bike-buddy/
├── src/
│   ├── config/
│   │   └── asesor.ts          # Configuración multi-tenant
│   ├── components/             # Componentes React
│   ├── pages/                  # Páginas de la aplicación
│   └── data/                   # Datos de motos
├── Dockerfile                  # Imagen Docker optimizada
├── docker-compose.yml          # Configuración Traefik
├── deploy.sh                   # Script de despliegue
├── add-asesor.sh              # Script para agregar asesores
└── README.md                   # Esta documentación
```

## 🔧 Configuración de Traefik

El proyecto está configurado para funcionar con Traefik. Asegúrate de que tu servidor tenga:

```yaml
# Configuración mínima de Traefik
networks:
  traefik_proxy:
    external: true

# Entrypoints
entrypoints:
  web:
    address: ":80"
  websecure:
    address: ":443"

# Certificate resolver
certificatesResolvers:
  letsencrypt:
    acme:
      email: tu@email.com
      storage: /letsencrypt/acme.json
      httpChallenge:
        entryPoint: web
```

## 🚨 Comandos Útiles

```bash
# Ver logs de todos los contenedores
docker-compose logs -f

# Ver logs de un asesor específico
docker-compose logs -f auteco-juan

# Reiniciar todos los servicios
docker-compose restart

# Reiniciar un servicio específico
docker-compose restart auteco-juan

# Detener todo
docker-compose down

# Reconstruir y reiniciar
docker-compose down && docker-compose build && docker-compose up -d

# Ver estado de contenedores
docker-compose ps

# Acceder al shell de un contenedor
docker exec -it auteco-juan sh
```

## 🔒 Variables de Entorno

```bash
# .env
VITE_ASESOR_ID=juan  # ID del asesor (juan, maria, default)
```

## 🏗️ Arquitectura Multi-tenant

```
                    ┌──────────────┐
                    │   Traefik    │
                    │  (Proxy)     │
                    └──────┬───────┘
                           │
        ┌──────────────────┼──────────────────┐
        │                  │                  │
    ┌───▼────┐        ┌───▼────┐        ┌───▼────┐
    │ juan   │        │ maria  │        │default │
    │ :80    │        │ :80    │        │ :80    │
    └────────┘        └────────┘        └────────┘
    juan.auto...      maria.auto...     autorunai.tech
```

## 📝 Scripts del Proyecto

```bash
npm run dev          # Desarrollo local
npm run build        # Build producción
npm run build:dev    # Build desarrollo
npm run preview      # Preview del build
npm run lint         # Linter
```

## 🤝 Contribución

1. Fork el proyecto
2. Crea tu feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push al branch (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## 📄 Licencia

Este proyecto es privado y propiedad de Serviautec Concesionario Auteco.

## 👨‍💻 Soporte

Para problemas o preguntas:
- Email: soporte@autorunai.tech
- Issues: [GitHub Issues](https://github.com/TU_USUARIO/auteco-bike-buddy/issues)

---

Hecho para SERVIAUTEC CONCESIONARIO AUTECO
