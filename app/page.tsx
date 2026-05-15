import SearchBar from '@/components/SearchBar';
import Image from 'next/image';

const MEDIDAS_POPULARES = [
  '175/70 R13', '185/65 R15', '195/65 R15',
  '205/55 R16', '205/60 R16', '215/65 R16',
  '235/65 R17', '265/70 R17',
];

const STATS = [
  { num: '+10,000', label: 'referencias' },
  { num: 'Hoy',    label: 'entrega en CDMX' },
  { num: '100%',   label: 'instalación gratis' },
  { num: '+10 años', label: 'en el mercado' },
];

const PERKS = [
  { icon: '🔧', title: 'Montaje',     desc: 'Incluido en cada llanta.' },
  { icon: '⚖️',  title: 'Balanceo',   desc: 'Sin costo adicional.' },
  { icon: '💨', title: 'Nitrógeno',   desc: 'Inflado puro gratis.' },
  { icon: '📐', title: 'Alineación',  desc: 'Con 2 llantas o más.' },
];

const WA_SVG = (
  <svg className="w-5 h-5 shrink-0" viewBox="0 0 24 24" fill="currentColor">
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
  </svg>
);

/* Speed lines config — distintas posiciones, duraciones y delays */
const SPEED_LINES = [
  { top: '18%', width: '38%', dur: '3.2s',  delay: '0s' },
  { top: '23%', width: '22%', dur: '2.6s',  delay: '1.1s' },
  { top: '31%', width: '55%', dur: '4.1s',  delay: '0.4s' },
  { top: '40%', width: '28%', dur: '3.7s',  delay: '2.0s' },
  { top: '51%', width: '44%', dur: '2.9s',  delay: '0.7s' },
  { top: '60%', width: '18%', dur: '4.4s',  delay: '1.5s' },
  { top: '68%', width: '60%', dur: '3.0s',  delay: '0.2s' },
  { top: '75%', width: '32%', dur: '2.4s',  delay: '1.8s' },
  { top: '82%', width: '46%', dur: '3.8s',  delay: '0.9s' },
];

export default function HomePage() {
  return (
    <main className="bg-[#0A0A0A]">

      {/* ══════════════════════════════════════════════════
          HERO
      ══════════════════════════════════════════════════ */}
      <section className="relative min-h-[82vh] flex items-center overflow-hidden">

        {/* Foto de fondo */}
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat scale-105"
          style={{ backgroundImage: "url('https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?auto=format&fit=crop&w=1920&q=80')" }}
        />

        {/* Overlay oscuro */}
        <div className="absolute inset-0 hero-overlay" />

        {/* ── Speed lines ── */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none z-[1]">
          {SPEED_LINES.map((l, i) => (
            <div
              key={i}
              className="speed-line"
              style={{ top: l.top, width: l.width, animationDuration: l.dur, animationDelay: l.delay }}
            />
          ))}
        </div>

        {/* ── Racing stripes estilo Mustang GT500 ── */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none z-[1]">
          {/* Raya 1 */}
          <div className="racing-stripe" style={{ right: '18%' }} />
          {/* Raya 2 — a 20px de distancia */}
          <div className="racing-stripe racing-stripe-2" style={{ right: 'calc(18% + 22px)' }} />
        </div>

        {/* ── Línea de scan ── */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none z-[1]">
          <div className="scan-line" />
        </div>

        {/* ── Esquinas HUD ── */}
        <div className="hud-corner tl z-[2]" />
        <div className="hud-corner tr z-[2]" />
        <div className="hud-corner bl z-[2]" />
        <div className="hud-corner br z-[2]" />

        {/* ── Contenido ── */}
        <div className="relative z-10 max-w-7xl mx-auto px-4 w-full py-14 sm:py-20">
          <div className="max-w-3xl">

            {/* Rating Google */}
            <a
              href="https://maps.app.goo.gl/Spvq6o1iNMJQrKLH6"
              target="_blank" rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-white/8 hover:bg-white/12 border border-white/10 px-4 py-2 rounded-full mb-8 transition-colors group"
            >
              <span className="flex text-yellow-400 text-sm">★★★★★</span>
              <span className="text-white font-bold text-sm">4.6</span>
              <span className="text-gray-400 text-xs">· 983 reseñas en Google</span>
            </a>

            {/* Branding — ShopTire Ajusco */}
            <div className="flex items-center gap-4 mb-10">
              <Image
                src="/logo.svg"
                alt="ShopTire Ajusco"
                width={64}
                height={64}
                className="rounded-full bg-white p-1 shadow-[0_0_24px_rgba(255,107,53,0.4)]"
                priority
              />
              <div>
                <p className="font-heading text-2xl sm:text-3xl font-extrabold text-white leading-none tracking-tight">
                  ShopTire <span className="text-[#FF6B35]">Ajusco</span>
                </p>
                <p className="text-gray-400 text-xs uppercase tracking-[0.2em] mt-1">
                  Llantas · CDMX
                </p>
              </div>
            </div>

            {/* Heading principal */}
            <h1 className="font-heading text-5xl sm:text-6xl lg:text-7xl font-extrabold text-white leading-[1.0] mb-6">
              LAS LLANTAS<br />
              QUE TU AUTO<br />
              <span className="text-[#FF6B35]">MERECE.</span>
            </h1>

            {/* Línea de acento */}
            <span className="accent-line mb-8 block" />

            <p className="text-gray-300 text-lg max-w-xl mb-10 leading-relaxed">
              Más de 10,000 referencias. Busca tu medida, apártala en segundos.
              Instalación, balanceo y nitrógeno <strong className="text-white">gratis</strong>.
            </p>

            {/* Search */}
            <div className="mb-6">
              <p className="text-xs text-gray-500 mb-3 uppercase tracking-wider">
                Escribe la medida — la encuentras en el flanco de tu llanta
              </p>
              <SearchBar autoFocus variant="dark" />
            </div>

            {/* Medidas populares */}
            <div className="flex flex-wrap gap-2">
              {MEDIDAS_POPULARES.map(m => (
                <a
                  key={m}
                  href={`/catalogo?medida=${encodeURIComponent(m)}`}
                  className="font-mono text-xs bg-white/5 hover:bg-[#FF6B35] text-gray-400 hover:text-white px-3 py-1.5 rounded-full transition-all border border-white/10 hover:border-[#FF6B35]"
                >
                  {m}
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 opacity-30 z-10">
          <span className="text-[10px] text-gray-400 uppercase tracking-widest">scroll</span>
          <div className="w-px h-8 bg-gradient-to-b from-gray-400 to-transparent" />
        </div>
      </section>

      {/* ══════════════════════════════════════════════════
          STATS — borde angular superior
      ══════════════════════════════════════════════════ */}
      <section className="bg-[#111] border-y border-[#1f1f1f] section-angled-top">
        <div className="max-w-7xl mx-auto px-4 py-12">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-0 lg:divide-x lg:divide-[#2a2a2a]">
            {STATS.map(s => (
              <div key={s.num} className="text-center px-6">
                <p className="font-heading text-4xl sm:text-5xl font-extrabold text-[#FF6B35] stat-number">{s.num}</p>
                <p className="text-gray-500 text-sm mt-2 uppercase tracking-wider">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════
          CÓMO FUNCIONA
      ══════════════════════════════════════════════════ */}
      <section className="py-24 max-w-6xl mx-auto px-4">
        <div className="mb-16">
          <p className="text-[#FF6B35] text-xs font-bold uppercase tracking-[0.25em] mb-3">Simple y rápido</p>
          <h2 className="font-heading text-3xl sm:text-4xl font-extrabold text-white">¿Cómo funciona?</h2>
          <span className="accent-line mt-4" />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 relative">
          <div className="hidden sm:block absolute top-12 left-[calc(16.7%+2rem)] right-[calc(16.7%+2rem)] h-px bg-gradient-to-r from-transparent via-[#FF6B35]/20 to-transparent" />
          {[
            { n: '01', title: 'Busca tu medida', desc: 'Escribe la medida del flanco de tu llanta actual. Ej: 205/55 R16.' },
            { n: '02', title: 'Elige y aparta',  desc: 'Selecciona la llanta. En tienda sin anticipo, de proveedor con anticipo mínimo.' },
            { n: '03', title: 'Recoge e instala', desc: 'Pasa a Ajusco. Montaje, balanceo, válvulas y nitrógeno incluidos.' },
          ].map(s => (
            <div key={s.n} className="bg-[#111] border border-[#1f1f1f] card-dark rounded-2xl p-8 flex flex-col items-start relative overflow-hidden">
              {/* Número grande de fondo */}
              <span className="absolute -right-2 -bottom-4 font-heading text-9xl font-extrabold text-white/[0.03] leading-none select-none">{s.n}</span>
              <span className="font-heading text-5xl font-extrabold text-[#FF6B35]/25 leading-none mb-5">{s.n}</span>
              <h3 className="font-heading font-bold text-white text-lg mb-3">{s.title}</h3>
              <p className="text-gray-400 text-sm leading-relaxed">{s.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ══════════════════════════════════════════════════
          ENTREGAS — sección con corte angular
      ══════════════════════════════════════════════════ */}
      <section className="bg-[#0d0d0d] py-24 px-4 section-angled-both">
        <div className="max-w-6xl mx-auto">
          <div className="mb-16">
            <p className="text-[#FF6B35] text-xs font-bold uppercase tracking-[0.25em] mb-3">Flexibilidad total</p>
            <h2 className="font-heading text-3xl sm:text-4xl font-extrabold text-white">Opciones de entrega</h2>
            <span className="accent-line mt-4" />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
            {[
              {
                icon: '🏪', borderColor: 'border-l-emerald-500',
                badge: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30',
                title: 'En tienda — inmediato',
                sub: 'DISPONIBLE AHORA',
                desc: 'Llantas físicamente en sucursal. Instalación en el momento, sin cita.',
              },
              {
                icon: '⚡', borderColor: 'border-l-blue-500',
                badge: 'bg-blue-500/10 text-blue-400 border-blue-500/30',
                title: 'Entrega hoy',
                sub: '~4 A 12 HORAS',
                desc: 'Proveedores express en CDMX. Tu llanta llega el mismo día.',
              },
              {
                icon: '🚚', borderColor: 'border-l-gray-600',
                badge: 'bg-gray-700/40 text-gray-400 border-gray-600/40',
                title: '2 días hábiles',
                sub: 'CUALQUIER MEDIDA',
                desc: 'Si no la tenemos, la conseguimos. +10,000 referencias disponibles.',
              },
            ].map(f => (
              <div key={f.title} className={`bg-[#111] border border-[#1f1f1f] border-l-4 ${f.borderColor} card-dark rounded-2xl p-7 flex flex-col gap-4`}>
                <span className="text-4xl">{f.icon}</span>
                <div>
                  <span className={`text-[10px] font-bold uppercase tracking-widest border px-2.5 py-1 rounded-full ${f.badge}`}>
                    {f.sub}
                  </span>
                  <h3 className="font-heading font-bold text-white text-lg mt-4 mb-2">{f.title}</h3>
                  <p className="text-gray-400 text-sm leading-relaxed">{f.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════
          BENEFICIOS
      ══════════════════════════════════════════════════ */}
      <section className="py-24 max-w-6xl mx-auto px-4">
        <div className="mb-16">
          <p className="text-[#FF6B35] text-xs font-bold uppercase tracking-[0.25em] mb-3">Todo incluido</p>
          <h2 className="font-heading text-3xl sm:text-4xl font-extrabold text-white">¿Por qué ShopTire?</h2>
          <span className="accent-line mt-4" />
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {PERKS.map(p => (
            <div key={p.title} className="bg-[#111] border border-[#1f1f1f] card-dark rounded-2xl p-6 flex flex-col items-center text-center gap-3 relative overflow-hidden">
              <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#FF6B35]/40 to-transparent" />
              <span className="text-3xl mt-2">{p.icon}</span>
              <h3 className="font-heading font-bold text-white text-sm">{p.title}</h3>
              <p className="text-gray-500 text-xs leading-relaxed">{p.desc}</p>
              <span className="text-[10px] font-bold text-[#FF6B35] uppercase tracking-widest border border-[#FF6B35]/30 px-3 py-1 rounded-full">
                GRATIS
              </span>
            </div>
          ))}
        </div>
      </section>

      {/* ══════════════════════════════════════════════════
          BANNER BÚSQUEDA
      ══════════════════════════════════════════════════ */}
      <section
        className="relative py-28 px-4 overflow-hidden"
        style={{ backgroundImage: "url('https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=1920&q=80')", backgroundSize: 'cover', backgroundPosition: 'center 40%' }}
      >
        <div className="absolute inset-0 bg-black/78" />

        {/* Speed lines en este banner también */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {SPEED_LINES.slice(0, 5).map((l, i) => (
            <div key={i} className="speed-line" style={{ top: l.top, width: l.width, animationDuration: l.dur, animationDelay: l.delay }} />
          ))}
          <div className="racing-stripe" style={{ right: '12%' }} />
          <div className="racing-stripe racing-stripe-2" style={{ right: 'calc(12% + 22px)' }} />
        </div>

        <div className="relative z-10 max-w-2xl mx-auto text-center">
          <h2 className="font-heading text-3xl sm:text-5xl font-extrabold text-white mb-4">
            ¿Ya sabes tu medida?
          </h2>
          <p className="text-gray-400 mb-10">Búscala ahora y apártala en menos de 2 minutos.</p>
          <SearchBar variant="dark" />
        </div>
      </section>

      {/* ══════════════════════════════════════════════════
          VISÍTANOS
      ══════════════════════════════════════════════════ */}
      <section className="py-24 max-w-6xl mx-auto px-4">
        <div className="mb-16">
          <p className="text-[#FF6B35] text-xs font-bold uppercase tracking-[0.25em] mb-3">Encuéntranos</p>
          <h2 className="font-heading text-3xl sm:text-4xl font-extrabold text-white">Visítanos en CDMX</h2>
          <span className="accent-line mt-4" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

          {/* Tienda principal */}
          <div className="bg-[#111] border border-[#1f1f1f] card-dark rounded-2xl p-7 space-y-5">
            <div className="flex items-center gap-3">
              <span className="text-3xl">🏪</span>
              <div>
                <p className="font-heading font-bold text-white text-lg">Tienda Principal</p>
                <p className="text-xs text-[#FF6B35] uppercase tracking-wider">Llantas · Instalación</p>
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <span className="text-gray-500 mt-0.5">📍</span>
                <div>
                  <p className="text-sm font-semibold text-gray-200">Huehuetan 286 esq. Tekal</p>
                  <p className="text-sm text-gray-400">Héroes de Padierna, CP 14200, CDMX</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <span className="text-gray-500 mt-0.5">🕘</span>
                <div>
                  <p className="text-sm text-gray-300"><span className="font-semibold text-white">Lun–Sáb</span> 9:00am – 6:00pm</p>
                  <p className="text-sm text-gray-400">Recogidas con cita: Lun–Vie hasta 9:00pm</p>
                  <p className="text-sm text-gray-500">Domingo cerrado</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <span className="text-gray-500 mt-0.5">📞</span>
                <p className="text-sm text-gray-300">
                  <a href="tel:5570601568" className="hover:text-white transition-colors">55 7060 1568</a>
                </p>
              </div>
            </div>

            {/* Rating */}
            <div className="flex items-center gap-2 bg-[#1a1a1a] border border-[#2a2a2a] rounded-xl px-4 py-3">
              <span className="text-yellow-400 tracking-tight">★★★★★</span>
              <span className="font-bold text-white text-sm">4.6</span>
              <span className="text-gray-500 text-xs">· 983 reseñas en Google</span>
            </div>

            <a
              href="https://maps.app.goo.gl/Spvq6o1iNMJQrKLH6"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 w-full border border-[#FF6B35]/40 text-[#FF6B35] hover:bg-[#FF6B35]/10 py-3 rounded-xl font-semibold text-sm transition-colors"
            >
              🗺️ Ver en Google Maps
            </a>
          </div>

          {/* Taller */}
          <div className="bg-[#111] border border-[#1f1f1f] card-dark rounded-2xl p-7 space-y-5">
            <div className="flex items-center gap-3">
              <span className="text-3xl">🔧</span>
              <div>
                <p className="font-heading font-bold text-white text-lg">Taller Mecánico</p>
                <p className="text-xs text-[#FF6B35] uppercase tracking-wider">Alineación · Suspensión</p>
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <span className="text-gray-500 mt-0.5">📍</span>
                <div>
                  <p className="text-sm font-semibold text-gray-200">Tekal 85</p>
                  <p className="text-sm text-gray-400">Tlalpan, CDMX</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <span className="text-gray-500 mt-0.5">🕘</span>
                <div>
                  <p className="text-sm text-gray-300"><span className="font-semibold text-white">Lun–Sáb</span> 9:00am – 6:00pm</p>
                  <p className="text-sm text-gray-400">Sin cita — llega directo</p>
                </div>
              </div>
            </div>

            {/* Servicios taller */}
            <div className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-xl p-4">
              <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">Servicios</p>
              <div className="grid grid-cols-2 gap-2">
                {[
                  { s: 'Alineación 4 planos', price: '$1,000' },
                  { s: 'Balanceo', price: 'GRATIS*' },
                  { s: 'Rótulas y bieletas', price: 'En taller' },
                  { s: 'Amortiguadores', price: 'En taller' },
                  { s: 'Terminales', price: 'En taller' },
                  { s: 'Rines', price: 'Ver en tienda' },
                ].map(item => (
                  <div key={item.s} className="flex flex-col">
                    <span className="text-xs text-gray-300">{item.s}</span>
                    <span className={`text-[10px] font-bold ${item.price.includes('GRATIS') ? 'text-[#FF6B35]' : 'text-gray-500'}`}>{item.price}</span>
                  </div>
                ))}
              </div>
              <p className="text-[10px] text-gray-600 mt-3">* Balanceo gratis con compra de llantas</p>
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════
          CTA WHATSAPP
      ══════════════════════════════════════════════════ */}
      <section className="bg-[#111] border-t border-[#1f1f1f] py-20 px-4 text-center">
        <div className="max-w-lg mx-auto">
          <Image src="/logo.svg" alt="ShopTire" width={68} height={68} className="mx-auto mb-6 rounded-full bg-white p-1.5 shadow-[0_0_32px_rgba(255,107,53,0.3)]" />
          <p className="text-[#FF6B35] font-bold text-xs uppercase tracking-[0.25em] mb-3">Atención personalizada</p>
          <h2 className="font-heading text-2xl sm:text-3xl font-extrabold text-white mb-3">
            ¿Prefieres hablar con Yoko?
          </h2>
          <p className="text-gray-400 mb-10 text-sm leading-relaxed max-w-sm mx-auto">
            Nuestra asesora con IA te ayuda a encontrar la llanta exacta para tu auto. Todos los días.
          </p>
          <a
            href="https://wa.me/5215512899120"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-3 bg-[#25D366] hover:bg-[#1ebe5d] text-white font-bold px-8 py-4 rounded-2xl transition-colors shadow-lg shadow-green-900/30 text-lg fab-pulse"
          >
            {WA_SVG}
            Hablar con Yoko
          </a>
        </div>
      </section>

    </main>
  );
}
