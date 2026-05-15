export default function Loading() {
  return (
    <main className="max-w-5xl mx-auto px-4 py-6">
      <div className="h-12 bg-gray-100 rounded-xl animate-pulse mb-6 max-w-xl" />
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {Array.from({ length: 9 }).map((_, i) => (
          <div key={i} className="bg-gray-100 rounded-xl h-40 animate-pulse" />
        ))}
      </div>
    </main>
  );
}