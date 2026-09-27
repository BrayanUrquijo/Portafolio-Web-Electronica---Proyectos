import { Badge } from "@/components/ui/Badge";
import { ProgressBar } from "@/components/ui/ProgressBar";
import type { Goal } from "@/lib/data/types";

const statusConfig = {
  pendiente: { label: "Pendiente", variant: "yellow" as const },
  "en-progreso": { label: "En Progreso", variant: "cyan" as const },
  completada: { label: "Completada", variant: "green" as const },
};

export function GoalCard({ goal }: { goal: Goal }) {
  const config = statusConfig[goal.status];

  return (
    <div className="rounded-lg border border-surface-border bg-surface-card p-4 space-y-3">
      <div className="flex items-start justify-between gap-3">
        <h4 className="font-medium text-text-primary">{goal.title}</h4>
        <Badge variant={config.variant}>{config.label}</Badge>
      </div>

      {goal.description && (
        <p className="text-sm text-text-secondary">{goal.description}</p>
      )}

      {goal.status === "en-progreso" && (
        <div className="space-y-1">
          <div className="flex justify-between text-xs text-text-muted">
            <span>Progreso</span>
            <span>{goal.progress}%</span>
          </div>
          <ProgressBar value={goal.progress} />
        </div>
      )}

      {goal.targetDate && (
        <p className="text-xs text-text-muted">
          Meta: {new Date(goal.targetDate).toLocaleDateString("es-ES")}
        </p>
      )}
    </div>
  );
}
