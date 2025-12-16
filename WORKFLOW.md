# 🚀 Flujo de Trabajo Profesional - Catálogo Serviautec

Este documento describe el flujo de trabajo Git y CI/CD implementado para el proyecto.

## 📋 Tabla de Contenidos

- [Estrategia de Branches](#estrategia-de-branches)
- [Entornos](#entornos)
- [Flujo de Trabajo](#flujo-de-trabajo)
- [GitHub Actions](#github-actions)
- [Comandos Útiles](#comandos-útiles)

---

## 🌿 Estrategia de Branches

Este proyecto utiliza una estrategia de **Git Flow simplificada**:

### Ramas Principales

1. **`master`** (Producción)
   - Código en producción
   - Solo se actualiza mediante Pull Requests aprobados
   - Protegida contra commits directos
   - Deploy automático a: `juan.autorunai.tech` y `autorunai.tech`

2. **`develop`** (Staging/Desarrollo)
   - Código en desarrollo y pruebas
   - Se puede hacer commit directo (para agilidad)
   - Deploy automático a: `staging-juan.autorunai.tech` y `staging.autorunai.tech`

### Ramas de Trabajo (Opcional)

3. **`feature/nombre-feature`**
   - Para desarrollar nuevas funcionalidades
   - Se fusionan a `develop` cuando están listas
   - Ejemplo: `feature/nuevos-precios-2026`

---

## 🌐 Entornos

| Entorno | Rama | URLs | Propósito |
|---------|------|------|-----------|
| **Producción** | `master` | • juan.autorunai.tech<br>• autorunai.tech | Clientes reales |
| **Staging** | `develop` | • staging-juan.autorunai.tech<br>• staging.autorunai.tech | Pruebas y aprobación |

---

## 🔄 Flujo de Trabajo

### Escenario 1: Cambios Rápidos (Actualizar precios, imágenes, etc.)

```bash
# 1. Asegurarte de estar en develop
git checkout develop
git pull origin develop

# 2. Hacer tus cambios
# ... editar archivos ...

# 3. Commit y push
git add .
git commit -m "feat: actualizar precios 2026"
git push origin develop

# ✅ Se despliega automáticamente a staging
# 👉 Prueba en: staging-juan.autorunai.tech
```

**Cuando el dueño apruebe:**

```bash
# 4. Fusionar a producción
git checkout master
git pull origin master
git merge develop
git push origin master

# ✅ Se despliega automáticamente a producción
# 👉 Visible en: juan.autorunai.tech
```

### Escenario 2: Usando Pull Requests (RECOMENDADO para cambios importantes)

```bash
# 1. Trabajar en develop
git checkout develop
git pull origin develop

# 2. Hacer cambios y push
git add .
git commit -m "feat: agregar nueva moto Apache 310"
git push origin develop

# ✅ Automáticamente desplegado a staging
```

**3. Crear Pull Request en GitHub:**
- Ve a: https://github.com/Alejo1425/catalogo-serviautec-concesionario
- Click en "Pull Requests" → "New Pull Request"
- Base: `master` ← Compare: `develop`
- Agrega descripción de los cambios
- Asigna al dueño para revisión

**4. Cuando se apruebe el PR:**
- Se fusiona automáticamente a `master`
- ✅ Se despliega automáticamente a producción

---

## ⚙️ GitHub Actions

### Workflows Configurados

#### 1. Deploy to Staging (`deploy-staging.yml`)

**Se activa cuando:** Haces `push` a la rama `develop`

**Qué hace:**
1. Conecta al servidor vía SSH
2. Hace `git pull origin develop`
3. Reconstruye las imágenes Docker de staging
4. Reinicia los contenedores de staging
5. Limpia imágenes viejas

#### 2. Deploy to Production (`deploy-production.yml`)

**Se activa cuando:**
- Haces `push` a la rama `master`
- Se fusiona un Pull Request a `master`

**Qué hace:**
1. Conecta al servidor vía SSH
2. Hace `git pull origin master`
3. Reconstruye las imágenes Docker de producción
4. Reinicia los contenedores de producción
5. Limpia imágenes viejas

### Configuración de Secrets

Los workflows necesitan estos secrets en GitHub:

| Secret | Descripción |
|--------|-------------|
| `SERVER_HOST` | IP o dominio del servidor |
| `SERVER_USER` | Usuario SSH (ej: root) |
| `SERVER_SSH_KEY` | Clave privada SSH para conectar |

**Configurar secrets:**
1. Ve a: Settings → Secrets and variables → Actions
2. Click "New repository secret"
3. Agrega cada secret

---

## 💻 Comandos Útiles

### Ver en qué rama estás
```bash
git branch
```

### Cambiar de rama
```bash
git checkout develop   # Ir a staging
git checkout master    # Ir a producción
```

### Ver estado de cambios
```bash
git status
```

### Ver historial de commits
```bash
git log --oneline --graph --decorate --all
```

### Ver diferencias antes de commit
```bash
git diff
```

### Deshacer cambios locales (antes de commit)
```bash
git restore archivo.ts     # Deshacer cambios en un archivo
git restore .              # Deshacer todos los cambios
```

### Actualizar tu rama local
```bash
git pull origin develop    # Traer cambios de develop
git pull origin master     # Traer cambios de master
```

### Ver ramas remotas
```bash
git branch -a
```

---

## 🎯 Mejores Prácticas

### ✅ DO (Hacer)

1. **Siempre probar en staging primero**
   - Haz push a `develop`
   - Prueba en `staging-juan.autorunai.tech`
   - Cuando funcione, fusiona a `master`

2. **Escribir buenos mensajes de commit**
   ```bash
   # ✅ Bueno
   git commit -m "feat: agregar moto Combat 100"
   git commit -m "fix: corregir precio de Apache 160"
   git commit -m "chore: actualizar imágenes optimizadas"

   # ❌ Malo
   git commit -m "cambios"
   git commit -m "fix"
   ```

3. **Hacer commits pequeños y frecuentes**
   - Mejor 5 commits pequeños que 1 gigante

4. **Hacer pull antes de push**
   ```bash
   git pull origin develop
   git push origin develop
   ```

### ❌ DON'T (No hacer)

1. **No hagas commit directo a master** (excepto emergencias)
2. **No hagas force push** (`git push -f`) sin saber qué haces
3. **No subas archivos sensibles** (.env, claves, contraseñas)

---

## 🆘 Solución de Problemas

### "Your branch is behind"
```bash
git pull origin develop
```

### "Merge conflict"
```bash
# 1. Edita los archivos en conflicto
# 2. Busca los marcadores: <<<<<<< ======= >>>>>>>
# 3. Resuelve manualmente
# 4. Luego:
git add .
git commit -m "fix: resolver conflictos de merge"
```

### Cancelar un commit (antes de push)
```bash
git reset --soft HEAD~1   # Mantiene los cambios
git reset --hard HEAD~1   # ELIMINA los cambios
```

---

## 📚 Recursos de Aprendizaje

- [Git Cheat Sheet](https://education.github.com/git-cheat-sheet-education.pdf)
- [GitHub Flow](https://guides.github.com/introduction/flow/)
- [Conventional Commits](https://www.conventionalcommits.org/)

---

## 🎓 Para Entrevistas de Trabajo

Puedes mencionar que has trabajado con:

- ✅ **Git Flow** con ramas develop y master
- ✅ **CI/CD** con GitHub Actions
- ✅ **Docker** y docker-compose para deployment
- ✅ **Infraestructura multi-ambiente** (staging + production)
- ✅ **Pull Requests** para code review
- ✅ **Automated deployments** mediante SSH
- ✅ **Traefik** como reverse proxy con SSL automático

---

**¿Preguntas?** Revisa este documento o consulta con el equipo.

**Última actualización:** Diciembre 2025
