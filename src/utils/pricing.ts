/**
 * Utilidades de Cálculo de Precios Dinámicos
 *
 * Centraliza la lógica de cálculo de precios para 2026/2027
 * y la sanitización de valores numéricos.
 *
 * @module utils/pricing
 */

import type { MotoNocoDB } from '@/types/moto';

/**
 * Tipo para el año seleccionado
 */
export type YearOption = '2026' | '2027';

/**
 * Interface para los precios calculados
 */
export interface PreciosCalculados {
  /** Precio comercial base */
  comercial: number | null;
  /** Precio de contado (comercial + trámite contado) */
  contado: number | null;
  /** Cuota inicial (10% comercial + trámite prenda) */
  inicial: number | null;
  /** Porcentaje aplicado para la cuota inicial (ej: 0.10 o 0.15) */
  porcentaje: number;
  /** Si hay precio disponible para el año */
  disponible: boolean;
}

/**
 * Limpia y convierte un valor a número
 *
 * Maneja formatos como:
 * - "$ 5.900.000"
 * - "5900000"
 * - 5900000
 * - null/undefined
 *
 * @param val - Valor a limpiar
 * @returns Número limpio o 0 si no es válido
 */
export const cleanNumber = (val: unknown): number => {
  if (typeof val === 'number' && !isNaN(val)) return val;
  if (!val) return 0;

  // Eliminar $, puntos de mil, espacios
  const str = String(val).replace(/[$.\s]/g, '');

  // Reemplazar coma decimal por punto si es necesario
  const normalized = str.replace(',', '.');

  const num = Number(normalized);
  return isNaN(num) ? 0 : num;
};

/**
 * Formatea un número como moneda colombiana
 *
 * @param value - Valor numérico
 * @returns String formateado (ej: "$ 5.900.000")
 */
export const formatPrice = (value: number | null): string => {
  if (value === null || value === 0) return '-';

  return new Intl.NumberFormat('es-CO', {
    style: 'currency',
    currency: 'COP',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);
};

/**
 * Calcula los precios dinámicos para una moto según el año
 *
 * Fórmulas:
 * - Contado = Precio Base + vueltas_transito_de_contado
 * - Inicial = (Precio Base * 0.10) + vueltas_transito_con_prenda
 *
 * @param moto - Datos de la moto desde NocoDB
 * @param year - Año seleccionado ('2026' o '2027')
 * @returns Objeto con precios calculados
 */
export const calcularPrecios = (
  moto: MotoNocoDB | Record<string, unknown>,
  year: YearOption
): PreciosCalculados => {
  // Obtener precio base según el año
  // Nota: El campo para 2027 podría ser "Precio comercial 2027" o "Precio_comercial_2027"
  const precioBase = cleanNumber(
    year === '2027'
      ? (moto as Record<string, unknown>)['Precio comercial 2027'] ||
      (moto as Record<string, unknown>)['Precio_comercial_2027'] ||
      (moto as MotoNocoDB).Precio_comercial // Fallback a 2026 si no hay 2027
      : (moto as MotoNocoDB).Precio_comercial
  );

  // Si es 2027 y no hay precio específico, marcar como no disponible
  if (year === '2027') {
    const precio2027 = cleanNumber(
      (moto as Record<string, unknown>)['Precio comercial 2027'] ||
      (moto as Record<string, unknown>)['Precio_comercial_2027']
    );

    if (!precio2027 || precio2027 === 0) {
      return {
        comercial: null,
        contado: null,
        inicial: null,
        porcentaje: 0.10, // Default percentage
        disponible: false,
      };
    }
  }

  // Si no hay precio base, retornar no disponible
  if (!precioBase || precioBase === 0) {
    return {
      comercial: null,
      contado: null,
      inicial: null,
      porcentaje: 0.10, // Default percentage
      disponible: false,
    };
  }

  // Obtener constantes de trámite
  const transitoContado = cleanNumber((moto as MotoNocoDB).vueltas_transito_de_contado);
  const transitoPrenda = cleanNumber((moto as MotoNocoDB).vueltas_transito_con_prenda);

  // Identificar si es Tricargo 200 para aplicar 15%
  const modelo = String((moto as MotoNocoDB).Productos_motos || (moto as any).Modelo || "").toUpperCase();
  const porcentaje = modelo.includes("TRICARGO 200") ? 0.15 : 0.10;

  // Calcular precios
  return {
    comercial: precioBase,
    contado: precioBase + transitoContado,
    inicial: Math.round(precioBase * porcentaje) + transitoPrenda,
    porcentaje,
    disponible: true,
  };
};

/**
 * Verifica si una moto tiene precio para 2027
 *
 * @param moto - Datos de la moto
 * @returns true si tiene precio 2027
 */
export const tienePrecio2027 = (moto: MotoNocoDB | Record<string, unknown>): boolean => {
  const precio2027 = cleanNumber(
    (moto as Record<string, unknown>)['Precio comercial 2027'] ||
    (moto as Record<string, unknown>)['Precio_comercial_2027']
  );
  return precio2027 > 0;
};

/**
 * Determina el año por defecto para una moto
 *
 * Si tiene precio 2027, muestra 2027. Si no, muestra 2026.
 *
 * @param moto - Datos de la moto
 * @returns Año por defecto
 */
export const getDefaultYear = (moto: MotoNocoDB | Record<string, unknown>): YearOption => {
  return tienePrecio2027(moto) ? '2027' : '2026';
};

/**
 * Genera el mensaje de WhatsApp con información de la moto
 *
 * @param params - Parámetros del mensaje
 * @returns Mensaje formateado
 */
export const generarMensajeWhatsApp = (params: {
  marca: string;
  modelo: string;
  year: YearOption;
  comercial: number | null;
  inicial: number | null;
  asesorNombre?: string;
}): string => {
  const { marca, modelo, year, comercial, inicial, asesorNombre = 'tu asesor' } = params;

  const lines = [
    `Hola ${asesorNombre}! Me interesa la *${marca} ${modelo}* modelo *${year}*.`,
  ];

  if (comercial) {
    lines.push(`Precio: ${formatPrice(comercial)}`);
  }

  if (inicial) {
    lines.push(`Inicial: ${formatPrice(inicial)}`);
  }

  lines.push('');
  lines.push('Me pueden dar más información?');

  return lines.join('\n');
};
