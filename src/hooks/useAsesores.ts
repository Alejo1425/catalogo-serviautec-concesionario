/**
 * Hook personalizado para gestionar asesores
 *
 * 🎓 CONCEPTO: Custom Hooks
 * Los custom hooks son funciones que:
 * 1. Empiezan con "use" (convención de React)
 * 2. Pueden usar otros hooks (useState, useEffect, etc.)
 * 3. Son REUTILIZABLES en cualquier componente
 * 4. Encapsulan lógica compleja
 *
 * Ventajas:
 * - Código más limpio
 * - Lógica reutilizable
 * - Fácil de testear
 * - Separación de responsabilidades
 *
 * @module hooks/useAsesores
 */

import { useState, useEffect, useCallback, useRef } from 'react';
import { AsesorService } from '@/services';
import type { Asesor } from '@/types';

/**
 * Estado del hook
 *
 * 🎓 CONCEPTO: Tipo de retorno
 * Definimos un tipo para lo que devuelve el hook.
 * Esto le da autocompletado perfecto a quien lo use.
 */
interface UseAsesoresReturn {
  /** Lista de asesores */
  asesores: Asesor[];

  /** Si está cargando datos */
  loading: boolean;

  /** Error si algo falló */
  error: string | null;

  /** Función para recargar los datos */
  refetch: () => Promise<void>;

  /** Función para buscar asesores */
  buscar: (query: string) => Promise<void>;
}

/**
 * Opciones del hook
 */
interface UseAsesoresOptions {
  /** Si debe cargar automáticamente al montar */
  autoFetch?: boolean;

  /** Solo asesores activos */
  soloActivos?: boolean;

  /** Callback cuando carga exitosamente */
  onSuccess?: (asesores: Asesor[]) => void;

  /** Callback cuando hay error */
  onError?: (error: Error) => void;
}

/**
 * 🎓 CONCEPTO: Cache Simple
 * Guardamos los datos en una variable fuera del hook
 * para no repetir llamadas a la API si no es necesario.
 *
 * Esto es un cache MUY BÁSICO. En producción usarías
 * algo como React Query o SWR.
 */
let cacheAsesores: Asesor[] | null = null;
let cacheTimestamp: number | null = null;
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutos en milisegundos

/**
 * Verifica si el cache es válido
 */
function isCacheValid(): boolean {
  if (!cacheAsesores || !cacheTimestamp) {
    return false;
  }

  const now = Date.now();
  const elapsed = now - cacheTimestamp;

  return elapsed < CACHE_DURATION;
}

/**
 * Hook para gestionar asesores
 *
 * @param options - Opciones de configuración
 * @returns Estado y funciones para gestionar asesores
 *
 * @example
 * ```tsx
 * function MiComponente() {
 *   const { asesores, loading, error, refetch } = useAsesores();
 *
 *   if (loading) return <Loading />;
 *   if (error) return <Error message={error} />;
 *
 *   return (
 *     <div>
 *       {asesores.map(a => <AsesorCard key={a.Id} asesor={a} />)}
 *       <button onClick={refetch}>Recargar</button>
 *     </div>
 *   );
 * }
 * ```
 */
export function useAsesores(options: UseAsesoresOptions = {}): UseAsesoresReturn {
  // Opciones con valores por defecto
  const {
    autoFetch = true,
    soloActivos = false,
    onSuccess,
    onError,
  } = options;

  // Estado del hook
  const [asesores, setAsesores] = useState<Asesor[]>([]);
  const [loading, setLoading] = useState(autoFetch);
  const [error, setError] = useState<string | null>(null);

  // 🔧 FIX: Ref para controlar que solo se haga el fetch inicial una vez
  const hasFetchedRef = useRef(false);

  /**
   * Función para cargar asesores
   *
   * 🎓 CONCEPTO: useCallback
   * Memorizamos la función para que no se recree en cada render.
   * Esto mejora el performance.
   */
  const fetchAsesores = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      // 🎓 CONCEPTO: Cache Check
      // Si el cache es válido, usarlo en lugar de hacer request
      if (isCacheValid() && cacheAsesores) {
        setAsesores(cacheAsesores);
        setLoading(false);

        if (onSuccess) {
          onSuccess(cacheAsesores);
        }

        return;
      }

      // Llamar al servicio
      const data = await AsesorService.getAll(soloActivos);

      // Actualizar cache
      cacheAsesores = data;
      cacheTimestamp = Date.now();

      // Actualizar estado
      setAsesores(data);
      setError(null);

      // Llamar callback de éxito
      if (onSuccess) {
        onSuccess(data);
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error desconocido';

      console.error('❌ Error al cargar asesores:', errorMessage);

      setError(errorMessage);
      setAsesores([]);

      // Llamar callback de error
      if (onError && err instanceof Error) {
        onError(err);
      }
    } finally {
      setLoading(false);
    }
  }, [soloActivos, onSuccess, onError]);

  /**
   * Función para buscar asesores
   */
  const buscar = useCallback(async (query: string) => {
    try {
      setLoading(true);
      setError(null);

      // 🔧 FIX: Invalidar el cache antes de buscar
      // Esto previene que el cache sobrescriba los resultados de búsqueda
      cacheAsesores = null;
      cacheTimestamp = null;

      const data = await AsesorService.buscar(query);

      setAsesores(data);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error en búsqueda';
      console.error('❌ Error en búsqueda:', errorMessage);
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Cargar datos al montar el componente
   *
   * 🎓 CONCEPTO: Dependency Array
   * Usamos un ref para asegurarnos de que solo se ejecute UNA VEZ
   * al montar el componente, y no en cada re-render
   *
   * 🔧 FIX: Esto previene que fetchAsesores() se ejecute múltiples veces
   * después de hacer una búsqueda
   */
  useEffect(() => {
    if (autoFetch && !hasFetchedRef.current) {
      hasFetchedRef.current = true;
      fetchAsesores();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Array vacío = solo ejecutar al montar

  // Retornar estado y funciones
  return {
    asesores,
    loading,
    error,
    refetch: fetchAsesores,
    buscar,
  };
}

/**
 * Hook para obtener un asesor específico por slug
 *
 * @param slug - Slug del asesor
 * @returns Asesor y estado de carga
 *
 * @example
 * ```tsx
 * function AsesorPage() {
 *   const { slug } = useParams();
 *   const { asesor, loading, error } = useAsesor(slug);
 *
 *   if (loading) return <Loading />;
 *   if (error || !asesor) return <NotFound />;
 *
 *   return <AsesorProfile asesor={asesor} />;
 * }
 * ```
 */
export function useAsesor(slug: string | undefined) {
  const [asesor, setAsesor] = useState<Asesor | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Si no hay slug, no hacer nada
    if (!slug) {
      setLoading(false);
      return;
    }

    async function fetchAsesor() {
      try {
        setLoading(true);
        setError(null);


        const data = await AsesorService.getBySlug(slug);

        if (data) {
          setAsesor(data);
        } else {
          setError('Asesor no encontrado');
        }
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Error al cargar asesor';
        setError(errorMessage);
        console.error('❌ Error:', errorMessage);
      } finally {
        setLoading(false);
      }
    }

    fetchAsesor();
  }, [slug]);

  return { asesor, loading, error };
}

/**
 * 🎓 RESUMEN - Lo que creamos:
 *
 * 1. useAsesores() - Hook para listar todos los asesores
 *    - Cache automático (5 minutos)
 *    - Loading y error states
 *    - Función refetch para recargar
 *    - Función buscar para filtrar
 *    - Callbacks onSuccess/onError
 *
 * 2. useAsesor(slug) - Hook para un asesor específico
 *    - Carga por slug
 *    - Loading y error states
 *
 * VENTAJA: Ahora cualquier componente puede usar estos hooks
 * con UNA SOLA LÍNEA de código.
 */
