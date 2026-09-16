import type { Task } from '../types';
import TaskStatusBadge from './TaskStatusBadge';
import OverdueBadge from './OverdueBadge';

interface Props {
  task: Task;
  onView: () => void;
  onEdit: () => void;
  onDelete: () => void;
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

export default function TaskCard({ task, onView, onEdit, onDelete }: Props) {
  const isCompleted = task.status === 'completed';

  return (
    <div
      className={`group bg-white rounded-xl border transition-shadow hover:shadow-md ${
        isCompleted ? 'border-slate-100 opacity-80' : task.isOverdue ? 'border-red-200' : 'border-slate-200'
      }`}
    >
      <div className="p-5">
        <div className="flex items-start gap-3">
          {/* Completion indicator */}
          <div className="mt-0.5 flex-shrink-0">
            {isCompleted ? (
              <div className="w-5 h-5 rounded-full bg-emerald-100 flex items-center justify-center">
                <svg className="w-3 h-3 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                </svg>
              </div>
            ) : (
              <div className={`w-5 h-5 rounded-full border-2 ${task.isOverdue ? 'border-red-300' : 'border-slate-300'}`} />
            )}
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-2 flex-wrap">
              <h3
                className={`text-sm font-semibold leading-snug ${isCompleted ? 'line-through text-slate-400' : 'text-slate-900'}`}
              >
                {task.title}
              </h3>
              <div className="flex items-center gap-1.5 flex-shrink-0 flex-wrap">
                <TaskStatusBadge status={task.status} size="sm" />
                {task.isOverdue && <OverdueBadge />}
              </div>
            </div>

            {task.description && (
              <p className="mt-1 text-xs text-slate-500 line-clamp-2 leading-relaxed">
                {task.description}
              </p>
            )}

            <div className="mt-3 flex items-center gap-4 flex-wrap">
              <span className={`font-mono text-xs flex items-center gap-1 ${task.isOverdue ? 'text-red-500' : 'text-slate-400'}`}>
                <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                    d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                Due {formatDate(task.dueDate)}
              </span>
              <span className="font-mono text-xs text-slate-400 flex items-center gap-1">
                <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                    d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Created {formatDate(task.createdAt)}
              </span>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="mt-4 pt-3.5 border-t border-slate-100 flex items-center justify-end gap-1">
          <button
            onClick={onView}
            className="px-3 py-1.5 text-xs font-medium text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
          >
            View
          </button>
          <button
            onClick={onEdit}
            className="px-3 py-1.5 text-xs font-medium text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
          >
            Edit
          </button>
          <button
            onClick={onDelete}
            className="px-3 py-1.5 text-xs font-medium text-red-500 hover:bg-red-50 rounded-lg transition-colors"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}
