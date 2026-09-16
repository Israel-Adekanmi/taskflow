import type { FilterStatus } from '../types';

interface Props {
  active: FilterStatus;
  onChange: (f: FilterStatus) => void;
}

const filters: { value: FilterStatus; label: string }[] = [
  { value: 'all', label: 'All' },
  { value: 'pending', label: 'Pending' },
  { value: 'in-progress', label: 'In Progress' },
  { value: 'completed', label: 'Completed' },
  { value: 'overdue', label: 'Overdue' },
];

export default function TaskFilters({ active, onChange }: Props) {
  return (
    <div className="flex items-center gap-1 flex-wrap">
      {filters.map((f) => (
        <button
          key={f.value}
          onClick={() => onChange(f.value)}
          className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
            active === f.value
              ? 'bg-indigo-600 text-white shadow-sm'
              : 'text-slate-600 hover:bg-slate-200 bg-slate-100'
          } ${f.value === 'overdue' && active !== 'overdue' ? 'text-red-500 hover:bg-red-50 bg-red-50' : ''}`}
        >
          {f.label}
        </button>
      ))}
    </div>
  );
}
