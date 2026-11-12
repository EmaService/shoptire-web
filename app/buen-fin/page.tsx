import type { Metadata } from 'next';
import Image from 'next/image';
import fs from 'fs';
import path from 'path';
import BuenFinClient from './BuenFinClient';
import {
  LEYENDA_BUEN_FIN,
  WA_TLALPAN,
  fechaBuenFinActiva,
} from './llantas';

export const dynamic = 'force-dynamic';

const HAS_CAMPAIGN_IMAGE = fs.existsSync(
  path.join(process.cwd(), 'public', 'promos', 'buen-fin.jpg')
);

const TITULO = 'Buen Fin 2026 — Llantas Sunfull y Davanti | ShopTire';
const DESCRIPCION =
  'Buen Fin en ShopTire Tlalpan: 12 llantas Sunfull y Davanti con 15% de regreso para tu próxima compra. Del 13 al 17 de noviembre de 2026.';

export const metadata: Metadata = {
  title: TITULO,
  description: DESCRIPCION,
  openGraph: {
    title: TITULO,
    description: DESCRIPCION,
    locale: 'es_MX',
    type: 'website',
    ...(HAS_CAMPAIGN_IMAGE ? { images: ['/promos/buen-fin.jpg'] } : {}),
  },
};

const WA_LINK = `https://wa.me/${WA_TLALPAN}?text=${encodeURIComponent(
  'Hola, vi el Buen Fin de ShopTire Tlalpan y quiero información.'
)}`;

function BuenFinTerminado() {
  return (
    <main className="min-h-[70vh] bg-[#0A0A0A] flex items-center justify-center px-4 py-20">
      <div className="max-w-md w-full text-center">
        <p className="text-5xl mb-5">🏁</p>
        <h1 className="font-heading text-3xl sm:text-4xl font-extrabold text-white mb-3">
          El Buen Fin terminó
        </h1>
        <p className="text-gray-400 text-sm leading-relaxed mb-8">
          Gracias por participar. Nuestro catálogo completo sigue disponible con instalación,
          balanceo, válvulas y nitrógeno gratis.
        </p>
        <a
          href="/catalogo"
          className="inline-flex items-center justify-center w-full sm:w-auto px-8 py-4 rounded-2xl bg-[#FF6B35] hover:bg-[#ff8055] text-white font-bold transition-colors"
        >
          Ver catálogo de llantas
        </a>
      </div>
    </main>
  );
}

export default function BuenFinPage() {
  if (!fechaBuenFinActiva()) {
    return <BuenFinTerminado />;
  }

  return (
    <main className="min-h-screen bg-[#0A0A0A]">
      <section className="relative overflow-hidden border-b border-[#1f1f1f]">
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              'radial-gradient(circle at 20% 0%, rgba(255,107,53,0.22), transparent 55%), radial-gradient(circle at 90% 20%, rgba(255,107,53,0.12), transparent 45%)',
          }}
        />
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="racing-stripe" style={{ right: '14%' }} />
          <div className="racing-stripe racing-stripe-2" style={{ right: 'calc(14% + 22px)' }} />
        </div>

        <div className="relative z-10 max-w-4xl mx-auto px-4 pt-10 pb-8 text-center">
          <div className="flex items-center justify-center gap-3 mb-5">
            <Image src="/logo.svg" alt="ShopTire" width={48} height={48} priority />
            <div className="text-left">
              <p className="font-heading text-xl font-extrabold text-white leading-none">
                ShopTire <span className="text-[#FF6B35]">Tlalpan</span>
              </p>
              <p className="text-[11px] text-gray-500 uppercase tracking-[0.2em] mt-1">
                Viaducto Tlalpan 78 A
              </p>
            </div>
          </div>

          <span className="inline-flex items-center gap-2 bg-[#FF6B35]/15 border border-[#FF6B35]/40 text-[#FF6B35] text-[11px] font-extrabold uppercase tracking-[0.2em] px-4 py-2 rounded-full mb-5">
            Solo sucursal Tlalpan
          </span>

          <h1 className="font-heading text-5xl sm:text-6xl font-extrabold text-white leading-none mb-3">
            🔥 BUEN FIN
          </h1>
          <p className="font-heading text-xl sm:text-2xl font-extrabold text-[#FF6B35] mb-4">
            13 al 17 de noviembre
          </p>
          <p className="text-gray-300 text-sm sm:text-base max-w-xl mx-auto leading-relaxed">
            <span className="font-bold text-white">15% de regreso</span> en saldo para tu próxima
            compra, en todas las llantas del inventario de Tlalpan.
          </p>
        </div>

        {HAS_CAMPAIGN_IMAGE && (
          <div className="relative z-10 max-w-2xl mx-auto px-4 pb-8">
            <div className="w-full rounded-2xl overflow-hidden shadow-lg">
              <Image
                src="/promos/buen-fin.jpg"
                alt="Campaña Buen Fin ShopTire Tlalpan"
                width={1200}
                height={630}
                className="w-full h-auto"
                priority
              />
            </div>
          </div>
        )}
      </section>

      <div className="pt-2">
        <BuenFinClient />
      </div>

      <section className="border-t border-[#1f1f1f] bg-[#0d0d0d] px-4 py-10">
        <div className="max-w-3xl mx-auto space-y-6">
          <div className="text-center">
            <p className="text-white font-bold text-sm sm:text-base">
              ✅ Instalación · Balanceo · Válvulas · Nitrógeno — gratis
            </p>
            <p className="text-gray-400 text-xs sm:text-sm mt-2">
              Precios válidos del 13 al 17 de noviembre de 2026 o hasta agotar existencias.
            </p>
          </div>

          <p className="text-gray-500 text-[11px] leading-relaxed text-center border-t border-white/5 pt-5">
            {LEYENDA_BUEN_FIN}
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <a
              href={WA_LINK}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 w-full sm:w-auto bg-[#25D366] hover:bg-[#1ebe5c] text-white font-bold text-sm px-6 py-3.5 rounded-xl transition-colors"
            >
              Preguntar por WhatsApp
            </a>
            <a
              href="/catalogo"
              className="flex items-center justify-center w-full sm:w-auto border border-[#2a2a2a] hover:border-[#FF6B35]/60 text-gray-300 hover:text-white font-bold text-sm px-6 py-3.5 rounded-xl transition-colors"
            >
              Ver catálogo completo
            </a>
          </div>

        </div>
      </section>
    </main>
  );
}
