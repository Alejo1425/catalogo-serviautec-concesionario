# 📋 Canned Responses para Chatwoot - Catálogos Personalizados

## 🎯 Configuración en Chatwoot

Para configurar estas respuestas en Chatwoot:

1. Ve a **Configuración** → **Canned Responses** (Respuestas predefinidas)
2. Haz clic en **"Add Canned Response"**
3. Copia el Short Code y el Content de cada respuesta abajo

---

## 📱 Respuestas Predefinidas por Asesor

### 1️⃣ Alejandra

**Short Code:** `/catalogo-alejandra` o `/catalogo`

**Content:**
```
¡Hola! 👋

Aquí está mi catálogo personalizado de motos:
🔗 https://autorunai.tech/alejandra

Puedes ver todas las motos disponibles con precios actualizados. Si alguna te interesa, haz clic en "Me interesa" y seguimos conversando aquí mismo. 🏍️✨
```

---

### 2️⃣ Miguel

**Short Code:** `/catalogo-miguel` o `/catalogo`

**Content:**
```
¡Hola! 👋

Aquí está mi catálogo personalizado de motos:
🔗 https://autorunai.tech/miguel

Puedes ver todas las motos disponibles con precios actualizados. Si alguna te interesa, haz clic en "Me interesa" y seguimos conversando aquí mismo. 🏍️✨
```

---

### 3️⃣ Nathalia

**Short Code:** `/catalogo-nathalia` o `/catalogo`

**Content:**
```
¡Hola! 👋

Aquí está mi catálogo personalizado de motos:
🔗 https://autorunai.tech/nathalia

Puedes ver todas las motos disponibles con precios actualizados. Si alguna te interesa, haz clic en "Me interesa" y seguimos conversando aquí mismo. 🏍️✨
```

---

### 4️⃣ Lorena

**Short Code:** `/catalogo-lorena` o `/catalogo`

**Content:**
```
¡Hola! 👋

Aquí está mi catálogo personalizado de motos:
🔗 https://autorunai.tech/lorena

Puedes ver todas las motos disponibles con precios actualizados. Si alguna te interesa, haz clic en "Me interesa" y seguimos conversando aquí mismo. 🏍️✨
```

---

### 5️⃣ Juan Pablo

**Short Code:** `/catalogo-juan-pablo` o `/catalogo`

**Content:**
```
¡Hola! 👋

Aquí está mi catálogo personalizado de motos:
🔗 https://autorunai.tech/juan-pablo

Puedes ver todas las motos disponibles con precios actualizados. Si alguna te interesa, haz clic en "Me interesa" y seguimos conversando aquí mismo. 🏍️✨
```

---

## 🚀 Cómo usarlas

### Para los Asesores:

1. En la conversación de Chatwoot, escribe **`/`** (barra)
2. Aparecerá un menú con las respuestas disponibles
3. Selecciona `/catalogo` o escribe `/catalogo-tu-nombre`
4. Se enviará automáticamente el mensaje con tu link personalizado

### Para Diego (Admin):

También puedes crear una respuesta genérica que detecte automáticamente el asesor:

**Short Code:** `/catalogo-auto`

**Content:**
```
¡Hola! 👋

Mi asesor te compartirá el catálogo personalizado en un momento.

Mientras tanto, puedes ver nuestro catálogo general aquí:
🔗 https://autorunai.tech

Si alguna moto te interesa, haz clic en "Me interesa" y seguimos conversando. 🏍️✨
```

---

## 📊 Ventajas de este sistema:

✅ **Un solo clic** para compartir catálogo
✅ **Link trackeable** - sabes qué asesor compartió qué catálogo
✅ **Conversación centralizada** - todo queda en Chatwoot
✅ **Custom attributes** - cuando el cliente hace clic en "Me interesa", se registra automáticamente

---

## 🔍 Ver intereses del cliente

Cuando el cliente hace clic en "Me interesa" en una moto, verás en Chatwoot:

**Custom Attributes del contacto:**
- `ultima_moto_interes`: "TVS APACHE 160 4V"
- `total_motos_interes`: 3
- `motos_interes`: [array JSON con todas las motos]

**Ejemplo:**
```json
{
  "ultima_moto_interes": "TVS APACHE 160 4V",
  "total_motos_interes": 2,
  "motos_interes": "[{\"id\":\"apache-160-4v\",\"modelo\":\"APACHE 160 4V\",\"marca\":\"TVS\",\"timestamp\":\"2025-12-17T14:30:00.000Z\"},{\"id\":\"mrx-150\",\"modelo\":\"MRX 150\",\"marca\":\"Victory\",\"timestamp\":\"2025-12-17T14:32:00.000Z\"}]"
}
```

---

## 🎨 Personalización

Puedes modificar el mensaje según tu estilo. Ejemplos:

**Más formal:**
```
Buenos días,

Le comparto el catálogo de motos con precios actualizados:
https://autorunai.tech/alejandra

Quedo atenta a sus consultas.
```

**Más casual:**
```
Hey! 😊

Aquí tienes mi catálogo con todas las motos disponibles:
👉 https://autorunai.tech/miguel

Dale un vistazo y me cuentas cuál te gusta más 🏍️
```

---

**Configurado por:** Diego Carvajal
**Fecha:** Diciembre 2025
