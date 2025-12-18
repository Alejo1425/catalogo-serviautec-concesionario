import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";

interface HeroProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  totalMotos: number;
}

export function Hero({ searchQuery, onSearchChange, totalMotos }: HeroProps) {
  return (
    <section className="relative bg-gradient-to-br from-secondary via-secondary to-auteco-dark py-16 overflow-hidden">
      {/* Background pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }} />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center max-w-3xl mx-auto">
          <h2 className="font-heading font-black text-4xl md:text-5xl lg:text-6xl text-secondary-foreground mb-4">
            Encuentra tu <span className="text-primary">moto ideal</span>
          </h2>
          <p className="text-secondary-foreground/70 text-lg mb-8 font-body">
            Explora nuestro catálogo de {totalMotos} referencias con precios y cuotas iniciales actualizadas
          </p>

          <div className="relative max-w-xl mx-auto">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground w-5 h-5" />
            <Input
              type="text"
              placeholder="Buscar por modelo, marca o cilindrada..."
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              className="pl-12 h-14 text-lg bg-card border-border/50 focus:border-primary rounded-full font-body"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
