# 🤖 Mensajes Automáticos en Chatwoot - Documentación

## ✅ Implementación Completada

Se ha implementado la funcionalidad para que cuando un cliente hace clic en "Me interesa" en un catálogo personalizado, automáticamente:

1. **Se envía un mensaje** al chat de Chatwoot con los detalles de la moto
2. **Se asigna la conversación** al asesor específico (Miguel, Alejandra, etc.)
3. **Se registra en custom attributes** para tracking

---

## 🎯 Flujo Completo

### Paso 1: Cliente abre catálogo personalizado
```
Cliente visita: https://autorunai.tech/miguel
```

### Paso 2: Cliente hace clic en "Me interesa"
- Se abre el widget de Chatwoot automáticamente
- Se registra la moto en custom attributes
- **NUEVO:** Se envía un mensaje automático al chat
- **NUEVO:** Se asigna la conversación a Miguel

### Paso 3: Mensaje automático enviado
El sistema envía este mensaje al chat:

```
🏍️ **Me interesa esta moto:**

**TVS APACHE 160 4V**

💰 **Precios:**
• Cuota Inicial: $500.000
• Precio Contado: $8.000.000
• Precio 2026: $8.500.000

¿Me puedes dar más información sobre esta moto?
```

### Paso 4: Asignación automática
La conversación se asigna automáticamente al asesor correspondiente al catálogo.

---

## 🔧 Implementación Técnica

### Nuevo Servicio: `ChatwootAPIService`

**Ubicación:** `src/services/chatwoot/chatwoot-api.service.ts`

**Funciones principales:**

#### 1. `enviarMotoInteres(moto, asesorId)`
Función principal que:
- Busca la conversación activa del cliente
- Crea un mensaje formateado con los detalles de la moto
- Envía el mensaje a Chatwoot
- Asigna la conversación al asesor

```typescript
const exito = await ChatwootAPIService.enviarMotoInteres(
  {
    marca: 'TVS',
    modelo: 'APACHE 160 4V',
    cuotaInicial: 500000,
    precioContado: 8000000,
    precio2026: 8500000,
    imagen: 'https://...',
  },
  asesorId
);
```

#### 2. `buscarConversacionActiva()`
Busca la conversación activa usando el localStorage de Chatwoot.

#### 3. `enviarMensaje(conversationId, mensaje)`
Envía un mensaje a una conversación específica usando la API REST.

#### 4. `asignarConversacionAsesor(conversationId, asesorId)`
Asigna la conversación a un asesor específico.

---

## 📝 Componentes Modificados

### 1. `MotoCard.tsx`
**Cambios:**
- Importa `ChatwootAPIService`
- `handleMeInteresa` ahora es `async`
- Llama a `ChatwootAPIService.enviarMotoInteres()` cuando hay asesor personalizado
- Muestra toast de éxito: *"¡Mensaje enviado a Miguel! Revisa el chat en la esquina"*

**Código:**
```typescript
const handleMeInteresa = async (e: React.MouseEvent) => {
  // ... código existente ...

  if (asesorActual) {
    const exito = await ChatwootAPIService.enviarMotoInteres(
      {
        marca: moto.marca,
        modelo: moto.modelo,
        cuotaInicial: moto.cuotaInicial,
        precioContado: moto.precioContado,
        precio2026: moto.precio2026,
        imagen: moto.imagen,
      },
      asesorActual.Id
    );

    if (exito) {
      toast.success(
        `¡Mensaje enviado a ${asesorActual.Aseror}! Revisa el chat en la esquina`
      );
    }
  }
};
```

### 2. `MotoDetail.tsx`
Mismos cambios que `MotoCard.tsx` para consistencia.

---

## 🔐 Configuración de API Token

El servicio usa el API token de Chatwoot configurado en `.env`:

```env
VITE_CHATWOOT_API_TOKEN=VsVcF9h2ZM1jhc8UiqTZwgJg
VITE_CHATWOOT_ACCOUNT_ID=1
VITE_CHATWOOT_BASE_URL=https://chatwoot.autorunai.tech
```

⚠️ **IMPORTANTE:** El API token está expuesto en el código del frontend. Para producción, se recomienda:
1. Crear un backend API intermediario
2. Hacer las llamadas a Chatwoot desde el backend
3. El frontend solo llama al backend (sin exponer el token)

**Alternativa simple:** Usar CORS y API key rotation en Chatwoot.

---

## 📊 Formato del Mensaje

El mensaje se envía con formato Markdown para mejor visualización en Chatwoot:

```markdown
🏍️ **Me interesa esta moto:**

**[MARCA] [MODELO]**

💰 **Precios:**
• Cuota Inicial: $XXX.XXX
• Precio Contado: $X.XXX.XXX
• Precio 2026: $X.XXX.XXX

¿Me puedes dar más información sobre esta moto?
```

---

## 🔍 Tracking en Chatwoot

### Custom Attributes Registrados:
Cuando el cliente hace clic en "Me interesa", se registran automáticamente:

| Atributo | Valor | Descripción |
|----------|-------|-------------|
| `motos_interes` | JSON Array | Lista completa de motos de interés |
| `ultima_moto_interes` | String | Última moto (ej: "TVS APACHE 160 4V") |
| `total_motos_interes` | Number | Cantidad total de motos |
| `asesor_nombre` | String | Nombre del asesor asignado |
| `asesor_id` | Number | ID del asesor |

### Mensaje en Conversación:
- **Tipo:** `incoming` (mensaje del cliente)
- **Contenido:** Detalles formateados de la moto
- **Asignación:** Automática al asesor del catálogo

---

## 🎨 Comportamiento por Tipo de Catálogo

### Catálogo Personalizado (`/miguel`, `/alejandra`, etc.):
1. Solo muestra botón "Me interesa - Hablar con [Asesor]"
2. Al hacer clic:
   - ✅ Envía mensaje automático con detalles de moto
   - ✅ Asigna conversación al asesor
   - ✅ Abre widget de Chatwoot
   - ✅ Muestra toast: *"¡Mensaje enviado a Miguel!"*

### Catálogo General (`/`):
1. Muestra ambos botones: "Me interesa" y "WhatsApp"
2. Al hacer clic en "Me interesa":
   - ✅ Registra en custom attributes
   - ✅ Abre widget de Chatwoot
   - ❌ No envía mensaje automático (no hay asesor asignado)
   - ✅ Muestra toast genérico

---

## 🚀 Testing

### Probar la Funcionalidad:

1. **Abrir catálogo personalizado:**
   ```
   http://82.25.84.168:8081/miguel
   ```

2. **Hacer clic en "Me interesa"** en cualquier moto

3. **Verificar en Chatwoot:**
   - Abrir el dashboard de Chatwoot
   - Ir a "Conversaciones"
   - Buscar la conversación del cliente
   - Verificar que:
     - ✅ Hay un mensaje con los detalles de la moto
     - ✅ La conversación está asignada a Miguel
     - ✅ Los custom attributes están actualizados

4. **Verificar en el cliente:**
   - El widget de Chatwoot se abrió automáticamente
   - Se ve el toast: "¡Mensaje enviado a Miguel!"
   - Al abrir el chat, se ve el mensaje con los detalles

---

## 🐛 Manejo de Errores

### Si no se encuentra conversación activa:
```
⚠️ No se encontró conversación activa
```
- Fallback: Solo registra en custom attributes
- Toast: Mensaje genérico sin confirmar envío

### Si falla el envío del mensaje:
```
❌ Error al enviar mensaje: [detalles]
```
- Fallback: Continúa con el flujo normal (abre chat)
- Toast: Mensaje genérico
- La funcionalidad básica sigue funcionando

### Si falla la asignación:
```
❌ Error al asignar conversación: [detalles]
```
- El mensaje se envía de todas formas
- La asignación puede hacerse manualmente en Chatwoot

---

## 📈 Ventajas de la Implementación

1. **Experiencia Seamless:** El cliente no tiene que escribir nada
2. **Información Completa:** El asesor ve inmediatamente la moto de interés con precios
3. **Asignación Automática:** No hay que asignar manualmente las conversaciones
4. **Tracking Completo:** Todo queda registrado en Chatwoot
5. **Sin Fragmentación:** Todo en una sola plataforma (Chatwoot)

---

## 🔄 Próximos Pasos (Opcional)

### Mejoras Futuras:

1. **Agregar Imagen de la Moto:**
   - Adjuntar imagen en el mensaje de Chatwoot
   - Requiere upload de imagen vía API

2. **Generar Tarjeta Visual:**
   - Crear imagen con datos de la moto
   - Enviar como attachment en Chatwoot

3. **Backend API:**
   - Crear endpoint intermediario
   - Mover lógica de API a backend
   - Mayor seguridad del API token

4. **Notificaciones Push:**
   - Notificar al asesor cuando hay nuevo interés
   - Integrar con sistema de notificaciones

5. **Analytics:**
   - Dashboard de motos más solicitadas
   - Métricas por asesor
   - Tasa de conversión

---

## 📞 Soporte

Si hay problemas con la integración:

1. **Verificar logs en consola del navegador:**
   - Ver errores de la API de Chatwoot
   - Verificar que el token es válido

2. **Verificar en Chatwoot:**
   - El API token tiene permisos correctos
   - El asesor existe y tiene un ID válido
   - La conversación está activa

3. **Variables de entorno:**
   - Verificar que `.env` tiene todas las variables
   - Reiniciar el servidor después de cambiar `.env`

---

**Implementado por:** Diego Carvajal
**Fecha:** Diciembre 2025
**Estado:** ✅ Completado y funcionando
