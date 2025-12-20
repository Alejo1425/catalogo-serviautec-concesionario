/**
 * Utilidades para integración con Chatwoot
 *
 * 🎓 CONCEPTO: Chatwoot Widget Integration
 * Chatwoot proporciona un widget de chat que se puede integrar en cualquier sitio web.
 * Este archivo maneja la carga y configuración del widget.
 *
 * @module utils/chatwoot
 */

import { chatwootConfig } from '@/config/env';

/**
 * Interfaz para la configuración del widget de Chatwoot
 */
interface ChatwootWindow extends Window {
  chatwootSettings?: {
    hideMessageBubble?: boolean;
    position?: 'left' | 'right';
    locale?: string;
    type?: 'standard' | 'expanded_bubble';
  };
  chatwootSDK?: {
    run: (config: { websiteToken: string; baseUrl: string }) => void;
  };
  $chatwoot?: {
    toggle: (state?: 'open' | 'close') => void;
    setUser: (identifier: string, user: ChatwootUser) => void;
    setCustomAttributes: (attributes: Record<string, any>) => void;
    deleteCustomAttribute: (key: string) => void;
    setLabel: (label: string) => void;
    removeLabel: (label: string) => void;
    reset: () => void;
    setLocale: (locale: string) => void;
    sendMessage: (message: string) => void;
  };
}

/**
 * Interfaz para los datos del usuario
 */
interface ChatwootUser {
  email?: string;
  name?: string;
  avatar_url?: string;
  phone_number?: string;
}

declare let window: ChatwootWindow;

/**
 * Carga el script del widget de Chatwoot
 *
 * @param websiteToken - Token del website/inbox de Chatwoot
 * @returns Promise que se resuelve cuando el script está cargado
 *
 * @example
 * ```ts
 * await loadChatwootWidget('YOUR_WEBSITE_TOKEN');
 * ```
 */
export async function loadChatwootWidget(websiteToken: string): Promise<void> {
  return new Promise((resolve, reject) => {
    // Si ya está cargado, no cargar de nuevo
    if (window.$chatwoot) {
      console.log('✅ Chatwoot ya está cargado');
      resolve();
      return;
    }

    // Configuración global del widget
    window.chatwootSettings = {
      hideMessageBubble: false,
      position: 'right',
      locale: 'es',
      type: 'standard',
    };

    // Crear el script
    const script = document.createElement('script');
    script.src = `${chatwootConfig.baseUrl}/packs/js/sdk.js`;
    script.defer = true;
    script.async = true;

    // Cuando el script cargue, inicializar el widget
    script.onload = () => {
      console.log('📦 Script de Chatwoot cargado, inicializando...');

      // Intentar inicializar el SDK
      const initializeWidget = () => {
        if (window.chatwootSDK) {
          try {
            window.chatwootSDK.run({
              websiteToken: websiteToken,
              baseUrl: chatwootConfig.baseUrl,
            });

            // Esperar a que $chatwoot esté disponible
            setTimeout(() => {
              if (window.$chatwoot) {
                console.log('✅ Chatwoot widget inicializado correctamente');
                resolve();
              } else {
                console.error('❌ $chatwoot no está disponible después de inicializar');
                reject(new Error('Chatwoot no se inicializó correctamente'));
              }
            }, 1500);
          } catch (err) {
            console.error('❌ Error al ejecutar chatwootSDK.run:', err);
            reject(err);
          }
        } else {
          console.error('❌ chatwootSDK no está disponible');
          reject(new Error('chatwootSDK no está disponible'));
        }
      };

      // Dar un momento para que el SDK esté disponible
      setTimeout(initializeWidget, 500);
    };

    script.onerror = () => {
      console.error('❌ Error al cargar el script de Chatwoot');
      reject(new Error('Error al cargar el script de Chatwoot'));
    };

    // Agregar el script al documento
    console.log('📥 Cargando script de Chatwoot...');
    document.head.appendChild(script);
  });
}

/**
 * Configura el widget con información del asesor seleccionado
 *
 * @param asesorNombre - Nombre del asesor
 * @param asesorId - ID del asesor
 *
 * @example
 * ```ts
 * configurarAsesor('Alejandra', 1);
 * ```
 */
export function configurarAsesor(asesorNombre: string, asesorId: number): void {
  if (!window.$chatwoot) {
    console.warn('⚠️ Chatwoot no está cargado');
    return;
  }

  // Configurar atributos personalizados
  window.$chatwoot.setCustomAttributes({
    asesor_nombre: asesorNombre,
    asesor_id: asesorId,
    origen: 'catalogo',
    fecha_contacto: new Date().toISOString(),
  });

  console.log(`✅ Asesor configurado: ${asesorNombre} (ID: ${asesorId})`);
}

/**
 * Abre el widget de chat
 */
export function abrirChat(): void {
  if (!window.$chatwoot) {
    console.warn('⚠️ Chatwoot no está cargado');
    return;
  }

  window.$chatwoot.toggle('open');
}

/**
 * Cierra el widget de chat
 */
export function cerrarChat(): void {
  if (!window.$chatwoot) {
    return;
  }

  window.$chatwoot.toggle('close');
}

/**
 * Configura la información del cliente
 *
 * @param user - Datos del usuario
 *
 * @example
 * ```ts
 * configurarUsuario({
 *   name: 'Juan Pérez',
 *   email: 'juan@ejemplo.com',
 *   phone_number: '+573001234567'
 * });
 * ```
 */
export function configurarUsuario(user: ChatwootUser): void {
  if (!window.$chatwoot) {
    console.warn('⚠️ Chatwoot no está cargado');
    return;
  }

  // Usar email o teléfono como identificador
  const identifier = user.email || user.phone_number || `guest_${Date.now()}`;

  window.$chatwoot.setUser(identifier, user);

  console.log(`✅ Usuario configurado: ${user.name || identifier}`);
}

/**
 * Reinicia el widget (útil cuando cambia de asesor)
 */
export function reiniciarChat(): void {
  if (!window.$chatwoot) {
    return;
  }

  window.$chatwoot.reset();
}

/**
 * Agrega una moto a la lista de interés del cliente
 *
 * @param motoId - ID de la moto
 * @param motoModelo - Modelo de la moto
 * @param motoMarca - Marca de la moto
 *
 * @example
 * ```ts
 * agregarMotoInteres('apache-160-4v', 'APACHE 160 4V', 'TVS');
 * ```
 */
export function agregarMotoInteres(
  motoId: string,
  motoModelo: string,
  motoMarca: string
): void {
  if (!window.$chatwoot) {
    console.warn('⚠️ Chatwoot no está cargado');
    return;
  }

  // Obtener motos de interés existentes (si las hay)
  const motosInteresActuales = obtenerMotosInteres();

  // Agregar la nueva moto si no existe ya
  if (!motosInteresActuales.some((m) => m.id === motoId)) {
    const nuevaMoto = {
      id: motoId,
      modelo: motoModelo,
      marca: motoMarca,
      timestamp: new Date().toISOString(),
    };

    motosInteresActuales.push(nuevaMoto);

    // Guardar en custom attributes (como JSON string)
    window.$chatwoot.setCustomAttributes({
      motos_interes: JSON.stringify(motosInteresActuales),
      ultima_moto_interes: `${motoMarca} ${motoModelo}`,
      total_motos_interes: motosInteresActuales.length,
    });

    console.log(`✅ Moto agregada a interés: ${motoMarca} ${motoModelo}`);
  } else {
    console.log(`ℹ️ Moto ya estaba en la lista de interés: ${motoMarca} ${motoModelo}`);
  }
}

/**
 * Obtiene la lista de motos de interés del cliente
 *
 * @returns Array de motos de interés
 */
export function obtenerMotosInteres(): Array<{
  id: string;
  modelo: string;
  marca: string;
  timestamp: string;
}> {
  // Como no podemos leer custom attributes directamente desde el cliente,
  // mantenemos una copia en localStorage
  const stored = localStorage.getItem('chatwoot_motos_interes');
  return stored ? JSON.parse(stored) : [];
}

/**
 * Guarda las motos de interés en localStorage
 * (para sincronización interna)
 */
function guardarMotosInteresLocal(motos: any[]): void {
  localStorage.setItem('chatwoot_motos_interes', JSON.stringify(motos));
}

/**
 * NOTA: La función sendMessage del widget de Chatwoot no está disponible
 * públicamente. Para enviar mensajes a conversaciones específicas, usar
 * enviarMensajeAConversacion() del servicio chatwoot-api.service.ts
 *
 * Las funciones de formateo de mensajes se han movido a chatwoot-api.service.ts
 */

/**
 * Abre el chat y registra el interés en una moto
 *
 * NOTA: Ya no se envía mensaje automático porque el widget no soporta sendMessage().
 * En su lugar, el usuario puede escribir directamente en el chat abierto.
 * Para enviar mensajes a conversaciones específicas, usar enviarMensajeAConversacion()
 * del servicio chatwoot-api.service.ts
 *
 * @param motoModelo - Modelo de la moto
 * @param motoMarca - Marca de la moto
 *
 * @example
 * ```ts
 * abrirChatConMoto('APACHE 160 4V', 'TVS');
 * ```
 */
export function abrirChatConMoto(
  motoModelo: string,
  motoMarca: string
): void {
  if (!window.$chatwoot) {
    console.warn('⚠️ Chatwoot no está cargado');
    return;
  }

  // Agregar la moto a la lista de interés
  const motoId = `${motoMarca}-${motoModelo}`.toLowerCase().replace(/\s+/g, '-');
  agregarMotoInteres(motoId, motoModelo, motoMarca);

  // Actualizar localStorage
  guardarMotosInteresLocal(obtenerMotosInteres());

  // Abrir el chat para que el usuario pueda escribir
  abrirChat();

  console.log(`💬 Chat abierto con interés en: ${motoMarca} ${motoModelo}`);
}

/**
 * Limpia la lista de motos de interés
 */
export function limpiarMotosInteres(): void {
  if (!window.$chatwoot) {
    return;
  }

  window.$chatwoot.deleteCustomAttribute('motos_interes');
  window.$chatwoot.deleteCustomAttribute('ultima_moto_interes');
  window.$chatwoot.deleteCustomAttribute('total_motos_interes');
  localStorage.removeItem('chatwoot_motos_interes');

  console.log('✅ Lista de motos de interés limpiada');
}

/**
 * 🎓 RESUMEN - Funciones disponibles:
 *
 * - loadChatwootWidget(token): Carga el script del widget
 * - configurarAsesor(nombre, id): Configura el asesor activo
 * - abrirChat(): Abre el widget
 * - cerrarChat(): Cierra el widget
 * - configurarUsuario(user): Configura datos del cliente
 * - reiniciarChat(): Reinicia la conversación
 * - agregarMotoInteres(id, modelo, marca): Agrega una moto a la lista de interés
 * - obtenerMotosInteres(): Obtiene la lista de motos de interés
 * - abrirChatConMoto(modelo, marca): Abre el chat con interés en una moto específica
 * - limpiarMotosInteres(): Limpia la lista de motos de interés
 */
