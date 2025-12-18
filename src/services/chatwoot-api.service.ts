/**
 * Servicio para enviar mensajes a conversaciones específicas de Chatwoot
 * usando la API REST
 *
 * @module services/chatwoot-api
 */

import { chatwootConfig } from '@/config/env';

/**
 * Interfaz para el payload de mensaje
 */
interface MessagePayload {
  content: string;
  message_type?: 'outgoing' | 'incoming';
  private?: boolean;
}

/**
 * Interfaz para la respuesta de la API
 */
interface MessageResponse {
  id: number;
  content: string;
  conversation_id: number;
  message_type: string;
  created_at: number;
}

/**
 * Envía un mensaje a una conversación específica usando la API de Chatwoot
 *
 * @param conversationId - ID de la conversación destino
 * @param message - Contenido del mensaje
 * @returns Promise con la respuesta de la API
 *
 * @example
 * ```ts
 * await enviarMensajeAConversacion(1712, 'Hola, me interesa esta moto');
 * ```
 */
export async function enviarMensajeAConversacion(
  conversationId: number,
  message: string
): Promise<MessageResponse> {
  const url = `${chatwootConfig.baseUrl}/api/v1/accounts/${chatwootConfig.accountId}/conversations/${conversationId}/messages`;

  const payload: MessagePayload = {
    content: message,
    message_type: 'incoming', // El mensaje viene del cliente
    private: false,
  };

  console.log(`📤 Enviando mensaje a conversación ${conversationId}...`);

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'api_access_token': chatwootConfig.apiToken,
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.error('❌ Error de API:', response.status, errorData);
      throw new Error(
        `Error al enviar mensaje: ${response.status} ${response.statusText}`
      );
    }

    const data: MessageResponse = await response.json();
    console.log('✅ Mensaje enviado exitosamente a conversación', conversationId);
    return data;
  } catch (error) {
    console.error('❌ Error al enviar mensaje a conversación:', error);
    throw error;
  }
}

/**
 * Verifica si una conversación existe y está accesible
 *
 * @param conversationId - ID de la conversación
 * @returns Promise<boolean> indicando si la conversación existe
 */
export async function verificarConversacion(
  conversationId: number
): Promise<boolean> {
  const url = `${chatwootConfig.baseUrl}/api/v1/accounts/${chatwootConfig.accountId}/conversations/${conversationId}`;

  try {
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'api_access_token': chatwootConfig.apiToken,
      },
    });

    return response.ok;
  } catch (error) {
    console.error('❌ Error al verificar conversación:', error);
    return false;
  }
}

/**
 * Formatea un mensaje con detalles de la moto
 */
export function formatearMensajeMoto(detalles: {
  marca: string;
  modelo: string;
  cuotaInicial?: number;
  precioContado?: number;
  precio2026?: number;
}): string {
  const { marca, modelo, cuotaInicial, precioContado, precio2026 } = detalles;

  let mensaje = `🏍️ Me interesa la ${marca} ${modelo}`;

  if (cuotaInicial || precioContado || precio2026) {
    mensaje += '\n\n📊 Información:';

    if (cuotaInicial) {
      mensaje += `\n💰 Cuota inicial: ${formatearPrecio(cuotaInicial)}`;
    }

    if (precioContado) {
      mensaje += `\n💵 Precio contado: ${formatearPrecio(precioContado)}`;
    }

    if (precio2026) {
      mensaje += `\n📅 Precio 2026: ${formatearPrecio(precio2026)}`;
    }
  }

  return mensaje;
}

/**
 * Formatea un precio en pesos colombianos
 */
function formatearPrecio(precio: number): string {
  return new Intl.NumberFormat('es-CO', {
    style: 'currency',
    currency: 'COP',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(precio);
}
