import type { Metadata } from 'next';
import { Montserrat, Inter, Roboto_Mono } from 'next/font/google';
import { Analytics } from '@vercel/analytics/react';
import Image from 'next/image';
import './globals.css';

const montserrat = Montserrat({
  subsets: ['latin'],
  weight: ['700', '800'],
  variable: '--font-montserrat',
  display: 'swap',
});

const inter = Inter({
  subsets: ['latin'],
  weight: ['400', '500', '600'],
  variable: '--font-inter',
  display: 'swap',
});

const robotoMono = Roboto_Mono({
  subsets: ['latin'],
  weight: ['400', '500'],
  variable: '--font-roboto-mono',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'ShopTire Ajusco — Llantas en CDMX',
  description: 'Encuentra llantas de todas las medidas. Entrega rápida en CDMX. ShopTire Ajusco.',
  keywords: 'llantas, CDMX, ajusco, neumáticos, llantería, llantas baratas CDMX',
  icons: {
    icon: '/logo.svg',
    shortcut: '/logo.svg',
    apple: '/logo.svg',
  },
  openGraph: {
    title: 'ShopTire Ajusco — Llantas en CDMX',
    description: 'Busca tu medida y cotiza al instante.',
    locale: 'es_MX',
    type: 'website',
  },
};

const WA_ICON = (
  <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24" fill="currentColor">
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
  </svg>
);

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es" className={`${montserrat.variable} ${inter.variable} ${robotoMono.variable}`}>
      <body className="font-body bg-[#0A0A0A] text-white">

        {/* ── Header ── */}
        <header className="bg-[#0A0A0A]/95 backdrop-blur-sm border-b border-[#1f1f1f] text-white sticky top-0 z-50">
          <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
            <a href="/" className="flex items-center gap-3.5">
              <Image
                src="/logo.svg"
                alt="ShopTire Ajusco"
                width={52}
                height={52}
                className="rounded-full bg-white p-0.5 shadow-[0_0_14px_rgba(255,107,53,0.3)]"
                priority
              />
              <div>
                <p className="font-heading text-xl font-extrabold leading-none tracking-tight">
                  ShopTire <span className="text-[#FF6B35]">Ajusco</span>
                </p>
                <p className="text-[11px] text-gray-500 leading-none mt-1 uppercase tracking-widest">Llantas · CDMX</p>
              </div>
            </a>

            <nav className="flex items-center gap-4">
              <a href="/catalogo" className="text-sm text-gray-400 hover:text-white hidden sm:block transition-colors font-medium">
                Catálogo
              </a>
              <a
                href="https://wa.me/5215512899120"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 bg-[#25D366] hover:bg-[#1ebe5d] text-white text-sm font-bold px-4 py-2 rounded-full transition-colors"
              >
                {WA_ICON}
                <span className="hidden sm:inline">WhatsApp</span>
              </a>
            </nav>
          </div>
        </header>

        {/* ── Content ── */}
        {children}

        {/* ── Footer ── */}
        <footer className="bg-[#0d0d0d] border-t border-[#1f1f1f]">
          <div className="max-w-7xl mx-auto px-4 py-12">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 mb-10">

              {/* Brand */}
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <Image src="/logo.svg" alt="ShopTire" width={44} height={44} className="rounded-full bg-white p-0.5" />
                  <div>
                    <p className="font-heading font-bold text-white">ShopTire <span className="text-[#FF6B35]">Ajusco</span></p>
                    <p className="text-[10px] text-gray-600 uppercase tracking-widest mt-0.5">Llantas · CDMX</p>
                  </div>
                </div>
                <p className="text-xs text-gray-500 leading-relaxed">
                  Más de 10 años vendiendo llantas en CDMX. Precio directo de llantera, instalación incluida.
                </p>
              </div>

              {/* Tienda */}
              <div className="space-y-3">
                <p className="text-xs font-bold text-[#FF6B35] uppercase tracking-widest">Tienda Principal</p>
                <div className="space-y-2 text-xs text-gray-400">
                  <p>📍 Huehuetan 286 esq. Tekal<br /><span className="text-gray-500">Héroes de Padierna, CP 14200</span></p>
                  <p>🕘 Lun–Sáb 9:00am – 6:00pm</p>
                  <p className="text-gray-500">Recogidas: Lun–Vie hasta 9pm (cita)</p>
                  <p>📞 <a href="tel:5570601568" className="hover:text-white transition-colors">55 7060 1568</a></p>
                  <a href="https://maps.app.goo.gl/Spvq6o1iNMJQrKLH6" target="_blank" rel="noopener noreferrer"
                    className="inline-block text-[#FF6B35] hover:underline">
                    Ver en Maps →
                  </a>
                </div>
              </div>

              {/* Taller */}
              <div className="space-y-3">
                <p className="text-xs font-bold text-[#FF6B35] uppercase tracking-widest">Taller Mecánico</p>
                <div className="space-y-2 text-xs text-gray-400">
                  <p>📍 Tekal 85, Tlalpan, CDMX</p>
                  <p>🕘 Lun–Sáb 9:00am – 6:00pm</p>
                  <p className="text-gray-500">Sin cita — llega directo</p>
                  <div className="space-y-1 pt-1 text-gray-500">
                    <p>• Alineación 4 planos <span className="text-white">$1,000</span></p>
                    <p>• Balanceo, rótulas, bieletas</p>
                    <p>• Amortiguadores, terminales</p>
                  </div>
                </div>
              </div>

              {/* Contacto */}
              <div className="space-y-3">
                <p className="text-xs font-bold text-[#FF6B35] uppercase tracking-widest">Contacto</p>
                <div className="space-y-3">
                  <a
                    href="https://wa.me/5215512899120"
                    target="_blank" rel="noopener noreferrer"
                    className="flex items-center gap-2 text-xs text-[#25D366] hover:underline"
                  >
                    <svg className="w-3.5 h-3.5 shrink-0" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                    </svg>
                    WhatsApp con Yoko (IA)
                  </a>
                  <a href="tel:5570601568" className="flex items-center gap-2 text-xs text-gray-400 hover:text-white transition-colors">
                    📞 55 7060 1568
                  </a>
                  <a href="/catalogo" className="flex items-center gap-2 text-xs text-gray-400 hover:text-white transition-colors">
                    🔍 Ver catálogo
                  </a>
                </div>
              </div>
            </div>

            {/* Bottom */}
            <div className="border-t border-[#1f1f1f] pt-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-[11px] text-gray-600">
              <p>© {new Date().getFullYear()} ShopTire Ajusco. Todos los derechos reservados.</p>
              <p>Héroes de Padierna · Tlalpan · CDMX</p>
            </div>
          </div>
        </footer>

        {/* ── FAB WhatsApp ── */}
        <a
          href="https://wa.me/5215512899120"
          target="_blank"
          rel="noopener noreferrer"
          className="fixed bottom-6 right-6 z-50 bg-[#25D366] text-white rounded-full shadow-2xl flex items-center gap-2 pl-3 pr-4 py-3 font-medium text-sm hover:bg-[#1ebe5d] transition-colors fab-pulse"
          aria-label="Habla con nosotros por WhatsApp"
        >
          {WA_ICON}
          <span className="hidden sm:inline">Hablar con Yoko</span>
        </a>

        <Analytics />
      </body>
    </html>
  );
}
