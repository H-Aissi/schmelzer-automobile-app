// SCR-003
export default function FahrzeugDetailLoading() {
  return (
    <div className="mx-auto max-w-content px-4 py-10 md:px-8">
      <div className="mb-6 h-4 w-40 animate-pulse rounded bg-gray-200" />
      <div className="grid grid-cols-1 gap-10 lg:grid-cols-2">
        {/* Galerie Skeleton */}
        <div>
          <div className="aspect-[16/9] animate-pulse rounded-[16px] bg-gray-200" />
          <div className="mt-3 flex gap-2">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-12 w-16 animate-pulse rounded-[6px] bg-gray-200" />
            ))}
          </div>
        </div>

        {/* Details Skeleton */}
        <div className="flex flex-col gap-4">
          <div className="h-6 w-20 animate-pulse rounded-full bg-gray-200" />
          <div className="h-10 w-3/4 animate-pulse rounded bg-gray-200" />
          <div className="h-12 w-1/3 animate-pulse rounded bg-gray-200" />
          <div className="h-px bg-gray-200" />
          <div className="grid grid-cols-2 gap-4">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i}>
                <div className="mb-1 h-3 w-20 animate-pulse rounded bg-gray-200" />
                <div className="h-5 w-28 animate-pulse rounded bg-gray-200" />
              </div>
            ))}
          </div>
          <div className="h-px bg-gray-200" />
          <div className="space-y-2">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-4 animate-pulse rounded bg-gray-200" />
            ))}
          </div>
          <div className="h-14 animate-pulse rounded-[10px] bg-gray-200" />
        </div>
      </div>
    </div>
  );
}
