/**
 * Página de prueba REFACTORIZADA usando el hook useAsesores
 *
 * 🎓 COMPARACIÓN:
 *
 * ANTES (TestAsesores.tsx):
 * - 30+ líneas de código
 * - useState manual
 * - useEffect manual
 * - Manejo de errores manual
 * - Loading state manual
 *
 * DESPUÉS (este archivo):
 * - 1 línea para obtener datos
 * - Todo el manejo lo hace el hook
 * - Código más limpio y legible
 *
 * @module pages/TestAsesoresV2
 */

import { useAsesores } from '@/hooks/useAsesores';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useState } from 'react';

export default function TestAsesoresV2() {
  // 🎓 CONCEPTO: Simplificación con Custom Hook
  // TODA la lógica está en el hook
  // El componente solo se preocupa de la UI
  const { asesores, loading, error, refetch, buscar } = useAsesores({
    soloActivos: false,
    onSuccess: (data) => {
    },
    onError: (err) => {
      console.error('💥 Callback: Error!', err.message);
    },
  });

  // Estado local solo para el input de búsqueda
  const [searchQuery, setSearchQuery] = useState('');

  // Handler para búsqueda
  const handleBuscar = () => {
    if (searchQuery.trim()) {
      buscar(searchQuery);
    } else {
      refetch(); // Si está vacío, mostrar todos
    }
  };

  // 🎓 NOTA: Mira qué simple es ahora el componente
  // No hay useState para asesores, loading, error
  // No hay useEffect
  // No hay try/catch
  // ¡Todo lo maneja el hook!

  // Mostrar loading
  if (loading) {
    return (
      <div className="p-8">
        <div className="flex items-center gap-3">
          <div className="animate-spin h-6 w-6 border-2 border-blue-600 border-t-transparent rounded-full" />
          <h1 className="text-2xl font-bold">Cargando asesores...</h1>
        </div>
      </div>
    );
  }

  // Mostrar error
  if (error) {
    return (
      <div className="p-8">
        <h1 className="text-2xl font-bold mb-4 text-red-600">
          ❌ Error al cargar asesores
        </h1>
        <div className="bg-red-50 border border-red-200 rounded p-4 mb-4">
          <p className="text-red-800">{error}</p>
        </div>
        <Button onClick={refetch} variant="outline">
          🔄 Reintentar
        </Button>
      </div>
    );
  }

  // Mostrar asesores
  return (
    <div className="p-8 max-w-6xl mx-auto">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-2">
          ✅ Asesores V2 (con Custom Hook)
        </h1>
        <p className="text-gray-600">
          Total: <strong>{asesores.length}</strong> asesores
        </p>
      </div>

      {/* Barra de búsqueda */}
      <div className="mb-6 flex gap-2">
        <Input
          type="text"
          placeholder="Buscar por nombre..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              handleBuscar();
            }
          }}
          className="max-w-md"
        />
        <Button onClick={handleBuscar}>
          🔍 Buscar
        </Button>
        <Button onClick={refetch} variant="outline">
          🔄 Recargar
        </Button>
      </div>

      {/* Mensaje si hay cache */}
      <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded text-sm">
        💡 <strong>Tip:</strong> Si recargas la página en los próximos 5 minutos,
        verás el cache en acción (será instantáneo).
      </div>

      {/* Grid de asesores */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {asesores.map((asesor) => (
          <div
            key={asesor.Id}
            className="border rounded-lg p-4 hover:shadow-lg transition-all hover:scale-105"
          >
            {/* Nombre */}
            <h3 className="text-lg font-semibold mb-2">{asesor.Asesor}</h3>

            {/* Info */}
            <div className="space-y-1 text-sm text-gray-600">
              <p className="flex items-center gap-2">
                <span>📞</span>
                <span>{asesor.Phone}</span>
              </p>

              {asesor.Email && (
                <p className="flex items-center gap-2">
                  <span>📧</span>
                  <span className="truncate">{asesor.Email}</span>
                </p>
              )}

              {asesor.slug && (
                <p className="flex items-center gap-2 text-blue-600">
                  <span>🔗</span>
                  <span className="truncate">autorunai.tech/{asesor.slug}</span>
                </p>
              )}

              {asesor.whatsapp && (
                <p className="flex items-center gap-2 text-green-600">
                  <span>💬</span>
                  <span>{asesor.whatsapp}</span>
                </p>
              )}
            </div>

            {/* Badge de estado */}
            <div className="mt-3 flex items-center justify-between">
              <span className="text-xs text-gray-500">ID: {asesor.Id}</span>

              {asesor.activo !== undefined && (
                <span
                  className={`inline-block px-2 py-1 rounded text-xs font-medium ${
                    asesor.activo
                      ? 'bg-green-100 text-green-800'
                      : 'bg-gray-100 text-gray-800'
                  }`}
                >
                  {asesor.activo ? '✓ Activo' : '○ Inactivo'}
                </span>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Mensaje si no hay resultados */}
      {asesores.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg">
            No se encontraron asesores
          </p>
          <Button onClick={refetch} variant="outline" className="mt-4">
            Mostrar todos
          </Button>
        </div>
      )}

      {/* Info de desarrollo */}
      <div className="mt-8 p-4 bg-gray-50 border border-gray-200 rounded">
        <h3 className="font-bold mb-2">🧪 Modo Desarrollo</h3>
        <p className="text-sm text-gray-600 mb-2">
          Abre la consola (F12) para ver los logs del hook.
        </p>
        <div className="flex gap-2">
          <Button
            size="sm"
            variant="secondary"
            onClick={() => {
              console.clear();
            }}
          >
            Limpiar Consola
          </Button>
          <Button
            size="sm"
            variant="secondary"
            onClick={() => {
              // Forzar recarga sin cache
              window.location.reload();
            }}
          >
            Recarga Completa
          </Button>
        </div>
      </div>
    </div>
  );
}

/**
 * 🎓 COMPARACIÓN DE CÓDIGO:
 *
 * ===== ANTES =====
 * const [asesores, setAsesores] = useState<Asesor[]>([]);
 * const [loading, setLoading] = useState(true);
 * const [error, setError] = useState<string | null>(null);
 *
 * useEffect(() => {
 *   async function cargarAsesores() {
 *     try {
 *       setLoading(true);
 *       const data = await AsesorService.getAll();
 *       setAsesores(data);
 *       setError(null);
 *     } catch (err) {
 *       setError(err.message);
 *     } finally {
 *       setLoading(false);
 *     }
 *   }
 *   cargarAsesores();
 * }, []);
 *
 * ===== DESPUÉS =====
 * const { asesores, loading, error, refetch } = useAsesores();
 *
 * ¡De 20 líneas a 1 línea!
 * Y con más funcionalidad (cache, refetch, callbacks)
 */
