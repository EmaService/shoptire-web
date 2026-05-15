import SearchBar from '@/components/SearchBar';
import LlantaCard from '@/components/LlantaCard';

interface Llanta {
  tabla_origen: string;
  id: number;
  marca_col: string;
  modelo: string;
  medida: string;
  precio: string;
  stock: number;
  disponibilidad: string;
  entrega_dias: number;
}

interface PageProps {
  searchParams: { medida?: string; page?: string };
}

async function fetchLlantas(medida: string, page: string) {
  const BACKEND = process.env.BACKEND_URL || 'http://3.236.101.20:3000';
  const url = `${BACKEND}/web/catalog?medida=${encodeURIComponent(medida)}&page=${page}&limit=60`;
  try {
    const res = await fetch(url, { cache: 'no-store' });
    return res.json();
  } catch {
    return { ok: false, items: [], total: 0 };
  }
}

export async function generateMetadata({ searchParams }: PageProps) {
  const medida = searchParams.medida || '';
  return {
    title: medida ? `Llantas ${medida} — ShopTire Ajusco` : 'Catálogo — ShopTire Ajusco',
  };
}

export default async function CatalogoPage({ searchParams }: PageProps) {
  const medida = searchParams.medida || '';
  const page = searchParams.page || '1';

  const data = medida ? await fetchLlantas(medida, page) : null;
  const llantas: Llanta[] = data?.items || [];

  const grupos = [
    { label: 'En tienda — disponible hoy', dias: 0, items: llantas.filter(l => l.entrega_dias === 0) },
    { label: 'Llega hoy (~4 hrs)', dias: 1, items: llantas.filter(l => l.entrega_dias === 1) },
    { label: 'Llega hoy (~12 hrs)', dias: 2, items: llantas.filter(l => l.entrega_dias === 2) },
    { label: '2 días hábiles', dias: 3, items: llantas.filter(l => l.entrega_dias === 3) },
  ].filter(g => g.items.length > 0);

  return (
    <main className="max-w-5xl mx-auto px-4 py-6">
      {/* Search */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center mb-6">
        <div className="flex-1">
          <SearchBar defaultValue={medida} />
        </div>
        {data && (
          <p className="text-sm text-gray-500 shrink-0">
            {data.total > 0
              ? `${data.total} llantas para "${medida}"`
              : `Sin resultados para "${medida}"`}
          </p>
        )}
      </div>

      {/* Sin búsqueda */}
      {!medida && (
        <div className="text-center py-20 text-gray-400">
          <p className="text-lg">Escribe una medida para buscar</p>
          <p className="text-sm mt-2">Ejemplo: 205/60 R16</p>
        </div>
      )}

      {/* Sin resultados */}
      {medida && llantas.length === 0 && (
        <div className="text-center py-20">
          <p className="text-lg text-gray-600">No encontramos llantas para <strong>{medida}</strong></p>
          <p className="text-sm text-gray-400 mt-2">Verifica la medida o contáctanos por WhatsApp</p>
          <a
            href="https://wa.me/5215512899120"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block mt-4 bg-green-600 text-white px-6 py-3 rounded-xl font-medium"
          >
            Consultar por WhatsApp
          </a>
        </div>
      )}

      {/* Resultados agrupados */}
      {grupos.map(grupo => (
        <section key={grupo.dias} className="mb-10">
          <h2 className="text-base font-semibold text-gray-700 mb-4 flex items-center gap-2">
            <span className={`w-2.5 h-2.5 rounded-full ${grupo.dias === 0 ? 'bg-emerald-500' : grupo.dias === 1 ? 'bg-blue-500' : grupo.dias === 2 ? 'bg-sky-400' : 'bg-gray-400'}`} />
            {grupo.label}
            <span className="text-gray-400 font-normal">({grupo.items.length})</span>
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {grupo.items.map(llanta => (
              <LlantaCard key={`${llanta.tabla_origen}-${llanta.id}`} llanta={llanta} />
            ))}
          </div>
        </section>
      ))}

      {/* Paginación */}
      {data && data.pages > 1 && (
        <div className="flex justify-center gap-2 mt-8">
          {Array.from({ length: Math.min(data.pages, 10) }, (_, i) => i + 1).map(p => (
            <a
              key={p}
              href={`/catalogo?medida=${encodeURIComponent(medida)}&page=${p}`}
              className={`w-9 h-9 rounded-lg flex items-center justify-center text-sm font-medium transition-colors ${
                String(p) === page
                  ? 'bg-[#FF6B35] text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {p}
            </a>
          ))}
        </div>
      )}
    </main>
  );
}