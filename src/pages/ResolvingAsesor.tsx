import { useEffect, useState } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { AsesorService } from '@/services/nocodb/asesor.service';
import { Loader2 } from 'lucide-react';

/**
 * Componente Resolver de Asesores
 * 
 * Recibe un identificador (nombre o slug) y redirige al catálogo correcto.
 * Útil para integraciones dinámicas como Chatwoot donde usamos {{agent.name}}.
 */
export default function ResolvingAsesor() {
    const { identifier } = useParams<{ identifier: string }>();
    const navigate = useNavigate();
    const location = useLocation();
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        async function resolve() {
            if (!identifier) {
                setError('Identificador no válido');
                return;
            }

            try {

                const asesor = await AsesorService.findSmart(identifier);

                if (asesor && asesor.slug) {
                    const targetUrl = `/${asesor.slug}${location.search}`;
                    // Mantener los query params (ej: ?cid=123)
                    navigate(targetUrl, { replace: true });
                } else {
                    console.warn(`❌ No se encontró asesor para: "${identifier}"`);
                    setError(`No pudimos encontrar un asesor llamado "${identifier}".`);

                    // Opcional: Redirigir al catálogo general después de unos segundos
                    setTimeout(() => {
                        navigate('/', { replace: true });
                    }, 3000);
                }
            } catch (err) {
                console.error('Error al resolver asesor:', err);
                setError('Ocurrió un error al buscar el asesor.');
            }
        }

        resolve();
    }, [identifier, navigate, location.search]);

    if (error) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center p-4 text-center">
                <h2 className="text-xl font-bold text-red-600 mb-2">Asesor no encontrado</h2>
                <p className="text-gray-600 mb-4">{error}</p>
                <p className="text-sm text-gray-400">Redirigiendo al catálogo general...</p>
            </div>
        );
    }

    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
            <Loader2 className="w-12 h-12 text-blue-600 animate-spin mb-4" />
            <h2 className="text-xl font-semibold text-gray-800">Buscando tu asesor...</h2>
            <p className="text-gray-500 mt-2">Por favor espera un momento</p>
        </div>
    );
}
