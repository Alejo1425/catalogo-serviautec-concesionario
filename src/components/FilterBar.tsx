import { Badge } from "@/components/ui/badge";
import { Check } from "lucide-react";
import { marcas, categorias } from "@/data/motos";
import { cn } from "@/lib/utils";
import { useRef } from "react";

interface FilterBarProps {
  selectedMarca: string | null;
  selectedCategoria: string;
  onMarcaChange: (marca: string | null) => void;
  onCategoriaChange: (categoria: string) => void;
  counts?: Record<string, number>; // New prop for badge counts
}

export function FilterBar({
  selectedMarca,
  selectedCategoria,
  onMarcaChange,
  onCategoriaChange,
  counts = {} // Default to empty object if not provided
}: FilterBarProps) {

  const categoriesRef = useRef<HTMLDivElement>(null);

  return (
    <div className="sticky top-0 z-40 w-full transition-all duration-300">
      {/* Background with Glassmorphism */}
      <div className="absolute inset-0 bg-white/80 dark:bg-black/70 backdrop-blur-md border-b border-gray-200/50 dark:border-white/10 shadow-[0_4px_30px_rgba(0,0,0,0.03)]" />

      <div className="relative container mx-auto flex flex-col gap-3 py-3">

        {/* SECTION: CATEGORÍAS (Typography Only) */}
        <div
          ref={categoriesRef}
          className="flex items-center gap-2 overflow-x-auto px-4 py-1.5 no-scrollbar snap-x snap-mandatory scroll-px-4"
        >
          {categorias.map((cat) => {
            const isSelected = selectedCategoria === cat.id;
            const count = counts[cat.id] || 0;

            return (
              <button
                key={cat.id}
                onClick={() => onCategoriaChange(cat.id)}
                className={cn(
                  "group relative flex items-center gap-2 px-4 py-2.5 rounded-full transition-all duration-300 snap-center outline-none shrink-0 border",
                  isSelected
                    ? "bg-primary text-primary-foreground border-transparent shadow-md transform scale-[1.02]"
                    : "bg-transparent text-muted-foreground border-transparent hover:bg-gray-100 dark:hover:bg-white/10 hover:text-foreground"
                )}
              >
                <span className={cn(
                  "font-heading text-sm font-bold tracking-tight whitespace-nowrap",
                  isSelected ? "text-primary-foreground" : "text-foreground/80 group-hover:text-foreground"
                )}>
                  {cat.nombre}
                </span>

                {/* Badge Count - Typography Style */}
                <span className={cn(
                  "flex items-center justify-center min-w-[1.25rem] h-5 px-1.5 text-[10px] font-bold rounded-full transition-colors",
                  isSelected
                    ? "bg-primary-foreground/20 text-primary-foreground"
                    : "bg-gray-200 dark:bg-gray-800 text-gray-600 dark:text-gray-400 group-hover:bg-gray-300 dark:group-hover:bg-gray-700"
                )}>
                  {count}
                </span>

                {/* Touch Feedback */}
                <div className="absolute inset-0 rounded-full active:bg-black/5 dark:active:bg-white/5 transition-colors duration-100 pointer-events-none" />
              </button>
            );
          })}
        </div>

        {/* SECTION: MARCAS (Horizontal Pills - Simplified) */}
        <div className="flex items-center gap-2 overflow-x-auto px-4 pb-1 no-scrollbar scroll-pl-4">

          <button
            onClick={() => onMarcaChange(null)}
            className={cn(
              "shrink-0 px-3 py-1.5 rounded-lg text-xs font-heading font-medium transition-all duration-300 border active:scale-95",
              selectedMarca === null
                ? "bg-gray-100 dark:bg-gray-800 text-foreground border-gray-200 dark:border-gray-700 font-bold"
                : "bg-transparent text-muted-foreground border-transparent hover:bg-gray-50 dark:hover:bg-white/5"
            )}
          >
            Todas las Marcas
          </button>

          {marcas.map((marca) => {
            const isSelected = selectedMarca === marca;
            return (
              <button
                key={marca}
                onClick={() => onMarcaChange(isSelected ? null : marca)}
                className={cn(
                  "shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-heading font-medium transition-all duration-300 border active:scale-95",
                  isSelected
                    ? "bg-gray-100 dark:bg-gray-800 text-foreground border-gray-200 dark:border-gray-700 font-bold shadow-sm"
                    : "bg-transparent text-muted-foreground border-transparent hover:bg-gray-50 dark:hover:bg-white/5"
                )}
              >
                {isSelected && <Check className="w-3 h-3" />}
                {marca}
              </button>
            );
          })}
        </div>

      </div>
    </div>
  );
}
