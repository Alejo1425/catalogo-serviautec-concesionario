/**
 * Página de PRUEBA para verificar el servicio de Asesores
 *
 * 🎓 CONCEPTO: Testing Manual
 * Antes de crear la UI completa, probamos que el servicio funciona.
 *
 * Esta página:
 * 1. Obtiene todos los asesores de NocoDB
 * 2. Los muestra en una lista simple
 * 3. Nos dice si hay errores
 *
 * @module pages/TestAsesores
 */

import { useEffect, useState } from 'react';
import { AsesorService } from '@/services';
import type { Asesor } from '@/types';

export default function TestAsesores() {
  // 🎓 CONCEPTO: React State
  // Guardamos los asesores, loading, y errores en el estado
  const [asesores, setAsesores] = useState<Asesor[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // 🎓 CONCEPTO: useEffect
  // Se ejecuta cuando el componente se monta (aparece en pantalla)
  useEffect(() => {
    // Función async para obtener datos
    async function cargarAsesores() {
      try {

        // Llamar al servicio
        const data = await AsesorService.getAll();


        // Guardar en el estado
        setAsesores(data);
        setError(null);
      } catch (err) {
        console.error('❌ Error al cargar asesores:', err);

        // Guardar error
        setError(err instanceof Error ? err.message : 'Error desconocido');
      } finally {
        // Siempre quitar loading al final
        setLoading(false);
      }
    }

    cargarAsesores();
  }, []); // [] = solo ejecutar una vez al montar

  // Mostrar loading
  if (loading) {
    return (
      <div className="p-8">
        <h1 className="text-2xl font-bold mb-4">🔄 Cargando asesores...</h1>
      </div>
    );
  }

  // Mostrar error si hay
  if (error) {
    return (
      <div className="p-8">
        <h1 className="text-2xl font-bold mb-4 text-red-600">
          ❌ Error al cargar asesores
        </h1>
        <div className="bg-red-50 border border-red-200 rounded p-4">
          <p className="text-red-800">{error}</p>
        </div>
        <div className="mt-4">
          <h2 className="font-bold mb-2">Cosas a verificar:</h2>
          <ul className="list-disc list-inside space-y-1">
            <li>¿Está el archivo .env configurado?</li>
            <li>¿Es correcto el token de NocoDB?</li>
            <li>¿Está NocoDB funcionando?</li>
          </ul>
        </div>
      </div>
    );
  }

  // Mostrar asesores
  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">
        ✅ Asesores cargados exitosamente
      </h1>

      <p className="mb-4 text-gray-600">
        Total de asesores: <strong>{asesores.length}</strong>
      </p>

      <div className="grid gap-4">
        {asesores.map((asesor) => (
          <div
            key={asesor.Id}
            className="border rounded-lg p-4 hover:shadow-lg transition-shadow"
          >
            <div className="flex justify-between items-start">
              <div>
                <h3 className="text-lg font-semibold">{asesor.Asesor}</h3>
                <p className="text-gray-600">📞 {asesor.Phone}</p>
                {asesor.Email && (
                  <p className="text-gray-600">📧 {asesor.Email}</p>
                )}
                {asesor.slug && (
                  <p className="text-sm text-blue-600 mt-2">
                    🔗 autorunai.tech/{asesor.slug}
                  </p>
                )}
              </div>

              <div className="text-right text-sm text-gray-500">
                <p>ID: {asesor.Id}</p>
                {asesor.activo !== undefined && (
                  <span
                    className={`inline-block px-2 py-1 rounded mt-2 ${
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
          </div>
        ))}
      </div>

      {/* Botón para probar búsqueda */}
      <div className="mt-8 p-4 bg-blue-50 border border-blue-200 rounded">
        <h3 className="font-bold mb-2">🧪 Abre la consola del navegador</h3>
        <p>Presiona F12 y ve a la pestaña "Console" para ver los logs.</p>
        <button
          onClick={async () => {
            const resultados = await AsesorService.buscar('ale');
          }}
          className="mt-2 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Probar Búsqueda
        </button>
      </div>
    </div>
  );
}

/**
 * 🎓 RESUMEN - Lo que hace este componente:
 *
 * 1. Usa useState para guardar datos
 * 2. Usa useEffect para cargar datos al montar
 * 3. Muestra loading mientras carga
 * 4. Muestra error si algo falla
 * 5. Muestra los asesores cuando carga exitosamente
 * 6. Tiene un botón para probar la búsqueda
 *
 * Esto es el PATRÓN que usaremos en todos los componentes
 * que necesiten datos de APIs.
 */
