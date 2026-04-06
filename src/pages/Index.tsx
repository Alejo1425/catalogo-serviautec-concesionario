import { useState, useMemo } from "react";
import { Header } from "@/components/Header";
import { Hero } from "@/components/Hero";
import { FilterBar } from "@/components/FilterBar";
import { MotoCard } from "@/components/MotoCard";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { RefreshCw, AlertCircle } from "lucide-react";
import { useMotos } from "@/hooks/useMotos";
import { MotoService } from "@/services/nocodb";
import type { MotoLegacy, MotoNocoDB } from "@/types";

const Index = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedMarca, setSelectedMarca] = useState<string | null>(null);
  const [selectedCategoria, setSelectedCategoria] = useState("todas");

  // Obtener motos desde NocoDB con sincronización automática cada 30 segundos
  const {
    data: motosNocoDB,
    isLoading,
    error,
    refetch,
  } = useMotos(
    { soloActivas: true },
    { refetchInterval: 1500 }
  );

  // Sincronización manual


  // Convertir motos de NocoDB a formato legacy para compatibilidad
  const motos: MotoLegacy[] = useMemo(() => {
    if (!motosNocoDB) return [];
    return MotoService.toLegacyFormatList(motosNocoDB);
  }, [motosNocoDB]);

  // Mapa id-legacy → registro NocoDB para lookup O(1) en cada MotoCard
  const nocoDBByLegacyId = useMemo(() => {
    if (!motosNocoDB) return new Map<string, MotoNocoDB>();
    const map = new Map<string, MotoNocoDB>();
    motosNocoDB.forEach(m => map.set(MotoService.toLegacyFormat(m).id, m));
    return map;
  }, [motosNocoDB]);

  // Filtrar motos
  const filteredMotos = useMemo(() => {
    return motos.filter((moto) => {
      // Filtro de búsqueda
      const searchLower = searchQuery.toLowerCase();
      const matchesSearch =
        moto.modelo.toLowerCase().includes(searchLower) ||
        moto.marca.toLowerCase().includes(searchLower) ||
        (moto.cilindrada && moto.cilindrada.toLowerCase().includes(searchLower));

      // Filtro de marca
      const matchesMarca = selectedMarca === null || moto.marca === selectedMarca;

      // Filtro de categoría
      const matchesCategoria =
        selectedCategoria === "todas" || moto.categoria === selectedCategoria;

      return matchesSearch && matchesMarca && matchesCategoria;
    });
  }, [motos, searchQuery, selectedMarca, selectedCategoria]);

  // Calcular conteos por categoría
  const categoryCounts = useMemo(() => {
    const counts: Record<string, number> = {
      todas: motos.length
    };

    motos.forEach(moto => {
      if (counts[moto.categoria]) {
        counts[moto.categoria]++;
      } else {
        counts[moto.categoria] = 1;
      }
    });

    return counts;
  }, [motos]);

  // Mostrar loading
  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <RefreshCw className="w-12 h-12 animate-spin text-primary mx-auto mb-4" />
          <p className="text-lg text-muted-foreground font-heading">Cargando catálogo...</p>
          <p className="text-sm text-muted-foreground mt-2 font-body">
            Sincronizando con NocoDB
          </p>
        </div>
      </div>
    );
  }

  // Mostrar error
  if (error) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container mx-auto px-4 py-16">
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Error al cargar el catálogo</AlertTitle>
            <AlertDescription>
              {error instanceof Error ? error.message : "Error desconocido"}
            </AlertDescription>
          </Alert>
          <div className="mt-6 text-center">
            <Button onClick={() => refetch()} variant="outline">
              <RefreshCw className="w-4 h-4 mr-2" />
              Reintentar
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main>
        <Hero
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          totalMotos={motos.length}
        />

        <FilterBar
          selectedMarca={selectedMarca}
          selectedCategoria={selectedCategoria}
          onMarcaChange={setSelectedMarca}
          onCategoriaChange={setSelectedCategoria}
          counts={categoryCounts}
        />

        <section className="container mx-auto px-4 pt-6 pb-16">


          {filteredMotos.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredMotos.map((moto, index) => (
                <MotoCard key={moto.id} moto={moto} index={index} rawData={nocoDBByLegacyId.get(moto.id)} />
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <p className="text-muted-foreground text-lg font-body">
                No se encontraron motos con los filtros seleccionados.
              </p>
              {motos.length === 0 && (
                <p className="text-sm text-muted-foreground mt-2 font-body">
                  Tip: Asegúrate de tener motos activas en NocoDB (campo Activo = 1)
                </p>
              )}
            </div>
          )}
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default Index;
