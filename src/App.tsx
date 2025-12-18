import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AsesorProvider } from "@/contexts";
import Index from "./pages/Index";
import MotoDetail from "./pages/MotoDetail";
import NotFound from "./pages/NotFound";
import TestAsesores from "./pages/TestAsesores";
import TestAsesoresV2 from "./pages/TestAsesoresV2";
import TestContext from "./pages/TestContext";
import GestionAsesores from "./pages/admin/GestionAsesores";
import AsesorCatalogo from "./pages/AsesorCatalogo";
import ResolvingAsesor from "./pages/ResolvingAsesor";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AsesorProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/moto/:id" element={<MotoDetail />} />
            <Route path="/admin/asesores" element={<GestionAsesores />} />
            <Route path="/test-asesores" element={<TestAsesores />} />
            <Route path="/test-asesores-v2" element={<TestAsesoresV2 />} />
            <Route path="/test-context" element={<TestContext />} />

            {/* Ruta para resolución dinámica de nombres de asesores */}
            <Route path="/asesor/:identifier" element={<ResolvingAsesor />} />

            {/* Ruta dinámica para catálogos personalizados de asesores */}
            <Route path="/:slug" element={<AsesorCatalogo />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AsesorProvider>
  </QueryClientProvider>
);

export default App;
