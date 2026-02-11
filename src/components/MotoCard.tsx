import { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MessageCircle, Eye } from "lucide-react";
import { useAsesorContext } from "@/contexts";
import type { Moto } from "@/data/motos";
import type { MotoNocoDB } from "@/types/moto";
import { getDestinationPhone, getAdvisorName, buildWhatsAppUrl } from "@/config/contact";
import {
  calcularPrecios,
  formatPrice,
  tienePrecio2027,
  generarMensajeWhatsApp,
  type YearOption,
} from "@/utils/pricing";
import { cn } from "@/lib/utils";

interface MotoCardProps {
  moto: Moto;
  index: number;
  /** Datos raw de NocoDB para cálculo dinámico de precios */
  rawData?: MotoNocoDB;
}

const getMarcaColor = (marca: string): string => {
  switch (marca) {
    case 'TVS':
      return 'bg-tvs-blue text-primary-foreground';
    case 'Victory':
      return 'bg-primary text-primary-foreground';
    case 'Kymco':
      return 'bg-secondary text-secondary-foreground';
    case 'Benelli':
      return 'bg-emerald-600 text-primary-foreground';
    case 'Ceronte':
      return 'bg-amber-600 text-primary-foreground';
    case 'Zontes':
      return 'bg-violet-600 text-primary-foreground';
    default:
      return 'bg-muted text-muted-foreground';
  }
};

export function MotoCard({ moto, index, rawData }: MotoCardProps) {
  const { asesorActual } = useAsesorContext();

  // Determinar si hay precio 2027 disponible
  const hasPrecio2027 = rawData ? tienePrecio2027(rawData) : false;

  // Estado del año seleccionado (2027 por defecto si está disponible)
  const [selectedYear, setSelectedYear] = useState<YearOption>(hasPrecio2027 ? '2027' : '2026');

  // Calcular precios dinámicamente si hay rawData
  const precios = useMemo(() => {
    if (rawData) {
      return calcularPrecios(rawData, selectedYear);
    }
    // Fallback a valores legacy
    return {
      comercial: moto.precio2026,
      contado: moto.precioContado,
      inicial: moto.cuotaInicial,
      porcentaje: 0.10,
      disponible: true,
    };
  }, [rawData, selectedYear, moto]);

  // Obtener teléfono y nombre del asesor
  const whatsappNumber = getDestinationPhone(asesorActual);
  const asesorNombre = getAdvisorName(asesorActual);

  // Construir mensaje de WhatsApp con precios dinámicos
  const whatsappMessage = generarMensajeWhatsApp({
    marca: moto.marca,
    modelo: moto.modelo,
    year: selectedYear,
    comercial: precios.comercial,
    inicial: precios.inicial,
    asesorNombre,
  });

  const whatsappUrl = buildWhatsAppUrl(whatsappNumber, whatsappMessage);

  return (
    <Card
      className="group overflow-hidden border-border/50 bg-card hover:border-primary/30 transition-all duration-300 hover:shadow-xl hover:shadow-primary/5 animate-fade-in"
      style={{ animationDelay: `${index * 50}ms` }}
    >
      <Link to={`/moto/${moto.id}`} className="block">
        <div className="relative overflow-hidden bg-gradient-to-br from-muted/50 to-muted aspect-[4/3]">
          <img
            src={moto.imagen}
            alt={moto.modelo}
            className="w-full h-full object-contain p-4 transition-transform duration-500 group-hover:scale-110"
            loading="lazy"
          />
          <Badge
            className={`absolute top-3 left-3 font-heading font-semibold ${getMarcaColor(moto.marca)}`}
          >
            {moto.marca}
          </Badge>
          {moto.cilindrada && (
            <Badge
              variant="outline"
              className="absolute top-3 right-3 bg-card/90 backdrop-blur-sm font-heading"
            >
              {moto.cilindrada}
            </Badge>
          )}
          {/* Badge de Año Modelo - Siempre visible */}
          {rawData && (
            <Badge
              className={cn(
                "absolute bottom-3 left-3 font-heading font-bold text-sm px-3 py-1",
                selectedYear === '2027'
                  ? "bg-emerald-600 text-white"
                  : "bg-indigo-600 text-white"
              )}
            >
              Modelo {selectedYear}
            </Badge>
          )}
        </div>
      </Link>

      <CardContent className="p-5">
        <h3 className="font-heading font-bold text-lg text-foreground mb-2 line-clamp-2 min-h-[3.5rem]">
          {moto.modelo}
        </h3>

        {/* Selector de Año - Solo mostrar si hay precio 2027 */}
        {rawData && hasPrecio2027 && (
          <div className="flex items-center gap-1 mb-3 p-1 bg-muted/50 rounded-lg">
            <button
              onClick={(e) => {
                e.preventDefault();
                setSelectedYear('2026');
              }}
              className={cn(
                "flex-1 px-3 py-1.5 text-xs font-semibold rounded-md transition-all",
                selectedYear === '2026'
                  ? "bg-primary text-primary-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              2026
            </button>
            <button
              onClick={(e) => {
                e.preventDefault();
                setSelectedYear('2027');
              }}
              className={cn(
                "flex-1 px-3 py-1.5 text-xs font-semibold rounded-md transition-all",
                selectedYear === '2027'
                  ? "bg-emerald-600 text-white shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              2027
            </button>
          </div>
        )}

        {/* Indicador de año cuando no hay precio 2027 - Sin selector */}
        {rawData && !hasPrecio2027 && (
          <div className="mb-3 text-center">
            <span className="text-xs text-muted-foreground">Solo disponible modelo 2026</span>
          </div>
        )}

        <div className={cn("space-y-3", !precios.disponible && "opacity-50")}>
          <div className="flex justify-between items-center py-2 border-b border-border/50">
            <div className="flex items-center gap-1.5">
              <span className="text-sm text-muted-foreground font-body">Cuota Inicial:</span>
              <Badge
                variant="secondary"
                className={cn(
                  "text-[10px] px-1 py-0 h-4 font-bold border-none",
                  precios.porcentaje === 0.15
                    ? "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400"
                    : "bg-muted text-muted-foreground"
                )}
              >
                {Math.round(precios.porcentaje * 100)}%
              </Badge>
            </div>
            <span className="font-heading font-bold text-primary text-lg">
              {precios.disponible ? formatPrice(precios.inicial) : '-'}
            </span>
          </div>

          <div className="flex justify-between items-center pt-1">
            <span className="text-sm text-muted-foreground font-body">Contado c/papeles:</span>
            <span className="font-heading font-extrabold text-foreground text-xl">
              {precios.disponible ? formatPrice(precios.contado) : '-'}
            </span>
          </div>
        </div>

        <div className="flex gap-2 mt-4">
          {asesorActual ? (
            // Catálogo personalizado - Solo mostrar botón de Detalles
            <Button
              asChild
              className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-heading font-semibold gap-2"
            >
              <Link to={`/moto/${moto.id}`}>
                <Eye className="w-4 h-4" />
                Ver más detalles
              </Link>
            </Button>
          ) : (
            // Catálogo general - Mostrar ambos botones
            <>
              <Button
                asChild
                variant="outline"
                className="flex-1 border-primary/50 text-primary hover:bg-primary hover:text-primary-foreground font-heading font-semibold gap-2"
              >
                <Link to={`/moto/${moto.id}`}>
                  <Eye className="w-4 h-4" />
                  Ver detalles
                </Link>
              </Button>

              <Button
                asChild
                className="flex-1 bg-green-600 hover:bg-green-700 text-white font-heading font-semibold gap-2"
              >
                <a
                  href={whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <MessageCircle className="w-4 h-4" />
                  WhatsApp
                </a>
              </Button>
            </>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
