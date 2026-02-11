/**
 * Context para gestionar el asesor seleccionado globalmente
 *
 * 🎓 CONCEPTO: Context API
 * Context permite compartir datos entre componentes sin pasar props manualmente.
 *
 * Ventajas:
 * - Evita "prop drilling" (pasar props por muchos niveles)
 * - Estado global accesible desde cualquier componente
 * - Más simple que Redux para casos básicos
 * - Integrado en React, sin librerías externas
 *
 * Cuándo usar Context:
 * ✅ Tema (dark/light mode)
 * ✅ Usuario autenticado
 * ✅ Idioma seleccionado
 * ✅ Asesor activo (nuestro caso)
 *
 * Cuándo NO usar Context:
 * ❌ Estado que cambia muy frecuentemente
 * ❌ Estado local de un solo componente
 * ❌ Aplicaciones muy grandes (mejor usar Redux/Zustand)
 *
 * @module contexts/AsesorContext
 */

import { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import type { Asesor } from '@/types';
import { getNombreAsesor } from '@/types/asesor';

/**
 * 🎓 CONCEPTO: Definir el tipo del contexto
 * Esto le da autocompletado perfecto a quien use el contexto
 */
interface AsesorContextType {
  /** Asesor actualmente seleccionado */
  asesorActual: Asesor | null;

  /** Función para seleccionar un asesor */
  seleccionarAsesor: (asesor: Asesor) => void;

  /** Función para limpiar la selección */
  limpiarAsesor: () => void;

  /** Si hay un asesor seleccionado */
  hayAsesorSeleccionado: boolean;
}

/**
 * 🎓 PASO 1: Crear el contexto
 * undefined = valor por defecto (se sobrescribe con el Provider)
 */
const AsesorContext = createContext<AsesorContextType | undefined>(undefined);

/**
 * Props del Provider
 */
interface AsesorProviderProps {
  children: ReactNode;
}

/**
 * 🎓 PASO 2: Crear el Provider
 * El Provider es el componente que "provee" los valores del contexto
 * a todos sus hijos.
 *
 * @param props - Debe tener children
 */
export function AsesorProvider({ children }: AsesorProviderProps) {
  // Estado local del contexto
  const [asesorActual, setAsesorActual] = useState<Asesor | null>(null);

  /**
   * Función para seleccionar un asesor
   *
   * 🎓 CONCEPTO: useCallback
   * Memorizamos la función para que no se recree en cada render
   */
  const seleccionarAsesor = useCallback((asesor: Asesor) => {
    const nombre = getNombreAsesor(asesor);

    // Validar que el asesor tenga nombre antes de seleccionarlo
    if (!nombre) {
      console.error('⚠️ Intento de seleccionar asesor sin nombre:', asesor);
      return;
    }

    setAsesorActual(asesor);

    // 🎓 CONCEPTO: Persistencia opcional
    // Puedes guardar en localStorage para que persista al recargar
    // localStorage.setItem('asesorActual', JSON.stringify(asesor));
  }, []);

  /**
   * Función para limpiar la selección
   */
  const limpiarAsesor = useCallback(() => {
    setAsesorActual(null);
    // localStorage.removeItem('asesorActual');
  }, []);

  /**
   * Valor computado: si hay asesor seleccionado
   */
  const hayAsesorSeleccionado = asesorActual !== null;

  /**
   * 🎓 CONCEPTO: Value del Provider
   * Este objeto es lo que estará disponible para todos los consumidores
   */
  const value: AsesorContextType = {
    asesorActual,
    seleccionarAsesor,
    limpiarAsesor,
    hayAsesorSeleccionado,
  };

  return (
    <AsesorContext.Provider value={value}>
      {children}
    </AsesorContext.Provider>
  );
}

/**
 * 🎓 PASO 3: Crear un hook personalizado para usar el contexto
 *
 * Esto hace que sea más fácil y seguro usar el contexto.
 * En lugar de usar useContext directamente, los componentes usan este hook.
 *
 * Ventajas:
 * - Lanza error si se usa fuera del Provider (evita bugs)
 * - Autocompletado perfecto
 * - Más corto de escribir
 *
 * @returns Estado y funciones del contexto de asesor
 *
 * @example
 * ```tsx
 * function MiComponente() {
 *   const { asesorActual, seleccionarAsesor } = useAsesorContext();
 *
 *   return (
 *     <div>
 *       {asesorActual ? (
 *         <p>Asesor: {asesorActual.Asesor}</p>
 *       ) : (
 *         <p>No hay asesor seleccionado</p>
 *       )}
 *     </div>
 *   );
 * }
 * ```
 */
export function useAsesorContext() {
  const context = useContext(AsesorContext);

  // 🎓 CONCEPTO: Validación del Provider
  // Si context es undefined, significa que el componente
  // está siendo usado FUERA del Provider. Esto es un error.
  if (context === undefined) {
    throw new Error(
      '❌ useAsesorContext debe ser usado dentro de un AsesorProvider. ' +
      'Asegúrate de envolver tu app con <AsesorProvider>.'
    );
  }

  return context;
}

/**
 * 🎓 RESUMEN - Cómo usar este Context:
 *
 * 1. En App.tsx, envolver la app con el Provider:
 *    ```tsx
 *    <AsesorProvider>
 *      <Routes>
 *        ...
 *      </Routes>
 *    </AsesorProvider>
 *    ```
 *
 * 2. En cualquier componente, usar el hook:
 *    ```tsx
 *    function MiComponente() {
 *      const { asesorActual, seleccionarAsesor } = useAsesorContext();
 *
 *      return (
 *        <button onClick={() => seleccionarAsesor(unAsesor)}>
 *          Seleccionar
 *        </button>
 *      );
 *    }
 *    ```
 *
 * 3. Cualquier componente que use el hook se re-renderizará
 *    automáticamente cuando cambie el asesor seleccionado.
 */
