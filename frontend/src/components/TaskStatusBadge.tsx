import type { TaskStatus } from '../types';

interface Props {
  status: TaskStatus;
  size?: 'sm' | 'md';
}

const config: Record<TaskStatus, { label: string; className: string }> = {
  pending: {
    label: 'Pending',
    className: 'bg-amber-50 text-amber-700 border border-amber-200',
  },
  'in-progress': {
    label: 'In Progress',
    className: 'bg-blue-50 text-blue-700 border border-blue-200',
  },
  completed: {
    label: 'Completed',
    className: 'bg-emerald-50 text-emerald-700 border border-emerald-200',
  },
};

export default function TaskStatusBadge({ status, size = 'md' }: Props) {
  const { label, className } = config[status];
  const sizeClass = size === 'sm' ? 'text-xs px-1.5 py-0.5' : 'text-xs px-2 py-1';
  return (
    <span className={`inline-flex items-center rounded-full font-medium font-mono ${sizeClass} ${className}`}>
      {label}
    </span>
  );
}
