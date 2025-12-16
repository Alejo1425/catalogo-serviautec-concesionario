# 🔐 Configuración de GitHub Secrets

Para que los workflows de GitHub Actions funcionen, necesitas configurar los secrets en el repositorio.

## 📋 Secrets Necesarios

| Secret Name | Descripción | Valor |
|-------------|-------------|-------|
| `SERVER_HOST` | IP o dominio del servidor | Ejemplo: `srv860507.hstgr.cloud` |
| `SERVER_USER` | Usuario SSH | Ejemplo: `root` |
| `SERVER_SSH_KEY` | Clave privada SSH | Ver instrucciones abajo |

---

## 🚀 Paso a Paso

### 1. Obtener la clave SSH privada

En el servidor, ejecuta:

```bash
cat ~/.ssh/id_rsa
```

**Copia TODO el contenido**, incluyendo:
```
-----BEGIN OPENSSH PRIVATE KEY-----
... (todo el contenido) ...
-----END OPENSSH PRIVATE KEY-----
```

### 2. Ir a GitHub

1. Ve a tu repositorio: https://github.com/Alejo1425/catalogo-serviautec-concesionario
2. Click en **Settings** (Configuración)
3. En el menú lateral: **Secrets and variables** → **Actions**
4. Click en **New repository secret**

### 3. Agregar cada secret

#### Secret 1: SERVER_HOST

- **Name:** `SERVER_HOST`
- **Value:** La IP o dominio de tu servidor
  ```
  srv860507.hstgr.cloud
  ```
- Click **Add secret**

#### Secret 2: SERVER_USER

- **Name:** `SERVER_USER`
- **Value:** El usuario SSH (normalmente `root`)
  ```
  root
  ```
- Click **Add secret**

#### Secret 3: SERVER_SSH_KEY

- **Name:** `SERVER_SSH_KEY`
- **Value:** Pega la clave privada SSH completa que copiaste en el paso 1
  ```
  -----BEGIN OPENSSH PRIVATE KEY-----
  ... (toda la clave) ...
  -----END OPENSSH PRIVATE KEY-----
  ```
- Click **Add secret**

---

## ✅ Verificar la Configuración

Una vez agregados los 3 secrets, deberías ver algo como:

```
SERVER_HOST        Updated now
SERVER_USER        Updated now
SERVER_SSH_KEY     Updated now
```

---

## 🧪 Probar el Deployment

### Probar Staging

```bash
git checkout develop
git commit --allow-empty -m "test: probar deploy a staging"
git push origin develop
```

1. Ve a: https://github.com/Alejo1425/catalogo-serviautec-concesionario/actions
2. Deberías ver el workflow "Deploy to Staging" corriendo
3. Si todo está bien, aparecerá un ✅ verde

### Probar Production

```bash
git checkout master
git merge develop
git push origin master
```

1. Ve a: https://github.com/Alejo1425/catalogo-serviautec-concesionario/actions
2. Deberías ver el workflow "Deploy to Production" corriendo
3. Si todo está bien, aparecerá un ✅ verde

---

## ❗ Solución de Problemas

### Error: "Permission denied (publickey)"

**Problema:** La clave SSH no es correcta o no tiene permisos

**Solución:**
1. Verifica que copiaste la clave COMPLETA (incluyendo BEGIN y END)
2. Asegúrate de que la clave tenga saltos de línea correctos
3. Verifica que el usuario tenga acceso SSH al servidor

### Error: "Host key verification failed"

**Problema:** El servidor no está en known_hosts

**Solución:** En el servidor, ejecuta:
```bash
ssh-keyscan srv860507.hstgr.cloud >> ~/.ssh/known_hosts
```

---

## 🔒 Seguridad

- ⚠️ **NUNCA** compartas tus secrets en commits de Git
- ⚠️ **NUNCA** publiques tus secrets en screenshots o mensajes
- ✅ Los secrets en GitHub están encriptados y solo son visibles durante la ejecución
- ✅ Solo los administradores del repositorio pueden ver los secrets

---

## 📸 Screenshots de Referencia

### Dónde encontrar los settings:

```
GitHub Repo → Settings → (Sidebar) Secrets and variables → Actions
```

### Cómo se ve cuando están configurados:

```
Repository secrets (3)
┌─────────────────┬──────────────┐
│ Name            │ Updated      │
├─────────────────┼──────────────┤
│ SERVER_HOST     │ 5 minutes ago│
│ SERVER_SSH_KEY  │ 5 minutes ago│
│ SERVER_USER     │ 5 minutes ago│
└─────────────────┴──────────────┘
```

---

**¿Listo?** Una vez configurados los secrets, los workflows funcionarán automáticamente cada vez que hagas push a `develop` o `master`.
