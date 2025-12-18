/**
 * Configuración de Variables de Entorno
 *
 * Este archivo centraliza el acceso a todas las variables de entorno
 * de la aplicación. Valida que las variables requeridas existan.
 *
 * 🎓 CONCEPTO: Single Source of Truth
 * En lugar de usar import.meta.env.VITE_XXX en cada archivo,
 * importamos desde aquí. Si necesitamos cambiar algo, lo cambiamos
 * en UN solo lugar.
 *
 * @module config/env
 */

/**
 * Obtiene una variable de entorno y valida que exista
 *
 * @param key - Nombre de la variable de entorno
 * @param required - Si es obligatoria (por defecto true)
 * @returns El valor de la variable
 * @throws Error si la variable es requerida y no existe
 *
 * @example
 * ```ts
 * const apiUrl = getEnvVar('VITE_API_URL'); // Obligatoria
 * const debug = getEnvVar('VITE_DEBUG', false); // Opcional
 * ```
 */
function getEnvVar(key: string, required = true): string {
  const value = import.meta.env[key];

  // Si es requerida y no existe, lanzar error
  if (required && !value) {
    throw new Error(
      `❌ Variable de entorno requerida no encontrada: ${key}\n` +
      `Por favor, agrega ${key} a tu archivo .env`
    );
  }

  return value || '';
}

/**
 * Configuración de NocoDB
 *
 * 🎓 CONCEPTO: Agrupamos variables relacionadas en objetos
 * Esto hace el código más organizado y fácil de mantener.
 */
export const nocodbConfig = {
  /** URL base de la API de NocoDB */
  baseUrl: getEnvVar('VITE_NOCODB_BASE_URL'),

  /** Token de autenticación (xc-token) */
  token: getEnvVar('VITE_NOCODB_TOKEN'),

  /** ID de la base de datos */
  baseId: getEnvVar('VITE_NOCODB_BASE_ID'),

  /**
   * IDs de las tablas en NocoDB
   *
   * 🎓 CONCEPTO: Constantes centralizadas
   * Si el ID de una tabla cambia, solo lo actualizamos aquí
   */
  tables: {
    asesores: 'mk3y12zsd2xgngl',
    leads: 'mjyc6hdsmcf8ogy',
    clientes: 'mp7ense60niggx7',
    metricas: 'ms7co3y6hi9paui',
    motos: 'mrihonukyh6rcqg',
    precios: 'm8hyj9f4y3ffe9o',
  },
} as const; // 'as const' hace que TypeScript trate esto como inmutable

/**
 * Configuración de Chatwoot
 */
export const chatwootConfig = {
  /** URL base de la API de Chatwoot */
  baseUrl: getEnvVar('VITE_CHATWOOT_BASE_URL'),

  /** Token de API */
  apiToken: getEnvVar('VITE_CHATWOOT_API_TOKEN', false), // Opcional por ahora

  /** ID de la cuenta */
  accountId: getEnvVar('VITE_CHATWOOT_ACCOUNT_ID', false) || '1',

  /** Website Token para el widget */
  websiteToken: getEnvVar('VITE_CHATWOOT_WEBSITE_TOKEN'),
} as const;

/**
 * Configuración general de la aplicación
 */
export const appConfig = {
  /** Ambiente (development, production) */
  env: getEnvVar('VITE_APP_ENV', false) || 'development',

  /** URL base de la aplicación */
  url: getEnvVar('VITE_APP_URL', false) || 'http://localhost:8080',

  /** Si estamos en desarrollo */
  isDev: getEnvVar('VITE_APP_ENV', false) === 'development',

  /** Si estamos en producción */
  isProd: getEnvVar('VITE_APP_ENV', false) === 'production',

  /** Número de WhatsApp por defecto (General) */
  defaultWhatsapp: getEnvVar('VITE_DEFAULT_WHATSAPP', false) || '3024894085', // Default a Diego (Admin) o número de empresa
} as const;

/**
 * 🎓 EXPLICACIÓN: ¿Por qué 'as const'?
 *
 * Sin 'as const':
 * const config = { url: 'https://...' };
 * config.url = 'otro-valor'; // ✅ Permitido (puede causar bugs)
 *
 * Con 'as const':
 * const config = { url: 'https://...' } as const;
 * config.url = 'otro-valor'; // ❌ Error de TypeScript
 *
 * Esto previene modificaciones accidentales de la configuración.
 */

// Log de configuración en desarrollo (solo para debugging)
if (appConfig.isDev) {
  console.log('🔧 Configuración cargada:', {
    nocodb: {
      baseUrl: nocodbConfig.baseUrl,
      tokenPresent: !!nocodbConfig.token,
    },
    chatwoot: {
      baseUrl: chatwootConfig.baseUrl,
      tokenPresent: !!chatwootConfig.apiToken,
    },
    app: appConfig,
  });
}
