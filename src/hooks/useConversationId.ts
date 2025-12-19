/**
 * Hook para rastrear el ID de conversación de Chatwoot desde la URL
 *
 * Este hook lee el parámetro `cid` (conversation ID) de la URL y lo mantiene
 * en localStorage durante la sesión del usuario.
 *
 * @module hooks/useConversationId
 */

import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';

const STORAGE_KEY = 'chatwoot_conversation_id';

/**
 * Hook para gestionar el ID de conversación desde la URL
 *
 * @returns {object} - conversationId y funciones para gestionarlo
 *
 * @example
 * ```tsx
 * function MiComponente() {
 *   const { conversationId, clearConversationId } = useConversationId();
 *
 *   if (conversationId) {
 *     console.log('Usuario vino de conversación:', conversationId);
 *   }
 *
 *   return <div>...</div>;
 * }
 * ```
 */
export function useConversationId() {
  const location = useLocation();
  const [conversationId, setConversationId] = useState<number | null>(null);

  useEffect(() => {
    // Leer el parámetro 'cid' de la URL
    const searchParams = new URLSearchParams(location.search);
    const cidParam = searchParams.get('cid');

    if (cidParam) {
      const cid = parseInt(cidParam, 10);

      if (!isNaN(cid) && cid > 0) {
        console.log(`📌 Conversación detectada desde URL: ${cid}`);
        // Guardar en localStorage
        localStorage.setItem(STORAGE_KEY, cid.toString());
        setConversationId(cid);
        return; // Importante: salir temprano para evitar leer del localStorage
      } else {
        console.warn('⚠️ Parámetro cid inválido:', cidParam);
      }
    }

    // Si no hay parámetro en la URL, intentar leer de localStorage
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      const cid = parseInt(stored, 10);
      if (!isNaN(cid) && cid > 0) {
        console.log(`📌 Conversación recuperada de localStorage: ${cid}`);
        setConversationId(cid);
      }
    } else {
      // No hay ni query param ni localStorage - limpiar el state
      setConversationId(null);
    }
  }, [location.search]);

  /**
   * Limpia el ID de conversación almacenado
   */
  const clearConversationId = () => {
    localStorage.removeItem(STORAGE_KEY);
    setConversationId(null);
    console.log('🗑️ ID de conversación limpiado');
  };

  /**
   * Establece manualmente un ID de conversación
   */
  const setManualConversationId = (cid: number) => {
    if (cid > 0) {
      localStorage.setItem(STORAGE_KEY, cid.toString());
      setConversationId(cid);
      console.log(`📌 ID de conversación establecido manualmente: ${cid}`);
    }
  };

  return {
    /** ID de conversación actual (null si no hay) */
    conversationId,

    /** Limpia el ID de conversación */
    clearConversationId,

    /** Establece manualmente un ID de conversación */
    setManualConversationId,
  };
}

/**
 * 🎓 EJEMPLO DE USO:
 *
 * Cuando un asesor envía un enlace como:
 * https://autorunai.tech/juan-pablo?cid=1712
 *
 * Este hook detectará automáticamente el cid=1712 y lo guardará.
 * Luego, cuando el usuario haga clic en "Me interesa", el componente
 * puede usar este conversationId para enviar el mensaje a esa conversación
 * específica usando la API de Chatwoot.
 */
