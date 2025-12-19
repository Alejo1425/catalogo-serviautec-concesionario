/**
 * Servicio de Motos
 *
 * Gestiona toda la lógica de negocio relacionada con motos.
 * Conecta con NocoDB para obtener/actualizar datos en tiempo real.
 *
 * Funcionalidades:
 * - CRUD completo de motos
 * - Filtros por marca, categoría, estado
 * - Activar/desactivar motos (cuando salen o entran al mercado)
 * - Parsing de datos complejos (características, ficha técnica, galería)
 * - Conversión entre formato NocoDB y formato legacy
 *
 * @module services/nocodb/moto.service
 */

import { NocoDBClient } from './client';
import { nocodbConfig } from '@/config/env';
import type {
  MotoNocoDB,
  CrearMotoDTO,
  ActualizarMotoDTO,
  NocoDBResponseMotos,
  ConsultarMotosOptions,
  MotoExtendida,
  CaracteristicasMoto,
  FichaTecnicaMoto,
  MotoLegacy,
} from '@/types/moto';

/**
 * ID de la tabla de motos/precios en NocoDB
 */
const TABLE_ID = nocodbConfig.tables.precios;

/**
 * Servicio para gestión de motos
 */
export class MotoService {
  /**
   * Obtiene todas las motos con opciones de filtrado
   *
   * @param options - Opciones de consulta
   * @returns Lista de motos
   *
   * @example
   * ```ts
   * // Todas las motos activas
   * const activas = await MotoService.getAll({ soloActivas: true });
   *
   * // Motos TVS deportivas
   * const tvsDeportivas = await MotoService.getAll({
   *   marca: 'TVS',
   *   categoria: 'deportiva'
   * });
   * ```
   */
  static async getAll(options: ConsultarMotosOptions = {}): Promise<MotoNocoDB[]> {
    const {
      soloActivas = true,
      marca,
      categoria,
      limit,
      offset,
      orderBy = 'Modelo',
      orderDirection = 'ASC',
    } = options;

    // Construir filtros dinámicos
    const whereClauses: string[] = [];

    // Filtro de activas (por defecto solo motos en el mercado)
    if (soloActivas) {
      whereClauses.push('(Activo,eq,1)');
    }

    // Filtro por marca
    if (marca) {
      whereClauses.push(`(Marca,eq,${marca})`);
    }

    // Filtro por categoría
    if (categoria) {
      whereClauses.push(`(Categoria,eq,${categoria})`);
    }

    // Combinar filtros con AND
    const whereClause = whereClauses.length > 0
      ? whereClauses.join('~and')
      : undefined;

    // Parámetros de consulta
    const params: Record<string, string | number> = {};

    if (whereClause) {
      params.where = whereClause;
    }

    if (limit) {
      params.limit = limit;
    }

    if (offset) {
      params.offset = offset;
    }

    // Ordenamiento
    params.sort = orderDirection === 'DESC' ? `-${orderBy}` : orderBy;

    // Ejecutar consulta
    const response = await NocoDBClient.get<NocoDBResponseMotos<MotoNocoDB>>(
      `${TABLE_ID}/records`,
      { params }
    );

    return response.list;
  }

  /**
   * Obtiene una moto por su ID
   *
   * @param id - ID de la moto
   * @returns Moto encontrada
   */
  static async getById(id: number): Promise<MotoNocoDB> {
    return await NocoDBClient.get<MotoNocoDB>(
      `${TABLE_ID}/records/${id}`
    );
  }

  /**
   * Obtiene una moto por su slug
   *
   * @param slug - Slug de la moto
   * @returns Moto encontrada o null
   */
  static async getBySlug(slug: string): Promise<MotoNocoDB | null> {
    if (!slug || slug.trim() === '') {
      throw new Error('El slug es requerido');
    }

    const response = await NocoDBClient.get<NocoDBResponseMotos<MotoNocoDB>>(
      `${TABLE_ID}/records`,
      {
        params: {
          where: `(slug,eq,${slug})`,
          limit: 1,
        },
      }
    );

    return response.list[0] || null;
  }

  /**
   * Crea una nueva moto
   *
   * @param data - Datos de la nueva moto
   * @returns Moto creada
   */
  static async create(data: CrearMotoDTO): Promise<MotoNocoDB> {
    // Validaciones
    if (!data.Modelo || !data.Marca || !data.Categoria) {
      throw new Error('Modelo, Marca y Categoría son requeridos');
    }

    // Generar slug si no existe
    if (!data.slug) {
      data.slug = this.generateSlug(data.Modelo);
    }

    // Verificar que el slug no exista
    const existente = await this.getBySlug(data.slug);
    if (existente) {
      throw new Error(`Ya existe una moto con el slug "${data.slug}"`);
    }

    // Por defecto, las motos nuevas están activas
    if (data.Activo === undefined) {
      data.Activo = 1;
    }

    return await NocoDBClient.post<MotoNocoDB>(
      `${TABLE_ID}/records`,
      { body: data }
    );
  }

  /**
   * Actualiza una moto existente
   *
   * @param id - ID de la moto
   * @param data - Datos a actualizar
   * @returns Moto actualizada
   */
  static async update(id: number, data: ActualizarMotoDTO): Promise<MotoNocoDB> {
    // Si se está actualizando el slug, verificar que no exista
    if (data.slug) {
      const existente = await this.getBySlug(data.slug);
      if (existente && existente.Id !== id) {
        throw new Error(`Ya existe una moto con el slug "${data.slug}"`);
      }
    }

    return await NocoDBClient.patch<MotoNocoDB>(
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
   * Activa una moto (la pone en el mercado)
   *
   * Útil cuando ingresa un nuevo modelo al catálogo
   *
   * @param id - ID de la moto
   */
  static async activar(id: number): Promise<void> {
    await this.update(id, { Activo: 1 });
  }

  /**
   * Desactiva una moto (la saca del mercado)
   *
   * Útil cuando un modelo sale del mercado pero queremos mantener
   * el histórico de datos
   *
   * @param id - ID de la moto
   */
  static async desactivar(id: number): Promise<void> {
    await this.update(id, { Activo: 0 });
  }

  /**
   * Elimina permanentemente una moto
   *
   * ⚠️ PELIGRO: Esta acción NO se puede deshacer
   * Preferir usar desactivar() en su lugar
   *
   * @param id - ID de la moto
   */
  static async eliminar(id: number): Promise<void> {
    await NocoDBClient.delete(`${TABLE_ID}/records/${id}`);
  }

  /**
   * Busca motos por nombre/modelo
   *
   * @param query - Término de búsqueda
   * @returns Motos que coinciden
   */
  static async buscar(query: string): Promise<MotoNocoDB[]> {
    if (!query || query.trim() === '') {
      return this.getAll();
    }

    const whereClause = `(Modelo,like,%${query}%)`;

    const response = await NocoDBClient.get<NocoDBResponseMotos<MotoNocoDB>>(
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
   * Obtiene motos con información extendida
   * Incluye parsing de campos complejos
   *
   * @param options - Opciones de consulta
   * @returns Motos con datos extendidos
   */
  static async getAllExtendidas(
    options: ConsultarMotosOptions = {}
  ): Promise<MotoExtendida[]> {
    const motos = await this.getAll(options);
    return motos.map(moto => this.extenderMoto(moto));
  }

  /**
   * Obtiene una moto extendida por ID
   *
   * @param id - ID de la moto
   * @returns Moto con datos extendidos
   */
  static async getByIdExtendida(id: number): Promise<MotoExtendida> {
    const moto = await this.getById(id);
    return this.extenderMoto(moto);
  }

  /**
   * Extiende una moto con datos parseados
   *
   * @param moto - Moto base
   * @returns Moto extendida
   */
  private static extenderMoto(moto: MotoNocoDB): MotoExtendida {
    return {
      ...moto,
      imagenesGaleria: this.parseGaleriaImagenes(moto.Galeria_Imagenes),
      caracteristicasObj: this.parseCaracteristicas(moto.Caracteristicas),
      fichaTecnicaObj: this.parseFichaTecnica(moto.Ficha_Tecnica),
    };
  }

  /**
   * Parsea la galería de imágenes
   * Acepta: JSON array, string separado por comas, o string simple
   *
   * @param galeria - String de galería
   * @returns Array de URLs
   */
  private static parseGaleriaImagenes(galeria?: string): string[] {
    if (!galeria) return [];

    try {
      // Intentar parsear como JSON
      const parsed = JSON.parse(galeria);
      if (Array.isArray(parsed)) {
        return parsed.filter(url => typeof url === 'string' && url.trim() !== '');
      }
    } catch {
      // No es JSON, intentar separar por comas
      return galeria
        .split(',')
        .map(url => url.trim())
        .filter(url => url !== '');
    }

    return [];
  }

  /**
   * Parsea las características
   * Acepta: JSON object o texto con líneas "clave: valor"
   *
   * @param caracteristicas - String de características
   * @returns Objeto de características
   */
  private static parseCaracteristicas(caracteristicas?: string): CaracteristicasMoto {
    if (!caracteristicas) return {};

    try {
      // Intentar parsear como JSON
      const parsed = JSON.parse(caracteristicas);
      if (typeof parsed === 'object') {
        return parsed;
      }
    } catch {
      // No es JSON, parsear como texto línea por línea
      const obj: CaracteristicasMoto = {};
      const lineas = caracteristicas.split('\n');

      lineas.forEach(linea => {
        const match = linea.match(/^([^:]+):\s*(.+)$/);
        if (match) {
          const [, key, value] = match;
          obj[key.trim().toLowerCase()] = value.trim();
        }
      });

      return obj;
    }

    return {};
  }

  /**
   * Parsea la ficha técnica
   * Acepta: JSON object o texto estructurado
   *
   * @param fichaTecnica - String de ficha técnica
   * @returns Objeto de ficha técnica
   */
  private static parseFichaTecnica(fichaTecnica?: string): FichaTecnicaMoto {
    if (!fichaTecnica) return {};

    try {
      // Intentar parsear como JSON
      const parsed = JSON.parse(fichaTecnica);
      if (typeof parsed === 'object') {
        return parsed;
      }
    } catch {
      // No es JSON, devolver objeto vacío
      // Podrías implementar un parser más sofisticado aquí si lo necesitas
      return {};
    }

    return {};
  }

  /**
   * Convierte una moto de NocoDB a formato legacy
   * Para compatibilidad con el código anterior
   *
   * @param moto - Moto de NocoDB
   * @returns Moto en formato legacy
   */
  static toLegacyFormat(moto: MotoNocoDB): MotoLegacy {
    return {
      id: moto.slug || `moto-${moto.Id}`,
      modelo: moto.Modelo,
      marca: moto.Marca,
      categoria: moto.Categoria,
      precio2026: moto.Precio_2026 || 0,
      cuotaInicial: moto.Cuota_Inicial || 0,
      precioContado: moto.Precio_Contado || 0,
      imagen: moto.Imagen_Principal || '',
      cilindrada: moto.Cilindrada,
    };
  }

  /**
   * Convierte lista de motos a formato legacy
   *
   * @param motos - Lista de motos de NocoDB
   * @returns Lista en formato legacy
   */
  static toLegacyFormatList(motos: MotoNocoDB[]): MotoLegacy[] {
    return motos.map(moto => this.toLegacyFormat(moto));
  }

  /**
   * Genera un slug URL-friendly desde un modelo
   *
   * @param modelo - Nombre del modelo
   * @returns Slug generado
   *
   * @example
   * ```ts
   * generateSlug('APACHE RTR 200 4V'); // "apache-rtr-200-4v"
   * generateSlug('RAIDER 125 FI');     // "raider-125-fi"
   * ```
   */
  private static generateSlug(modelo: string): string {
    return modelo
      .toLowerCase()
      .trim()
      .replace(/[áàäâ]/g, 'a')
      .replace(/[éèëê]/g, 'e')
      .replace(/[íìïî]/g, 'i')
      .replace(/[óòöô]/g, 'o')
      .replace(/[úùüû]/g, 'u')
      .replace(/ñ/g, 'n')
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-');
  }

  /**
   * Sincroniza motos desde NocoDB
   * Obtiene las últimas motos activas del catálogo
   *
   * Útil para:
   * - Cargar motos al iniciar la app
   * - Refrescar después de cambios
   * - Polling periódico
   *
   * @returns Lista de motos activas
   */
  static async sincronizar(): Promise<MotoNocoDB[]> {
    return await this.getAll({ soloActivas: true });
  }

  /**
   * Obtiene estadísticas del catálogo
   *
   * @returns Estadísticas
   */
  static async getEstadisticas() {
    const todasLasMotos = await this.getAll({ soloActivas: false });
    const motosActivas = todasLasMotos.filter(m => m.Activo);
    const motosInactivas = todasLasMotos.filter(m => !m.Activo);

    // Agrupar por marca
    const porMarca = todasLasMotos.reduce((acc, moto) => {
      acc[moto.Marca] = (acc[moto.Marca] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    // Agrupar por categoría
    const porCategoria = todasLasMotos.reduce((acc, moto) => {
      acc[moto.Categoria] = (acc[moto.Categoria] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return {
      total: todasLasMotos.length,
      activas: motosActivas.length,
      inactivas: motosInactivas.length,
      porMarca,
      porCategoria,
    };
  }
}
