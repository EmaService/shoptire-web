import { MetadataRoute } from 'next';

const BASE = 'https://shoptire-web.vercel.app';
const BACKEND = process.env.BACKEND_URL || 'http://3.236.101.20:3000';

const MEDIDAS_PRIORITARIAS = [
  '175/70 R13', '185/65 R15', '195/65 R15', '205/55 R16',
  '205/60 R16', '205/65 R16', '215/65 R16', '215/60 R16',
  '225/65 R17', '235/65 R17', '265/65 R17', '255/65 R17',
  '195/75 R16', '235/75 R15', '265/70 R16', '265/70 R17',
];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date();

  let medidasDinamicas: string[] = [];
  try {
    const res = await fetch(`${BACKEND}/web/medidas`, { cache: 'no-store' });
    const data = await res.json();
    if (data.ok && Array.isArray(data.medidas)) {
      medidasDinamicas = data.medidas.slice(0, 200);
    }
  } catch {
    medidasDinamicas = MEDIDAS_PRIORITARIAS;
  }

  const todasMedidas = Array.from(new Set([...MEDIDAS_PRIORITARIAS, ...medidasDinamicas]));

  const medidasUrls: MetadataRoute.Sitemap = todasMedidas.map(m => ({
    url: `${BASE}/catalogo?medida=${encodeURIComponent(m)}`,
    lastModified: now,
    changeFrequency: 'daily',
    priority: 0.7,
  }));

  return [
    {
      url: BASE,
      lastModified: now,
      changeFrequency: 'daily',
      priority: 1.0,
    },
    ...medidasUrls,
  ];
}