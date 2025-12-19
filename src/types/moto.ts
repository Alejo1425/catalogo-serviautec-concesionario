/**
 * Tipos relacionados con motos
 *
 * Define las interfaces para trabajar con motos desde NocoDB
 * Adaptado a la estructura real de la tabla "lista_de_precios"
 */

/**
 * Tipo de moto desde NocoDB
 * Estructura real de la tabla "lista_de_precios"
 */
export interface MotoNocoDB {
  /** ID único del registro en NocoDB */
  Id: number;

  /** Nombre/modelo de la moto */
  Productos_motos: string;

  /** Marca de la moto */
  Marca: string;

  /** Categoría de la moto */
  Categoria: string;

  /** Categoría por cilindrada */
  Categoria_Cilindraje?: string;

  /** Precio comercial (precio financiado) */
  Precio_comercial?: number;

  /** Vueltas tránsito de contado */
  vueltas_transito_de_contado?: number;

  /** Vueltas tránsito con prenda */
  vueltas_transito_con_prenda?: number;

  /** Precio de contado */
  precio_de_contado?: number;

  /** Cuota inicial */
  cuota_inicial?: number;

  /** Modelo/año */
  Modelo?: string;

  /** Fotos e imágenes (array de objetos de NocoDB) */
  Fotos_imagenes_motos?: Array<{
    id: string;
    path: string;
    title: string;
    mimetype: string;
    size: number;
    width?: number;
    height?: number;
    signedPath: string;
    thumbnails?: {
      tiny?: { signedPath: string };
      small?: { signedPath: string };
      card_cover?: { signedPath: string };
    };
  }>;

  /** Descripción rápida (Markdown) */
  descripcion_rapida?: string;

  /** Características y beneficios (Markdown) */
  'caracteristicas y beneficios'?: string;

  /** Garantía (Markdown/HTML) */
  garantia?: string;

  /** Ficha técnica (Markdown) */
  ficha_tecnica?: string;

  /** Manual de propietario (array de PDFs) */
  manual_de_propietario?: Array<{
    id: string;
    path: string;
    title: string;
    mimetype: string;
    size: number;
    signedPath: string;
  }>;

  /** Página principal de Auteco */
  pagina_principal_auteco?: string;

  /** Precio con descuento */
  precio_con_descuento?: number | null;

  /** Bono de descuento */
  Bono_de_descuento?: number | null;

  /** Motos disponibles */
  motos_disponibles?: string;

  /** Estado activo/inactivo (1 = activo, 0 = inactivo) */
  Activo?: number;

  /** Fecha de creación (auto-generado por NocoDB) */
  CreatedAt?: string;

  /** Fecha de última actualización (auto-generado por NocoDB) */
  UpdatedAt?: string;
}

/**
 * DTO para crear una nueva moto
 */
export interface CrearMotoDTO {
  Productos_motos: string;
  Marca: string;
  Categoria: string;
  Categoria_Cilindraje?: string;
  Precio_comercial?: number;
  vueltas_transito_de_contado?: number;
  vueltas_transito_con_prenda?: number;
  precio_de_contado?: number;
  cuota_inicial?: number;
  Modelo?: string;
  descripcion_rapida?: string;
  'caracteristicas y beneficios'?: string;
  garantia?: string;
  ficha_tecnica?: string;
  pagina_principal_auteco?: string;
  precio_con_descuento?: number | null;
  Bono_de_descuento?: number | null;
  motos_disponibles?: string;
  Activo?: number;
}

/**
 * DTO para actualizar una moto existente
 */
export interface ActualizarMotoDTO extends Partial<CrearMotoDTO> {
  Id?: number;
}

/**
 * Formato de respuesta de NocoDB para listas
 */
export interface NocoDBResponseMotos<T> {
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
 * Tipo legacy de moto (formato anterior del sistema)
 * Para compatibilidad con componentes existentes
 */
export interface MotoLegacy {
  id: string;
  modelo: string;
  marca: 'TVS' | 'Victory' | 'Kymco' | 'Benelli' | 'Ceronte' | 'Zontes';
  categoria: 'sport' | 'trabajo' | 'automatica' | 'semi-automatica' | 'deportiva' | 'todo-terreno' | 'tricargo' | 'alta-gama';
  precio2026: number;
  cuotaInicial: number;
  precioContado: number;
  imagen: string;
  cilindrada?: string;
}

/**
 * Características parseadas desde Markdown
 */
export interface CaracteristicasMoto {
  [titulo: string]: string;
}

/**
 * Sección de ficha técnica parseada
 */
export interface SeccionFichaTecnica {
  [campo: string]: string;
}

/**
 * Ficha técnica completa parseada desde Markdown
 */
export interface FichaTecnicaMoto {
  [seccion: string]: SeccionFichaTecnica;
}

/**
 * Moto con información extendida y procesada
 */
export interface MotoExtendida extends MotoNocoDB {
  /** URLs de imágenes procesadas desde Fotos_imagenes_motos */
  imagenesGaleria?: string[];

  /** URL de imagen principal */
  imagenPrincipal?: string;

  /** Características parseadas desde Markdown */
  caracteristicasObj?: CaracteristicasMoto;

  /** Ficha técnica parseada desde Markdown */
  fichaTecnicaObj?: FichaTecnicaMoto;

  /** Descripción en texto plano */
  descripcionTexto?: string;

  /** Garantía en texto plano */
  garantiaTexto?: string;
}

/**
 * Opciones para consultar motos
 */
export interface ConsultarMotosOptions {
  /** Solo motos activas (Activo = 1) */
  soloActivas?: boolean;

  /** Filtrar por marca */
  marca?: string;

  /** Filtrar por categoría */
  categoria?: string;

  /** Filtrar por cilindrada */
  cilindrada?: string;

  /** Solo motos disponibles */
  soloDisponibles?: boolean;

  /** Límite de resultados */
  limit?: number;

  /** Offset para paginación */
  offset?: number;

  /** Ordenar por campo */
  orderBy?: keyof MotoNocoDB;

  /** Dirección del ordenamiento */
  orderDirection?: 'ASC' | 'DESC';
}

/**
 * Mapeo de categorías de NocoDB a categorías legacy
 */
export const CATEGORIA_MAP: Record<string, MotoLegacy['categoria']> = {
  'Trabajo': 'trabajo',
  'trabajo': 'trabajo',
  'Sport': 'sport',
  'sport': 'sport',
  'Automatica': 'automatica',
  'automatica': 'automatica',
  'Semi Automatica': 'semi-automatica',
  'Semi-Automatica': 'semi-automatica',
  'semi-automatica': 'semi-automatica',
  'Deportiva': 'deportiva',
  'deportiva': 'deportiva',
  'Todo Terreno': 'todo-terreno',
  'Todo-Terreno': 'todo-terreno',
  'todo-terreno': 'todo-terreno',
  'Tricargo': 'tricargo',
  'tricargo': 'tricargo',
  'Alta Gama': 'alta-gama',
  'Alta-Gama': 'alta-gama',
  'alta-gama': 'alta-gama',
};

/**
 * Mapeo de marcas de NocoDB a formato legacy
 */
export const MARCA_MAP: Record<string, MotoLegacy['marca']> = {
  'Tvs': 'TVS',
  'TVS': 'TVS',
  'tvs': 'TVS',
  'Victory': 'Victory',
  'victory': 'Victory',
  'Kymco': 'Kymco',
  'kymco': 'Kymco',
  'Benelli': 'Benelli',
  'benelli': 'Benelli',
  'Ceronte': 'Ceronte',
  'ceronte': 'Ceronte',
  'Zontes': 'Zontes',
  'zontes': 'Zontes',
};
