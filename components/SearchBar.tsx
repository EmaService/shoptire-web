'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Search } from 'lucide-react';

interface Props {
  defaultValue?: string;
  autoFocus?: boolean;
}

export default function SearchBar({ defaultValue = '', autoFocus = false }: Props) {
  const [value, setValue] = useState(defaultValue);
  const router = useRouter();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const q = value.trim();
    if (!q) return;
    router.push(`/catalogo?medida=${encodeURIComponent(q)}`);
  };

  return (
    <form onSubmit={handleSubmit} className="flex gap-2 w-full max-w-xl">
      <input
        type="text"
        value={value}
        onChange={e => setValue(e.target.value)}
        autoFocus={autoFocus}
        placeholder="Ej: 205/60 R16"
        className="flex-1 rounded-xl border-2 border-gray-200 px-4 py-3 text-lg focus:border-red-400 focus:outline-none shadow-sm"
      />
      <button
        type="submit"
        className="bg-red-500 hover:bg-red-600 text-white px-5 py-3 rounded-xl font-semibold flex items-center gap-2 shadow-sm transition-colors"
      >
        <Search className="w-5 h-5" />
        <span className="hidden sm:inline">Buscar</span>
      </button>
    </form>
  );
}