import type { Metadata } from 'next';
import Image from 'next/image';
import fs from 'fs';
import path from 'path';
import BuenFinClient from './BuenFinClient';
import { getBuenFin } from './nexus';
import { WA_AJUSCO } from './constantes';
import { linkWhatsApp } from './utils';
import type { Sucursal } from './tipos';

const HAS_CAMPAIGN_IMAGE = fs.existsSync(
  path.join(process.cwd(), 'public', 'promos', 'buen-fin.jpg')
);

const TITULO = 'Buen Fin 2026 — Llantas Sunfull y Davanti | ShopTire';
const DESCRIPCION =
  'Buen Fin 2026 en ShopTire: llantas Sunfull, Davanti y Longtrack en Ajusco y Tlalpan. 15% de regreso en Tlalpan. Del 13 al 17 de noviembre.';

export const metadata: Metadata = {
  metadataBase: new URL('https://shoptire-web.vercel.app'),
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

type PageProps = {
  searchParams?: { sucursal?: string | string[] };
};

function AvisoPromociones() {
  return (
    <main className="min-h-[70vh] bg-[#0A0A0A] flex items-center justify-center px-4 py-20">
      <div className="max-w-md w-full text-center">
        <p className="text-5xl mb-5">🔧</p>
        <h1 className="font-heading text-2xl sm:text-3xl font-extrabold text-white mb-3">
          Estamos actualizando las promociones
        </h1>
        <p className="text-gray-400 text-sm leading-relaxed mb-8">
          Vuelve a intentarlo en unos minutos o escríbenos por WhatsApp y te ayudamos a
          encontrar tu llanta.
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <a
            href={linkWhatsApp(
              WA_AJUSCO,
              'Hola, vi el Buen Fin en la web y quiero información.'
            )}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center w-full sm:w-auto bg-[#25D366] hover:bg-[#1ebe5c] text-white font-bold text-sm px-6 py-3.5 rounded-xl transition-colors"
          >
            Preguntar por WhatsApp
          </a>
          <a
            href="/catalogo"
            className="flex items-center justify-center w-full sm:w-auto border border-[#2a2a2a] hover:border-[#E11D2E]/60 text-gray-300 hover:text-white font-bold text-sm px-6 py-3.5 rounded-xl transition-colors"
          >
            Ver catálogo completo
          </a>
        </div>
      </div>
    </main>
  );
}

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
          className="inline-flex items-center justify-center w-full sm:w-auto px-8 py-4 rounded-2xl bg-[#E11D2E] hover:bg-[#c4162a] text-white font-bold transition-colors"
        >
          Ver catálogo de llantas
        </a>
      </div>
    </main>
  );
}

export default async function BuenFinPage({ searchParams }: PageProps) {
  const estado = await getBuenFin();
  const parametro = Array.isArray(searchParams?.sucursal)
    ? searchParams?.sucursal[0]
    : searchParams?.sucursal;
  const initialSucursal: Sucursal = parametro === 'tlalpan' ? 'tlalpan' : 'ajusco';

  if (!estado.ok) {
    return <AvisoPromociones />;
  }

  if (estado.data.activo === false) {
    return <BuenFinTerminado />;
  }

  return (
    <main className="min-h-screen bg-[#0A0A0A]">
      <section className="relative overflow-hidden border-b border-white/10">
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              'radial-gradient(circle at 15% 0%, rgba(225,29,46,0.32), transparent 55%), radial-gradient(circle at 90% 15%, rgba(255,212,0,0.16), transparent 45%)',
          }}
        />
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="racing-stripe" style={{ right: '12%' }} />
          <div className="racing-stripe racing-stripe-2" style={{ right: 'calc(12% + 22px)' }} />
        </div>

        <div className="relative z-10 max-w-4xl mx-auto px-4 pt-10 pb-8 text-center">
          <div className="flex items-center justify-center gap-3 mb-5">
            <Image src="/logo.svg" alt="ShopTire" width={48} height={48} priority />
            <div className="text-left">
              <p className="font-heading text-xl font-extrabold text-white leading-none">
                ShopTire
              </p>
              <p className="text-[11px] text-gray-500 uppercase tracking-[0.2em] mt-1">
                Llantas · CDMX
              </p>
            </div>
          </div>

          <span className="inline-flex items-center gap-2 bg-[#FFD400] text-black text-[11px] font-extrabold uppercase tracking-[0.2em] px-4 py-2 rounded-full mb-5">
            Del 13 al 17 de noviembre
          </span>

          <h1 className="font-heading text-5xl sm:text-6xl font-extrabold text-white leading-none mb-3">
            🔥 BUEN FIN
          </h1>
          <p className="font-heading text-lg sm:text-xl font-extrabold text-[#FFD400] mb-2">
            Sunfull · Davanti · Longtrack
          </p>
          <p className="text-gray-300 text-sm sm:text-base max-w-xl mx-auto leading-relaxed">
            Elige tu sucursal: precio normal en Ajusco o{' '}
            <span className="font-bold text-white">15% de regreso</span> en Tlalpan.
          </p>
        </div>

        {HAS_CAMPAIGN_IMAGE && (
          <div className="relative z-10 max-w-2xl mx-auto px-4 pb-8">
            <div className="w-full rounded-2xl overflow-hidden shadow-lg">
              <Image
                src="/promos/buen-fin.jpg"
                alt="Campaña Buen Fin ShopTire"
                width={1200}
                height={630}
                className="w-full h-auto"
                priority
              />
            </div>
          </div>
        )}
      </section>

      <BuenFinClient data={estado.data} initialSucursal={initialSucursal} />
    </main>
  );
}
