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

const DOT: Record<number, string> = {
  0: 'bg-emerald-500',
  1: 'bg-blue-500',
  2: 'bg-sky-400',
  3: 'bg-gray-500',
};

export default async function CatalogoPage({ searchParams }: PageProps) {
  const medida = searchParams.medida || '';
  const page = searchParams.page || '1';

  const data = medida ? await fetchLlantas(medida, page) : null;
  const llantas: Llanta[] = data?.items || [];

  const grupos = [
    { label: 'En tienda — disponible hoy', dias: 0, items: llantas.filter(l => l.entrega_dias === 0) },
    { label: 'Llega hoy (~4 hrs)',          dias: 1, items: llantas.filter(l => l.entrega_dias === 1) },
    { label: 'Llega hoy (~12 hrs)',         dias: 2, items: llantas.filter(l => l.entrega_dias === 2) },
    { label: '2 días hábiles',              dias: 3, items: llantas.filter(l => l.entrega_dias === 3) },
  ].filter(g => g.items.length > 0);

  return (
    <main className="bg-[#0A0A0A] min-h-screen">
      {/* Header de búsqueda */}
      <div className="border-b border-[#1f1f1f] bg-[#111]">
        <div className="max-w-5xl mx-auto px-4 py-5">
          <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
            <div className="flex-1">
              <SearchBar defaultValue={medida} variant="dark" />
            </div>
            {data && (
              <p className="text-sm text-gray-500 shrink-0 font-mono">
                {data.total > 0
                  ? <><span className="text-[#FF6B35] font-bold">{data.total}</span> llantas para &quot;{medida}&quot;</>
                  : `Sin resultados para "${medida}"`}
              </p>
            )}
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 py-8">

        {/* Sin búsqueda */}
        {!medida && (
          <div className="text-center py-24">
            <p className="text-6xl mb-6">🔍</p>
            <p className="text-xl font-heading font-bold text-white mb-2">Busca tu medida</p>
            <p className="text-gray-500 text-sm">Ejemplo: 205/60 R16 — la encuentras en el flanco de tu llanta</p>
          </div>
        )}

        {/* Sin resultados */}
        {medida && llantas.length === 0 && (
          <div className="text-center py-24">
            <p className="text-5xl mb-6">😔</p>
            <p className="text-xl font-heading font-bold text-white mb-2">
              No encontramos <span className="text-[#FF6B35]">{medida}</span>
            </p>
            <p className="text-gray-500 text-sm mb-8">Verifica la medida o escríbenos y la conseguimos</p>
            <a
              href="https://wa.me/5215512899120"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-[#25D366] hover:bg-[#1ebe5d] text-white font-bold px-6 py-3 rounded-xl transition-colors"
            >
              Consultar por WhatsApp
            </a>
          </div>
        )}

        {/* Resultados agrupados */}
        {grupos.map(grupo => (
          <section key={grupo.dias} className="mb-12">
            <div className="flex items-center gap-3 mb-5">
              <span className={`w-2.5 h-2.5 rounded-full shrink-0 ${DOT[grupo.dias]}`} />
              <h2 className="font-heading font-bold text-white text-base">{grupo.label}</h2>
              <span className="text-xs text-gray-600 font-mono">({grupo.items.length})</span>
            </div>
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
                className={`w-9 h-9 rounded-lg flex items-center justify-center text-sm font-bold transition-colors ${
                  String(p) === page
                    ? 'bg-[#FF6B35] text-white'
                    : 'bg-[#111] border border-[#2a2a2a] text-gray-400 hover:border-[#FF6B35] hover:text-white'
                }`}
              >
                {p}
              </a>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
