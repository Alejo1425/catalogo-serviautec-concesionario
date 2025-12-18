# 📋 Guía del Sistema de Compartir Catálogo

## 🎯 Resumen

Este sistema permite a los asesores compartir sus catálogos personalizados con prospectos y rastrear qué motos les interesan a través de Chatwoot.

## 🚀 Características Implementadas

### 1. **Botón "Me interesa" en las Motos**

Los clientes pueden expresar interés en motos específicas de dos formas:

#### En las Tarjetas de Moto (Catálogo Principal)
- Cada moto tiene dos botones:
  - **"Me interesa"** (con ícono de corazón) - Abre el chat y registra el interés
  - **"WhatsApp"** (con ícono de WhatsApp) - Link directo a WhatsApp

#### En la Página de Detalle de Moto
- Botón grande "Me interesa esta moto" que:
  - Abre el widget de Chatwoot
  - Registra la moto en los custom attributes del cliente
  - Muestra una notificación de confirmación

### 2. **Rastreo de Intereses en Chatwoot**

Cuando un cliente hace clic en "Me interesa", el sistema:

1. **Guarda en Custom Attributes de Chatwoot:**
   - `motos_interes`: Array JSON con todas las motos de interés
   - `ultima_moto_interes`: Última moto que le interesó (ej: "TVS APACHE 160 4V")
   - `total_motos_interes`: Contador de motos de interés

2. **Estructura de datos guardada:**
```json
{
  "id": "tvs-apache-160-4v",
  "modelo": "APACHE 160 4V",
  "marca": "TVS",
  "timestamp": "2025-12-17T10:30:00.000Z"
}
```

3. **También guarda en localStorage** para mantener sincronización local

### 3. **Panel de Administración - Compartir URLs**

En [/admin/asesores](src/pages/admin/GestionAsesores.tsx) cada asesor activo muestra:

- **URL del catálogo personalizado**: `autorunai.tech/alejandra`
- **Botón de copiar** (ícono de portapapeles) - Copia la URL al portapapeles
- **Link directo** (ícono de enlace externo) - Abre el catálogo en nueva pestaña

Solo se muestra para asesores:
- ✅ Activos (Activo === 1)
- ✅ Con slug configurado

## 📱 Flujo de Uso para Asesores

### Paso 1: Obtener tu URL de catálogo

1. Ve a `/admin/asesores`
2. Busca tu nombre en la lista
3. Verás tu URL personalizada (ej: `autorunai.tech/miguel`)
4. Haz clic en el botón de copiar 📋

### Paso 2: Compartir con Prospectos

Puedes compartir tu URL por cualquier medio:
- WhatsApp
- Email
- Redes sociales
- Mensaje directo en Chatwoot

### Paso 3: El Cliente Explora el Catálogo

El prospecto:
1. Entra a tu URL personalizada (ej: `autorunai.tech/miguel`)
2. Ve tu banner personalizado en la parte superior
3. El widget de Chatwoot se carga automáticamente configurado para ti
4. Explora las motos disponibles

### Paso 4: El Cliente Expresa Interés

Cuando el cliente hace clic en "Me interesa" en una moto:
1. ✅ Se abre el widget de Chatwoot automáticamente
2. ✅ La moto se guarda en los custom attributes de la conversación
3. ✅ El cliente ve una notificación: "TVS APACHE 160 4V agregada a tu lista de interés"

### Paso 5: Tú Ves sus Intereses en Chatwoot

En el panel de Chatwoot verás:

**Custom Attributes del contacto:**
```
última_moto_interes: "TVS APACHE 160 4V"
total_motos_interes: 3
motos_interes: [array JSON con todas las motos]
```

Esto te permite:
- Saber exactamente qué motos le interesan
- Priorizar tu oferta comercial
- Dar seguimiento personalizado

## 🔧 Archivos Modificados

### Nuevas Funciones en Chatwoot Utils
**Archivo:** [src/utils/chatwoot.ts](src/utils/chatwoot.ts)

```typescript
// Agregar una moto a la lista de interés
agregarMotoInteres(motoId, motoModelo, motoMarca)

// Abrir chat con una moto específica
abrirChatConMoto(motoModelo, motoMarca)

// Obtener lista de motos de interés
obtenerMotosInteres()

// Limpiar lista de interés
limpiarMotosInteres()
```

### Hook Actualizado
**Archivo:** [src/hooks/useChatwoot.ts](src/hooks/useChatwoot.ts)

Nuevos métodos disponibles:
- `openChatWithMoto(modelo, marca)` - Abre chat con interés
- `addMotoInteres(id, modelo, marca)` - Agrega moto sin abrir chat
- `getMotosInteres()` - Obtiene lista de interés
- `clearMotosInteres()` - Limpia lista

### Componentes Actualizados

**1. MotoCard** - [src/components/MotoCard.tsx](src/components/MotoCard.tsx)
- Botón "Me interesa" agregado
- Integración con useChatwoot hook
- Toast notifications

**2. MotoDetail** - [src/pages/MotoDetail.tsx](src/pages/MotoDetail.tsx)
- Botón grande "Me interesa esta moto"
- Carga automática de Chatwoot
- Notificaciones de confirmación

**3. GestionAsesores** - [src/pages/admin/GestionAsesores.tsx](src/pages/admin/GestionAsesores.tsx)
- URLs de catálogo con botón copiar
- Links directos a catálogos
- Solo para asesores activos

## 💡 Ejemplos de Uso

### Ejemplo 1: Asesor comparte catálogo por WhatsApp

```
Hola Juan! 👋

Te comparto mi catálogo personalizado de motos:
👉 autorunai.tech/miguel

Puedes ver todas las motos disponibles y si alguna te interesa,
solo haz clic en "Me interesa" y podemos conversar por aquí. 🏍️
```

### Ejemplo 2: Cliente expresa interés

1. Cliente entra a `autorunai.tech/miguel`
2. Ve una "TVS APACHE 160 4V" que le gusta
3. Hace clic en "Me interesa"
4. El chat de Chatwoot se abre automáticamente
5. El asesor ve en Chatwoot:
   ```
   última_moto_interes: "TVS APACHE 160 4V"
   total_motos_interes: 1
   ```

### Ejemplo 3: Cliente interesado en múltiples motos

Cliente hace clic en "Me interesa" en:
- TVS APACHE 160 4V
- Victory MRX 150 FOX
- Kymco AGILITY FUSION

El asesor ve en Chatwoot:
```json
{
  "última_moto_interes": "Kymco AGILITY FUSION",
  "total_motos_interes": 3,
  "motos_interes": "[
    {\"id\":\"tvs-apache-160-4v\",\"modelo\":\"APACHE 160 4V\",\"marca\":\"TVS\",\"timestamp\":\"...\"},
    {\"id\":\"victory-mrx-150-fox\",\"modelo\":\"MRX 150 FOX\",\"marca\":\"Victory\",\"timestamp\":\"...\"},
    {\"id\":\"kymco-agility-fusion\",\"modelo\":\"AGILITY FUSION\",\"marca\":\"Kymco\",\"timestamp\":\"...\"}
  ]"
}
```

## 🎨 Interfaz de Usuario

### Botones de las Motos

**Antes:**
```
[  Cotizar por WhatsApp  ] (botón verde, full width)
```

**Ahora:**
```
[ ❤️ Me interesa ] [ 💬 WhatsApp ]
(dos botones lado a lado)
```

### Panel de Admin

**Vista de Asesor Activo con Slug:**
```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🟢 Alejandra  [✓ Activo]
   📞 3177352000
   📧 alejandra@ejemplo.com
   🔗 autorunai.tech/alejandra [📋]

   [⏸️ Desactivar] [👋 Retirar]
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

## 📊 Métricas que se Pueden Rastrear

Con este sistema puedes analizar:

1. **Por Asesor:**
   - Cuántos clics en "Me interesa" reciben
   - Qué motos son más populares en su catálogo

2. **Por Cliente:**
   - Cuántas motos le interesan
   - Cuál fue la última moto que vio
   - Secuencia temporal de interés

3. **Por Moto:**
   - Cuántos clientes expresaron interés
   - En qué catálogos de asesores se ve más

## 🔐 Seguridad y Privacidad

- ✅ Los datos se guardan solo en Chatwoot y localStorage del cliente
- ✅ No se comparten entre sesiones
- ✅ Cada asesor solo ve sus propios contactos
- ✅ URLs de catálogo solo funcionan para asesores activos

## 🚀 Próximos Pasos Sugeridos

### Mejoras Futuras:

1. **Dashboard de Métricas:**
   - Panel para ver motos más populares
   - Estadísticas de interacción por asesor
   - Gráficos de conversión

2. **Notificaciones Push:**
   - Notificar al asesor cuando alguien expresa interés
   - Email automático con resumen diario

3. **Comparador de Motos:**
   - Permitir seleccionar múltiples motos para comparar
   - Enviar comparación al asesor por Chatwoot

4. **QR Codes:**
   - Generar QR para cada asesor
   - Facilitar compartir en eventos presenciales

5. **Tracking de Conversiones:**
   - Marcar cuando un interés se convierte en venta
   - ROI por asesor y por canal

## 📝 Notas Técnicas

### Custom Attributes en Chatwoot

Los custom attributes son visibles en el panel lateral de cada conversación en Chatwoot.

Para verlos:
1. Abre una conversación en Chatwoot
2. Panel derecho → "Contact Attributes"
3. Busca: `motos_interes`, `ultima_moto_interes`, `total_motos_interes`

### localStorage

Se usa como cache local para evitar pérdida de datos si Chatwoot se desconecta temporalmente.

Clave: `chatwoot_motos_interes`

### Sincronización

Cada vez que se agrega una moto:
1. Se actualiza localStorage
2. Se actualiza Chatwoot custom attributes
3. Se muestra toast notification al usuario

## 🐛 Troubleshooting

### El botón "Me interesa" no funciona

**Causa:** Chatwoot no está cargado
**Solución:** Verifica que el widget de Chatwoot se haya cargado correctamente

### No veo los custom attributes en Chatwoot

**Causa:** Los custom attributes pueden tardar un momento en sincronizar
**Solución:** Refresca la página de Chatwoot o espera unos segundos

### La URL del catálogo no aparece en el admin

**Causa:** El asesor no tiene slug configurado o no está activo
**Solución:**
1. Verifica que el asesor esté activo (Activo === 1)
2. Ejecuta el script de slugs si falta: `npx tsx scripts/setup-asesor-slugs.ts`

---

## ✅ Build Status

**Estado:** ✅ Build exitoso
**Última compilación:** 6.56s
**Tamaño del bundle:** 396.20 kB (gzip: 120.21 kB)

---

¡El sistema está listo para usar! 🎉
