"use client";

import { motion } from "framer-motion";
import { GoalCard } from "./GoalCard";
import type { Goal } from "@/lib/data/types";

export function GoalsList({ goals }: { goals: Goal[] }) {
  const inProgress = goals.filter((g) => g.status === "en-progreso").sort((a, b) => a.order - b.order);
  const pending = goals.filter((g) => g.status === "pendiente").sort((a, b) => a.order - b.order);
  const completed = goals.filter((g) => g.status === "completada").sort((a, b) => a.order - b.order);

  if (goals.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-text-muted">No hay metas registradas aún</p>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-8"
    >
      {inProgress.length > 0 && (
        <section>
          <h3 className="font-display text-lg font-bold text-neon-cyan mb-4 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-neon-cyan animate-pulse" />
            En Progreso
          </h3>
          <div className="grid gap-3 sm:grid-cols-2">
            {inProgress.map((goal) => (
              <GoalCard key={goal.id} goal={goal} />
            ))}
          </div>
        </section>
      )}

      {pending.length > 0 && (
        <section>
          <h3 className="font-display text-lg font-bold text-neon-yellow mb-4 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-neon-yellow" />
            Pendientes
          </h3>
          <div className="grid gap-3 sm:grid-cols-2">
            {pending.map((goal) => (
              <GoalCard key={goal.id} goal={goal} />
            ))}
          </div>
        </section>
      )}

      {completed.length > 0 && (
        <section>
          <h3 className="font-display text-lg font-bold text-neon-green mb-4 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-neon-green" />
            Completadas
          </h3>
          <div className="grid gap-3 sm:grid-cols-2">
            {completed.map((goal) => (
              <GoalCard key={goal.id} goal={goal} />
            ))}
          </div>
        </section>
      )}
    </motion.div>
  );
}
