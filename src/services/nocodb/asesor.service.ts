/**
 * Servicio de Asesores
 *
 * 🎓 CONCEPTO: Service Layer
 * Este servicio contiene toda la lógica de negocio relacionada
 * con asesores. Los componentes y hooks solo llaman a estos métodos.
 *
 * Ventajas:
 * - Lógica reutilizable
 * - Fácil de testear
 * - Cambios en la API solo afectan este archivo
 *
 * @module services/nocodb/asesor.service
 */

import { NocoDBClient } from './client';
import { nocodbConfig } from '@/config/env';
import type {
  Asesor,
  NocoDBResponse,
  CrearAsesorDTO,
  ActualizarAsesorDTO
} from '@/types/asesor';

/**
 * ID de la tabla de asesores en NocoDB
 */
const TABLE_ID = nocodbConfig.tables.asesores;

/**
 * Servicio para operaciones CRUD de asesores
 *
 * 🎓 CONCEPTO: CRUD = Create, Read, Update, Delete
 * Las 4 operaciones básicas de cualquier sistema de datos.
 */
export class AsesorService {
  /**
   * Obtiene todos los asesores
   *
   * @param activos - Si true, solo devuelve asesores activos
   * @returns Lista de asesores
   *
   * @example
   * ```ts
   * // Obtener todos
   * const todos = await AsesorService.getAll();
   *
   * // Solo activos
   * const activos = await AsesorService.getAll(true);
   * ```
   */
  static async getAll(activos?: boolean): Promise<Asesor[]> {
    // 🎓 EXPLICACIÓN: Construir filtro dinámico
    // Si 'activos' es true, agregamos filtro
    // Si no, obtenemos todos
    const params: Record<string, string> = {};

    if (activos) {
      // NocoDB usa sintaxis especial para filtros
      // Formato: (campo,operador,valor)
      // Nota: La columna se llama "Activo" (con A mayúscula)
      // y el valor es 1 (no true)
      params.where = '(Activo,eq,1)';
    }

    // Llamar a la API
    const response = await NocoDBClient.get<NocoDBResponse<Asesor>>(
      `${TABLE_ID}/records`,
      { params }
    );

    return response.list;
  }

  /**
   * Obtiene un asesor por su slug
   *
   * 🎓 CONCEPTO: Búsqueda por campo único
   * El slug es único para cada asesor, como un username.
   *
   * @param slug - Slug del asesor (ej: "alejandra")
   * @returns Asesor encontrado o null
   *
   * @example
   * ```ts
   * const asesor = await AsesorService.getBySlug('alejandra');
   * if (asesor) {
   * }
   * ```
   */
  static async getBySlug(slug: string): Promise<Asesor | null> {
    // Validar input
    if (!slug || slug.trim() === '') {
      throw new Error('El slug es requerido');
    }

    // Buscar por slug en NocoDB
    // 🎓 NOTA: Usamos 'eq' (equals) para búsqueda exacta
    const response = await NocoDBClient.get<NocoDBResponse<Asesor>>(
      `${TABLE_ID}/records`,
      {
        params: {
          where: `(slug,eq,${slug})`,
          limit: 1, // Solo necesitamos uno
        },
      }
    );

    // Devolver el primero o null si no hay resultados
    return response.list[0] || null;
  }

  /**
   * Obtiene un asesor por su ID
   *
   * @param id - ID numérico del asesor
   * @returns Asesor encontrado
   *
   * @example
   * ```ts
   * const asesor = await AsesorService.getById(123);
   * ```
   */
  static async getById(id: number): Promise<Asesor> {
    return await NocoDBClient.get<Asesor>(
      `${TABLE_ID}/records/${id}`
    );
  }

  /**
   * Crea un nuevo asesor
   *
   * 🎓 CONCEPTO: Data Transfer Object (DTO)
   * Usamos CrearAsesorDTO que no incluye campos auto-generados
   * (Id, CreatedAt, UpdatedAt)
   *
   * @param data - Datos del nuevo asesor
   * @returns Asesor creado
   *
   * @example
   * ```ts
   * const nuevo = await AsesorService.create({
   *   Aseror: 'Pedro López',
   *   Phone: '3001234567',
   *   Email: 'pedro@ejemplo.com',
   *   slug: 'pedro',
   *   activo: true
   * });
   * ```
   */
  static async create(data: CrearAsesorDTO): Promise<Asesor> {
    // Validaciones básicas
    if (!data.Asesor || !data.Phone) {
      throw new Error('Nombre y teléfono son requeridos');
    }

    // Si no hay slug, generarlo del nombre
    if (!data.slug) {
      data.slug = this.generateSlug(data.Asesor);
    }

    // Verificar que el slug no exista
    const existente = await this.getBySlug(data.slug);
    if (existente) {
      throw new Error(`Ya existe un asesor con el slug "${data.slug}"`);
    }

    // Crear en NocoDB
    return await NocoDBClient.post<Asesor>(
      `${TABLE_ID}/records`,
      { body: data }
    );
  }

  /**
   * Actualiza un asesor existente
   *
   * 🎓 CONCEPTO: Partial Update
   * Solo actualizamos los campos que envías, el resto queda igual.
   *
   * @param id - ID del asesor a actualizar
   * @param data - Campos a actualizar
   * @returns Asesor actualizado
   *
   * @example
   * ```ts
   * // Solo actualizar el teléfono
   * await AsesorService.update(123, {
   *   Phone: '3009999999'
   * });
   * ```
   */
  static async update(
    id: number,
    data: ActualizarAsesorDTO
  ): Promise<Asesor> {
    // Si se está actualizando el slug, verificar que no exista
    if (data.slug) {
      const existente = await this.getBySlug(data.slug);
      if (existente && existente.Id !== id) {
        throw new Error(`Ya existe un asesor con el slug "${data.slug}"`);
      }
    }

    return await NocoDBClient.patch<Asesor>(
      `${TABLE_ID}/records`,
      {
        body: {
          Id: id,
          ...data,
        },
      }
    );
  }

  /**
   * Desactiva un asesor (soft delete)
   *
   * 🎓 CONCEPTO: Soft Delete vs Hard Delete
   * - Soft: Marcar como inactivo (puede reactivarse)
   * - Hard: Eliminar permanentemente (no se puede recuperar)
   *
   * Usamos soft delete para no perder datos históricos.
   *
   * 🎓 ESTADOS:
   * - 0 = Inactivo (temporalmente desactivado)
   * - 1 = Activo (trabajando actualmente)
   * - 2 = Retirado (ya no trabaja con nosotros)
   *
   * @param id - ID del asesor
   */
  static async desactivar(id: number): Promise<void> {
    await this.update(id, { Activo: 0 as any });
  }

  /**
   * Reactiva un asesor
   *
   * @param id - ID del asesor
   */
  static async activar(id: number): Promise<void> {
    await this.update(id, { Activo: 1 as any });
  }

  /**
   * Marca un asesor como retirado
   *
   * Los asesores retirados ya no trabajan con nosotros,
   * pero mantienen su información en el sistema por si regresan.
   *
   * @param id - ID del asesor
   */
  static async marcarComoRetirado(id: number): Promise<void> {
    await this.update(id, { Activo: 2 as any });
  }

  /**
   * Reactiva un asesor retirado
   *
   * Útil cuando un asesor regresa a trabajar con nosotros.
   *
   * @param id - ID del asesor
   */
  static async reactivarDesdeRetirado(id: number): Promise<void> {
    await this.update(id, { Activo: 1 as any });
  }

  /**
   * Elimina permanentemente un asesor (hard delete)
   *
   * ⚠️ PELIGRO: Esta acción NO se puede deshacer
   * Solo usar en casos excepcionales.
   *
   * @param id - ID del asesor
   */
  static async eliminar(id: number): Promise<void> {
    await NocoDBClient.delete(`${TABLE_ID}/records/${id}`);
  }

  /**
   * Genera un slug URL-friendly desde un nombre
   *
   * 🎓 CONCEPTO: String Manipulation
   * Convierte "Alejandra González" en "alejandra-gonzalez"
   *
   * @param nombre - Nombre del asesor
   * @returns Slug generado
   *
   * @example
   * ```ts
   * generateSlug('Alejandra González'); // "alejandra-gonzalez"
   * generateSlug('Juan Pablo III');     // "juan-pablo-iii"
   * ```
   */
  private static generateSlug(nombre: string): string {
    return nombre
      .toLowerCase()                    // a minúsculas
      .trim()                          // quitar espacios al inicio/fin
      .replace(/[áàäâ]/g, 'a')        // reemplazar acentos
      .replace(/[éèëê]/g, 'e')
      .replace(/[íìïî]/g, 'i')
      .replace(/[óòöô]/g, 'o')
      .replace(/[úùüû]/g, 'u')
      .replace(/ñ/g, 'n')
      .replace(/[^a-z0-9\s-]/g, '')   // quitar caracteres especiales
      .replace(/\s+/g, '-')           // espacios → guiones
      .replace(/-+/g, '-');           // múltiples guiones → uno solo
  }

  /**
   * Busca asesores por nombre (búsqueda parcial)
   *
   * 🎓 CONCEPTO: Fuzzy Search
   * Encuentra coincidencias parciales (ej: "ale" encuentra "Alejandra")
   *
   * @param query - Término de búsqueda
   * @returns Asesores que coinciden
   *
   * @example
   * ```ts
   * const resultados = await AsesorService.buscar('ale');
   * // Puede devolver: Alejandra, Alejandro, etc.
   * ```
   */
  static async buscar(query: string): Promise<Asesor[]> {
    if (!query || query.trim() === '') {
      return this.getAll();
    }

    // NocoDB usa 'like' para búsqueda parcial
    // '%' es wildcard (cualquier cosa)
    const whereClause = `(Asesor,like,%${query}%)`;

    const response = await NocoDBClient.get<NocoDBResponse<Asesor>>(
      `${TABLE_ID}/records`,
      {
        params: {
          where: whereClause,
        },
      }
    );

    return response.list;
  }

  /**
   * Búsqueda inteligente para resolver nombres o slugs
   *
   * Intenta encontrar un asesor único usando varias estrategias:
   * 1. Búsqueda exacta por slug
   * 2. Búsqueda por slug generado (ej: "Juan Pablo" -> "juan-pablo")
   * 3. Búsqueda exacta por nombre
   * 4. Búsqueda parcial por nombre
   *
   * @param identifier - Nombre o slug (ej: "Juan Pablo", "juan-pablo")
   * @returns El asesor único encontrado o null si no hay coincidencias o hay múltiples
   */
  static async findSmart(identifier: string): Promise<Asesor | null> {
    if (!identifier) return null;
    const cleanId = identifier.trim();

    // 1. Intentar por slug exacto
    const bySlug = await this.getBySlug(cleanId);
    if (bySlug) return bySlug;

    // 2. Intentar generando el slug
    const generatedSlug = this.generateSlug(cleanId);
    const byGenSlug = await this.getBySlug(generatedSlug);
    if (byGenSlug) return byGenSlug;

    // 3. Obtener todos los activos para filtrar en memoria
    // (Es más eficiente que múltiples llamadas a la API si la lista es corta)
    const allActive = await this.getAll(true);

    // 4. Búsqueda exacta por nombre (case insensitive)
    const exactMatch = allActive.find(
      a => a.Asesor.toLowerCase() === cleanId.toLowerCase()
    );
    if (exactMatch) return exactMatch;

    // 5. Búsqueda parcial (contiene el texto)
    const partialMatches = allActive.filter(
      a => a.Asesor.toLowerCase().includes(cleanId.toLowerCase())
    );

    if (partialMatches.length  == 1) {
      return partialMatches[0];
    }

    // Si hay múltiples coincidencias parciales (ej: "Juan" -> "Juan Pablo", "Juan Carlos"),
    // intentamos ver si alguna empieza exactamente con el identificador
    if (partialMatches.length > 1) {
      const startMatches = partialMatches.filter(
        a => a.Asesor.toLowerCase().startsWith(cleanId.toLowerCase())
      );
      if (startMatches.length  == 1) {
        return startMatches[0];
      }
    }

    return null;
  }
}

/**
 * 🎓 RESUMEN - Lo que creamos:
 *
 * Un servicio con métodos para:
 * ✅ Obtener todos los asesores
 * ✅ Obtener por slug (para rutas)
 * ✅ Obtener por ID
 * ✅ Crear nuevo asesor
 * ✅ Actualizar asesor
 * ✅ Activar/Desactivar (soft delete)
 * ✅ Eliminar permanentemente
 * ✅ Buscar por nombre
 * ✅ Generar slugs automáticamente
 *
 * TODO esto es REUTILIZABLE en cualquier parte de la app.
 */
