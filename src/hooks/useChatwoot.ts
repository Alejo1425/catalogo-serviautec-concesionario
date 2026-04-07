/**
 * Hook para integración con Chatwoot
 *
 * @module hooks/useChatwoot
 */

import { useEffect, useState, useCallback } from 'react';
import {
  loadChatwootWidget,
  configurarAsesor,
  abrirChat,
  cerrarChat,
  configurarUsuario,
  reiniciarChat,
  abrirChatConMoto,
  agregarMotoInteres,
  obtenerMotosInteres,
  limpiarMotosInteres,
} from '@/utils/chatwoot';

/**
 * Opciones para el hook useChatwoot
 */
interface UseChatwootOptions {
  /** Website token de Chatwoot */
  websiteToken: string;

  /** Si debe cargar automáticamente el widget al montar */
  autoLoad?: boolean;
}

/**
 * Hook para gestionar Chatwoot
 *
 * @param options - Opciones de configuración
 * @returns Funciones y estado para controlar Chatwoot
 *
 * @example
 * ```tsx
 * function MiComponente() {
 *   const { isLoaded, setAsesor, openChat } = useChatwoot({
 *     websiteToken: 'YOUR_TOKEN',
 *     autoLoad: true
 *   });
 *
 *   const handleSelectAsesor = (asesor: Asesor) => {
 *     setAsesor(asesor.Asesor, asesor.Id);
 *     openChat();
 *   };
 *
 *   return <div>...</div>;
 * }
 * ```
 */
export function useChatwoot(options: UseChatwootOptions) {
  const { websiteToken, autoLoad = true } = options;

  const [isLoaded, setIsLoaded] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  /**
   * Carga el widget de Chatwoot
   */
  const load = useCallback(async () => {
    if (isLoaded || isLoading) {
      return;
    }

    try {
      setIsLoading(true);
      setError(null);
      await loadChatwootWidget(websiteToken);
      setIsLoaded(true);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error al cargar Chatwoot';
      setError(errorMessage);
      console.error('❌ Error cargando Chatwoot:', errorMessage);
    } finally {
      setIsLoading(false);
    }
  }, [websiteToken, isLoaded, isLoading]);

  /**
   * Configura el asesor activo
   */
  const setAsesor = useCallback((nombre: string, id: number) => {
    if (!isLoaded) {
      console.warn('⚠️ Chatwoot no está cargado aún');
      return;
    }

    // Validar que el nombre no esté vacío
    if (!nombre || nombre.trim() === '') {
      console.error('⚠️ Intento de configurar asesor sin nombre. ID:', id);
      return;
    }

    configurarAsesor(nombre, id);
  }, [isLoaded]);

  /**
   * Abre el chat
   */
  const openChat = useCallback(() => {
    if (!isLoaded) {
      console.warn('⚠️ Chatwoot no está cargado aún');
      return;
    }

    abrirChat();
  }, [isLoaded]);

  /**
   * Cierra el chat
   */
  const closeChat = useCallback(() => {
    if (!isLoaded) {
      return;
    }

    cerrarChat();
  }, [isLoaded]);

  /**
   * Configura el usuario/cliente
   */
  const setUser = useCallback((user: {
    name?: string;
    email?: string;
    phone_number?: string;
  }) => {
    if (!isLoaded) {
      console.warn('⚠️ Chatwoot no está cargado aún');
      return;
    }

    configurarUsuario(user);
  }, [isLoaded]);

  /**
   * Reinicia el chat
   */
  const reset = useCallback(() => {
    if (!isLoaded) {
      return;
    }

    reiniciarChat();
  }, [isLoaded]);

  /**
   * Abre el chat con interés en una moto específica
   */
  const openChatWithMoto = useCallback((
    motoModelo: string,
    motoMarca: string,
    _detalles?: {
      marca: string;
      modelo: string;
      cuotaInicial?: number;
      precioContado?: number;
      precio2026?: number;
      year?: string;
    }
  ) => {
    if (!isLoaded) {
      console.warn('⚠️ Chatwoot no está cargado aún');
      return;
    }

    // Los detalles ya no se pasan porque abrirChatConMoto solo abre el chat
    // Para enviar mensajes a conversaciones, usar enviarMensajeAConversacion()
    abrirChatConMoto(motoModelo, motoMarca);
  }, [isLoaded]);

  /**
   * Agrega una moto a la lista de interés
   */
  const addMotoInteres = useCallback((motoId: string, motoModelo: string, motoMarca: string) => {
    if (!isLoaded) {
      console.warn('⚠️ Chatwoot no está cargado aún');
      return;
    }

    agregarMotoInteres(motoId, motoModelo, motoMarca);
  }, [isLoaded]);

  /**
   * Obtiene la lista de motos de interés
   */
  const getMotosInteres = useCallback(() => {
    return obtenerMotosInteres();
  }, []);

  /**
   * Limpia la lista de motos de interés
   */
  const clearMotosInteres = useCallback(() => {
    if (!isLoaded) {
      return;
    }

    limpiarMotosInteres();
  }, [isLoaded]);

  /**
   * Cargar automáticamente al montar si autoLoad está habilitado
   */
  useEffect(() => {
    if (autoLoad && !isLoaded && !isLoading) {
      load();
    }
  }, [autoLoad, isLoaded, isLoading, load]);

  return {
    /** Si el widget está cargado */
    isLoaded,

    /** Si está en proceso de carga */
    isLoading,

    /** Error si hubo algún problema */
    error,

    /** Carga el widget manualmente */
    load,

    /** Configura el asesor activo */
    setAsesor,

    /** Abre el chat */
    openChat,

    /** Cierra el chat */
    closeChat,

    /** Configura datos del usuario */
    setUser,

    /** Reinicia el chat */
    reset,

    /** Abre el chat con interés en una moto */
    openChatWithMoto,

    /** Agrega una moto a la lista de interés */
    addMotoInteres,

    /** Obtiene motos de interés */
    getMotosInteres,

    /** Limpia motos de interés */
    clearMotosInteres,
  };
}

/**
 * 🎓 EJEMPLO DE USO:
 *
 * ```tsx
 * import { useChatwoot } from '@/hooks/useChatwoot';
 * import { useAsesorContext } from '@/contexts';
 *
 * function Catalogo() {
 *   const { asesorActual } = useAsesorContext();
 *   const { isLoaded, setAsesor, openChat } = useChatwoot({
 *     websiteToken: 'YOUR_WEBSITE_TOKEN'
 *   });
 *
 *   useEffect(() => {
 *     if (isLoaded && asesorActual) {
 *       setAsesor(asesorActual.Asesor, asesorActual.Id);
 *     }
 *   }, [isLoaded, asesorActual, setAsesor]);
 *
 *   return (
 *     <div>
 *       <button onClick={openChat}>
 *         Chatear con {asesorActual?.Asesor}
 *       </button>
 *     </div>
 *   );
 * }
 * ```
 */
