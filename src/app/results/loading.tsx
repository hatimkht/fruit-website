export default function Loading() {
  return (
    <div className="container py-20">
      <div className="max-w-xl space-y-3">
        <div className="h-3 w-32 animate-pulse rounded-full bg-paper-200" />
        <div className="h-10 w-2/3 animate-pulse rounded-full bg-paper-200" />
        <div className="h-4 w-3/4 animate-pulse rounded-full bg-paper-200" />
      </div>
      <div className="mt-14 grid grid-cols-1 gap-8">
        {Array.from({ length: 3 }).map((_, i) => (
          <div
            key={i}
            className="h-64 animate-pulse rounded-2xl border border-rule bg-paper-50"
          />
        ))}
      </div>
    </div>
  );
}
