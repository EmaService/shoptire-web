export default function ErrorPagoPage({ params }: { params: { id: string } }) {
  return (
    <main className="min-h-screen flex items-center justify-center px-4">
      <div className="text-center max-w-md">
        <div className="text-6xl mb-4">❌</div>
        <h1 className="text-2xl font-bold text-gray-900">El pago no fue completado</h1>
        <p className="mt-3 text-gray-600">
          El pago del pedido #{params.id} no se procesó. Puedes intentarlo de nuevo o contactarnos.
        </p>
        <div className="flex gap-3 justify-center mt-6">
          <a href="/" className="bg-gray-100 text-gray-700 px-5 py-3 rounded-xl font-medium hover:bg-gray-200 transition-colors">
            Volver al catálogo
          </a>
          <a href="https://wa.me/5215512899120" target="_blank" rel="noopener noreferrer"
            className="bg-green-600 text-white px-5 py-3 rounded-xl font-medium hover:bg-green-700 transition-colors">
            WhatsApp
          </a>
        </div>
      </div>
    </main>
  );
}