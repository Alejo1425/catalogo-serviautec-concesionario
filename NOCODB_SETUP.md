# Guía de Integración con NocoDB

Esta guía explica cómo funciona la integración con NocoDB para el catálogo de motos en tiempo real.

## 📋 Tabla de Contenidos

1. [Descripción General](#descripción-general)
2. [Configuración Inicial](#configuración-inicial)
3. [Estructura de la Tabla](#estructura-de-la-tabla)
4. [Uso del Sistema](#uso-del-sistema)
5. [Sincronización en Tiempo Real](#sincronización-en-tiempo-real)
6. [Gestión de Motos](#gestión-de-motos)
7. [Ejemplos de Uso](#ejemplos-de-uso)

## Descripción General

El sistema está conectado a NocoDB para gestionar el catálogo de motos de forma dinámica. Los cambios que hagas en NocoDB se reflejarán automáticamente en el sitio web en producción.

### Ventajas

✅ **Actualización en Tiempo Real**: Los cambios en NocoDB se sincronizan automáticamente
✅ **Sin Código**: Gestiona motos sin tocar código
✅ **Histórico**: Las motos desactivadas se mantienen en el sistema
✅ **Información Extendida**: Descripción, características, garantía, ficha técnica e imágenes
✅ **Fácil de Usar**: Interfaz visual para administrar el catálogo

## Configuración Inicial

### 1. Variables de Entorno

Asegúrate de tener configuradas estas variables en tu archivo `.env`:

```env
VITE_NOCODB_BASE_URL=https://nocodb.autorunai.tech
VITE_NOCODB_TOKEN=t2M4tCGewzq2mKATShL1OBSB1u2s9zztgwgHnvtk
VITE_NOCODB_BASE_ID=p3aqrpa3rc5mhel
```

### 2. Estructura de la Tabla en NocoDB

La tabla `lista_de_precios` (ID: `m8hyj9f4y3ffe9o`) debe tener las siguientes columnas:

#### Campos Obligatorios

| Campo | Tipo | Descripción | Ejemplo |
|-------|------|-------------|---------|
| `Id` | Number | ID único (auto-generado) | 1 |
| `Modelo` | Text | Nombre del modelo | "APACHE RTR 200 4V" |
| `Marca` | SingleSelect | Marca de la moto | TVS, Victory, Kymco, etc. |
| `Categoria` | SingleSelect | Categoría | sport, trabajo, automatica, etc. |

#### Campos de Precio

| Campo | Tipo | Descripción | Ejemplo |
|-------|------|-------------|---------|
| `Precio_2026` | Number | Precio financiado | 11999999 |
| `Cuota_Inicial` | Number | Cuota inicial | 2185500 |
| `Precio_Contado` | Number | Precio de contado | 12885499 |

#### Campos Opcionales Básicos

| Campo | Tipo | Descripción | Ejemplo |
|-------|------|-------------|---------|
| `Cilindrada` | Text | Cilindrada del motor | "200cc" |
| `slug` | Text | URL amigable | "apache-rtr-200-4v" |
| `Activo` | Checkbox | Si está en el mercado | ✓ (activo) / ✗ (inactivo) |

#### Campos de Información Extendida

| Campo | Tipo | Descripción | Formato |
|-------|------|-------------|---------|
| `Imagen_Principal` | Text/URL | URL de imagen principal | https://... |
| `Galeria_Imagenes` | LongText | URLs de galería | JSON array o separadas por comas |
| `Descripcion` | LongText | Descripción de la moto | Texto libre |
| `Caracteristicas` | LongText | Características principales | Texto línea por línea o JSON |
| `Garantia` | LongText | Información de garantía | Texto libre |
| `Ficha_Tecnica` | LongText | Especificaciones técnicas | JSON object |

### 3. Valores Permitidos

#### Marcas
- TVS
- Victory
- Kymco
- Benelli
- Ceronte
- Zontes

#### Categorías
- sport
- trabajo
- automatica
- semi-automatica
- deportiva
- todo-terreno
- tricargo
- alta-gama

## Estructura de Datos

### Galería de Imágenes

Puedes usar dos formatos:

**Opción 1: JSON Array**
```json
["https://imagen1.jpg", "https://imagen2.jpg", "https://imagen3.jpg"]
```

**Opción 2: Separado por comas**
```
https://imagen1.jpg, https://imagen2.jpg, https://imagen3.jpg
```

### Características

**Opción 1: JSON Object**
```json
{
  "motor": "4 tiempos, monocilíndrico",
  "potencia": "20.5 HP @ 8500 rpm",
  "transmision": "5 velocidades",
  "frenos": "Disco adelante y atrás"
}
```

**Opción 2: Texto línea por línea**
```
Motor: 4 tiempos, monocilíndrico
Potencia: 20.5 HP @ 8500 rpm
Transmisión: 5 velocidades
Frenos: Disco adelante y atrás
```

### Ficha Técnica

Formato JSON estructurado:

```json
{
  "motor": {
    "tipo": "4 tiempos, SOHC",
    "cilindrada": "199.5cc",
    "potencia": "20.5 HP @ 8500 rpm",
    "torque": "18.1 Nm @ 7000 rpm",
    "refrigeracion": "Aire y aceite",
    "arranque": "Eléctrico"
  },
  "transmision": {
    "tipo": "Manual",
    "embrague": "Multidisco húmedo",
    "cambios": "5 velocidades"
  },
  "chasis": {
    "tipo": "Tubular doble cuna",
    "suspensionDelantera": "Telescópica",
    "suspensionTrasera": "Monoshock",
    "frenoDelantero": "Disco 270mm con ABS",
    "frenoTrasero": "Disco 200mm",
    "llantaDelantera": "90/90-17",
    "llantaTrasera": "130/70-17"
  },
  "dimensiones": {
    "largo": "2050mm",
    "ancho": "790mm",
    "alto": "1050mm",
    "distanciaEntreEjes": "1353mm",
    "alturaSillin": "800mm",
    "despejePiso": "180mm"
  },
  "capacidades": {
    "tanqueCombustible": "12 litros",
    "aceiteMotor": "1.1 litros",
    "peso": "148 kg",
    "cargaMaxima": "150 kg"
  }
}
```

## Uso del Sistema

### En el Código

#### 1. Hook para Listar Motos

```tsx
import { useMotos } from '@/hooks/useMotos';

function CatalogoMotos() {
  const { data: motos, isLoading, error } = useMotos({
    soloActivas: true  // Solo motos en el mercado
  });

  if (isLoading) return <div>Cargando...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <div>
      {motos?.map(moto => (
        <div key={moto.Id}>{moto.Modelo}</div>
      ))}
    </div>
  );
}
```

#### 2. Hook con Información Extendida

```tsx
import { useMotosExtendidas } from '@/hooks/useMotos';

function CatalogoExtendido() {
  const { data: motos } = useMotosExtendidas({ soloActivas: true });

  return (
    <div>
      {motos?.map(moto => (
        <div key={moto.Id}>
          <h2>{moto.Modelo}</h2>
          <p>{moto.Descripcion}</p>

          {/* Galería parseada automáticamente */}
          {moto.imagenesGaleria?.map(img => (
            <img key={img} src={img} alt={moto.Modelo} />
          ))}

          {/* Características parseadas */}
          {moto.caracteristicasObj && (
            <ul>
              {Object.entries(moto.caracteristicasObj).map(([key, value]) => (
                <li key={key}>{key}: {value}</li>
              ))}
            </ul>
          )}
        </div>
      ))}
    </div>
  );
}
```

#### 3. Componente de Detalles Completos

```tsx
import { MotoDetails } from '@/components/MotoDetails';
import { useMotoExtendida } from '@/hooks/useMotos';

function DetalleMoto({ id }: { id: number }) {
  const { data: moto } = useMotoExtendida(id);

  if (!moto) return null;

  return <MotoDetails moto={moto} />;
}
```

#### 4. Filtrar por Marca o Categoría

```tsx
import { useMotosByMarca, useMotosByCategoria } from '@/hooks/useMotos';

function MotosTVS() {
  const { data: motos } = useMotosByMarca('TVS');
  // ...
}

function MotosDeportivas() {
  const { data: motos } = useMotosByCategoria('deportiva');
  // ...
}
```

## Sincronización en Tiempo Real

### Polling Automático

El sistema puede sincronizarse automáticamente cada X segundos:

```tsx
import { useMotosPolling } from '@/hooks/useMotos';

function CatalogoLive() {
  // Actualiza cada 30 segundos
  const { data: motos } = useMotosPolling(30000);

  return <div>Motos siempre actualizadas</div>;
}
```

### Sincronización Manual

```tsx
import { useSincronizarMotos } from '@/hooks/useMotos';

function SyncButton() {
  const sync = useSincronizarMotos();

  return (
    <button
      onClick={() => sync.mutate()}
      disabled={sync.isPending}
    >
      {sync.isPending ? 'Sincronizando...' : 'Actualizar Catálogo'}
    </button>
  );
}
```

## Gestión de Motos

### Activar/Desactivar Motos

**Cuando un modelo sale del mercado:**
1. Ve a NocoDB
2. Encuentra la moto
3. Desmarca el campo `Activo`
4. La moto desaparecerá del catálogo automáticamente

**Cuando un modelo entra al mercado:**
1. Ve a NocoDB
2. Encuentra la moto o créala nueva
3. Marca el campo `Activo`
4. La moto aparecerá en el catálogo automáticamente

### Crear Nueva Moto

En NocoDB, agrega un nuevo registro con:

1. **Información básica**: Modelo, Marca, Categoría, Cilindrada
2. **Precios**: Precio_2026, Cuota_Inicial, Precio_Contado
3. **Slug**: Se genera automáticamente si no lo proporcionas
4. **Estado**: Marca `Activo` si debe mostrarse
5. **Información extendida** (opcional): Descripción, Características, Garantía, Ficha_Tecnica
6. **Imágenes** (opcional): Imagen_Principal, Galeria_Imagenes

### Actualizar Moto Existente

Simplemente edita los campos en NocoDB. Los cambios se reflejarán en el sitio según el intervalo de polling configurado (default: 30 segundos).

## Ejemplos de Uso

### Ejemplo Completo: Agregar Apache RTR 200

```
Modelo: APACHE RTR 200 4V XC FI ABS
Marca: TVS
Categoria: deportiva
Cilindrada: 200cc
Precio_2026: 13699000
Cuota_Inicial: 2377400
Precio_Contado: 14606500
Activo: ✓
slug: apache-rtr-200-4v-xc-fi-abs

Imagen_Principal: https://example.com/apache-200.webp

Galeria_Imagenes:
["https://example.com/apache-200-1.jpg", "https://example.com/apache-200-2.jpg"]

Descripcion:
La Apache RTR 200 4V es una motocicleta deportiva de alto rendimiento diseñada para quienes buscan velocidad y adrenalina. Con su motor de 4 válvulas y sistema de inyección electrónica, ofrece una experiencia de manejo única.

Caracteristicas:
Motor: 4 válvulas, refrigerado por aceite
Potencia: 20.5 HP @ 8500 rpm
Transmisión: 5 velocidades
Frenos: ABS de doble canal
Suspensión: Monoshock ajustable
Instrumentación: Digital con conectividad

Garantia:
2 años o 18,000 km, lo que ocurra primero. Incluye mantenimientos gratuitos durante el primer año.

Ficha_Tecnica:
{ver ejemplo JSON arriba}
```

### Ejemplo: Desactivar Modelo Descontinuado

Si el modelo **RAIDER 125 RACING EDITION** sale del mercado:

1. Busca el registro en NocoDB
2. Desmarca `Activo`
3. Guarda
4. El modelo ya no aparecerá en el catálogo web

## Preguntas Frecuentes

### ¿Cuánto tarda en actualizarse el sitio?

Por defecto, el sitio se actualiza cada 30 segundos mediante polling. Puedes ajustar este intervalo o forzar una sincronización manual.

### ¿Qué pasa si borro una moto de NocoDB?

La moto desaparecerá permanentemente del catálogo. Es preferible desactivarla para mantener el histórico.

### ¿Puedo tener motos sin precio?

Sí, pero se mostrará como 0. Es recomendable siempre agregar precios.

### ¿Las imágenes deben estar en NocoDB?

No, solo necesitas proporcionar las URLs públicas de las imágenes. Pueden estar en cualquier servidor.

## Soporte

Si tienes problemas o preguntas, contacta al equipo de desarrollo.
