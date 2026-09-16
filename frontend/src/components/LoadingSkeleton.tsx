export default function LoadingSkeleton() {
  return (
    <div className="space-y-3">
      {[...Array(4)].map((_, i) => (
        <div key={i} className="bg-white rounded-xl border border-slate-200 p-5">
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1 space-y-2.5">
              <div className="skeleton h-4 w-2/3 rounded-md" />
              <div className="skeleton h-3 w-full rounded-md" />
              <div className="skeleton h-3 w-4/5 rounded-md" />
            </div>
            <div className="skeleton h-6 w-16 rounded-full" />
          </div>
          <div className="mt-4 flex items-center gap-4">
            <div className="skeleton h-3 w-24 rounded" />
            <div className="skeleton h-3 w-24 rounded" />
          </div>
        </div>
      ))}
    </div>
  );
}
