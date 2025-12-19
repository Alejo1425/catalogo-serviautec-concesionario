import { Phone, MapPin, Globe } from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-secondary text-secondary-foreground py-12 mt-16">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-3 gap-8">
          <div>
            <img 
              src="https://auteco.vtexassets.com/assets/vtex.file-manager-graphql/images/842550b6-d0da-4797-aadb-dc4e0493dc91___f559a76f2dffdf25985c6b99ec59ffef.svg" 
              alt="Serviautec Concesionario Auteco" 
              className="h-8 brightness-0 invert mb-4"
            />
            <p className="text-secondary-foreground/70 font-body text-sm">
              Distribuidor oficial de las mejores marcas de motos en Colombia. 
              Financiación disponible con cuotas desde $6.148 diarios.
            </p>
          </div>
          
          <div>
            <h4 className="font-heading font-bold text-lg mb-4">Contacto</h4>
            <ul className="space-y-3 text-secondary-foreground/70 font-body text-sm">
              <li className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-primary" />
                <a href="tel:3002643510" className="hover:text-primary transition-colors">
                  300 264 3510
                </a>
              </li>
              <li className="flex items-center gap-2">
                <Globe className="w-4 h-4 text-primary" />
                <a 
                  href="https://serviautec.com" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="hover:text-primary transition-colors"
                >
                  serviautec.com
                </a>
              </li>
              <li className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-primary" />
                <span>+5.000 puntos de venta en Colombia</span>
              </li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-heading font-bold text-lg mb-4">Nuestras Marcas</h4>
            <div className="flex flex-wrap gap-4 opacity-70">
              <span className="text-sm font-heading">TVS</span>
              <span className="text-sm font-heading">Victory</span>
              <span className="text-sm font-heading">Kymco</span>
              <span className="text-sm font-heading">Benelli</span>
              <span className="text-sm font-heading">Kawasaki</span>
              <span className="text-sm font-heading">Zontes</span>
            </div>
          </div>
        </div>
        
        <div className="border-t border-secondary-foreground/20 mt-8 pt-8 text-center">
          <p className="text-secondary-foreground/50 text-sm font-body">
            © 2025 Catálogo Serviautec Concesionario. Precios sujetos a cambios sin previo aviso.
          </p>
        </div>
      </div>
    </footer>
  );
}
