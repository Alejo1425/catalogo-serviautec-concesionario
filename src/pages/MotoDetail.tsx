import { useParams, Link } from "react-router-dom";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowLeft, MessageCircle, Fuel, Gauge, Settings, Cog, Heart, RefreshCw } from "lucide-react";
import { useChatwoot } from "@/hooks/useChatwoot";
import { useConversationId } from "@/hooks/useConversationId";
import { useAsesorContext } from "@/contexts";
import { chatwootConfig } from "@/config/env";
import { toast } from "sonner";
import { useMotos } from "@/hooks/useMotos";
import { MotoService } from "@/services/nocodb";
import { MotoDetails } from "@/components/MotoDetails";
import { enviarMensajeAConversacion, formatearMensajeMoto } from "@/services/chatwoot-api.service";

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

const getCategoriaLabel = (categoria: string): string => {
  const labels: Record<string, string> = {
    'sport': 'Sport',
    'trabajo': 'Trabajo',
    'automatica': 'Automática',
    'deportiva': 'Deportiva',
    'todo-terreno': 'Todo Terreno',
    'tricargo': 'Tricargo',
    'alta-gama': 'Alta Gama'
  };
  return labels[categoria] || categoria;
};


const MotoDetail = () => {
  const { id } = useParams<{ id: string }>();

  // Obtener todas las motos desde NocoDB y filtrar por el slug
  // El ID en la URL es el slug del formato legacy (ej: "sport-100-els-spoke-tk")
  const { data: motosNocoDB, isLoading, error } = useMotos({ soloActivas: true });

  // Buscar la moto que coincida con el slug/id
  const motoNocoDB = motosNocoDB?.find(m => {
    // Convertir a formato legacy para obtener el ID slug
    const legacyMoto = MotoService.toLegacyFormat(m);
    return legacyMoto?.id === id;
  });

  // Crear objeto extendido manualmente con los campos que necesitamos
  const moto = motoNocoDB ? {
    ...motoNocoDB,
    imagenPrincipal: motoNocoDB.Fotos_imagenes_motos?.[0]?.signedPath
      ? `${import.meta.env.VITE_NOCODB_BASE_URL}/${motoNocoDB.Fotos_imagenes_motos[0].signedPath}`
      : '',
  } : null;

  const { asesorActual } = useAsesorContext();
  const { conversationId } = useConversationId();

  const { isLoaded, openChatWithMoto } = useChatwoot({
    websiteToken: chatwootConfig.websiteToken,
    autoLoad: true,
  });

  const handleMeInteresa = async () => {
    if (!moto) return;

    if (!isLoaded) {
      toast.error('El chat no está disponible en este momento');
      return;
    }

    const marca = moto.Marca || '';
    const modelo = moto.Productos_motos || '';
    const cuotaInicial = moto.cuota_inicial || 0;
    const precioContado = moto.precio_de_contado || 0;
    const precioComercial = moto.Precio_comercial || 0;

    // Si hay un conversation ID, enviar mensaje directo a esa conversación via API
    if (conversationId) {
      try {
        const mensaje = formatearMensajeMoto({
          marca,
          modelo,
          cuotaInicial,
          precioContado,
          precio2026: precioComercial,
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
            `¡Mensaje enviado! Tu asesor verá tu interés en la ${marca} ${modelo}`,
            { duration: 5000 }
          );
        }
      } catch (error) {
        console.error('Error al enviar mensaje:', error);
        toast.error('No se pudo enviar el mensaje. Por favor intenta de nuevo.');
      }
    } else {
      // No hay conversation ID - usar el método tradicional con el widget
      openChatWithMoto(modelo, marca, {
        marca,
        modelo,
        cuotaInicial,
        precioContado,
        precio2026: precioComercial,
      });

      // Mostrar mensaje de confirmación
      if (asesorActual) {
        toast.success(
          `¡Mensaje enviado! ${asesorActual.Aseror} verá tu interés en la ${marca} ${modelo}`,
          { duration: 5000 }
        );
      } else {
        toast.success(
          `${marca} ${modelo} agregada ✓ Abre el chat en la esquina para más información`,
          { duration: 5000 }
        );
      }
    }
  };

  // Obtener el teléfono del asesor actual o usar el predeterminado
  const whatsappNumber = asesorActual?.Phone || '3114319886';
  const asesorNombre = asesorActual?.Aseror || 'tu asesor';

  // Loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="container mx-auto px-4 py-16 text-center">
          <RefreshCw className="w-12 h-12 animate-spin text-primary mx-auto mb-4" />
          <p className="text-lg text-muted-foreground font-heading">Cargando detalles...</p>
        </main>
        <Footer />
      </div>
    );
  }

  // Error or not found state
  if (error || !moto) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="container mx-auto px-4 py-16 text-center">
          <h1 className="text-3xl font-heading font-bold text-foreground mb-4">
            Moto no encontrada
          </h1>
          <Link to="/">
            <Button variant="outline">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Volver al catálogo
            </Button>
          </Link>
        </main>
        <Footer />
      </div>
    );
  }

  const marca = moto.Marca || '';
  const modelo = moto.Productos_motos || '';
  const cilindrada = moto.Categoria_Cilindraje || '';
  const categoria = moto.Categoria || '';
  const imagenPrincipal = moto.imagenPrincipal || '';

  const whatsappMessage = encodeURIComponent(
    `Hola ${asesorNombre}! Estoy interesado en la ${marca} ${modelo}. ¿Me pueden dar más información sobre precios y disponibilidad?`
  );

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="container mx-auto px-4 py-8">
        {/* Breadcrumb */}
        <div className="mb-6">
          <Link
            to="/"
            className="inline-flex items-center text-muted-foreground hover:text-primary transition-colors font-body"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Volver al catálogo
          </Link>
        </div>

        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12">
          {/* Image Section */}
          <div className="relative">
            <div className="bg-gradient-to-br from-muted/50 to-muted rounded-2xl p-8 aspect-square flex items-center justify-center">
              <img
                src={imagenPrincipal}
                alt={modelo}
                className="max-w-full max-h-full object-contain"
              />
            </div>
            <div className="absolute top-4 left-4 flex gap-2">
              <Badge className={`font-heading font-semibold ${getMarcaColor(marca)}`}>
                {marca}
              </Badge>
              <Badge variant="outline" className="bg-card/90 backdrop-blur-sm font-heading">
                {getCategoriaLabel(categoria)}
              </Badge>
            </div>
          </div>

          {/* Info Section */}
          <div className="space-y-6">
            <div>
              <h1 className="text-3xl lg:text-4xl font-heading font-bold text-foreground mb-2">
                {modelo}
              </h1>
              {cilindrada && (
                <p className="text-xl text-muted-foreground font-heading">
                  Motor {cilindrada}
                </p>
              )}
            </div>

            {/* Extended Information: Características, Garantía, Ficha Técnica */}
            <MotoDetails moto={moto} />

            {/* Quick Specifications */}
            <Card className="border-border/50">
              <CardContent className="p-6">
                <h2 className="font-heading font-bold text-lg mb-4 text-foreground">
                  Especificaciones Rápidas
                </h2>
                <div className="grid grid-cols-2 gap-4">
                  {cilindrada && (
                    <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
                      <Gauge className="w-5 h-5 text-primary" />
                      <div>
                        <p className="text-xs text-muted-foreground font-body">Cilindrada</p>
                        <p className="font-heading font-semibold text-foreground">{cilindrada}</p>
                      </div>
                    </div>
                  )}
                  <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
                    <Fuel className="w-5 h-5 text-primary" />
                    <div>
                      <p className="text-xs text-muted-foreground font-body">Combustible</p>
                      <p className="font-heading font-semibold text-foreground">Gasolina</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
                    <Settings className="w-5 h-5 text-primary" />
                    <div>
                      <p className="text-xs text-muted-foreground font-body">Transmisión</p>
                      <p className="font-heading font-semibold text-foreground">
                        {categoria === 'automatica' ? 'Automática' : 'Manual'}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
                    <Cog className="w-5 h-5 text-primary" />
                    <div>
                      <p className="text-xs text-muted-foreground font-body">Tipo</p>
                      <p className="font-heading font-semibold text-foreground">{getCategoriaLabel(categoria)}</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Prices */}
            <Card className="border-primary/30 bg-primary/5">
              <CardContent className="p-6">
                <h2 className="font-heading font-bold text-lg mb-4 text-foreground">
                  Precios
                </h2>
                <div className="space-y-4">
                  {moto.cuota_inicial && (
                    <div className="flex justify-between items-center py-3 border-b border-border/50">
                      <span className="text-muted-foreground font-body">Cuota Inicial:</span>
                      <span className="font-heading font-bold text-primary text-2xl">
                        {formatPrice(moto.cuota_inicial)}
                      </span>
                    </div>
                  )}
                  {moto.Precio_comercial && (
                    <div className="flex justify-between items-center py-3 border-b border-border/50">
                      <span className="text-muted-foreground font-body">Precio Comercial:</span>
                      <span className="font-heading font-semibold text-foreground text-xl">
                        {formatPrice(moto.Precio_comercial)}
                      </span>
                    </div>
                  )}
                  {moto.precio_de_contado && (
                    <div className="flex justify-between items-center pt-2">
                      <span className="text-muted-foreground font-body">Contado con papeles:</span>
                      <span className="font-heading font-extrabold text-foreground text-2xl">
                        {formatPrice(moto.precio_de_contado)}
                      </span>
                    </div>
                  )}

                  {moto.precio_con_descuento && (
                    <div className="flex justify-between items-center pt-3 border-t-2 border-primary/30">
                      <span className="text-foreground font-body font-semibold">Precio con descuento:</span>
                      <span className="font-heading font-extrabold text-green-600 text-2xl">
                        {formatPrice(moto.precio_con_descuento)}
                      </span>
                    </div>
                  )}
                  {moto.Bono_de_descuento && (
                    <div className="bg-green-50 dark:bg-green-950 p-3 rounded-lg">
                      <p className="text-sm text-green-800 dark:text-green-200 font-body">
                        <strong>Bono de descuento:</strong> {formatPrice(moto.Bono_de_descuento)}
                      </p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Contact Section */}
            <Card className="border-primary/30 bg-primary/5">
              <CardContent className="p-6">
                <p className="text-muted-foreground font-body mb-1 text-center">
                  ¿Te interesa esta moto?
                </p>
                {asesorActual ? (
                  <>
                    <h3 className="font-heading font-bold text-xl text-foreground mb-2 text-center">
                      {conversationId ? 'Continuar con el proceso' : `Habla con ${asesorActual.Aseror}`}
                    </h3>
                    <p className="text-sm text-muted-foreground font-body mb-4 text-center">
                      {conversationId ? 'Enviar mi interés a la conversación' : 'Continúa la conversación en el chat'}
                    </p>

                    <Button
                      onClick={handleMeInteresa}
                      size="lg"
                      className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-heading font-bold text-lg gap-3 py-6"
                    >
                      <Heart className="w-6 h-6" />
                      {conversationId ? 'Me interesa - Continuar con el proceso' : `Haz que sea tuya ahora - Hablar con ${asesorActual.Aseror}`}
                    </Button>
                  </>
                ) : (
                  <>
                    <h3 className="font-heading font-bold text-xl text-foreground mb-4 text-center">
                      Habla con tu asesor
                    </h3>

                    <div className="space-y-3">
                      <Button
                        onClick={handleMeInteresa}
                        size="lg"
                        variant="outline"
                        className="w-full border-primary/50 text-primary hover:bg-primary hover:text-primary-foreground font-heading font-bold text-lg gap-3 py-6"
                      >
                        <Heart className="w-6 h-6" />
                        Me interesa esta moto
                      </Button>

                      <Button
                        asChild
                        size="lg"
                        className="w-full bg-green-600 hover:bg-green-700 text-white font-heading font-bold text-lg gap-3 py-6"
                      >
                        <a
                          href={`https://wa.me/57${whatsappNumber}?text=${whatsappMessage}`}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <MessageCircle className="w-6 h-6" />
                          Cotizar por WhatsApp
                        </a>
                      </Button>
                    </div>
                  </>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default MotoDetail;
