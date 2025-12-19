/**
 * Componente de Detalles Extendidos de Moto
 *
 * Muestra toda la información completa de una moto:
 * - Descripción
 * - Características
 * - Garantía
 * - Ficha técnica
 * - Galería de imágenes
 */

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Button } from "@/components/ui/button";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { CheckCircle2, Shield, FileText, Image as ImageIcon, ChevronDown, ChevronUp } from "lucide-react";
import type { MotoExtendida } from "@/types";

interface MotoDetailsProps {
  moto: MotoExtendida;
}

export function MotoDetails({ moto }: MotoDetailsProps) {
  const hasExtendedInfo =
    moto.Descripcion ||
    moto.Caracteristicas ||
    moto.Garantia ||
    moto.Ficha_Tecnica ||
    (moto.imagenesGaleria && moto.imagenesGaleria.length > 0);

  if (!hasExtendedInfo) {
    return null;
  }

  return (
    <div className="space-y-6">
      <Tabs defaultValue="descripcion" className="w-full">
        <TabsList className="grid w-full grid-cols-2 lg:grid-cols-4">
          {moto.Descripcion && (
            <TabsTrigger value="descripcion">
              <FileText className="w-4 h-4 mr-2" />
              Descripción
            </TabsTrigger>
          )}
          {moto.Caracteristicas && (
            <TabsTrigger value="caracteristicas">
              <CheckCircle2 className="w-4 h-4 mr-2" />
              Características
            </TabsTrigger>
          )}
          {moto.Garantia && (
            <TabsTrigger value="garantia">
              <Shield className="w-4 h-4 mr-2" />
              Garantía
            </TabsTrigger>
          )}
          {moto.Ficha_Tecnica && (
            <TabsTrigger value="ficha-tecnica">
              <FileText className="w-4 h-4 mr-2" />
              Ficha Técnica
            </TabsTrigger>
          )}
          {moto.imagenesGaleria && moto.imagenesGaleria.length > 0 && (
            <TabsTrigger value="galeria">
              <ImageIcon className="w-4 h-4 mr-2" />
              Galería ({moto.imagenesGaleria.length})
            </TabsTrigger>
          )}
        </TabsList>

        {/* Descripción */}
        {moto.Descripcion && (
          <TabsContent value="descripcion">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="w-5 h-5 text-primary" />
                  Descripción
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground leading-relaxed whitespace-pre-line">
                  {moto.Descripcion}
                </p>
              </CardContent>
            </Card>
          </TabsContent>
        )}

        {/* Características */}
        {moto.Caracteristicas && (
          <TabsContent value="caracteristicas">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 text-primary" />
                  Características Principales
                </CardTitle>
              </CardHeader>
              <CardContent>
                {moto.caracteristicasObj && Object.keys(moto.caracteristicasObj).length > 0 ? (
                  <div className="grid gap-3 md:grid-cols-2">
                    {Object.entries(moto.caracteristicasObj).map(([key, value]) => (
                      <div
                        key={key}
                        className="flex items-start gap-3 p-3 rounded-lg bg-muted/50"
                      >
                        <CheckCircle2 className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                        <div>
                          <p className="font-semibold text-sm capitalize">{key}</p>
                          <p className="text-sm text-muted-foreground">{value}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="space-y-2">
                    {moto.Caracteristicas.split('\n').map((linea, index) => (
                      <div key={index} className="flex items-start gap-2">
                        <CheckCircle2 className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                        <p className="text-muted-foreground">{linea}</p>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        )}

        {/* Garantía */}
        {moto.Garantia && (
          <TabsContent value="garantia">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="w-5 h-5 text-primary" />
                  Garantía
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="bg-primary/5 border border-primary/20 rounded-lg p-6">
                  <p className="text-muted-foreground leading-relaxed whitespace-pre-line">
                    {moto.Garantia}
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        )}

        {/* Ficha Técnica */}
        {moto.Ficha_Tecnica && (
          <TabsContent value="ficha-tecnica">
            <FichaTecnicaSection moto={moto} />
          </TabsContent>
        )}

        {/* Galería */}
        {moto.imagenesGaleria && moto.imagenesGaleria.length > 0 && (
          <TabsContent value="galeria">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <ImageIcon className="w-5 h-5 text-primary" />
                  Galería de Imágenes
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Carousel className="w-full">
                  <CarouselContent>
                    {moto.imagenesGaleria.map((imagen, index) => (
                      <CarouselItem key={index} className="md:basis-1/2 lg:basis-1/3">
                        <div className="p-1">
                          <div className="relative aspect-[4/3] overflow-hidden rounded-lg bg-muted">
                            <img
                              src={imagen}
                              alt={`${moto.Modelo} - Imagen ${index + 1}`}
                              className="w-full h-full object-cover hover:scale-110 transition-transform duration-300"
                              loading="lazy"
                            />
                          </div>
                        </div>
                      </CarouselItem>
                    ))}
                  </CarouselContent>
                  <CarouselPrevious />
                  <CarouselNext />
                </Carousel>
              </CardContent>
            </Card>
          </TabsContent>
        )}
      </Tabs>
    </div>
  );
}

/**
 * Componente de Ficha Técnica con secciones colapsables
 */
interface FichaTecnicaSectionProps {
  moto: MotoExtendida;
}

function FichaTecnicaSection({ moto }: FichaTecnicaSectionProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FileText className="w-5 h-5 text-primary" />
          Especificaciones Técnicas
        </CardTitle>
      </CardHeader>
      <CardContent>
        {moto.fichaTecnicaObj && Object.keys(moto.fichaTecnicaObj).length > 0 ? (
          <div className="space-y-3">
            {Object.entries(moto.fichaTecnicaObj).map(([seccion, datos], index) => (
              <FichaTecnicaCollapsible
                key={seccion}
                seccion={seccion}
                datos={datos}
                defaultOpen={index === 0}
              />
            ))}
          </div>
        ) : (
          <div className="prose prose-sm max-w-none">
            <pre className="whitespace-pre-line text-muted-foreground font-body">
              {moto.Ficha_Tecnica}
            </pre>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

/**
 * Sección colapsable de ficha técnica
 */
interface FichaTecnicaCollapsibleProps {
  seccion: string;
  datos: any;
  defaultOpen?: boolean;
}

function FichaTecnicaCollapsible({ seccion, datos, defaultOpen = false }: FichaTecnicaCollapsibleProps) {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <Collapsible open={isOpen} onOpenChange={setIsOpen}>
      <div className="border border-border rounded-lg overflow-hidden">
        <CollapsibleTrigger asChild>
          <Button
            variant="ghost"
            className="w-full flex items-center justify-between p-4 hover:bg-muted/50"
          >
            <h4 className="font-heading font-bold text-base capitalize">
              {seccion.replace(/([A-Z])/g, ' $1').trim()}
            </h4>
            {isOpen ? (
              <ChevronUp className="w-5 h-5 text-muted-foreground" />
            ) : (
              <ChevronDown className="w-5 h-5 text-muted-foreground" />
            )}
          </Button>
        </CollapsibleTrigger>

        <CollapsibleContent className="border-t border-border">
          <div className="p-4 bg-muted/20">
            {typeof datos === 'object' && datos !== null ? (
              <div className="grid gap-3 md:grid-cols-2">
                {Object.entries(datos).map(([key, value]) => (
                  <div key={key} className="flex justify-between p-3 rounded bg-card border border-border">
                    <span className="text-sm text-muted-foreground capitalize">
                      {key.replace(/([A-Z])/g, ' $1').trim()}:
                    </span>
                    <span className="text-sm font-semibold ml-2">{String(value)}</span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">{String(datos)}</p>
            )}
          </div>
        </CollapsibleContent>
      </div>
    </Collapsible>
  );
}

/**
 * Componente simplificado para mostrar características en una lista
 */
interface CaracteristicasListProps {
  caracteristicas: string;
}

export function CaracteristicasList({ caracteristicas }: CaracteristicasListProps) {
  const items = caracteristicas.split('\n').filter(item => item.trim());

  return (
    <ul className="space-y-2">
      {items.map((item, index) => (
        <li key={index} className="flex items-start gap-2">
          <CheckCircle2 className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
          <span className="text-muted-foreground">{item}</span>
        </li>
      ))}
    </ul>
  );
}

/**
 * Badge de garantía compacto
 */
interface GarantiaBadgeProps {
  garantia: string;
}

export function GarantiaBadge({ garantia }: GarantiaBadgeProps) {
  return (
    <Badge variant="outline" className="gap-2">
      <Shield className="w-4 h-4" />
      {garantia}
    </Badge>
  );
}
