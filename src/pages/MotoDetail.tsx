import { useParams, Link } from "react-router-dom";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowLeft, MessageCircle, Fuel, Gauge, Settings, Cog } from "lucide-react";
import { motos } from "@/data/motos";
import { useAsesorConfig } from "@/config/asesor";

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

const getDescripcion = (moto: typeof motos[0]): string => {
  const marca = moto.marca;
  const modelo = moto.modelo;
  const cilindrada = moto.cilindrada || '';
  
  if (marca === 'TVS') {
    if (modelo.includes('SPORT 100')) {
      return `La ${modelo} es una motocicleta de trabajo confiable y económica. Con motor de ${cilindrada}, ofrece excelente rendimiento de combustible y bajo costo de mantenimiento. Ideal para el uso diario y trabajo.`;
    }
    if (modelo.includes('RAIDER')) {
      return `La ${modelo} combina estilo deportivo con practicidad urbana. Motor de ${cilindrada} con tecnología avanzada para un rendimiento óptimo. Perfecta para quienes buscan una moto ágil y con personalidad.`;
    }
    if (modelo.includes('APACHE 160')) {
      return `La ${modelo} es una deportiva de alto rendimiento con motor de ${cilindrada}. Diseño agresivo, suspensión deportiva y frenos de alta eficiencia. La elección perfecta para los amantes de la velocidad y la adrenalina.`;
    }
    if (modelo.includes('APACHE 200')) {
      return `La ${modelo} representa la cúspide del rendimiento deportivo con motor de ${cilindrada}. Tecnología de punta, diseño aerodinámico y potencia impresionante para una experiencia de conducción única.`;
    }
    if (modelo.includes('APACHE 310')) {
      return `La ${modelo} es la máxima expresión de ingeniería TVS. Motor de ${cilindrada}, tecnología racing y prestaciones de alta gama para los más exigentes.`;
    }
    if (modelo.includes('NTORQ')) {
      return `La ${modelo} es una scooter deportiva con conectividad inteligente. Motor de ${cilindrada}, diseño moderno y tecnología SmartXonnect para una experiencia de conducción conectada.`;
    }
    if (modelo.includes('NEON') || modelo.includes('DAZZ')) {
      return `La ${modelo} es una scooter urbana práctica y económica. Motor de ${cilindrada}, amplio espacio de almacenamiento y excelente maniobrabilidad en la ciudad.`;
    }
    if (modelo.includes('KING')) {
      return `El ${modelo} es un mototaxi/tricargo robusto y confiable. Motor de ${cilindrada}, capacidad de carga superior y comodidad para pasajeros. Ideal para transporte comercial.`;
    }
    if (modelo.includes('STRYKER')) {
      return `La ${modelo} es una moto versátil para trabajo y uso diario. Motor de ${cilindrada}, construcción robusta y excelente economía de combustible.`;
    }
  }
  
  if (marca === 'Kymco') {
    if (modelo.includes('TWIST')) {
      return `La ${modelo} es una scooter urbana elegante y práctica. Motor de ${cilindrada}, diseño europeo y excelente comodidad para el día a día en la ciudad.`;
    }
    if (modelo.includes('AGILITY')) {
      return `La ${modelo} es la scooter más vendida de Colombia. Motor de ${cilindrada}, confiabilidad comprobada, amplio espacio y el mejor respaldo de servicio postventa.`;
    }
  }
  
  if (marca === 'Victory') {
    if (modelo.includes('ONE')) {
      return `La ${modelo} es una moto de trabajo económica y confiable. Motor de ${cilindrada}, bajo consumo de combustible y mantenimiento accesible. Perfecta para mensajería y domicilios.`;
    }
    if (modelo.includes('ADVANCE')) {
      return `La ${modelo} combina estilo y economía. Motor de ${cilindrada}, diseño moderno y excelente relación calidad-precio para el uso urbano diario.`;
    }
    if (modelo.includes('X1')) {
      return `La ${modelo} ofrece tecnología de inyección en un paquete accesible. Motor de ${cilindrada} con inyección electrónica para mayor eficiencia y menor consumo.`;
    }
    if (modelo.includes('NEW LIFE')) {
      return `La ${modelo} es perfecta para el trabajo diario. Motor de ${cilindrada}, construcción robusta y excelente capacidad de carga para mensajería y domicilios.`;
    }
    if (modelo.includes('MRX')) {
      return `La ${modelo} está diseñada para la aventura. Motor de ${cilindrada}, suspensión reforzada y capacidad todo terreno para conquistar cualquier camino.`;
    }
    if (modelo.includes('NITRO')) {
      return `La ${modelo} ofrece potencia y estilo en un paquete deportivo. Motor de ${cilindrada} y diseño agresivo para quienes buscan destacar.`;
    }
    if (modelo.includes('SWITCH')) {
      return `La ${modelo} es versátil y práctica. Motor de ${cilindrada}, fácil manejo y perfecta para quienes inician en el mundo de las motos.`;
    }
    if (modelo.includes('COMBAT')) {
      return `La ${modelo} es resistente y confiable para el trabajo pesado. Motor de ${cilindrada} y construcción duradera para las condiciones más exigentes.`;
    }
    if (modelo.includes('HUNTER')) {
      return `La ${modelo} combina aventura y practicidad. Motor de ${cilindrada}, diseño adventure y capacidad para explorar nuevos caminos.`;
    }
    if (modelo.includes('TRICARGO')) {
      return `El ${modelo} es un vehículo de carga eficiente. Motor de ${cilindrada}, amplia capacidad de carga y estabilidad para transporte comercial.`;
    }
  }
  
  if (marca === 'Benelli') {
    return `La ${modelo} representa la tradición italiana en motocicletas. Motor de ${cilindrada}, diseño premium y tecnología avanzada para una experiencia de conducción excepcional.`;
  }
  
  if (marca === 'Ceronte') {
    return `La ${modelo} ofrece calidad y rendimiento. Motor de ${cilindrada}, construcción robusta y excelente valor para el mercado colombiano.`;
  }
  
  if (marca === 'Zontes') {
    return `La ${modelo} es una moto premium con tecnología de vanguardia. Motor de ${cilindrada}, acabados de alta calidad y prestaciones superiores para los más exigentes.`;
  }
  
  return `La ${modelo} de ${marca} ofrece excelente rendimiento y confiabilidad. Con motor de ${cilindrada}, es perfecta para el uso diario.`;
};

const MotoDetail = () => {
  const { id } = useParams<{ id: string }>();
  const moto = motos.find(m => m.id === id);
  const asesor = useAsesorConfig();

  if (!moto) {
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

  const whatsappMessage = encodeURIComponent(
    `Hola ${asesor.nombre}! Estoy interesado en la ${moto.marca} ${moto.modelo}. ¿Me pueden dar más información sobre precios y disponibilidad?`
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
                src={moto.imagen}
                alt={moto.modelo}
                className="max-w-full max-h-full object-contain"
              />
            </div>
            <div className="absolute top-4 left-4 flex gap-2">
              <Badge className={`font-heading font-semibold ${getMarcaColor(moto.marca)}`}>
                {moto.marca}
              </Badge>
              <Badge variant="outline" className="bg-card/90 backdrop-blur-sm font-heading">
                {getCategoriaLabel(moto.categoria)}
              </Badge>
            </div>
          </div>

          {/* Info Section */}
          <div className="space-y-6">
            <div>
              <h1 className="text-3xl lg:text-4xl font-heading font-bold text-foreground mb-2">
                {moto.modelo}
              </h1>
              {moto.cilindrada && (
                <p className="text-xl text-muted-foreground font-heading">
                  Motor {moto.cilindrada}
                </p>
              )}
            </div>

            {/* Description */}
            <Card className="border-border/50">
              <CardContent className="p-6">
                <h2 className="font-heading font-bold text-lg mb-3 text-foreground">
                  Descripción
                </h2>
                <p className="text-muted-foreground font-body leading-relaxed">
                  {getDescripcion(moto)}
                </p>
              </CardContent>
            </Card>

            {/* Specifications */}
            <Card className="border-border/50">
              <CardContent className="p-6">
                <h2 className="font-heading font-bold text-lg mb-4 text-foreground">
                  Especificaciones
                </h2>
                <div className="grid grid-cols-2 gap-4">
                  {moto.cilindrada && (
                    <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
                      <Gauge className="w-5 h-5 text-primary" />
                      <div>
                        <p className="text-xs text-muted-foreground font-body">Cilindrada</p>
                        <p className="font-heading font-semibold text-foreground">{moto.cilindrada}</p>
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
                        {moto.categoria === 'automatica' ? 'Automática' : 'Manual'}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
                    <Cog className="w-5 h-5 text-primary" />
                    <div>
                      <p className="text-xs text-muted-foreground font-body">Tipo</p>
                      <p className="font-heading font-semibold text-foreground">{getCategoriaLabel(moto.categoria)}</p>
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
                  <div className="flex justify-between items-center py-3 border-b border-border/50">
                    <span className="text-muted-foreground font-body">Cuota Inicial:</span>
                    <span className="font-heading font-bold text-primary text-2xl">
                      {formatPrice(moto.cuotaInicial)}
                    </span>
                  </div>
                  <div className="flex justify-between items-center py-3 border-b border-border/50">
                    <span className="text-muted-foreground font-body">Precio 2026:</span>
                    <span className="font-heading font-semibold text-foreground text-xl">
                      {formatPrice(moto.precio2026)}
                    </span>
                  </div>
                  <div className="flex justify-between items-center pt-2">
                    <span className="text-muted-foreground font-body">Contado con papeles:</span>
                    <span className="font-heading font-extrabold text-foreground text-2xl">
                      {formatPrice(moto.precioContado)}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Contact Section */}
            <Card className="border-green-600/30 bg-green-600/5">
              <CardContent className="p-6 text-center">
                <p className="text-muted-foreground font-body mb-1">Tu asesor comercial</p>
                <h3 className="font-heading font-bold text-xl text-foreground mb-4">
                  {asesor.nombre}
                </h3>
                <Button
                  asChild
                  size="lg"
                  className="w-full bg-green-600 hover:bg-green-700 text-white font-heading font-bold text-lg gap-3 py-6"
                >
                  <a
                    href={`https://wa.me/${asesor.whatsapp}?text=${whatsappMessage}`}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <MessageCircle className="w-6 h-6" />
                    Cotizar por WhatsApp
                  </a>
                </Button>
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
