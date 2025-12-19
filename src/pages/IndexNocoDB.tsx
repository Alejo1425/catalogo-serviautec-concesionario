/**
 * Página Principal del Catálogo - Versión NocoDB
 *
 * Esta es una versión actualizada que usa datos de NocoDB en lugar de datos estáticos.
 * Los cambios en NocoDB se reflejan automáticamente en la página.
 *
 * Para usarla:
 * 1. Renombra Index.tsx a Index.backup.tsx
 * 2. Renombra este archivo a Index.tsx
 */

import { useState, useMemo } from "react";
import { Header } from "@/components/Header";
import { Hero } from "@/components/Hero";
import { FilterBar } from "@/components/FilterBar";
import { MotoCard } from "@/components/MotoCard";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { RefreshCw, AlertCircle } from "lucide-react";
import { useMotos, useSincronizarMotos } from "@/hooks/useMotos";
import { MotoService } from "@/services/nocodb";
import type { MotoNocoDB, MotoLegacy } from "@/types";

const Index = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedMarca, setSelectedMarca] = useState<string | null>(null);
  const [selectedCategoria, setSelectedCategoria] = useState("todas");

  // Obtener motos desde NocoDB con polling cada 30 segundos
  const {
    data: motosNocoDB,
    isLoading,
    error,
    refetch,
  } = useMotos(
    { soloActivas: true },
    { refetchInterval: 30000 } // Sincronización automática cada 30 segundos
  );

  // Sincronización manual
  const syncMotos = useSincronizarMotos();

  // Convertir motos de NocoDB a formato legacy para compatibilidad con MotoCard
  const motos: MotoLegacy[] = useMemo(() => {
    if (!motosNocoDB) return [];
    return MotoService.toLegacyFormatList(motosNocoDB);
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

  // Manejar sincronización manual
  const handleSync = () => {
    syncMotos.mutate();
  };

  // Mostrar loading
  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <RefreshCw className="w-12 h-12 animate-spin text-primary mx-auto mb-4" />
          <p className="text-lg text-muted-foreground">Cargando catálogo...</p>
          <p className="text-sm text-muted-foreground mt-2">
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
        />

        <section className="container mx-auto px-4 pb-16">
          <div className="flex justify-between items-center mb-6">
            <h3 className="font-heading font-bold text-2xl text-foreground">
              {filteredMotos.length}{" "}
              {filteredMotos.length === 1 ? "moto encontrada" : "motos encontradas"}
            </h3>

            {/* Botón de sincronización manual */}
            <Button
              onClick={handleSync}
              disabled={syncMotos.isPending}
              variant="outline"
              size="sm"
              className="gap-2"
            >
              <RefreshCw
                className={`w-4 h-4 ${syncMotos.isPending ? "animate-spin" : ""}`}
              />
              {syncMotos.isPending ? "Sincronizando..." : "Actualizar"}
            </Button>
          </div>

          {/* Indicador de última sincronización */}
          <div className="mb-4">
            <p className="text-xs text-muted-foreground">
              {syncMotos.isPending
                ? "Sincronizando con NocoDB..."
                : "Sincronización automática cada 30 segundos"}
            </p>
          </div>

          {filteredMotos.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredMotos.map((moto, index) => (
                <MotoCard key={moto.id} moto={moto} index={index} />
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <p className="text-muted-foreground text-lg font-body">
                No se encontraron motos con los filtros seleccionados.
              </p>
            </div>
          )}
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default Index;
