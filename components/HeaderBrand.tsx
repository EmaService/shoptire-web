'use client';

import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';

type Sucursal = 'ajusco' | 'tlalpan';

export default function HeaderBrand() {
  const pathname = usePathname();
  const [sucursal, setSucursal] = useState<Sucursal>('ajusco');

  useEffect(() => {
    if (pathname !== '/buen-fin') {
      setSucursal('ajusco');
      return;
    }

    const actual = document.documentElement.dataset.buenFinSucursal;
    if (actual === 'tlalpan' || actual === 'ajusco') setSucursal(actual);

    const alCambiar = (evento: Event) => {
      const detalle = (evento as CustomEvent<Sucursal>).detail;
      if (detalle === 'tlalpan' || detalle === 'ajusco') setSucursal(detalle);
    };

    window.addEventListener('buenfin-sucursal', alCambiar);
    return () => window.removeEventListener('buenfin-sucursal', alCambiar);
  }, [pathname]);

  const nombre = pathname === '/buen-fin' && sucursal === 'tlalpan' ? 'Tlalpan' : 'Ajusco';

  return (
    <a href="/" className="flex items-center gap-3.5">
      <Image
        src="/logo.svg"
        alt="ShopTire"
        width={52}
        height={52}
        className="rounded-full bg-white p-0.5 shadow-[0_0_14px_rgba(255,107,53,0.3)]"
        priority
      />
      <div>
        <p className="font-heading text-xl font-extrabold leading-none tracking-tight">
          ShopTire <span className="text-[#FF6B35]">{nombre}</span>
        </p>
        <p className="text-[11px] text-gray-500 leading-none mt-1 uppercase tracking-widest">
          Llantas · CDMX
        </p>
      </div>
    </a>
  );
}
