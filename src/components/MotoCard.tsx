import { Link } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MessageCircle, Heart } from "lucide-react";
import { useChatwoot } from "@/hooks/useChatwoot";
import { useConversationId } from "@/hooks/useConversationId";
import { useAsesorContext } from "@/contexts";
import { chatwootConfig } from "@/config/env";
import { toast } from "sonner";
import type { Moto } from "@/data/motos";
import { enviarMensajeAConversacion, formatearMensajeMoto } from "@/services/chatwoot-api.service";

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
  const { asesorActual } = useAsesorContext();
  const { conversationId } = useConversationId();
  const { isLoaded, openChatWithMoto } = useChatwoot({
    websiteToken: chatwootConfig.websiteToken,
    autoLoad: false, // No auto-cargar en cada card
  });

  const handleMeInteresa = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (!isLoaded) {
      toast.error('El chat no está disponible en este momento');
      return;
    }

    // Si hay un conversation ID, enviar mensaje directo a esa conversación via API
    if (conversationId) {
      try {
        const mensaje = formatearMensajeMoto({
          marca: moto.marca,
          modelo: moto.modelo,
          cuotaInicial: moto.cuotaInicial,
          precioContado: moto.precioContado,
          precio2026: moto.precio2026,
        });

        await enviarMensajeAConversacion(conversationId, mensaje);

        // Mensaje de éxito
        if (asesorActual) {
          toast.success(
            `¡Mensaje enviado a tu conversación con ${asesorActual.Aseror}! 💬`,
            { duration: 5000 }
          );
        } else {
          toast.success(
            `¡Mensaje enviado! Tu asesor verá tu interés en la ${moto.marca} ${moto.modelo}`,
            { duration: 5000 }
          );
        }
      } catch (error) {
        console.error('Error al enviar mensaje:', error);
        toast.error('No se pudo enviar el mensaje. Por favor intenta de nuevo.');
      }
    } else {
      // No hay conversation ID - usar el método tradicional con el widget
      openChatWithMoto(moto.modelo, moto.marca, {
        marca: moto.marca,
        modelo: moto.modelo,
        cuotaInicial: moto.cuotaInicial,
        precioContado: moto.precioContado,
        precio2026: moto.precio2026,
      });

      // Mostrar mensaje de confirmación
      if (asesorActual) {
        toast.success(
          `¡Mensaje enviado! ${asesorActual.Aseror} verá tu interés en la ${moto.marca} ${moto.modelo}`,
          { duration: 5000 }
        );
      } else {
        toast.success(
          `${moto.marca} ${moto.modelo} agregada ✓ Abre el chat en la esquina para más información`,
          { duration: 5000 }
        );
      }
    }
  };

  // Obtener el teléfono del asesor actual o usar el predeterminado
  const whatsappNumber = asesorActual?.Phone || appConfig.defaultWhatsapp;
  const asesorNombre = asesorActual?.Aseror || 'tu asesor';

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

        <div className="flex gap-2 mt-4">
          {asesorActual ? (
            // Catálogo personalizado - Solo mostrar botón de Chatwoot
            <Button
              onClick={handleMeInteresa}
              className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-heading font-semibold gap-2"
            >
              <Heart className="w-4 h-4" />
              {conversationId ? 'Me interesa - Continuar con el proceso' : `Me interesa - Hablar con ${asesorActual.Aseror}`}
            </Button>
          ) : (
            // Catálogo general - Mostrar ambos botones
            <>
              <Button
                onClick={handleMeInteresa}
                variant="outline"
                className="flex-1 border-primary/50 text-primary hover:bg-primary hover:text-primary-foreground font-heading font-semibold gap-2"
              >
                <Heart className="w-4 h-4" />
                Me interesa
              </Button>

              <Button
                asChild
                className="flex-1 bg-green-600 hover:bg-green-700 text-white font-heading font-semibold gap-2"
              >
                <a
                  href={`https://wa.me/57${whatsappNumber}?text=${encodeURIComponent(`Hola ${asesorNombre}! Estoy interesado en la ${moto.marca} ${moto.modelo}. ¿Me pueden dar más información?`)}`}
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
