// SCR-002
export default function FahrzeugeLoading() {
  return (
    <div className="mx-auto max-w-content px-4 py-10 md:px-8">
      <div className="mb-6 h-10 w-40 animate-pulse rounded-[6px] bg-gray-200" />
      <div className="mb-8 h-20 animate-pulse rounded-[10px] bg-gray-100" />
      <div className="mb-6 h-4 w-32 animate-pulse rounded bg-gray-200" />
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 12 }).map((_, i) => (
          <div
            key={i}
            className="animate-pulse overflow-hidden rounded-[10px] bg-white shadow-[0_1px_3px_rgba(0,0,0,0.08)]"
          >
            <div className="aspect-[16/10] bg-gray-200" />
            <div className="p-4">
              <div className="mb-2 h-4 w-16 rounded bg-gray-200" />
              <div className="mb-2 h-6 w-3/4 rounded bg-gray-200" />
              <div className="mb-4 h-7 w-1/3 rounded bg-gray-200" />
              <div className="flex gap-3 border-t border-gray-100 pt-3">
                <div className="h-4 w-20 rounded bg-gray-200" />
                <div className="h-4 w-12 rounded bg-gray-200" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
