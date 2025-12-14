import { Link } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MessageCircle } from "lucide-react";
import type { Moto } from "@/data/motos";

interface MotoCardProps {
  moto: Moto;
  index: number;
}

const formatPrice = (price: number): string => {
  return new Intl.NumberFormat('es-CO', {
    style: 'currency',
    currency: 'COP',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(price);
};

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

export function MotoCard({ moto, index }: MotoCardProps) {
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
        </div>
      </Link>
      
      <CardContent className="p-5">
        <h3 className="font-heading font-bold text-lg text-foreground mb-4 line-clamp-2 min-h-[3.5rem]">
          {moto.modelo}
        </h3>
        
        <div className="space-y-3">
          <div className="flex justify-between items-center py-2 border-b border-border/50">
            <span className="text-sm text-muted-foreground font-body">Cuota Inicial:</span>
            <span className="font-heading font-bold text-primary text-lg">
              {formatPrice(moto.cuotaInicial)}
            </span>
          </div>
          
          <div className="flex justify-between items-center pt-1">
            <span className="text-sm text-muted-foreground font-body">Contado c/papeles:</span>
            <span className="font-heading font-extrabold text-foreground text-xl">
              {formatPrice(moto.precioContado)}
            </span>
          </div>
        </div>

        <Button
          asChild
          className="w-full mt-4 bg-green-600 hover:bg-green-700 text-white font-heading font-semibold gap-2"
        >
          <a
            href={`https://wa.me/573114319886?text=${encodeURIComponent(`Hola Juan Pablo! Estoy interesado en la ${moto.marca} ${moto.modelo}. ¿Me pueden dar más información?`)}`}
            target="_blank"
            rel="noopener noreferrer"
          >
            <MessageCircle className="w-5 h-5" />
            Cotizar por WhatsApp
          </a>
        </Button>
      </CardContent>
    </Card>
  );
}
