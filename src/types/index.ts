/**
 * Exports centralizados de tipos
 *
 * 🎓 CONCEPTO: Barrel Pattern
 * En lugar de importar desde archivos individuales:
 * import { Asesor } from '@/types/asesor';
 * import { Lead } from '@/types/lead';
 *
 * Importamos todo desde un solo lugar:
 * import { Asesor, Lead } from '@/types';
 *
 * Ventaja: Imports más limpios
 */

// Tipos de Asesor
export type {
  Asesor,
  CrearAsesorDTO,
  ActualizarAsesorDTO,
  NocoDBResponse,
} from './asesor';

// Tipos de Moto
export type {
  MotoNocoDB,
  CrearMotoDTO,
  ActualizarMotoDTO,
  NocoDBResponseMotos,
  MotoLegacy,
  CaracteristicasMoto,
  FichaTecnicaMoto,
  MotoExtendida,
  ConsultarMotosOptions,
} from './moto';

// 🎓 NOTA: A medida que agregues más tipos (Lead, etc.)
// los exportarás aquí también:
// export type { Lead } from './lead';
