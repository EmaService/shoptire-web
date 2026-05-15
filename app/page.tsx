import SearchBar from '@/components/SearchBar';
import Image from 'next/image';

const MEDIDAS_POPULARES = [
  '175/70 R13', '185/65 R15', '195/65 R15',
  '205/55 R16', '205/60 R16', '215/65 R16',
  '235/65 R17', '265/70 R17',
];

export default function HomePage() {
  return (
    <main>
      {/* ── Hero ── */}
      <section className="bg-brand-black text-white overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 py-16 sm:py-24 flex flex-col lg:flex-row items-center gap-12">
          <div className="flex-1 text-center lg:text-left">
            <p className="text-brand-orange font-semibold text-sm uppercase tracking-widest mb-3">
              +10,000 llantas disponibles
            </p>
            <h1 className="font-heading text-4xl sm:text-5xl lg:text-6xl font-extrabold leading-tight">
              Encuentra las llantas<br />
              <span className="text-brand-orange">perfectas</span> para tu auto
            </h1>
            <p className="mt-4 text-gray-400 text-lg max-w-xl mx-auto lg:mx-0">
              Busca por medida, elige la que quieras y apártala en segundos. Entrega en CDMX.
            </p>
            <div className="mt-8 max-w-lg mx-auto lg:mx-0">
              <p className="text-xs text-gray-500 mb-2 text-left">
                Escribe la medida de tu llanta — la encuentras en el flanco del neumático
              </p>
              <SearchBar autoFocus />
            </div>
            <div className="mt-5 flex flex-wrap justify-center lg:justify-start gap-2">
              {MEDIDAS_POPULARES.map(m => (
                <a
                  key={m}
                  href={`/catalogo?medida=${encodeURIComponent(m)}`}
                  className="font-mono text-xs bg-white/10 hover:bg-brand-orange text-gray-300 hover:text-white px-3 py-1.5 rounded-full transition-colors border border-white/10 hover:border-brand-orange"
                >
                  {m}
                </a>
              ))}
            </div>
          </div>
          <div className="shrink-0">
            <div className="relative w-56 h-56 sm:w-72 sm:h-72">
              <Image src="/logo.svg" alt="ShopTire Ajusco" fill className="object-contain drop-shadow-2xl" priority />
            </div>
          </div>
        </div>
      </section>

      {/* ── Cómo funciona ── */}
      <section className="bg-brand-light py-14">
        <div className="max-w-5xl mx-auto px-4">
          <h2 className="font-heading text-2xl sm:text-3xl text-center text-brand-black mb-10">
            ¿Cómo funciona?
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {[
              { n: '1', title: 'Busca tu medida', desc: 'Escribe la medida de tu llanta. La encuentras en el flanco del neumático actual.' },
              { n: '2', title: 'Elige y aparta',  desc: 'Selecciona la llanta. Confirma disponibilidad o aparta con anticipo vía transferencia.' },
              { n: '3', title: 'Recoge o recibe', desc: 'Pasa a instalar en sucursal Ajusco o espera tu entrega en CDMX.' },
            ].map(s => (
              <div key={s.n} className="bg-white rounded-2xl p-6 flex flex-col items-center text-center shadow-sm">
                <span className="w-11 h-11 rounded-full bg-brand-orange text-white font-heading font-bold text-xl flex items-center justify-center mb-4 shadow">
                  {s.n}
                </span>
                <h3 className="font-heading font-bold text-brand-black mb-2">{s.title}</h3>
                <p className="text-sm text-gray-500 leading-relaxed">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Entregas ── */}
      <section className="py-14 max-w-5xl mx-auto px-4">
        <h2 className="font-heading text-2xl sm:text-3xl text-center text-brand-black mb-10">
          Opciones de entrega
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
          {[
            { icon: '🏪', title: 'En tienda — inmediato', desc: 'Llantas físicamente en sucursal. Instalación en el momento, sin citas.' },
            { icon: '⚡', title: 'Llega hoy',             desc: 'Proveedores express. Tu llanta en 4 a 12 horas.' },
            { icon: '🚚', title: '2 días hábiles',        desc: 'Cualquier medida, la conseguimos. Envío a domicilio disponible.' },
          ].map(f => (
            <div key={f.title} className="border-2 border-brand-light hover:border-brand-orange rounded-2xl p-6 flex flex-col items-center text-center transition-colors">
              <span className="text-4xl mb-3">{f.icon}</span>
              <h3 className="font-heading font-bold text-brand-black mb-1">{f.title}</h3>
              <p className="text-sm text-gray-500">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── CTA WhatsApp ── */}
      <section className="bg-brand-black py-12 px-4 text-center">
        <p className="text-brand-orange font-semibold text-sm uppercase tracking-widest mb-3">Atención 24/7</p>
        <h2 className="font-heading text-2xl sm:text-3xl text-white font-bold mb-2">
          ¿Prefieres hablar con Yoko?
        </h2>
        <p className="text-gray-400 mb-6 max-w-md mx-auto text-sm">
          Nuestra asesora de IA te ayuda a encontrar la llanta exacta para tu auto por WhatsApp.
        </p>
        <a
          href="https://wa.me/5215512899120"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 bg-[#25D366] hover:bg-[#1ebe5d] text-white font-bold px-8 py-4 rounded-2xl transition-colors shadow-lg"
        >
          <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
          </svg>
          Hablar con Yoko
        </a>
      </section>
    </main>
  );
}
