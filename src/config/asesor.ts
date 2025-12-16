/**
 * Configuración Multi-tenant por Asesor
 *
 * Este archivo maneja la configuración específica de cada asesor
 * basándose en variables de entorno o subdominios
 */

export interface AsesorConfig {
  id: string;
  nombre: string;
  email: string;
  telefono: string;
  whatsapp: string;
  urlSubdominio: string;
  logo?: string;
  colorPrimario?: string;
  colorSecundario?: string;
}

// Configuración de asesores disponibles
const asesoresConfig: Record<string, AsesorConfig> = {
  juan: {
    id: 'juan',
    nombre: 'Juan Pablo',
    email: 'juan@autorunai.tech',
    telefono: '+57 304 436 4455',
    whatsapp: '573044364455',
    urlSubdominio: 'juan.autorunai.tech',
    colorPrimario: '#1a56db',
    colorSecundario: '#0e7490',
  },
  alejandra: {
    id: 'alejandra',
    nombre: 'Alejandra González',
    email: 'alejandra@autorunai.tech',
    telefono: '+57 304 436 4455',
    whatsapp: '573044364455',
    urlSubdominio: 'alejandra.autorunai.tech',
    colorPrimario: '#db2777',
    colorSecundario: '#be185d',
  },
  miguel: {
    id: 'miguel',
    nombre: 'Miguel Weter',
    email: 'miguel@autorunai.tech',
    telefono: '+57 315 709 2610',
    whatsapp: '573157092610',
    urlSubdominio: 'miguel.autorunai.tech',
    colorPrimario: '#059669',
    colorSecundario: '#047857',
  },
  lorena: {
    id: 'lorena',
    nombre: 'Lorena Polo',
    email: 'lorena@autorunai.tech',
    telefono: '+57 324 549 0851',
    whatsapp: '573245490851',
    urlSubdominio: 'lorena.autorunai.tech',
    colorPrimario: '#7c3aed',
    colorSecundario: '#6d28d9',
  },
  nathalia: {
    id: 'nathalia',
    nombre: 'Nathalia',
    email: 'nathalia@autorunai.tech',
    telefono: '+57 315 457 7343',
    whatsapp: '573154577343',
    urlSubdominio: 'nathalia.autorunai.tech',
    colorPrimario: '#ea580c',
    colorSecundario: '#c2410c',
  },
  staging: {
    id: 'staging',
    nombre: 'Ambiente de Pruebas',
    email: 'info@autorunai.tech',
    telefono: '+57 304 436 4455',
    whatsapp: '573044364455',
    urlSubdominio: 'staging.autorunai.tech',
    colorPrimario: '#f59e0b',
    colorSecundario: '#d97706',
  },
  default: {
    id: 'default',
    nombre: 'Asesor Auteco Medellín',
    email: 'info@autorunai.tech',
    telefono: '+57 304 436 4455',
    whatsapp: '573044364455',
    urlSubdominio: 'autorunai.tech',
  },
};

/**
 * Obtiene la configuración del asesor actual
 * basándose en variable de entorno o subdomain
 */
export const getAsesorConfig = (): AsesorConfig => {
  // 1. Primero intenta obtener desde variable de entorno
  const asesorId = import.meta.env.VITE_ASESOR_ID;

  if (asesorId && asesoresConfig[asesorId]) {
    return asesoresConfig[asesorId];
  }

  // 2. Si no hay variable, intenta detectar por subdomain (en producción)
  if (typeof window !== 'undefined') {
    const hostname = window.location.hostname;
    const subdomain = hostname.split('.')[0];

    if (asesoresConfig[subdomain]) {
      return asesoresConfig[subdomain];
    }
  }

  // 3. Retorna configuración por defecto
  return asesoresConfig.default;
};

/**
 * Hook para usar la configuración del asesor en componentes
 */
export const useAsesorConfig = () => {
  return getAsesorConfig();
};

// Exporta la configuración actual
export const currentAsesor = getAsesorConfig();
