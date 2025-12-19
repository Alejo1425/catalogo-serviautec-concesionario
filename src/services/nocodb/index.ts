/**
 * Exports centralizados de servicios de NocoDB
 *
 * 🎓 CONCEPTO: Facade Pattern
 * Exponemos una interfaz simple para usar los servicios.
 *
 * Uso:
 * import { AsesorService } from '@/services/nocodb';
 */

export { NocoDBClient } from './client';
export { AsesorService } from './asesor.service';
export { MotoService } from './moto.service';

// Cuando agregues más servicios, expórtalos aquí:
// export { LeadService } from './lead.service';
