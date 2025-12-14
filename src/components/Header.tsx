import { Phone } from "lucide-react";

export function Header() {
  return (
    <header className="bg-secondary text-secondary-foreground">
      {/* Top bar */}
      <div className="bg-primary text-primary-foreground py-2">
        <div className="container mx-auto px-4 flex justify-between items-center text-sm">
          <span className="font-body">Precios actualizados - Diciembre 2025</span>
          <a
            href="tel:3114319886"
            className="flex items-center gap-2 hover:opacity-80 transition-opacity font-heading font-semibold"
          >
            <Phone className="w-4 h-4" />
            311 431 9886
          </a>
        </div>
      </div>
      
      {/* Main header */}
      <div className="container mx-auto px-4 py-6">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <img 
              src="https://auteco.vtexassets.com/assets/vtex.file-manager-graphql/images/842550b6-d0da-4797-aadb-dc4e0493dc91___f559a76f2dffdf25985c6b99ec59ffef.svg" 
              alt="Auteco" 
              className="h-10 brightness-0 invert"
            />
            <div className="h-8 w-px bg-secondary-foreground/30" />
            <h1 className="font-heading font-bold text-xl md:text-2xl">
              Catálogo de Motos
            </h1>
          </div>
          
          <div className="flex items-center gap-6">
            <img 
              src="https://auteco.vtexassets.com/assets/vtex.file-manager-graphql/images/6e90a246-9ad1-4874-ac95-b14f3bb6b0b0___56808239fb9fcd829fdf3c5855f9b258.png" 
              alt="TVS" 
              className="h-8 object-contain brightness-0 invert opacity-80 hover:opacity-100 transition-opacity"
            />
            <img 
              src="https://auteco.vtexassets.com/assets/vtex.file-manager-graphql/images/d068273e-bac9-4908-8663-a7aadf857788___a5cf55b1252b648101e6faa9f795e5d8.png" 
              alt="Victory" 
              className="h-8 object-contain brightness-0 invert opacity-80 hover:opacity-100 transition-opacity"
            />
            <img 
              src="https://auteco.vtexassets.com/assets/vtex.file-manager-graphql/images/0f3bb69d-e25d-438d-af7f-aa5c42db6563___7ed0249ef68914c38d8139f1f4f1658b.png" 
              alt="Kymco" 
              className="h-8 object-contain brightness-0 invert opacity-80 hover:opacity-100 transition-opacity"
            />
          </div>
        </div>
      </div>
    </header>
  );
}
