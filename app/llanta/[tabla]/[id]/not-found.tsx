export default function NotFound() {
  return (
    <main className="min-h-screen flex items-center justify-center px-4">
      <div className="text-center">
        <p className="text-5xl mb-4">🔍</p>
        <h1 className="text-xl font-bold text-gray-900">Llanta no encontrada</h1>
        <p className="text-gray-500 mt-2">Puede que ya no esté disponible o se agotó el stock.</p>
        <a href="/" className="inline-block mt-5 bg-red-500 text-white px-6 py-3 rounded-xl font-medium">
          Buscar otras llantas
        </a>
      </div>
    </main>
  );
}