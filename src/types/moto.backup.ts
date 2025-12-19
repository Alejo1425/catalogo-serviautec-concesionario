/**
 * Tipos relacionados con motos
 *
 * Define las interfaces para trabajar con motos desde NocoDB
 * y los tipos legacy del sistema anterior
 */

/**
 * Tipo de moto desde NocoDB
 * Estructura de la tabla "lista_de_precios"
 */
export interface MotoNocoDB {
  /** ID único del registro en NocoDB */
  Id: number;

  /** Nombre/modelo de la moto */
  Modelo: string;

  /** Marca de la moto */
  Marca: 'TVS' | 'Victory' | 'Kymco' | 'Benelli' | 'Ceronte' | 'Zontes';

  /** Categoría de la moto */
  Categoria: 'sport' | 'trabajo' | 'automatica' | 'semi-automatica' | 'deportiva' | 'todo-terreno' | 'tricargo' | 'alta-gama';

  /** Precio financiado 2026 */
  Precio_2026?: number;

  /** Cuota inicial requerida */
  Cuota_Inicial?: number;

  /** Precio de contado */
  Precio_Contado?: number;

  /** Cilindrada (ej: "100cc", "125cc") */
  Cilindrada?: string;

  /** URL de la imagen principal */
  Imagen_Principal?: string;

  /** URLs de galería de imágenes (separadas por coma o JSON array) */
  Galeria_Imagenes?: string;

  /** Descripción rápida de la moto */
  Descripcion?: string;

  /** Características principales (JSON o texto separado por líneas) */
  Caracteristicas?: string;

  /** Información de garantía */
  Garantia?: string;

  /** Ficha técnica completa (JSON o texto) */
  Ficha_Tecnica?: string;

  /** Slug URL-friendly para la moto */
  slug?: string;

  /** Estado activo/inactivo */
  Activo?: boolean | number;

  /** Fecha de creación (auto-generado por NocoDB) */
  CreatedAt?: string;

  /** Fecha de última actualización (auto-generado por NocoDB) */
  UpdatedAt?: string;
}

/**
 * DTO para crear una nueva moto
 * Excluye campos auto-generados
 */
export interface CrearMotoDTO {
  Modelo: string;
  Marca: MotoNocoDB['Marca'];
  Categoria: MotoNocoDB['Categoria'];
  Precio_2026?: number;
  Cuota_Inicial?: number;
  Precio_Contado?: number;
  Cilindrada?: string;
  Imagen_Principal?: string;
  Galeria_Imagenes?: string;
  Descripcion?: string;
  Caracteristicas?: string;
  Garantia?: string;
  Ficha_Tecnica?: string;
  slug?: string;
  Activo?: boolean | number;
}

/**
 * DTO para actualizar una moto existente
 * Todos los campos son opcionales
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
 * Mantener para compatibilidad con el código existente
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
 * Características parseadas como objeto
 */
export interface CaracteristicasMoto {
  motor?: string;
  potencia?: string;
  torque?: string;
  transmision?: string;
  frenos?: string;
  suspension?: string;
  tanque?: string;
  peso?: string;
  [key: string]: string | undefined;
}

/**
 * Ficha técnica completa parseada
 */
export interface FichaTecnicaMoto {
  motor?: {
    tipo?: string;
    cilindrada?: string;
    potencia?: string;
    torque?: string;
    refrigeracion?: string;
    arranque?: string;
  };
  transmision?: {
    tipo?: string;
    embrague?: string;
    cambios?: string;
  };
  chasis?: {
    tipo?: string;
    suspensionDelantera?: string;
    suspensionTrasera?: string;
    frenoDelantero?: string;
    frenoTrasero?: string;
    llantaDelantera?: string;
    llantaTrasera?: string;
  };
  dimensiones?: {
    largo?: string;
    ancho?: string;
    alto?: string;
    distanciaEntreEjes?: string;
    alturaSillin?: string;
    despejePiso?: string;
  };
  capacidades?: {
    tanqueCombustible?: string;
    aceiteMotor?: string;
    peso?: string;
    cargaMaxima?: string;
  };
  [key: string]: any;
}

/**
 * Moto con información extendida
 * Incluye datos parseados y procesados
 */
export interface MotoExtendida extends MotoNocoDB {
  /** Galería de imágenes como array */
  imagenesGaleria?: string[];

  /** Características parseadas */
  caracteristicasObj?: CaracteristicasMoto;

  /** Ficha técnica parseada */
  fichaTecnicaObj?: FichaTecnicaMoto;
}

/**
 * Opciones para consultar motos
 */
export interface ConsultarMotosOptions {
  /** Solo motos activas */
  soloActivas?: boolean;

  /** Filtrar por marca */
  marca?: MotoNocoDB['Marca'];

  /** Filtrar por categoría */
  categoria?: MotoNocoDB['Categoria'];

  /** Límite de resultados */
  limit?: number;

  /** Offset para paginación */
  offset?: number;

  /** Ordenar por campo */
  orderBy?: keyof MotoNocoDB;

  /** Dirección del ordenamiento */
  orderDirection?: 'ASC' | 'DESC';
}
