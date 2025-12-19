/**
 * Servicio de Motos
 *
 * Gestiona toda la lógica de negocio relacionada con motos.
 * Adaptado a la estructura real de la tabla "lista_de_precios" en NocoDB.
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
  SeccionFichaTecnica,
  FichaTecnicaMoto,
  MotoLegacy,
  CATEGORIA_MAP,
  MARCA_MAP,
} from '@/types/moto';
import { CATEGORIA_MAP as categoriaMap, MARCA_MAP as marcaMap } from '@/types/moto';

/**
 * ID de la tabla de motos/precios en NocoDB
 */
const TABLE_ID = nocodbConfig.tables.precios;

/**
 * Base URL para las imágenes de NocoDB
 */
const NOCODB_BASE_URL = nocodbConfig.baseUrl;

/**
 * Servicio para gestión de motos
 */
export class MotoService {
  /**
   * Obtiene todas las motos con opciones de filtrado
   */
  static async getAll(options: ConsultarMotosOptions = {}): Promise<MotoNocoDB[]> {
    const {
      soloActivas = true,
      marca,
      categoria,
      cilindrada,
      soloDisponibles = false,
      limit,
      offset,
      orderBy = 'Productos_motos',
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

    // Filtro por cilindrada
    if (cilindrada) {
      whereClauses.push(`(Categoria_Cilindraje,eq,${cilindrada})`);
    }

    // Filtro de disponibles
    if (soloDisponibles) {
      whereClauses.push('(motos_disponibles,eq,Disponible)');
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
   */
  static async getById(id: number): Promise<MotoNocoDB> {
    return await NocoDBClient.get<MotoNocoDB>(
      `${TABLE_ID}/records/${id}`
    );
  }

  /**
   * Crea una nueva moto
   */
  static async create(data: CrearMotoDTO): Promise<MotoNocoDB> {
    // Validaciones
    if (!data.Productos_motos || !data.Marca || !data.Categoria) {
      throw new Error('Producto, Marca y Categoría son requeridos');
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
   */
  static async update(id: number, data: ActualizarMotoDTO): Promise<MotoNocoDB> {
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
   */
  static async activar(id: number): Promise<void> {
    await this.update(id, { Activo: 1 });
  }

  /**
   * Desactiva una moto (la saca del mercado)
   */
  static async desactivar(id: number): Promise<void> {
    await this.update(id, { Activo: 0 });
  }

  /**
   * Elimina permanentemente una moto
   */
  static async eliminar(id: number): Promise<void> {
    await NocoDBClient.delete(`${TABLE_ID}/records/${id}`);
  }

  /**
   * Busca motos por nombre/modelo
   */
  static async buscar(query: string): Promise<MotoNocoDB[]> {
    if (!query || query.trim() === '') {
      return this.getAll();
    }

    const whereClause = `(Productos_motos,like,%${query}%)`;

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
   */
  static async getAllExtendidas(
    options: ConsultarMotosOptions = {}
  ): Promise<MotoExtendida[]> {
    const motos = await this.getAll(options);
    return motos.map(moto => this.extenderMoto(moto));
  }

  /**
   * Obtiene una moto extendida por ID
   */
  static async getByIdExtendida(id: number): Promise<MotoExtendida> {
    const moto = await this.getById(id);
    return this.extenderMoto(moto);
  }

  /**
   * Extiende una moto con datos parseados
   */
  private static extenderMoto(moto: MotoNocoDB): MotoExtendida {
    return {
      ...moto,
      imagenesGaleria: this.parseImagenesGaleria(moto.Fotos_imagenes_motos),
      imagenPrincipal: this.getImagenPrincipal(moto.Fotos_imagenes_motos),
      caracteristicasObj: this.parseCaracteristicas(moto['caracteristicas y beneficios']),
      fichaTecnicaObj: this.parseFichaTecnica(moto.ficha_tecnica),
      descripcionTexto: this.stripMarkdown(moto.descripcion_rapida),
      garantiaTexto: this.stripMarkdown(moto.garantia),
    };
  }

  /**
   * Parsea las imágenes de NocoDB y devuelve URLs completas
   */
  private static parseImagenesGaleria(fotos?: MotoNocoDB['Fotos_imagenes_motos']): string[] {
    if (!fotos || !Array.isArray(fotos)) return [];

    return fotos.map(foto => {
      // Usar signedPath que ya incluye la URL completa
      return `${NOCODB_BASE_URL}/${foto.signedPath}`;
    });
  }

  /**
   * Obtiene la imagen principal (primera del array)
   */
  private static getImagenPrincipal(fotos?: MotoNocoDB['Fotos_imagenes_motos']): string | undefined {
    if (!fotos || !Array.isArray(fotos) || fotos.length === 0) return undefined;
    return `${NOCODB_BASE_URL}/${fotos[0].signedPath}`;
  }

  /**
   * Parsea características desde Markdown
   */
  private static parseCaracteristicas(markdown?: string): CaracteristicasMoto {
    if (!markdown) return {};

    const caracteristicas: CaracteristicasMoto = {};

    // Remover el título principal (# CARACTERÍSTICAS Y BENEFICIOS)
    let texto = markdown.replace(/^#\s+.+$/m, '').trim();

    // Dividir por secciones (## Título)
    const secciones = texto.split(/^##\s+/m).filter(s => s.trim());

    secciones.forEach(seccion => {
      const lineas = seccion.split('\n');
      const titulo = lineas[0]?.trim();
      const contenido = lineas.slice(1).join('\n').trim();

      if (titulo && contenido) {
        caracteristicas[titulo] = contenido;
      }
    });

    return caracteristicas;
  }

  /**
   * Parsea ficha técnica desde Markdown
   */
  private static parseFichaTecnica(markdown?: string): FichaTecnicaMoto {
    if (!markdown) return {};

    const fichaTecnica: FichaTecnicaMoto = {};

    // Remover el título principal (# FICHA TÉCNICA)
    let texto = markdown.replace(/^#\s+FICHA TÉCNICA$/m, '').trim();

    // Dividir por secciones (## Motor, ## Transmisión, etc.)
    const secciones = texto.split(/^##\s+/m).filter(s => s.trim());

    secciones.forEach(seccion => {
      const lineas = seccion.split('\n');
      const nombreSeccion = lineas[0]?.trim();

      if (!nombreSeccion) return;

      const camposSeccion: SeccionFichaTecnica = {};

      // Parsear cada línea con formato "- **Campo:** valor"
      lineas.slice(1).forEach(linea => {
        const match = linea.match(/^-\s+\*\*(.+?):\*\*\s+(.+)$/);
        if (match) {
          const [, campo, valor] = match;
          camposSeccion[campo.trim()] = valor.trim();
        }
      });

      if (Object.keys(camposSeccion).length > 0) {
        fichaTecnica[nombreSeccion] = camposSeccion;
      }
    });

    return fichaTecnica;
  }

  /**
   * Remueve formato Markdown básico
   */
  private static stripMarkdown(text?: string): string | undefined {
    if (!text) return undefined;

    return text
      .replace(/^#+ /gm, '') // Remover headers
      .replace(/\*\*(.+?)\*\*/g, '$1') // Remover bold
      .replace(/\*(.+?)\*/g, '$1') // Remover italic
      .replace(/\[(.+?)\]\(.+?\)/g, '$1') // Remover links
      .trim();
  }

  /**
   * Convierte una moto de NocoDB a formato legacy
   */
  static toLegacyFormat(moto: MotoNocoDB): MotoLegacy {
    // Mapear marca
    const marcaLegacy = marcaMap[moto.Marca] || 'TVS';

    // Mapear categoría
    const categoriaLegacy = categoriaMap[moto.Categoria] || 'trabajo';

    // Obtener imagen principal
    const imagen = this.getImagenPrincipal(moto.Fotos_imagenes_motos) || '';

    // Generar ID único basado en el nombre del producto
    const id = this.generateSlug(moto.Productos_motos);

    return {
      id,
      modelo: moto.Productos_motos,
      marca: marcaLegacy,
      categoria: categoriaLegacy,
      precio2026: moto.Precio_comercial || 0,
      cuotaInicial: moto.cuota_inicial || 0,
      precioContado: moto.precio_de_contado || 0,
      imagen,
      cilindrada: moto.Categoria_Cilindraje ? `${moto.Categoria_Cilindraje}cc` : undefined,
    };
  }

  /**
   * Convierte lista de motos a formato legacy
   */
  static toLegacyFormatList(motos: MotoNocoDB[]): MotoLegacy[] {
    return motos.map(moto => this.toLegacyFormat(moto));
  }

  /**
   * Genera un slug URL-friendly desde un nombre
   */
  private static generateSlug(nombre: string): string {
    return nombre
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
   */
  static async sincronizar(): Promise<MotoNocoDB[]> {
    return await this.getAll({ soloActivas: true });
  }

  /**
   * Obtiene estadísticas del catálogo
   */
  static async getEstadisticas() {
    const todasLasMotos = await this.getAll({ soloActivas: false });
    const motosActivas = todasLasMotos.filter(m => m.Activo === 1);
    const motosInactivas = todasLasMotos.filter(m => m.Activo !== 1);

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

    // Agrupar por cilindrada
    const porCilindrada = todasLasMotos.reduce((acc, moto) => {
      if (moto.Categoria_Cilindraje) {
        acc[moto.Categoria_Cilindraje] = (acc[moto.Categoria_Cilindraje] || 0) + 1;
      }
      return acc;
    }, {} as Record<string, number>);

    return {
      total: todasLasMotos.length,
      activas: motosActivas.length,
      inactivas: motosInactivas.length,
      porMarca,
      porCategoria,
      porCilindrada,
    };
  }
}
