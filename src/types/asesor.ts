/**
 * Tipos para la entidad Asesor
 *
 * 🎓 CONCEPTO: Estos tipos representan la estructura EXACTA
 * de los datos que vienen de NocoDB tabla "Asesores".
 *
 * Ventaja: TypeScript te avisará si intentas acceder a un campo
 * que no existe o si pones el tipo de dato incorrecto.
 *
 * @module types/asesor
 */

/**
 * Estructura de un Asesor en NocoDB
 *
 * 🎓 EXPLICACIÓN DE CAMPOS:
 *
 * - Campos con '?' son OPCIONALES (pueden no existir)
 * - Campos sin '?' son OBLIGATORIOS
 * - 'string' = texto
 * - 'number' = número
 * - 'boolean' = verdadero/falso
 */
export interface Asesor {
  /**
   * ID único del asesor en NocoDB
   * Generado automáticamente por NocoDB
   */
  Id: number;

  /**
   * Fecha de creación del registro
   * Generado automáticamente por NocoDB
   */
  CreatedAt: string;

  /**
   * Fecha de última actualización
   * Generado automáticamente por NocoDB
   */
  UpdatedAt: string;

  /**
   * Nombre del asesor
   * Ejemplo: "Alejandra", "Miguel"
   *
   * 🎓 NOTA: En NocoDB está como "Aseror" (typo),
   * pero lo mantenemos así para que coincida con la BD
   */
  Aseror: string;

  /**
   * Número de teléfono
   * Ejemplo: "3177352000"
   */
  Phone: string;

  /**
   * Correo electrónico
   * Puede ser null si no está configurado
   */
  Email: string | null;

  // ============================================
  // CAMPOS ADICIONALES
  // ============================================

  /**
   * Si el asesor está activo
   * 1 = activo, 0 = inactivo
   * Solo los asesores activos aparecen en el catálogo
   */
  Activo?: number;

  /**
   * Slug único para la URL
   * Ejemplo: "alejandra" para autorunai.tech/alejandra
   *
   * 🎓 CONCEPTO: Slug
   * Es una versión URL-friendly del nombre:
   * - Todo en minúsculas
   * - Sin espacios (usa guiones)
   * - Sin caracteres especiales
   * Ejemplo: "Alejandra González" → "alejandra-gonzalez"
   */
  slug?: string;

  // 🎓 NOTA: Los siguientes campos están planeados pero aún no existen en NocoDB
  // Descomenta cuando los agregues a tu base de datos:

  /**
   * Número de WhatsApp (con código de país)
   * Ejemplo: "573177352000"
   */
  // whatsapp?: string;

  /**
   * Color primario del tema del asesor (hexadecimal)
   * Ejemplo: "#db2777"
   */
  // color_primario?: string;

  /**
   * Color secundario del tema del asesor
   * Ejemplo: "#be185d"
   */
  // color_secundario?: string;

  /**
   * ID del inbox en Chatwoot
   * Para crear conversaciones automáticamente
   */
  // inbox_chatwoot_id?: string;

  /**
   * Horarios de atención en formato JSON
   * Estructura: { lunes_viernes: {...}, sabado: {...}, domingo: {...} }
   */
  // horario_json?: string;

  /**
   * URL del logo personalizado del asesor
   * Si no tiene, usa el logo por defecto
   */
  // logo_url?: string;
}

/**
 * 🎓 CONCEPTO: Tipo para CREAR un asesor
 *
 * Cuando creamos un asesor nuevo, NO enviamos:
 * - Id (lo genera NocoDB)
 * - CreatedAt (lo genera NocoDB)
 * - UpdatedAt (lo genera NocoDB)
 *
 * Este tipo usa 'Omit' para excluir esos campos.
 */
export type CrearAsesorDTO = Omit<
  Asesor,
  'Id' | 'CreatedAt' | 'UpdatedAt'
>;

/**
 * 🎓 CONCEPTO: Tipo para ACTUALIZAR un asesor
 *
 * Cuando actualizamos, TODOS los campos son opcionales
 * porque podemos actualizar solo algunos campos.
 *
 * 'Partial<T>' hace que todos los campos de T sean opcionales.
 */
export type ActualizarAsesorDTO = Partial<
  Omit<Asesor, 'Id' | 'CreatedAt' | 'UpdatedAt'>
>;

/**
 * 🎓 CONCEPTO: Tipo para la respuesta de NocoDB
 *
 * NocoDB siempre devuelve las listas en este formato:
 * {
 *   list: [...],      // Array de registros
 *   pageInfo: {...}   // Info de paginación
 * }
 */
export interface NocoDBResponse<T> {
  list: T[];
  pageInfo: {
    totalRows?: number;
    page?: number;
    pageSize?: number;
    isFirstPage?: boolean;
    isLastPage?: boolean;
  };
}

/**
 * 🎓 EJEMPLO DE USO:
 *
 * ```typescript
 * // Obtener un asesor
 * const asesor: Asesor = await getAsesor('alejandra');
 * console.log(asesor.Aseror); // ✅ TypeScript sabe que existe
 * console.log(asesor.nombre); // ❌ Error: campo no existe
 *
 * // Crear un asesor nuevo
 * const nuevoAsesor: CrearAsesorDTO = {
 *   Aseror: 'Pedro',
 *   Phone: '3001234567',
 *   Email: 'pedro@ejemplo.com',
 *   slug: 'pedro',
 *   activo: true
 * };
 *
 * // Actualizar un asesor
 * const actualizar: ActualizarAsesorDTO = {
 *   Phone: '3009999999' // Solo actualizamos el teléfono
 * };
 * ```
 */
