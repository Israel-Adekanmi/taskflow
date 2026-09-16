import { useEffect, useState, useCallback } from "react";
import { tasksApi } from "../api";
import type { Task, FilterStatus, AuthState, Screen } from "../types";
import TaskCard from "../components/TaskCard";
import TaskFilters from "../components/TaskFilters";
import LoadingSkeleton from "../components/LoadingSkeleton";
import EmptyState from "../components/EmptyState";
import ErrorState from "../components/ErrorState";
import DeleteTaskDialog from "../components/DeleteTaskDialog";

interface Props {
  auth: AuthState;
  onLogout: () => void;
  onNavigate: (screen: Screen) => void;
}

const filterEmptyMessages: Record<FilterStatus, string> = {
  all: "You haven't created any tasks yet.",
  pending: "No pending tasks.",
  "in-progress": "No tasks in progress.",
  completed: "No completed tasks yet.",
  overdue: "No overdue tasks — you're on track!",
};


export default function DashboardPage({ auth, onLogout, onNavigate }: Props) {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [filter, setFilter] = useState<FilterStatus>("all");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [deleteTarget, setDeleteTarget] = useState<Task | null>(null);
  const [menuOpen, setMenuOpen] = useState(false);

  const fetchTasks = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const response = await tasksApi.list(
        auth.token,
        filter !== "all" ? filter : undefined,
      );

      setTasks(response.data);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to load tasks");
    } finally {
      setLoading(false);
    }
  }, [auth.token, filter]);

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  const taskCount = tasks.length;
  const overdueCount = tasks.filter((t) => t.isOverdue).length;

  const handleComplete = async (taskId: string) => {
  try {
    await tasksApi.update(auth.token, taskId, {
      status: 'completed',
    });

    await fetchTasks();
  } catch (e) {
    setError(
      e instanceof Error ? e.message : 'Failed to complete task',
    );
  }
};

  return (
    <div className="min-h-screen bg-[#f0f2f7]">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-30">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between gap-4">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-indigo-600 flex items-center justify-center flex-shrink-0">
              <svg
                className="w-4 h-4 text-white"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"
                />
              </svg>
            </div>
            <span
              className="font-bold text-slate-900 text-lg tracking-tight"
              style={{ fontFamily: "'Instrument Serif', serif" }}
            >
              TaskFlow
            </span>
          </div>

          {/* User menu */}
          <div className="relative">
            <button
              onClick={() => setMenuOpen((v) => !v)}
              className="flex items-center gap-2 px-3 py-1.5 rounded-lg hover:bg-slate-100 transition-colors text-sm font-medium text-slate-700"
            >
              <div className="w-7 h-7 rounded-full bg-indigo-100 flex items-center justify-center text-xs font-bold text-indigo-700">
                {auth.user.firstName[0]}
                {auth.user.lastName[0]}
              </div>
              <span className="hidden sm:inline">
                {auth.user.firstName} {auth.user.lastName}
              </span>
              <svg
                className="w-4 h-4 text-slate-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </button>
            {menuOpen && (
              <>
                <div
                  className="fixed inset-0 z-10"
                  onClick={() => setMenuOpen(false)}
                />
                <div className="absolute right-0 mt-1 w-48 bg-white rounded-xl border border-slate-200 shadow-lg z-20 py-1 overflow-hidden">
                  <div className="px-3 py-2 border-b border-slate-100">
                    <p className="text-xs font-medium text-slate-900">
                      {auth.user.firstName} {auth.user.lastName}
                    </p>
                    <p className="text-xs text-slate-500 truncate">
                      {auth.user.email}
                    </p>
                  </div>
                  <button
                    onClick={onLogout}
                    className="w-full text-left px-3 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors flex items-center gap-2"
                  >
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                      />
                    </svg>
                    Sign out
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </header>

      {/* Main */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
        {/* Page heading */}
        <div className="flex items-start justify-between gap-4 mb-6 flex-wrap">
          <div>
            <h2 className="text-2xl font-bold text-slate-900">My Tasks</h2>
            {!loading && !error && (
              <p className="text-sm text-slate-500 mt-0.5">
                {taskCount === 0
                  ? "No tasks"
                  : `${taskCount} task${taskCount !== 1 ? "s" : ""}${overdueCount > 0 ? ` · ${overdueCount} overdue` : ""}`}
              </p>
            )}
          </div>
          <button
            onClick={() => onNavigate({ name: "create-task" })}
            className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white text-sm font-semibold rounded-lg hover:bg-indigo-700 transition-colors shadow-sm flex-shrink-0"
          >
            <svg
              className="w-4 h-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 4v16m8-8H4"
              />
            </svg>
            Create Task
          </button>
        </div>

        {/* Filters */}
        <div className="mb-5">
          <TaskFilters
            active={filter}
            onChange={(f) => {
              setFilter(f);
            }}
          />
        </div>

        {/* Content */}
        {loading ? (
          <LoadingSkeleton />
        ) : error ? (
          <ErrorState message={error} onRetry={fetchTasks} />
        ) : tasks.length === 0 ? (
          <EmptyState
            title={
              filter === "all" ? "No tasks yet" : filterEmptyMessages[filter]
            }
            description={
              filter === "all"
                ? "Create your first task to get started."
                : filter === "overdue"
                  ? "Great job keeping up with your deadlines."
                  : "Tasks in this category will appear here."
            }
            action={
              filter === "all"
                ? {
                    label: "Create Task",
                    onClick: () => onNavigate({ name: "create-task" }),
                  }
                : undefined
            }
          />
        ) : (
          <div className="space-y-3">
            {tasks.map((task) => (
              <TaskCard
                key={task._id}
                task={task}
                onComplete={() => handleComplete(task._id)}
                onView={() =>
                  onNavigate({ name: "task-detail", taskId: task._id })
                }
                onEdit={() =>
                  onNavigate({ name: "edit-task", taskId: task._id })
                }
                onDelete={() => setDeleteTarget(task)}
              />
            ))}
          </div>
        )}
      </main>

      {deleteTarget && (
        <DeleteTaskDialog
          task={deleteTarget}
          token={auth.token}
          onDeleted={() => {
            setDeleteTarget(null);
            fetchTasks();
          }}
          onCancel={() => setDeleteTarget(null)}
        />
      )}
    </div>
  );
}
