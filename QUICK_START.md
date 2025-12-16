# ⚡ Guía Rápida - Para Comenzar

Esta es una guía rápida para que empieces a trabajar. Para detalles completos, lee [WORKFLOW.md](./WORKFLOW.md).

---

## 🎯 Flujo de Trabajo Diario

### Opción 1: Cambios Rápidos (Precios, Imágenes, etc.)

```bash
# 1. Clonar el repo (solo la primera vez)
git clone git@github.com:Alejo1425/catalogo-serviautec-concesionario.git
cd catalogo-serviautec-concesionario

# 2. Ir a develop
git checkout develop
git pull origin develop

# 3. Hacer cambios
# ... editar archivos ...

# 4. Guardar cambios
git add .
git commit -m "feat: actualizar precios 2026"
git push origin develop

# ✅ AUTOMÁTICAMENTE se despliega a staging-juan.autorunai.tech
# 👉 Prueba que todo funcione
```

### Opción 2: Aprobar y Pasar a Producción

```bash
# Cuando el jefe apruebe los cambios en staging:

git checkout master
git pull origin master
git merge develop
git push origin master

# ✅ AUTOMÁTICAMENTE se despliega a juan.autorunai.tech
```

---

## 🌐 URLs para Probar

| Sitio | URL | Qué es |
|-------|-----|--------|
| **Staging** | https://staging-juan.autorunai.tech | Para probar cambios |
| **Producción** | https://juan.autorunai.tech | Lo que ven los clientes |

---

## 📝 Mensajes de Commit Profesionales

```bash
# Buenas prácticas:
git commit -m "feat: agregar moto Apache 310"       # Nueva funcionalidad
git commit -m "fix: corregir precio Combat 100"     # Corrección
git commit -m "chore: optimizar imágenes"           # Tareas generales
git commit -m "docs: actualizar README"             # Documentación

# ❌ Evitar:
git commit -m "cambios"
git commit -m "fix"
git commit -m "asdf"
```

---

## 🆘 Comandos Útiles

```bash
# Ver en qué rama estás
git branch

# Cambiar de rama
git checkout develop    # Ir a staging
git checkout master     # Ir a producción

# Ver qué cambió
git status

# Traer cambios del servidor
git pull origin develop
```

---

## ⚙️ Primera Vez: Configurar GitHub Secrets

**IMPORTANTE:** Para que el deploy automático funcione, necesitas configurar los secrets en GitHub.

Sigue las instrucciones en: [GITHUB_SECRETS_SETUP.md](./GITHUB_SECRETS_SETUP.md)

---

## 🎓 Para tu CV / Entrevistas

Ahora puedes decir que trabajas con:

- ✅ **Git Flow** (ramas develop y master)
- ✅ **CI/CD** (GitHub Actions)
- ✅ **Docker** y docker-compose
- ✅ **Infraestructura multi-ambiente** (staging + production)
- ✅ **Automated deployments**
- ✅ **Reverse proxy** (Traefik con SSL)

---

## 📚 Más Información

- **[WORKFLOW.md](./WORKFLOW.md)** - Guía completa del flujo de trabajo
- **[GITHUB_SECRETS_SETUP.md](./GITHUB_SECRETS_SETUP.md)** - Configurar secrets
- **[README.md](./README.md)** - Documentación general del proyecto

---

**¡Listo para comenzar!** 🚀
