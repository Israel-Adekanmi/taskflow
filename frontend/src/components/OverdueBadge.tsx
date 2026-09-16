export default function OverdueBadge() {
  return (
    <span className="inline-flex items-center gap-1 rounded-full bg-red-50 text-red-600 border border-red-200 text-xs px-2 py-1 font-medium font-mono">
      <span className="w-1.5 h-1.5 rounded-full bg-red-500 inline-block" />
      Overdue
    </span>
  );
}
