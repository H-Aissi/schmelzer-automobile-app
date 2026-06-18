// SCR-007
export default function AdminFahrzeugeLoading() {
  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <div className="h-9 w-32 animate-pulse rounded bg-gray-200" />
        <div className="h-10 w-44 animate-pulse rounded-[10px] bg-gray-200" />
      </div>
      <div className="overflow-hidden rounded-[10px] bg-white shadow-[0_1px_3px_rgba(0,0,0,0.08)]">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="flex items-center gap-4 border-b border-gray-50 px-4 py-3 last:border-0">
            <div className="h-[60px] w-20 animate-pulse rounded-[6px] bg-gray-200" />
            <div className="flex-1">
              <div className="mb-1 h-4 w-40 animate-pulse rounded bg-gray-200" />
              <div className="h-3 w-12 animate-pulse rounded bg-gray-200" />
            </div>
            <div className="h-4 w-20 animate-pulse rounded bg-gray-200" />
            <div className="h-6 w-16 animate-pulse rounded-full bg-gray-200" />
          </div>
        ))}
      </div>
    </div>
  );
}
