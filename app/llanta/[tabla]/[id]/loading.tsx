export default function Loading() {
  return (
    <main className="max-w-4xl mx-auto px-4 py-6">
      <div className="h-5 w-32 bg-gray-100 rounded animate-pulse mb-6" />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="space-y-4">
          <div className="h-6 w-24 bg-gray-100 rounded animate-pulse" />
          <div className="h-8 w-3/4 bg-gray-100 rounded animate-pulse" />
          <div className="h-28 bg-gray-200 rounded-2xl animate-pulse" />
          <div className="h-8 w-36 bg-gray-100 rounded-full animate-pulse" />
        </div>
        <div className="h-96 bg-gray-100 rounded-2xl animate-pulse" />
      </div>
    </main>
  );
}