# 🚀 Guía Rápida: Catálogo con NocoDB

## ✅ Estado Actual

- ✅ Conexión a NocoDB configurada y funcionando
- ✅ Tabla `lista_de_precios` conectada
- ✅ Token configurado correctamente
- ✅ **1 moto activa** en el catálogo

## 📋 Estructura Real de la Base de Datos

Tu tabla en NocoDB tiene estos campos:

### Información Básica
- `Id` - ID único (auto-generado)
- `Productos_motos` - Nombre del producto/moto
- `Marca` - Marca (Tvs, Victory, Kymco, etc.)
- `Categoria` - Categoría (Trabajo, Sport, Deportiva, etc.)
- `Categoria_Cilindraje` - Cilindrada (100, 125, 200, etc.)
- `Modelo` - Año/modelo

### Precios
- `Precio_comercial` - Precio financiado
- `cuota_inicial` - Cuota inicial
- `precio_de_contado` - Precio de contado
- `vueltas_transito_de_contado` - Vueltas tránsito contado
- `vueltas_transito_con_prenda` - Vueltas tránsito con prenda
- `precio_con_descuento` - Precio con descuento
- `Bono_de_descuento` - Bono de descuento

### Información Extendida
- `descripcion_rapida` - Descripción en Markdown
- `caracteristicas y beneficios` - Características en Markdown
- `ficha_tecnica` - Especificaciones técnicas en Markdown
- `garantia` - Información de garantía en Markdown/HTML

### Recursos
- `Fotos_imagenes_motos` - Array de imágenes (subidas a NocoDB)
- `manual_de_propietario` - Array de PDFs
- `pagina_principal_auteco` - URL de la página oficial

### Estado
- `Activo` - 1 = mostrar en catálogo, 0 = ocultar
- `motos_disponibles` - Estado de disponibilidad

## 🎯 Cómo Activar el Sistema

### Paso 1: Activar más motos en NocoDB

Actualmente solo tienes 1 moto activa. Para mostrar más motos:

1. Ve a NocoDB: https://nocodb.autorunai.tech
2. Abre la tabla "lista_de_precios"
3. Para cada moto que quieras mostrar:
   - Marca el campo `Activo` con el valor `1`
   - Guarda los cambios
4. Las motos aparecerán automáticamente en el catálogo

### Paso 2: Activar la página con NocoDB

Opción A - **Migración completa** (Recomendado):
```bash
cd /root/opt/catalogo-serviautec
mv src/pages/Index.tsx src/pages/Index.backup.tsx
mv src/pages/IndexNocoDB.tsx src/pages/Index.tsx
npm run dev
```

Opción B - **Prueba gradual**:
Mantén el sistema actual y usa los hooks de NocoDB en componentes específicos.

### Paso 3: Verificar que funciona

```bash
cd /root/opt/catalogo-serviautec
npm run dev
```

Abre http://localhost:8080 y deberías ver las motos desde NocoDB.

## 📝 Formato de Contenido

### Descripción Rápida
```markdown
# TVS SPORT 100

La **TVS SPORT 100** es insignia en calidad, economía y comodidad.
Su motor de **99 cc** con tecnología **Duralife** provee un
transporte confiable y eficiente.
```

### Características y Beneficios
```markdown
# CARACTERÍSTICAS Y BENEFICIOS

## DURALIFE
Esta tecnología hace al motor más durable y eficiente.

## SBT (Sistema de Frenado Conjunto)
Activa el freno delantero y trasero simultáneamente.

## Encendido Eléctrico
Fácil y cómoda de conducir.
```

### Ficha Técnica
```markdown
# FICHA TÉCNICA

## Motor
- **Cilindraje:** 99.7 cc
- **Motor:** 4 tiempos, monocilíndrico
- **Potencia Máxima:** 7.38 HP @ 7500 rpm

## Transmisión
- **Transmisión:** Mecánica 4 velocidades
- **Arranque:** Eléctrico y pedal

## Dimensiones y Pesos
- **Largo Total:** 1950 mm
- **Peso Neto:** 100 kg
```

### Garantía
```markdown
# GARANTÍA

**Vigencia Total:** 36 meses o 36,000 km (lo que ocurra primero).

| Etapa | Vigencia | Kilómetros |
|-------|----------|------------|
| Legal | 6 meses  | 6,000      |
| Suplementaria | 30 meses | 30,000 |
```

## 🔄 Gestión de Motos

### Agregar Nueva Moto
1. En NocoDB, crea un nuevo registro
2. Llena los campos obligatorios:
   - `Productos_motos`
   - `Marca`
   - `Categoria`
   - `Precio_comercial`
   - `cuota_inicial`
   - `precio_de_contado`
3. Sube imágenes en `Fotos_imagenes_motos`
4. Marca `Activo = 1`
5. Guarda

### Quitar del Catálogo
1. Encuentra la moto en NocoDB
2. Cambia `Activo` de `1` a `0`
3. La moto desaparece del catálogo (pero se conserva en la BD)

### Actualizar Precios
1. Edita los campos de precio en NocoDB
2. Los cambios se reflejan en máximo 30 segundos

## 🎨 Componentes Disponibles

### Mostrar Listado de Motos
```tsx
import { useMotos } from '@/hooks/useMotos';

function MisMotos() {
  const { data: motos, isLoading } = useMotos({ soloActivas: true });

  if (isLoading) return <div>Cargando...</div>;

  return (
    <div>
      {motos?.map(moto => (
        <div key={moto.Id}>
          <h3>{moto.Productos_motos}</h3>
          <p>Marca: {moto.Marca}</p>
          <p>Precio: ${moto.Precio_comercial?.toLocaleString()}</p>
        </div>
      ))}
    </div>
  );
}
```

### Mostrar Detalles Extendidos
```tsx
import { useMotoExtendida } from '@/hooks/useMotos';
import { MotoDetails } from '@/components/MotoDetails';

function DetalleMoto({ id }) {
  const { data: moto } = useMotoExtendida(id);

  if (!moto) return null;

  return (
    <div>
      <h1>{moto.Productos_motos}</h1>
      <img src={moto.imagenPrincipal} alt={moto.Productos_motos} />

      {/* Componente con tabs: Descripción, Características, Garantía, Ficha Técnica */}
      <MotoDetails moto={moto} />
    </div>
  );
}
```

### Filtrar por Marca
```tsx
import { useMotosByMarca } from '@/hooks/useMotos';

function MotosTVS() {
  const { data: motos } = useMotosByMarca('Tvs');

  return <div>Motos TVS: {motos?.length}</div>;
}
```

## 📊 Estadísticas

```tsx
import { useEstadisticasMotos } from '@/hooks/useMotos';

function Stats() {
  const { data: stats } = useEstadisticasMotos();

  return (
    <div>
      <p>Total: {stats?.total}</p>
      <p>Activas: {stats?.activas}</p>
      <p>Por Marca: {JSON.stringify(stats?.porMarca)}</p>
    </div>
  );
}
```

## 🐛 Solución de Problemas

### No veo ninguna moto
**Solución**: Verifica que tengas motos con `Activo = 1` en NocoDB

### Las imágenes no cargan
**Solución**: Las imágenes usan `signedPath` de NocoDB, verifica que estén subidas correctamente

### Los cambios no se reflejan
**Solución**:
- Espera 30 segundos (polling automático)
- O presiona el botón "Actualizar" en la interfaz

## 📚 Archivos Importantes

- `src/types/moto.ts` - Tipos adaptados a tu BD
- `src/services/nocodb/moto.service.ts` - Servicio adaptado
- `src/hooks/useMotos.ts` - Hooks de React
- `src/components/MotoDetails.tsx` - Componente de detalles
- `src/pages/IndexNocoDB.tsx` - Página de ejemplo

## 🎯 Próximos Pasos Recomendados

1. ✅ Activa más motos en NocoDB (cambiar `Activo` a `1`)
2. ✅ Sube imágenes a las motos que no las tengan
3. ✅ Completa los campos de descripción, características y ficha técnica
4. ✅ Activa la página IndexNocoDB.tsx
5. ✅ Prueba el catálogo en desarrollo
6. ✅ Despliega a producción

---

**¡El sistema está listo para usar!** 🚀

Solo necesitas activar más motos en NocoDB cambiando el campo `Activo` a `1`.
