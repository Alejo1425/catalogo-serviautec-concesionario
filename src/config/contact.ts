/**
 * Configuración de Contactos Centralizada
 *
 * Maneja teléfonos y mapeos de asesores para WhatsApp
 * desacoplando esta lógica de componentes individuales.
 *
 * @module config/contact
 */

import type { Asesor } from '@/types';

/**
 * Configuración principal de contacto
 */
export const CONTACT_CONFIG = {
  /** Número corporativo principal (sin código de país) */
  corporateNumber: '3232853771',

  /** Mensaje predeterminado de WhatsApp */
  defaultMessage: 'Hola, estoy interesado en una moto.',

  /** Código de país */
  countryCode: '57',
} as const;

/**
 * Interface para mapeo de asesores
 */
export interface AdvisorMapping {
  slug: string;
  name: string;
  phone: string;
}

/**
 * Mapeo estático de asesores para redirección rápida basada en URL
 * Estos son valores de respaldo en caso de que NocoDB no esté disponible
 */
export const ADVISOR_MAPPING: Record<string, AdvisorMapping> = {
  'miguel': { slug: 'miguel', name: 'Miguel Angel', phone: '3001234567' },
  'juan-pablo': { slug: 'juan-pablo', name: 'Juan Pablo', phone: '3001234568' },
  'nathalia': { slug: 'nathalia', name: 'Nathalia', phone: '3001234569' },
  'alejandra': { slug: 'alejandra', name: 'Alejandra', phone: '3001234570' },
  'diego': { slug: 'diego', name: 'Diego', phone: '3024894085' },
};

/**
 * Determina el número de teléfono a usar basado en el contexto
 *
 * Prioridad:
 * 1. Teléfono del asesor actual (de NocoDB via contexto)
 * 2. Número corporativo por defecto
 *
 * @param currentAdvisor - Asesor actual del contexto (si existe)
 * @returns Número de teléfono (sin código de país)
 */
export const getDestinationPhone = (currentAdvisor?: Asesor | null): string => {
  // Caso B: Asesor del contexto (NocoDB)
  if (currentAdvisor?.Phone) {
    // Limpiar el número (quitar espacios, guiones, etc.)
    return currentAdvisor.Phone.replace(/\D/g, '').replace(/^57/, '');
  }

  // Caso A: Default corporativo
  return CONTACT_CONFIG.corporateNumber;
};

/**
 * Obtiene el nombre del asesor para personalizar mensajes
 *
 * @param currentAdvisor - Asesor actual del contexto
 * @returns Nombre del asesor o "tu asesor" si no hay
 */
export const getAdvisorName = (currentAdvisor?: Asesor | null): string => {
  if (currentAdvisor?.Asesor) {
    // Obtener solo el primer nombre
    return currentAdvisor.Asesor.split(' ')[0];
  }
  return 'tu asesor';
};

/**
 * Construye la URL completa de WhatsApp
 *
 * @param phone - Número de teléfono (sin código de país)
 * @param message - Mensaje a enviar
 * @returns URL de WhatsApp completa
 */
export const buildWhatsAppUrl = (phone: string, message: string): string => {
  const cleanPhone = phone.replace(/\D/g, '');
  const encodedMessage = encodeURIComponent(message);
  return `https://wa.me/${CONTACT_CONFIG.countryCode}${cleanPhone}?text=${encodedMessage}`;
};
