# Guía del Ambiente de Staging

## 🌐 URLs de los Ambientes

- **Producción:** https://autorunai.tech (rama `master`)
- **Staging/Dev:** https://dev.autorunai.tech (rama `develop`)

---

## 📋 Configuración DNS

Debes configurar el registro DNS para `dev.autorunai.tech`:

```
Tipo: A
Nombre: dev
Valor: 82.25.84.168 (IP del servidor)
TTL: 300
```

O si usas CNAME:
```
Tipo: CNAME
Nombre: dev
Valor: autorunai.tech
TTL: 300
```

---

## 🚀 Cómo Desplegar Cambios a Staging

### Método 1: Script Automático (Recomendado)

```bash
cd /root/opt/catalogo-serviautec
./deploy-staging.sh
```

Este script:
1. Cambia a la rama `develop`
2. Obtiene los últimos cambios de GitHub
3. Construye la imagen Docker
4. Despliega el contenedor

### Método 2: Manual

```bash
cd /root/opt/catalogo-serviautec

# Cambiar a develop y obtener cambios
git checkout develop
git pull origin develop

# Reconstruir y desplegar
docker compose build auteco-staging
docker compose up -d auteco-staging
```

---

## 🔄 Flujo de Trabajo Recomendado

### 1. Desarrollo Local
```bash
cd /root/opt/catalogo-serviautec
git checkout develop
git pull origin develop

# Hacer tus cambios...
git add .
git commit -m "feat: tu descripción"
git push origin develop
```

### 2. Desplegar a Staging
```bash
./deploy-staging.sh
```

### 3. Probar en Staging
- Visita: https://dev.autorunai.tech
- Prueba todas las funcionalidades
- Verifica integración con n8n, chatwoot, nocodb

### 4. Merge a Producción
Cuando el staging esté OK:
```bash
git checkout master
git merge develop
git push origin master

# Reconstruir producción
docker compose build auteco-default
docker compose up -d auteco-default
```

---

## 📊 Monitoreo

### Ver Estado de Contenedores
```bash
docker ps | grep auteco
```

### Ver Logs de Staging
```bash
docker logs auteco-staging --tail 100 -f
```

### Ver Logs de Producción
```bash
docker logs auteco-default --tail 100 -f
```

### Ver Uso de Memoria
```bash
docker stats auteco-staging auteco-default
```

---

## 🔧 Comandos Útiles

### Reiniciar Staging
```bash
cd /root/opt/catalogo-serviautec
docker compose restart auteco-staging
```

### Detener Staging
```bash
docker compose stop auteco-staging
```

### Ver Diferencias entre Staging y Producción
```bash
git diff master develop
```

### Reconstruir desde Cero
```bash
docker compose down auteco-staging
docker compose up -d --build auteco-staging
```

---

## 🐛 Troubleshooting

### El staging no está accesible
1. Verifica el DNS: `nslookup dev.autorunai.tech`
2. Verifica el contenedor: `docker ps | grep auteco-staging`
3. Verifica logs: `docker logs auteco-staging`
4. Verifica Traefik: `docker logs traefik | grep staging`

### Cambios no se reflejan
1. Asegúrate de estar en la rama develop: `git branch`
2. Reconstruye la imagen: `./deploy-staging.sh`
3. Limpia caché del navegador (Ctrl+Shift+R)

### Error al construir
1. Verifica que estés en el directorio correcto
2. Verifica que tengas los node_modules: `npm install`
3. Revisa los logs del build

---

## ⚙️ Variables de Entorno

### Staging vs Producción

| Variable | Producción | Staging |
|----------|-----------|---------|
| VITE_APP_ENV | `production` | `staging` |
| VITE_APP_URL | `https://autorunai.tech` | `https://dev.autorunai.tech` |
| Contenedor | `auteco-default` | `auteco-staging` |
| Rama Git | `master` | `develop` |

Ambos ambientes comparten:
- VITE_NOCODB_BASE_URL
- VITE_NOCODB_TOKEN
- VITE_CHATWOOT_BASE_URL
- Etc. (definidas en `.env`)

---

## 🔒 Seguridad

- Ambos ambientes están detrás de Traefik con HTTPS
- Los certificados SSL se renuevan automáticamente
- Límites de memoria configurados (128MB por contenedor)
- Monitoreo automático cada 5 minutos

---

## 📝 Scripts Disponibles

| Script | Descripción |
|--------|-------------|
| `deploy-staging.sh` | Despliega staging desde develop |
| `deploy.sh` | Despliega producción desde master |
| `/root/monitor-services.sh` | Monitorea todos los servicios |
| `/root/docker-cleanup.sh` | Limpia Docker (domingos 3AM) |

---

## 🆘 Soporte

Si tienes problemas:
1. Revisa los logs: `docker logs auteco-staging`
2. Verifica el monitoreo: `tail -f /var/log/docker-monitor.log`
3. Revisa este archivo: `/root/CONFIGURACION_SERVICIOS.md`

---

**Última actualización:** 2025-12-28
