/**
 * Página de Gestión de Asesores
 *
 * Permite a los administradores:
 * - Ver todos los asesores (activos, inactivos y retirados)
 * - Activar/desactivar asesores
 * - Marcar asesores como retirados
 * - Ver información de contacto
 *
 * Estados:
 * - 0 = Inactivo (temporalmente desactivado)
 * - 1 = Activo (trabajando actualmente)
 * - 2 = Retirado (ya no trabaja con nosotros)
 *
 * @module pages/admin/GestionAsesores
 */

import { useEffect, useState } from 'react';
import { AsesorService } from '@/services/nocodb/asesor.service';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Copy, ExternalLink } from 'lucide-react';
import { toast } from 'sonner';
import { appConfig } from '@/config/env';
import type { Asesor } from '@/types';

type FiltroEstado = 'todos' | 'activos' | 'inactivos' | 'retirados';

export default function GestionAsesores() {
  const [asesores, setAsesores] = useState<Asesor[]>([]);
  const [loading, setLoading] = useState(true);
  const [procesando, setProcesando] = useState<number | null>(null);
  const [filtro, setFiltro] = useState<FiltroEstado>('todos');

  // Cargar todos los asesores
  const cargarAsesores = async () => {
    try {
      setLoading(true);
      const todos = await AsesorService.getAll();
      setAsesores(todos);
    } catch (error) {
      console.error('Error al cargar asesores:', error);
      toast.error('Error al cargar la lista de asesores');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    cargarAsesores();
  }, []);

  // Activar asesor
  const handleActivar = async (id: number, nombre: string) => {
    try {
      setProcesando(id);
      await AsesorService.activar(id);
      toast.success(`✅ ${nombre} ha sido activado`);
      await cargarAsesores();
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
      await cargarAsesores();
    } catch (error) {
      console.error('Error al desactivar:', error);
      toast.error('Error al desactivar el asesor');
    } finally {
      setProcesando(null);
    }
  };

  // Marcar como retirado
  const handleMarcarComoRetirado = async (id: number, nombre: string) => {
    try {
      setProcesando(id);
      await AsesorService.marcarComoRetirado(id);
      toast.success(`👋 ${nombre} ha sido marcado como retirado`);
      await cargarAsesores();
    } catch (error) {
      console.error('Error al marcar como retirado:', error);
      toast.error('Error al marcar como retirado');
    } finally {
      setProcesando(null);
    }
  };

  // Filtrar asesores según el filtro seleccionado
  const asesoresFiltrados = asesores.filter(asesor => {
    if (filtro === 'activos') return asesor.Activo  == 1;
    if (filtro === 'inactivos') return asesor.Activo === 0;
    if (filtro === 'retirados') return asesor.Activo === 2;
    return true; // 'todos'
  });

  // Copiar URL del catálogo
  const copiarURLCatalogo = (slug: string, nombreAsesor: string) => {
    const url = `${appConfig.url}/${slug}`;
    navigator.clipboard.writeText(url);
    toast.success(`URL de ${nombreAsesor} copiada al portapapeles`);
  };

  // Estadísticas
  const asesoresActivos = asesores.filter(a => a.Activo  == 1).length;
  const asesoresInactivos = asesores.filter(a => a.Activo === 0).length;
  const asesoresRetirados = asesores.filter(a => a.Activo === 2).length;

  // Función helper para obtener info del estado
  const getEstadoInfo = (activo: number) => {
    switch (activo) {
      case 1:
        return {
          label: '✓ Activo',
          color: 'bg-green-100 text-green-800',
          dotColor: 'bg-green-500',
          borderColor: 'border-green-200 bg-green-50',
        };
      case 0:
        return {
          label: '⏸️ Inactivo',
          color: 'bg-gray-100 text-gray-800',
          dotColor: 'bg-gray-400',
          borderColor: 'border-gray-200 bg-gray-50',
        };
      case 2:
        return {
          label: '👋 Retirado',
          color: 'bg-orange-100 text-orange-800',
          dotColor: 'bg-orange-500',
          borderColor: 'border-orange-200 bg-orange-50',
        };
      default:
        return {
          label: '? Desconocido',
          color: 'bg-gray-100 text-gray-800',
          dotColor: 'bg-gray-400',
          borderColor: 'border-gray-200 bg-gray-50',
        };
    }
  };

  if (loading) {
    return (
      <div className="p-8 max-w-7xl mx-auto">
        <div className="flex items-center gap-3">
          <div className="animate-spin h-8 w-8 border-4 border-blue-600 border-t-transparent rounded-full" />
          <h1 className="text-3xl font-bold">Cargando asesores...</h1>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-2">⚙️ Gestión de Asesores</h1>
        <p className="text-gray-600">
          Administra el estado de los asesores en el sistema
        </p>
      </div>

      {/* Estadísticas */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-gray-600">
              Total Asesores
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{asesores.length}</p>
          </CardContent>
        </Card>

        <Card className="border-green-200 bg-green-50">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-green-800">
              ✓ Activos
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-green-700">{asesoresActivos}</p>
          </CardContent>
        </Card>

        <Card className="border-gray-200 bg-gray-50">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-gray-600">
              ⏸️ Inactivos
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-gray-700">{asesoresInactivos}</p>
          </CardContent>
        </Card>

        <Card className="border-orange-200 bg-orange-50">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-orange-800">
              👋 Retirados
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-orange-700">{asesoresRetirados}</p>
          </CardContent>
        </Card>
      </div>

      {/* Filtros */}
      <div className="mb-6 flex flex-wrap gap-2">
        <Button
          onClick={() => setFiltro('todos')}
          variant={filtro === 'todos' ? 'default' : 'outline'}
          size="sm"
        >
          Todos ({asesores.length})
        </Button>
        <Button
          onClick={() => setFiltro('activos')}
          variant={filtro === 'activos' ? 'default' : 'outline'}
          size="sm"
          className={filtro === 'activos' ? 'bg-green-600 hover:bg-green-700' : ''}
        >
          ✓ Activos ({asesoresActivos})
        </Button>
        <Button
          onClick={() => setFiltro('inactivos')}
          variant={filtro === 'inactivos' ? 'default' : 'outline'}
          size="sm"
          className={filtro === 'inactivos' ? 'bg-gray-600 hover:bg-gray-700' : ''}
        >
          ⏸️ Inactivos ({asesoresInactivos})
        </Button>
        <Button
          onClick={() => setFiltro('retirados')}
          variant={filtro === 'retirados' ? 'default' : 'outline'}
          size="sm"
          className={filtro === 'retirados' ? 'bg-orange-600 hover:bg-orange-700' : ''}
        >
          👋 Retirados ({asesoresRetirados})
        </Button>
      </div>

      {/* Lista de asesores */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Lista de Asesores</CardTitle>
              <CardDescription>
                Solo los asesores activos serán visibles para los clientes.
              </CardDescription>
            </div>
            <Button
              onClick={cargarAsesores}
              variant="outline"
              size="sm"
            >
              🔄 Recargar
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {asesoresFiltrados.map((asesor) => {
              const estadoInfo = getEstadoInfo(asesor.Activo);
              const estaProcesando = procesando === asesor.Id;

              return (
                <div
                  key={asesor.Id}
                  className={`flex items-center justify-between p-4 rounded-lg border transition-all ${estadoInfo.borderColor}`}
                >
                  <div className="flex items-center gap-4">
                    {/* Indicador de estado */}
                    <div className={`w-3 h-3 rounded-full flex-shrink-0 ${estadoInfo.dotColor}`} />

                    {/* Información del asesor */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-3 mb-1">
                        <p className="font-semibold text-lg">{asesor.Asesor}</p>
                        <span className={`text-xs font-medium px-2 py-1 rounded-full ${estadoInfo.color}`}>
                          {estadoInfo.label}
                        </span>
                      </div>
                      <div className="flex flex-wrap gap-4 text-sm text-gray-600">
                        <span className="flex items-center gap-1">
                          📞 {asesor.Phone}
                        </span>
                        {asesor.Email && (
                          <span className="flex items-center gap-1">
                            📧 {asesor.Email}
                          </span>
                        )}
                        <span className="text-gray-400">
                          ID: {asesor.Id}
                        </span>
                      </div>
                      {/* URL del catálogo si el asesor tiene slug y está activo */}
                      {asesor.slug && asesor.Activo  == 1 && (
                        <div className="mt-2 flex items-center gap-2">
                          <a
                            href={`${appConfig.url}/${asesor.slug}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-sm text-blue-600 hover:text-blue-800 flex items-center gap-1 hover:underline"
                          >
                            <ExternalLink className="w-3 h-3" />
                            {appConfig.url}/{asesor.slug}
                          </a>
                          <Button
                            onClick={() => copiarURLCatalogo(asesor.slug!, asesor.Asesor)}
                            variant="ghost"
                            size="sm"
                            className="h-6 px-2"
                          >
                            <Copy className="w-3 h-3" />
                          </Button>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Botones de acción */}
                  <div className="flex-shrink-0 flex gap-2">
                    {asesor.Activo  == 1 && (
                      <>
                        <Button
                          onClick={() => handleDesactivar(asesor.Id, asesor.Asesor)}
                          disabled={estaProcesando}
                          variant="outline"
                          size="sm"
                          className="border-gray-300 text-gray-700 hover:bg-gray-50"
                        >
                          {estaProcesando ? '⏳' : '⏸️'} Desactivar
                        </Button>
                        <Button
                          onClick={() => handleMarcarComoRetirado(asesor.Id, asesor.Asesor)}
                          disabled={estaProcesando}
                          variant="outline"
                          size="sm"
                          className="border-orange-300 text-orange-700 hover:bg-orange-50"
                        >
                          {estaProcesando ? '⏳' : '👋'} Retirar
                        </Button>
                      </>
                    )}

                    {asesor.Activo === 0 && (
                      <>
                        <Button
                          onClick={() => handleActivar(asesor.Id, asesor.Asesor)}
                          disabled={estaProcesando}
                          variant="outline"
                          size="sm"
                          className="border-green-300 text-green-700 hover:bg-green-50"
                        >
                          {estaProcesando ? '⏳' : '▶️'} Activar
                        </Button>
                        <Button
                          onClick={() => handleMarcarComoRetirado(asesor.Id, asesor.Asesor)}
                          disabled={estaProcesando}
                          variant="outline"
                          size="sm"
                          className="border-orange-300 text-orange-700 hover:bg-orange-50"
                        >
                          {estaProcesando ? '⏳' : '👋'} Retirar
                        </Button>
                      </>
                    )}

                    {asesor.Activo === 2 && (
                      <Button
                        onClick={() => handleActivar(asesor.Id, asesor.Asesor)}
                        disabled={estaProcesando}
                        variant="outline"
                        size="sm"
                        className="border-green-300 text-green-700 hover:bg-green-50"
                      >
                        {estaProcesando ? '⏳ Procesando...' : '🔄 Reactivar'}
                      </Button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Mensaje si no hay asesores */}
          {asesoresFiltrados.length === 0 && (
            <div className="text-center py-12">
              <p className="text-gray-500 text-lg mb-4">
                No hay asesores {filtro === 'todos' ? '' : filtro}
              </p>
              <Button onClick={() => setFiltro('todos')} variant="outline">
                Ver todos
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Información adicional */}
      <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
        <h3 className="font-bold text-blue-900 mb-2">ℹ️ Información sobre Estados</h3>
        <ul className="text-sm text-blue-800 space-y-2">
          <li className="flex items-start gap-2">
            <span className="font-semibold min-w-[90px]">✓ Activo:</span>
            <span>El asesor está trabajando actualmente y es visible para los clientes.</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="font-semibold min-w-[90px]">⏸️ Inactivo:</span>
            <span>El asesor está temporalmente desactivado (vacaciones, enfermedad, etc.). Puede reactivarse fácilmente.</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="font-semibold min-w-[90px]">👋 Retirado:</span>
            <span>El asesor ya no trabaja con nosotros, pero conservamos su información en caso de que regrese en el futuro.</span>
          </li>
        </ul>
      </div>
    </div>
  );
}
