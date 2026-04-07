/**
 * Página de prueba para demostrar Context API
 *
 * 🎓 CONCEPTO: Compartir estado entre componentes
 *
 * Esta página demuestra cómo múltiples componentes pueden:
 * 1. Acceder al mismo estado (asesor seleccionado)
 * 2. Modificar ese estado
 * 3. Reaccionar automáticamente a cambios
 *
 * TODO sin prop drilling (pasar props manualmente)
 *
 * @module pages/TestContext
 */

import { useEffect, useState } from 'react';
import { useAsesores } from '@/hooks/useAsesores';
import { useAsesorContext } from '@/contexts';
import { useChatwoot } from '@/hooks/useChatwoot';
import { chatwootConfig } from '@/config/env';
import { AsesorService } from '@/services/nocodb/asesor.service';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from 'sonner';
import type { Asesor } from '@/types';

/**
 * 🎓 COMPONENTE 1: Selector de Asesores
 * Este componente muestra la lista y permite seleccionar
 */
function SelectorAsesores() {
  const { asesores, loading } = useAsesores({ soloActivos: true });
  const { seleccionarAsesor, asesorActual } = useAsesorContext();

  if (loading) {
    return <div className="text-gray-500">Cargando asesores...</div>;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>📋 Lista de Asesores</CardTitle>
        <CardDescription>
          Selecciona un asesor para ver su información en el panel derecho
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          {asesores.map((asesor) => (
            <button
              key={asesor.Id}
              onClick={() => seleccionarAsesor(asesor)}
              className={`w-full text-left p-3 rounded-lg border transition-all ${
                asesorActual?.Id === asesor.Id
                  ? 'border-blue-500 bg-blue-50 font-semibold'
                  : 'border-gray-200 hover:border-blue-300 hover:bg-gray-50'
              }`}
            >
              <div className="flex items-center justify-between">
                <span>{asesor.Asesor}</span>
                {asesorActual?.Id === asesor.Id && (
                  <span className="text-blue-600">✓ Seleccionado</span>
                )}
              </div>
            </button>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

/**
 * 🎓 COMPONENTE 2: Detalles del Asesor
 * Este componente solo muestra información
 * NO recibe props, obtiene todo del Context
 */
function DetallesAsesor() {
  const { asesorActual, limpiarAsesor, hayAsesorSeleccionado } = useAsesorContext();

  if (!hayAsesorSeleccionado) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>👤 Detalles del Asesor</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-12 text-gray-500">
            <p className="text-4xl mb-4">🤷</p>
            <p>No hay ningún asesor seleccionado</p>
            <p className="text-sm mt-2">Selecciona uno de la lista</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>👤 Detalles del Asesor</CardTitle>
        <CardDescription>
          Información completa del asesor seleccionado
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {/* Nombre */}
          <div>
            <label className="text-sm font-medium text-gray-500">Nombre</label>
            <p className="text-lg font-semibold">{asesorActual!.Asesor}</p>
          </div>

          {/* Teléfono */}
          <div>
            <label className="text-sm font-medium text-gray-500">Teléfono</label>
            <p className="flex items-center gap-2">
              📞 {asesorActual!.Phone}
            </p>
          </div>

          {/* Email */}
          {asesorActual!.Email && (
            <div>
              <label className="text-sm font-medium text-gray-500">Email</label>
              <p className="flex items-center gap-2">
                📧 {asesorActual!.Email}
              </p>
            </div>
          )}

          {/* Estado */}
          {asesorActual!.Activo !== undefined && (
            <div>
              <label className="text-sm font-medium text-gray-500">Estado</label>
              <div className="mt-1">
                <span
                  className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${
                    asesorActual!.Activo  == 1
                      ? 'bg-green-100 text-green-800'
                      : 'bg-gray-100 text-gray-800'
                  }`}
                >
                  {asesorActual!.Activo  == 1 ? '✓ Activo' : '○ Inactivo'}
                </span>
              </div>
            </div>
          )}

          {/* ID */}
          <div>
            <label className="text-sm font-medium text-gray-500">ID</label>
            <p className="text-sm text-gray-600">{asesorActual!.Id}</p>
          </div>

          {/* Fechas */}
          <div>
            <label className="text-sm font-medium text-gray-500">Registrado</label>
            <p className="text-sm text-gray-600">
              {new Date(asesorActual!.CreatedAt).toLocaleDateString('es-ES')}
            </p>
          </div>

          {/* Botón limpiar */}
          <div className="pt-4 border-t">
            <Button onClick={limpiarAsesor} variant="outline" className="w-full">
              🧹 Limpiar Selección
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

/**
 * 🎓 COMPONENTE 3: Resumen en Header
 * Este componente muestra un resumen en la parte superior
 * También usa el Context, completamente independiente de los otros
 */
function HeaderResumen() {
  const { asesorActual, hayAsesorSeleccionado } = useAsesorContext();

  return (
    <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white p-6 rounded-lg shadow-lg">
      <h1 className="text-3xl font-bold mb-2">
        ✨ Demo: Context API
      </h1>
      <p className="text-blue-100">
        {hayAsesorSeleccionado ? (
          <>
            Asesor seleccionado: <strong>{asesorActual!.Asesor}</strong>
          </>
        ) : (
          'Ningún asesor seleccionado'
        )}
      </p>
    </div>
  );
}

/**
 * 🎓 COMPONENTE 4: Gestionar Asesores
 * Este componente permite activar/desactivar asesores
 */
function GestionarAsesores() {
  const [asesores, setAsesores] = useState<Asesor[]>([]);
  const [loading, setLoading] = useState(true);
  const [procesando, setProcesando] = useState<number | null>(null);

  // Cargar todos los asesores (activos e inactivos)
  const cargarAsesores = async () => {
    try {
      setLoading(true);
      const todos = await AsesorService.getAll(); // Sin filtro = todos
      setAsesores(todos);
    } catch (error) {
      console.error('Error al cargar asesores:', error);
      toast.error('Error al cargar la lista de asesores');
    } finally {
      setLoading(false);
    }
  };

  // Cargar al montar el componente
  useEffect(() => {
    cargarAsesores();
  }, []);

  // Activar asesor
  const handleActivar = async (id: number, nombre: string) => {
    try {
      setProcesando(id);
      await AsesorService.activar(id);
      toast.success(`✅ ${nombre} ha sido activado`);
      await cargarAsesores(); // Recargar lista
    } catch (error) {
      console.error('Error al activar:', error);
      toast.error('Error al activar el asesor');
    } finally {
      setProcesando(null);
    }
  };

  // Desactivar asesor
  const handleDesactivar = async (id: number, nombre: string) => {
    try {
      setProcesando(id);
      await AsesorService.desactivar(id);
      toast.success(`⏸️ ${nombre} ha sido desactivado`);
      await cargarAsesores(); // Recargar lista
    } catch (error) {
      console.error('Error al desactivar:', error);
      toast.error('Error al desactivar el asesor');
    } finally {
      setProcesando(null);
    }
  };

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>⚙️ Gestionar Asesores</CardTitle>
          <CardDescription>
            Activa o desactiva asesores desde aquí
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-gray-500">
            <p>⏳ Cargando asesores...</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>⚙️ Gestionar Asesores</CardTitle>
        <CardDescription>
          Activa o desactiva asesores. Solo los asesores activos aparecerán en la lista de selección.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {asesores.map((asesor) => {
            const estaActivo = asesor.Activo  == 1;
            const estaProcesando = procesando === asesor.Id;

            return (
              <div
                key={asesor.Id}
                className={`flex items-center justify-between p-4 rounded-lg border transition-all ${
                  estaActivo
                    ? 'border-green-200 bg-green-50'
                    : 'border-gray-200 bg-gray-50'
                }`}
              >
                <div className="flex items-center gap-3">
                  {/* Indicador de estado */}
                  <div
                    className={`w-3 h-3 rounded-full ${
                      estaActivo ? 'bg-green-500' : 'bg-gray-400'
                    }`}
                  />

                  {/* Información del asesor */}
                  <div>
                    <p className="font-semibold">{asesor.Asesor}</p>
                    <p className="text-sm text-gray-600">{asesor.Phone}</p>
                  </div>
                </div>

                {/* Botón de acción */}
                <div className="flex items-center gap-3">
                  {/* Badge de estado */}
                  <span
                    className={`text-xs font-medium px-2 py-1 rounded-full ${
                      estaActivo
                        ? 'bg-green-100 text-green-800'
                        : 'bg-gray-100 text-gray-800'
                    }`}
                  >
                    {estaActivo ? '✓ Activo' : '○ Inactivo'}
                  </span>

                  {/* Botón */}
                  {estaActivo ? (
                    <Button
                      onClick={() => handleDesactivar(asesor.Id, asesor.Asesor)}
                      disabled={estaProcesando}
                      variant="outline"
                      size="sm"
                      className="border-red-300 text-red-700 hover:bg-red-50"
                    >
                      {estaProcesando ? '⏳' : '⏸️'} Desactivar
                    </Button>
                  ) : (
                    <Button
                      onClick={() => handleActivar(asesor.Id, asesor.Asesor)}
                      disabled={estaProcesando}
                      variant="outline"
                      size="sm"
                      className="border-green-300 text-green-700 hover:bg-green-50"
                    >
                      {estaProcesando ? '⏳' : '▶️'} Activar
                    </Button>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Botón para recargar */}
        <div className="mt-4 pt-4 border-t">
          <Button
            onClick={cargarAsesores}
            variant="outline"
            size="sm"
            className="w-full"
          >
            🔄 Recargar Lista
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

/**
 * 🎓 COMPONENTE PRINCIPAL
 * Ensambla todos los componentes
 *
 * NOTA IMPORTANTE: Ninguno de estos componentes recibe props
 * Todos obtienen su información del Context directamente
 */
export default function TestContext() {
  const { asesorActual } = useAsesorContext();
  const { isLoaded, isLoading, setAsesor, openChat } = useChatwoot({
    websiteToken: chatwootConfig.websiteToken,
    autoLoad: true,
  });

  // Configurar Chatwoot cuando cambia el asesor
  useEffect(() => {
    if (isLoaded && asesorActual) {
      setAsesor(asesorActual.Asesor, asesorActual.Id);
    }
  }, [isLoaded, asesorActual, setAsesor]);

  return (
    <div className="p-8 max-w-7xl mx-auto">
      {/* Header con resumen */}
      <HeaderResumen />

      {/* Explicación */}
      <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
        <h3 className="font-bold text-yellow-900 mb-2">
          🎓 Qué está pasando aquí:
        </h3>
        <ul className="text-sm text-yellow-800 space-y-1">
          <li>• <strong>SelectorAsesores</strong>: Lee y modifica el contexto</li>
          <li>• <strong>DetallesAsesor</strong>: Solo lee el contexto</li>
          <li>• <strong>HeaderResumen</strong>: Solo lee el contexto</li>
          <li>• <strong>Chatwoot</strong>: Se configura automáticamente con el asesor seleccionado</li>
          <li>• Ningún componente recibe props de su padre</li>
          <li>• Todos se sincronizan automáticamente</li>
          <li>• Abre la consola (F12) para ver los logs</li>
        </ul>
      </div>

      {/* Estado de Chatwoot */}
      <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
        <h3 className="font-bold text-blue-900 mb-2">
          💬 Integración con Chatwoot
        </h3>
        <div className="flex items-center justify-between">
          <div className="text-sm text-blue-800">
            <p>
              Estado: {' '}
              {isLoading && <span className="font-semibold">⏳ Cargando...</span>}
              {isLoaded && <span className="font-semibold text-green-700">✅ Conectado</span>}
              {!isLoading && !isLoaded && <span className="font-semibold text-red-700">❌ No cargado</span>}
            </p>
            {asesorActual && isLoaded && (
              <p className="mt-1">
                Configurado para: <strong>{asesorActual.Asesor}</strong>
              </p>
            )}
          </div>
          <Button
            onClick={openChat}
            disabled={!isLoaded || !asesorActual}
            className="bg-blue-600 hover:bg-blue-700"
          >
            💬 Abrir Chat
          </Button>
        </div>
      </div>

      {/* Grid con los componentes */}
      <div className="mt-6 grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Columna izquierda: Selector */}
        <div>
          <SelectorAsesores />
        </div>

        {/* Columna derecha: Detalles */}
        <div>
          <DetallesAsesor />
        </div>
      </div>

      {/* Gestión de asesores */}
      <div className="mt-6">
        <GestionarAsesores />
      </div>

      {/* Info adicional */}
      <div className="mt-8 p-6 bg-gray-50 border border-gray-200 rounded-lg">
        <h3 className="font-bold text-lg mb-3">🧪 Experimento:</h3>
        <div className="space-y-2 text-sm text-gray-700">
          <p>1. Selecciona un asesor de la lista</p>
          <p>2. Observa cómo se actualiza:</p>
          <ul className="ml-6 space-y-1">
            <li>• El header superior (HeaderResumen)</li>
            <li>• El panel de detalles (DetallesAsesor)</li>
            <li>• El botón en la lista (SelectorAsesores)</li>
          </ul>
          <p className="mt-3 font-semibold">
            Todo esto SIN pasar props entre componentes 🎉
          </p>
        </div>

        <div className="mt-4 pt-4 border-t">
          <h4 className="font-bold mb-2">📚 Comparación:</h4>
          <div className="grid md:grid-cols-2 gap-4 text-sm">
            <div className="p-3 bg-red-50 border border-red-200 rounded">
              <p className="font-semibold text-red-900 mb-1">❌ Sin Context (Props):</p>
              <code className="text-xs text-red-800">
                App → Padre → Hijo1 → Hijo2 → Hijo3
              </code>
              <p className="text-red-700 mt-2 text-xs">
                Props deben pasar por TODOS los niveles
              </p>
            </div>
            <div className="p-3 bg-green-50 border border-green-200 rounded">
              <p className="font-semibold text-green-900 mb-1">✅ Con Context:</p>
              <code className="text-xs text-green-800">
                Provider → Cualquier componente
              </code>
              <p className="text-green-700 mt-2 text-xs">
                Acceso directo desde cualquier lugar
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/**
 * 🎓 RESUMEN DE ESTA DEMO:
 *
 * ANTES (con props):
 * ```tsx
 * function App() {
 *   const [asesor, setAsesor] = useState(null);
 *   return (
 *     <Padre asesor={asesor} onChange={setAsesor}>
 *       <Hijo1 asesor={asesor}>
 *         <Hijo2 asesor={asesor} onChange={setAsesor}>
 *           <Hijo3 asesor={asesor} />
 *         </Hijo2>
 *       </Hijo1>
 *     </Padre>
 *   );
 * }
 * ```
 * Problema: Props drilling (pasar props por muchos niveles)
 *
 * DESPUÉS (con Context):
 * ```tsx
 * function App() {
 *   return (
 *     <AsesorProvider>
 *       <Padre>
 *         <Hijo1>
 *           <Hijo2>
 *             <Hijo3 />
 *           </Hijo2>
 *         </Hijo1>
 *       </Padre>
 *     </AsesorProvider>
 *   );
 * }
 *
 * function Hijo3() {
 *   const { asesor, setAsesor } = useAsesorContext();
 *   // ¡Acceso directo! Sin props
 * }
 * ```
 * Solución: Acceso directo desde cualquier componente
 */
