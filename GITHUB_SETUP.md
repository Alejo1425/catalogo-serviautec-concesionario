# 📦 Guía para Subir el Proyecto a GitHub

## Paso 1: Crear Repositorio en GitHub

1. Ve a https://github.com/new
2. Nombre del repositorio: `catalogo-serviautec-concesionario`
3. Descripción: "Catálogo Multi-tenant de Motos Auteco"
4. Visibilidad: **Private** (recomendado) o Public
5. **NO** marcar "Initialize with README" (ya tenemos uno)
6. Click en "Create repository"

## Paso 2: Configurar Git Local

Abre tu terminal en el proyecto y ejecuta:

```bash
# Navegar al proyecto
cd "c:\Users\dcarv\OneDrive\Escritorio\catalogo\catalogo-serviautec-concesionario-main"

# Inicializar repositorio (si no está inicializado)
git init

# Configurar tu usuario (solo primera vez)
git config --global user.name "Tu Nombre"
git config --global user.email "tu@email.com"

# Agregar todos los archivos
git add .

# Ver qué archivos se agregarán
git status

# Crear commit inicial
git commit -m "feat: Initial commit - Multi-tenant Auteco Bike Buddy

- Configuración multi-tenant con variables de entorno
- Docker + Traefik setup
- Scripts de despliegue automatizados
- Soporte para múltiples asesores con subdominios personalizados"
```

## Paso 3: Conectar con GitHub

Después de crear el repositorio en GitHub, verás instrucciones. Usa estas:

```bash
# Agregar repositorio remoto (reemplaza TU_USUARIO)
git remote add origin https://github.com/TU_USUARIO/catalogo-serviautec-concesionario.git

# O si usas SSH:
# git remote add origin git@github.com:TU_USUARIO/auteco-bike-buddy.git

# Subir código a GitHub
git push -u origin main

# Si te pide credenciales, usa tu token de GitHub (no contraseña)
```

## Paso 4: Verificar en GitHub

Ve a `https://github.com/TU_USUARIO/catalogo-serviautec-concesionario` y verifica que:
- ✅ Todos los archivos están subidos
- ✅ README.md se muestra correctamente
- ✅ .gitignore está funcionando (no debe haber carpeta node_modules)

## 📝 Comandos Git Útiles

### Para futuras actualizaciones:

```bash
# Ver estado de cambios
git status

# Ver diferencias
git diff

# Agregar archivos específicos
git add archivo1.ts archivo2.tsx

# Agregar todos los cambios
git add .

# Crear commit
git commit -m "feat: descripción del cambio"

# Subir cambios
git push

# Ver historial
git log --oneline

# Crear nueva rama
git checkout -b feature/nueva-funcionalidad

# Cambiar de rama
git checkout main
```

### Convención de commits:

```bash
git commit -m "feat: agregar nuevo asesor Pedro"
git commit -m "fix: corregir error en configuración de Traefik"
git commit -m "docs: actualizar README con instrucciones"
git commit -m "style: mejorar UI del catálogo"
git commit -m "refactor: optimizar sistema de configuración"
git commit -m "chore: actualizar dependencias"
```

## 🔑 Configurar Token de GitHub

Si GitHub te pide contraseña, necesitas un Personal Access Token:

1. Ve a GitHub → Settings → Developer settings → Personal access tokens → Tokens (classic)
2. Click en "Generate new token (classic)"
3. Nombre: "Auteco Bike Buddy Deploy"
4. Scopes: Marcar `repo` (todos los permisos de repositorio)
5. Click en "Generate token"
6. **COPIA EL TOKEN** (no podrás verlo de nuevo)
7. Usa el token como contraseña cuando hagas `git push`

### Guardar credenciales (opcional):

```bash
# Para no tener que ingresar el token cada vez
git config --global credential.helper store

# La próxima vez que hagas push, ingresa:
# Username: tu_usuario_github
# Password: tu_token (el que copiaste)
```

## 🚀 Workflow Recomendado

### Para desarrollo:

```bash
# 1. Crear rama para nueva feature
git checkout -b feature/nuevo-asesor

# 2. Hacer cambios en el código
# ...

# 3. Agregar y commitear
git add .
git commit -m "feat: agregar asesor nuevo"

# 4. Subir rama
git push -u origin feature/nuevo-asesor

# 5. Crear Pull Request en GitHub
# 6. Revisar y mergear a main
```

### Para despliegue rápido:

```bash
# 1. Hacer cambios
# ...

# 2. Commit directo a main
git add .
git commit -m "fix: corrección rápida"
git push

# 3. Desplegar al servidor
./deploy.sh
```

## 📋 Checklist de Subida a GitHub

- [ ] Repositorio creado en GitHub
- [ ] Git configurado localmente
- [ ] Archivos agregados con `git add .`
- [ ] Commit creado
- [ ] Repositorio remoto agregado
- [ ] Código subido con `git push`
- [ ] README visible en GitHub
- [ ] .gitignore funcionando
- [ ] No hay archivos sensibles (.env, credentials)
- [ ] Scripts tienen permisos correctos

## 🔒 Seguridad

### Archivos que NO deben subirse (ya están en .gitignore):

- ❌ `node_modules/`
- ❌ `.env` (variables de entorno locales)
- ❌ `dist/` (archivos compilados)
- ❌ Claves API o credenciales

### Si subiste un archivo por error:

```bash
# Remover del repositorio pero mantener local
git rm --cached archivo_secreto.txt

# Agregarlo a .gitignore
echo "archivo_secreto.txt" >> .gitignore

# Commit
git add .gitignore
git commit -m "chore: remover archivo sensible"
git push
```

## 🌐 Después de Subir a GitHub

1. **Actualizar deploy.sh** con la URL correcta:
   ```bash
   REPO_URL="https://github.com/TU_USUARIO/catalogo-serviautec-concesionario.git"
   ```

2. **Probar despliegue**:
   ```bash
   ./deploy.sh
   ```

3. **Configurar GitHub Actions** (opcional para CI/CD automático)

---

¿Problemas? Revisa:
- https://docs.github.com/es/get-started
- https://docs.github.com/es/authentication
