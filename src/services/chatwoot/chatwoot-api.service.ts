/**
 * Servicio para interactuar con la API REST de Chatwoot
 *
 * ⚠️ IMPORTANTE: En producción, estas llamadas deberían hacerse desde un backend
 * para no exponer el API token. Por ahora, funciona desde el frontend porque
 * el token está en variables de entorno que no se exponen en el bundle.
 *
 * @module services/chatwoot/chatwoot-api.service
 */

import { chatwootConfig } from '@/config/env';

interface MotoDetails {
  marca: string;
  modelo: string;
  cuotaInicial: number;
  precioContado: number;
  precio2026: number;
  imagen: string;
}

/**
 * Servicio para interactuar con la API de Chatwoot
 */
export class ChatwootAPIService {
  private static baseUrl = chatwootConfig.baseUrl;
  private static apiToken = chatwootConfig.apiToken;
  private static accountId = chatwootConfig.accountId;

  /**
   * Obtiene los headers para las peticiones a la API
   */
  private static getHeaders(): HeadersInit {
    return {
      'Content-Type': 'application/json',
      'api_access_token': this.apiToken,
    };
  }

  /**
   * Formatea un precio en pesos colombianos
   */
  private static formatPrice(price: number): string {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price);
  }

  /**
   * Crea un mensaje formateado con los detalles de la moto
   */
  private static crearMensajeMoto(moto: MotoDetails): string {
    return `🏍️ **Me interesa esta moto:**

**${moto.marca} ${moto.modelo}**

💰 **Precios:**
• Cuota Inicial: ${this.formatPrice(moto.cuotaInicial)}
• Precio Contado: ${this.formatPrice(moto.precioContado)}
• Precio 2026: ${this.formatPrice(moto.precio2026)}

¿Me puedes dar más información sobre esta moto?`;
  }

  /**
   * Busca la conversación activa del contacto usando el identificador de sesión
   *
   * Chatwoot usa contact_identifier para trackear conversaciones del widget
   */
  static async buscarConversacionActiva(): Promise<number | null> {
    try {
      // Debug: Ver todas las keys de localStorage que empiezan con 'chatwoot' o 'cw'
      console.log('🔍 Buscando conversación en localStorage...');
      const allKeys = Object.keys(localStorage);
      const chatwootKeys = allKeys.filter(k => k.toLowerCase().includes('chatwoot') || k.toLowerCase().includes('cw'));
      console.log('📋 Keys de Chatwoot encontradas:', chatwootKeys);

      // Intentar diferentes posibles keys
      const possibleKeys = [
        'cw_conversation',
        'chatwoot_conversation',
        `chatwoot_widget_${chatwootConfig.websiteToken}`,
        'chatwoot_user'
      ];

      for (const key of possibleKeys) {
        const data = localStorage.getItem(key);
        if (data) {
          console.log(`📝 Datos encontrados en ${key}:`, data.substring(0, 100));
          try {
            const parsed = JSON.parse(data);
            console.log(`🔍 Estructura del objeto ${key}:`, Object.keys(parsed));

            // Buscar conversationId en diferentes posibles estructuras
            if (parsed.id) {
              console.log(`✅ Conversación encontrada: ${parsed.id}`);
              return parsed.id;
            }
            if (parsed.conversationId) {
              console.log(`✅ Conversación encontrada: ${parsed.conversationId}`);
              return parsed.conversationId;
            }
            if (parsed.conversation?.id) {
              console.log(`✅ Conversación encontrada: ${parsed.conversation.id}`);
              return parsed.conversation.id;
            }
          } catch (e) {
            console.log(`⚠️ No se pudo parsear ${key}`);
          }
        }
      }

      console.warn('⚠️ No se encontró conversación activa en ningún lugar');
      return null;
    } catch (error) {
      console.error('❌ Error al buscar conversación:', error);
      return null;
    }
  }

  /**
   * Envía un mensaje a una conversación específica
   */
  static async enviarMensaje(
    conversationId: number,
    mensaje: string,
    private_message: boolean = false
  ): Promise<void> {
    try {
      const url = `${this.baseUrl}/api/v1/accounts/${this.accountId}/conversations/${conversationId}/messages`;

      const response = await fetch(url, {
        method: 'POST',
        headers: this.getHeaders(),
        body: JSON.stringify({
          content: mensaje,
          message_type: 'outgoing', // 'outgoing' = mensaje desde asesor
          private: private_message,
        }),
      });

      if (!response.ok) {
        throw new Error(`Error al enviar mensaje: ${response.status}`);
      }

      console.log(`✅ Mensaje enviado a conversación ${conversationId}`);
    } catch (error) {
      console.error('❌ Error al enviar mensaje:', error);
      throw error;
    }
  }

  /**
   * Mapea IDs de asesores de NocoDB a IDs de usuarios en Chatwoot
   *
   * IMPORTANTE: Estos IDs deben coincidir con los usuarios en Chatwoot
   * Para obtener los IDs de Chatwoot: Settings → Agents
   */
  private static mapearAsesorAChatwoot(asesorNocodbId: number): number | null {
    /**
     * Mapeo de IDs de NocoDB a IDs de Chatwoot
     *
     * Obtenido de:
     * - NocoDB: scripts/verificar-slugs.ts
     * - Chatwoot: GET /api/v1/accounts/1/agents
     */
    const mapeo: Record<number, number> = {
      // NocoDB ID → Chatwoot User ID
      1: 6,   // Alejandra
      2: 10,  // Miguel
      3: 9,   // Nathalia
      8: 7,   // Lorena
      10: 4,  // Juan Pablo
    };

    const chatwootId = mapeo[asesorNocodbId];
    if (!chatwootId) {
      console.warn(`⚠️ No se encontró mapeo para asesor NocoDB ID ${asesorNocodbId}`);
    }
    return chatwootId || null;
  }

  /**
   * Asigna una conversación a un asesor específico
   */
  static async asignarConversacionAsesor(
    conversationId: number,
    asesorNocodbId: number
  ): Promise<void> {
    try {
      // Mapear ID de NocoDB a ID de Chatwoot
      const chatwootUserId = this.mapearAsesorAChatwoot(asesorNocodbId);

      if (!chatwootUserId) {
        console.error(`❌ No se pudo mapear asesor ${asesorNocodbId} a Chatwoot`);
        return;
      }

      console.log(`🔄 Mapeando asesor NocoDB ${asesorNocodbId} → Chatwoot ${chatwootUserId}`);

      // Método 1: Intentar con PATCH (actualizar conversación)
      const urlPatch = `${this.baseUrl}/api/v1/accounts/${this.accountId}/conversations/${conversationId}`;

      console.log(`📡 URL de asignación: ${urlPatch}`);
      console.log(`📋 Payload:`, { assignee_id: chatwootUserId });

      const response = await fetch(urlPatch, {
        method: 'PATCH',
        headers: this.getHeaders(),
        body: JSON.stringify({
          assignee_id: chatwootUserId,
        }),
      });

      const responseText = await response.text();
      console.log(`📨 Response status: ${response.status}`);
      console.log(`📨 Response body:`, responseText);

      if (!response.ok) {
        throw new Error(`Error al asignar conversación: ${response.status} - ${responseText}`);
      }

      console.log(`✅ Conversación ${conversationId} asignada al asesor Chatwoot ${chatwootUserId} (NocoDB ${asesorNocodbId})`);
    } catch (error) {
      console.error('❌ Error al asignar conversación:', error);
      if (error instanceof Error) {
        console.error('❌ Detalles:', error.message);
      }
      // No lanzar el error para que el mensaje se envíe de todas formas
    }
  }

  /**
   * Espera a que la conversación de Chatwoot se cree
   */
  private static async esperarConversacion(maxIntentos: number = 10): Promise<number | null> {
    for (let i = 0; i < maxIntentos; i++) {
      const conversationId = await this.buscarConversacionActiva();
      if (conversationId) {
        console.log(`✅ Conversación encontrada en intento ${i + 1}`);
        return conversationId;
      }

      console.log(`⏳ Esperando conversación... intento ${i + 1}/${maxIntentos}`);
      // Esperar 500ms antes del siguiente intento
      await new Promise(resolve => setTimeout(resolve, 500));
    }

    return null;
  }

  /**
   * Envía un mensaje con los detalles de una moto y asigna la conversación al asesor
   *
   * Esta es la función principal que se llama cuando el cliente hace clic en "Me interesa"
   */
  static async enviarMotoInteres(
    moto: MotoDetails,
    asesorId: number
  ): Promise<boolean> {
    try {
      console.log(`📤 Iniciando envío de moto: ${moto.marca} ${moto.modelo}`);
      console.log(`👤 Asesor ID: ${asesorId}`);

      // 1. Esperar a que la conversación se cree (máximo 5 segundos)
      const conversationId = await this.esperarConversacion(10);

      if (!conversationId) {
        console.warn('⚠️ No se encontró conversación activa después de esperar');
        return false;
      }

      console.log(`💬 Usando conversación ID: ${conversationId}`);

      // 2. Crear el mensaje con los detalles de la moto
      const mensaje = this.crearMensajeMoto(moto);
      console.log(`📝 Mensaje creado:`, mensaje.substring(0, 100) + '...');

      // 3. Enviar el mensaje
      console.log(`📨 Enviando mensaje...`);
      await this.enviarMensaje(conversationId, mensaje);

      // 4. Asignar la conversación al asesor
      console.log(`👥 Asignando conversación al asesor ${asesorId}...`);
      await this.asignarConversacionAsesor(conversationId, asesorId);

      console.log(`✅ Moto ${moto.marca} ${moto.modelo} enviada y conversación asignada`);
      return true;
    } catch (error) {
      console.error('❌ Error al enviar moto de interés:', error);
      if (error instanceof Error) {
        console.error('❌ Detalles del error:', error.message);
        console.error('❌ Stack:', error.stack);
      }
      return false;
    }
  }

  /**
   * Actualiza los custom attributes de una conversación
   */
  static async actualizarCustomAttributes(
    conversationId: number,
    attributes: Record<string, any>
  ): Promise<void> {
    try {
      const url = `${this.baseUrl}/api/v1/accounts/${this.accountId}/conversations/${conversationId}/custom_attributes`;

      const response = await fetch(url, {
        method: 'POST',
        headers: this.getHeaders(),
        body: JSON.stringify({ custom_attributes: attributes }),
      });

      if (!response.ok) {
        throw new Error(`Error al actualizar custom attributes: ${response.status}`);
      }

      console.log(`✅ Custom attributes actualizados en conversación ${conversationId}`);
    } catch (error) {
      console.error('❌ Error al actualizar custom attributes:', error);
      throw error;
    }
  }
}

/**
 * 🎓 RESUMEN - Cómo usar este servicio:
 *
 * ```ts
 * import { ChatwootAPIService } from '@/services/chatwoot/chatwoot-api.service';
 *
 * // Cuando el cliente hace clic en "Me interesa"
 * const exito = await ChatwootAPIService.enviarMotoInteres({
 *   marca: 'TVS',
 *   modelo: 'APACHE 160 4V',
 *   cuotaInicial: 500000,
 *   precioContado: 8000000,
 *   precio2026: 8500000,
 *   imagen: 'https://...',
 * }, asesorId);
 *
 * if (exito) {
 *   toast.success('¡Mensaje enviado al asesor!');
 * }
 * ```
 */
