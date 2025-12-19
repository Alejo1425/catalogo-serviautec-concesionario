/**
 * Hook personalizado para gestionar motos
 *
 * Usa React Query para:
 * - Cache automático de datos
 * - Refetch en background
 * - Sincronización en tiempo real
 * - Estados de loading/error
 *
 * @module hooks/useMotos
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { MotoService } from '@/services/nocodb';
import type {
  MotoNocoDB,
  MotoExtendida,
  ConsultarMotosOptions,
  CrearMotoDTO,
  ActualizarMotoDTO,
} from '@/types';

/**
 * Keys para React Query
 * Centralizadas para facilitar invalidación de cache
 */
export const motoQueryKeys = {
  all: ['motos'] as const,
  lists: () => [...motoQueryKeys.all, 'list'] as const,
  list: (options: ConsultarMotosOptions) => [...motoQueryKeys.lists(), options] as const,
  details: () => [...motoQueryKeys.all, 'detail'] as const,
  detail: (id: number) => [...motoQueryKeys.details(), id] as const,
  slug: (slug: string) => [...motoQueryKeys.all, 'slug', slug] as const,
  extendidas: (options: ConsultarMotosOptions) => [...motoQueryKeys.all, 'extendidas', options] as const,
  estadisticas: () => [...motoQueryKeys.all, 'estadisticas'] as const,
};

/**
 * Hook para obtener todas las motos
 *
 * @param options - Opciones de consulta
 * @param config - Configuración de React Query
 * @returns Query con lista de motos
 *
 * @example
 * ```tsx
 * function MotosList() {
 *   const { data: motos, isLoading, error } = useMotos({ soloActivas: true });
 *
 *   if (isLoading) return <div>Cargando...</div>;
 *   if (error) return <div>Error: {error.message}</div>;
 *
 *   return (
 *     <ul>
 *       {motos?.map(moto => (
 *         <li key={moto.Id}>{moto.Modelo}</li>
 *       ))}
 *     </ul>
 *   );
 * }
 * ```
 */
export function useMotos(
  options: ConsultarMotosOptions = { soloActivas: true },
  config?: {
    enabled?: boolean;
    refetchInterval?: number;
  }
) {
  return useQuery({
    queryKey: motoQueryKeys.list(options),
    queryFn: () => MotoService.getAll(options),
    staleTime: 5 * 60 * 1000, // 5 minutos
    refetchInterval: config?.refetchInterval, // Para polling si se especifica
    enabled: config?.enabled,
  });
}

/**
 * Hook para obtener motos extendidas (con datos parseados)
 *
 * @param options - Opciones de consulta
 * @returns Query con motos extendidas
 */
export function useMotosExtendidas(
  options: ConsultarMotosOptions = { soloActivas: true }
) {
  return useQuery({
    queryKey: motoQueryKeys.extendidas(options),
    queryFn: () => MotoService.getAllExtendidas(options),
    staleTime: 5 * 60 * 1000,
  });
}

/**
 * Hook para obtener una moto por ID
 *
 * @param id - ID de la moto
 * @param enabled - Si la query debe ejecutarse
 * @returns Query con la moto
 */
export function useMoto(id: number, enabled = true) {
  return useQuery({
    queryKey: motoQueryKeys.detail(id),
    queryFn: () => MotoService.getById(id),
    enabled: enabled && !!id,
    staleTime: 10 * 60 * 1000, // 10 minutos (detalles cambian menos)
  });
}

/**
 * Hook para obtener una moto extendida por ID
 *
 * @param id - ID de la moto
 * @param enabled - Si la query debe ejecutarse
 * @returns Query con la moto extendida
 */
export function useMotoExtendida(id: number, enabled = true) {
  return useQuery({
    queryKey: [...motoQueryKeys.detail(id), 'extendida'],
    queryFn: () => MotoService.getByIdExtendida(id),
    enabled: enabled && !!id,
    staleTime: 10 * 60 * 1000,
  });
}

/**
 * Hook para obtener una moto por slug
 *
 * @param slug - Slug de la moto
 * @param enabled - Si la query debe ejecutarse
 * @returns Query con la moto
 */
export function useMotoBySlug(slug: string, enabled = true) {
  return useQuery({
    queryKey: motoQueryKeys.slug(slug),
    queryFn: () => MotoService.getBySlug(slug),
    enabled: enabled && !!slug,
    staleTime: 10 * 60 * 1000,
  });
}

/**
 * Hook para obtener estadísticas del catálogo
 *
 * @returns Query con estadísticas
 */
export function useEstadisticasMotos() {
  return useQuery({
    queryKey: motoQueryKeys.estadisticas(),
    queryFn: () => MotoService.getEstadisticas(),
    staleTime: 15 * 60 * 1000, // 15 minutos
  });
}

/**
 * Hook para crear una nueva moto
 *
 * @returns Mutation para crear moto
 *
 * @example
 * ```tsx
 * function CrearMotoForm() {
 *   const crearMoto = useCrearMoto();
 *
 *   const handleSubmit = async (data) => {
 *     try {
 *       await crearMoto.mutateAsync(data);
 *       toast.success('Moto creada exitosamente');
 *     } catch (error) {
 *       toast.error('Error al crear moto');
 *     }
 *   };
 *
 *   return <form onSubmit={handleSubmit}>...</form>;
 * }
 * ```
 */
export function useCrearMoto() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CrearMotoDTO) => MotoService.create(data),
    onSuccess: () => {
      // Invalidar todas las listas de motos para refetch
      queryClient.invalidateQueries({ queryKey: motoQueryKeys.lists() });
      queryClient.invalidateQueries({ queryKey: motoQueryKeys.estadisticas() });
    },
  });
}

/**
 * Hook para actualizar una moto
 *
 * @returns Mutation para actualizar moto
 */
export function useActualizarMoto() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: ActualizarMotoDTO }) =>
      MotoService.update(id, data),
    onSuccess: (updatedMoto) => {
      // Invalidar listas
      queryClient.invalidateQueries({ queryKey: motoQueryKeys.lists() });

      // Actualizar el detalle específico en cache
      queryClient.setQueryData(
        motoQueryKeys.detail(updatedMoto.Id),
        updatedMoto
      );

      // Invalidar estadísticas
      queryClient.invalidateQueries({ queryKey: motoQueryKeys.estadisticas() });
    },
  });
}

/**
 * Hook para activar una moto
 *
 * @returns Mutation para activar
 */
export function useActivarMoto() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => MotoService.activar(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: motoQueryKeys.lists() });
      queryClient.invalidateQueries({ queryKey: motoQueryKeys.estadisticas() });
    },
  });
}

/**
 * Hook para desactivar una moto
 *
 * @returns Mutation para desactivar
 */
export function useDesactivarMoto() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => MotoService.desactivar(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: motoQueryKeys.lists() });
      queryClient.invalidateQueries({ queryKey: motoQueryKeys.estadisticas() });
    },
  });
}

/**
 * Hook para eliminar una moto
 *
 * @returns Mutation para eliminar
 */
export function useEliminarMoto() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => MotoService.eliminar(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: motoQueryKeys.all });
    },
  });
}

/**
 * Hook para sincronizar motos
 * Útil para forzar un refetch de todas las motos
 *
 * @returns Mutation para sincronizar
 *
 * @example
 * ```tsx
 * function SyncButton() {
 *   const sync = useSincronizarMotos();
 *
 *   return (
 *     <button
 *       onClick={() => sync.mutate()}
 *       disabled={sync.isPending}
 *     >
 *       {sync.isPending ? 'Sincronizando...' : 'Sincronizar'}
 *     </button>
 *   );
 * }
 * ```
 */
export function useSincronizarMotos() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => MotoService.sincronizar(),
    onSuccess: (motos) => {
      // Actualizar cache con las motos sincronizadas
      queryClient.setQueryData(
        motoQueryKeys.list({ soloActivas: true }),
        motos
      );

      // Invalidar el resto
      queryClient.invalidateQueries({ queryKey: motoQueryKeys.lists() });
    },
  });
}

/**
 * Hook para polling automático de motos
 * Sincroniza cada X segundos para obtener cambios en tiempo real
 *
 * @param intervalMs - Intervalo en milisegundos (default: 30 segundos)
 * @param enabled - Si el polling está activo
 * @returns Query con polling activo
 *
 * @example
 * ```tsx
 * function MotosLiveList() {
 *   // Refetch cada 30 segundos
 *   const { data: motos } = useMotosPolling(30000);
 *
 *   return <MotosList motos={motos} />;
 * }
 * ```
 */
export function useMotosPolling(
  intervalMs: number = 30000,
  enabled = true
) {
  return useMotos(
    { soloActivas: true },
    {
      refetchInterval: intervalMs,
      enabled,
    }
  );
}

/**
 * Hook para buscar motos por marca
 *
 * @param marca - Marca a filtrar
 * @returns Query con motos de la marca
 */
export function useMotosByMarca(
  marca: ConsultarMotosOptions['marca']
) {
  return useMotos({ marca, soloActivas: true });
}

/**
 * Hook para buscar motos por categoría
 *
 * @param categoria - Categoría a filtrar
 * @returns Query con motos de la categoría
 */
export function useMotosByCategoria(
  categoria: ConsultarMotosOptions['categoria']
) {
  return useMotos({ categoria, soloActivas: true });
}
