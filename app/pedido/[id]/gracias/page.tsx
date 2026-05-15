export default function GraciasPage({ params }: { params: { id: string } }) {
  return (
    <main className="min-h-screen flex items-center justify-center px-4">
      <div className="text-center max-w-md">
        <div className="text-6xl mb-4">✅</div>
        <h1 className="text-2xl font-bold text-gray-900">¡Pago recibido!</h1>
        <p className="mt-3 text-gray-600">
          Tu pedido <strong>#{params.id}</strong> fue confirmado. En breve recibirás un mensaje de WhatsApp con los detalles.
        </p>
        <a href="/" className="inline-block mt-6 bg-red-500 text-white px-6 py-3 rounded-xl font-medium hover:bg-red-600 transition-colors">
          Seguir comprando
        </a>
      </div>
    </main>
  );
}