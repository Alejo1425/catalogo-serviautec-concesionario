import { Phone } from "lucide-react";
import { ThemeToggle } from "@/components/ThemeToggle";

export function Header() {
  return (
    <header className="bg-secondary text-secondary-foreground shadow-md">
      {/* Top bar */}
      <div className="bg-primary text-primary-foreground py-1 relative">
        <div className="container mx-auto px-4 flex justify-between items-center text-sm h-8">
          <span className="font-body hidden sm:block">Precios actualizados - Diciembre 2025</span>
          <a
            href="tel:3002643510"
            className="flex items-center gap-2 hover:opacity-80 transition-opacity font-heading font-semibold mr-10 sm:mr-0"
          >
            <Phone className="w-4 h-4" />
            <span className="whitespace-nowrap">300 264 3510</span>
          </a>
        </div>

        {/* Toggle en la esquina superior derecha */}
        <div className="absolute right-4 top-0 bottom-0 flex items-center">
          <ThemeToggle />
        </div>
      </div>

      {/* Main header */}
      <div className="container mx-auto px-4 py-3 md:py-2">
        <div className="flex flex-wrap items-center justify-between gap-y-4 gap-x-2 md:gap-8">
          <div className="flex items-center gap-2 sm:gap-4 overflow-hidden">
            <img
              src="https://auteco.vtexassets.com/assets/vtex.file-manager-graphql/images/842550b6-d0da-4797-aadb-dc4e0493dc91___f559a76f2dffdf25985c6b99ec59ffef.svg"
              alt="Auteco"
              className="h-8 sm:h-10 brightness-0 invert shrink-0"
            />
            <div className="h-6 sm:h-8 w-px bg-secondary-foreground/30 shrink-0" />
            <h1 className="font-heading font-bold text-lg sm:text-xl md:text-2xl whitespace-nowrap overflow-hidden text-ellipsis">
              Serviautec Concesionario
            </h1>
          </div>

          <div className="flex items-center gap-4 text-sm font-heading">
            <span className="px-3 py-1 bg-secondary-foreground/10 rounded-md hover:bg-secondary-foreground/20 transition-colors">
              TVS
            </span>
            <span className="px-3 py-1 bg-secondary-foreground/10 rounded-md hover:bg-secondary-foreground/20 transition-colors">
              Victory
            </span>
            <span className="px-3 py-1 bg-secondary-foreground/10 rounded-md hover:bg-secondary-foreground/20 transition-colors">
              Kymco
            </span>
          </div>
        </div>
      </div>
    </header>
  );
}
