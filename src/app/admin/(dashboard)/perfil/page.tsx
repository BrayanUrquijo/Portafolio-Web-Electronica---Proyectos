"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";
import { ProgressBar } from "@/components/ui/ProgressBar";
import { AvatarUploader } from "@/components/media/AvatarUploader";
import { v4 as uuid } from "uuid";
import type { Profile, Goal, GoalStatus, Career } from "@/lib/data/types";

export default function AdminProfilePage() {
  const router = useRouter();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    fetch("/api/profile")
      .then((r) => r.json())
      .then((data) => {
        const p = data.data;
        // Migrar formato viejo (career string) al nuevo (careers array)
        if (p && !p.careers) {
          p.careers = [{ name: p.career || "", semester: p.currentSemester || 1 }];
        }
        setProfile(p);
        setLoading(false);
      });
  }, []);

  async function handleSave() {
    if (!profile) return;
    setSaving(true);
    setMessage("");
    try {
      const res = await fetch("/api/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(profile),
      });
      if (res.ok) {
        setMessage("Perfil guardado");
        router.refresh();
      }
    } catch {
      setMessage("Error al guardar");
    } finally {
      setSaving(false);
    }
  }

  function updateField<K extends keyof Profile>(key: K, value: Profile[K]) {
    if (!profile) return;
    setProfile({ ...profile, [key]: value });
  }

  function addCareer() {
    if (!profile) return;
    setProfile({
      ...profile,
      careers: [...profile.careers, { name: "", semester: 1 }],
    });
  }

  function updateCareer(index: number, data: Partial<Career>) {
    if (!profile) return;
    const updated = [...profile.careers];
    updated[index] = { ...updated[index], ...data };
    setProfile({ ...profile, careers: updated });
  }

  function removeCareer(index: number) {
    if (!profile) return;
    setProfile({
      ...profile,
      careers: profile.careers.filter((_, i) => i !== index),
    });
  }

  function addGoal() {
    if (!profile) return;
    const newGoal: Goal = {
      id: uuid(),
      title: "",
      description: "",
      status: "pendiente",
      progress: 0,
      order: profile.goals.length,
    };
    setProfile({ ...profile, goals: [...profile.goals, newGoal] });
  }

  function updateGoal(id: string, data: Partial<Goal>) {
    if (!profile) return;
    setProfile({
      ...profile,
      goals: profile.goals.map((g) => (g.id === id ? { ...g, ...data } : g)),
    });
  }

  function removeGoal(id: string) {
    if (!profile) return;
    setProfile({
      ...profile,
      goals: profile.goals.filter((g) => g.id !== id),
    });
  }

  if (loading) {
    return (
      <div className="space-y-4 max-w-3xl">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="h-12 rounded-lg bg-surface-card animate-pulse" />
        ))}
      </div>
    );
  }

  if (!profile) return null;

  return (
    <div className="max-w-3xl space-y-8">
      <h1 className="font-display text-2xl font-bold text-text-primary">Editar Perfil</h1>

          <section className="space-y-4">
            <h2 className="font-display text-lg font-bold text-text-primary">Información Personal</h2>

            <AvatarUploader
              currentUrl={profile.photoUrl}
              name={profile.name}
              onUpload={(url) => updateField("photoUrl", url)}
            />

            <div className="grid gap-4 sm:grid-cols-2">
              <Input
                id="name"
                label="Nombre"
                value={profile.name}
                onChange={(e) => updateField("name", e.target.value)}
              />
              <Input
                id="university"
                label="Universidad"
                value={profile.university}
                onChange={(e) => updateField("university", e.target.value)}
              />
            </div>

            <Textarea
              id="bio"
              label="Biografía"
              value={profile.bio}
              onChange={(e) => updateField("bio", e.target.value)}
            />
          </section>

          <section className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="font-display text-lg font-bold text-text-primary">Carreras</h2>
              <Button type="button" variant="secondary" onClick={addCareer}>
                + Agregar Carrera
              </Button>
            </div>

            {profile.careers.length === 0 ? (
              <p className="text-text-muted text-sm py-4">No hay carreras. Agrega tu primera carrera.</p>
            ) : (
              <div className="space-y-3">
                {profile.careers.map((career, index) => (
                  <div
                    key={index}
                    className="flex items-end gap-3 p-4 rounded-lg border border-surface-border bg-surface-card"
                  >
                    <div className="flex-1">
                      <Input
                        id={`career-name-${index}`}
                        label={`Carrera ${index + 1}`}
                        placeholder="Nombre de la carrera"
                        value={career.name}
                        onChange={(e) => updateCareer(index, { name: e.target.value })}
                      />
                    </div>
                    <div className="w-32">
                      <Input
                        id={`career-sem-${index}`}
                        label={`Semestre`}
                        type="number"
                        min={1}
                        max={12}
                        value={career.semester}
                        onChange={(e) => updateCareer(index, { semester: parseInt(e.target.value) || 1 })}
                      />
                    </div>
                    {profile.careers.length > 1 && (
                      <Button
                        type="button"
                        variant="danger"
                        onClick={() => removeCareer(index)}
                        className="shrink-0 mb-0.5"
                      >
                        ×
                      </Button>
                    )}
                  </div>
                ))}
              </div>
            )}
          </section>

          <section className="space-y-4">
            <h2 className="font-display text-lg font-bold text-text-primary">Redes Sociales</h2>
            <div className="grid gap-4 sm:grid-cols-2">
              <Input
                id="github"
                label="GitHub"
                placeholder="https://github.com/usuario"
                value={profile.socialLinks.github || ""}
                onChange={(e) => updateField("socialLinks", { ...profile.socialLinks, github: e.target.value })}
              />
              <Input
                id="linkedin"
                label="LinkedIn"
                placeholder="https://linkedin.com/in/usuario"
                value={profile.socialLinks.linkedin || ""}
                onChange={(e) => updateField("socialLinks", { ...profile.socialLinks, linkedin: e.target.value })}
              />
              <Input
                id="email"
                label="Email"
                placeholder="correo@ejemplo.com"
                value={profile.socialLinks.email || ""}
                onChange={(e) => updateField("socialLinks", { ...profile.socialLinks, email: e.target.value })}
              />
              <Input
                id="website"
                label="Sitio Web"
                placeholder="https://miportafolio.com"
                value={profile.socialLinks.website || ""}
                onChange={(e) => updateField("socialLinks", { ...profile.socialLinks, website: e.target.value })}
              />
            </div>
          </section>

          <section className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="font-display text-lg font-bold text-text-primary">Metas</h2>
              <Button type="button" variant="secondary" onClick={addGoal}>
                + Agregar Meta
              </Button>
            </div>

            {profile.goals.length === 0 ? (
              <p className="text-text-muted text-sm py-4">No hay metas. Agrega tu primera meta.</p>
            ) : (
              <div className="space-y-4">
                {profile.goals.map((goal) => (
                  <div key={goal.id} className="p-4 rounded-lg border border-surface-border bg-surface-card space-y-3">
                    <div className="flex items-start gap-3">
                      <div className="flex-1 space-y-3">
                        <Input
                          id={`goal-title-${goal.id}`}
                          placeholder="Título de la meta"
                          value={goal.title}
                          onChange={(e) => updateGoal(goal.id, { title: e.target.value })}
                        />
                        <Input
                          id={`goal-desc-${goal.id}`}
                          placeholder="Descripción"
                          value={goal.description}
                          onChange={(e) => updateGoal(goal.id, { description: e.target.value })}
                        />
                        <div className="flex gap-3 items-end flex-wrap">
                          <div className="space-y-1">
                            <label className="text-xs text-text-muted">Estado</label>
                            <select
                              value={goal.status}
                              onChange={(e) => updateGoal(goal.id, { status: e.target.value as GoalStatus })}
                              className="px-2 py-1.5 rounded-lg text-sm bg-surface-secondary border
                                         border-surface-border text-text-primary"
                            >
                              <option value="pendiente">Pendiente</option>
                              <option value="en-progreso">En Progreso</option>
                              <option value="completada">Completada</option>
                            </select>
                          </div>
                          {goal.status === "en-progreso" && (
                            <div className="flex-1 min-w-[150px] space-y-1">
                              <label className="text-xs text-text-muted">Progreso: {goal.progress}%</label>
                              <input
                                type="range"
                                min={0}
                                max={100}
                                value={goal.progress}
                                onChange={(e) => updateGoal(goal.id, { progress: parseInt(e.target.value) })}
                                className="w-full accent-neon-cyan"
                              />
                              <ProgressBar value={goal.progress} />
                            </div>
                          )}
                          <Input
                            id={`goal-date-${goal.id}`}
                            type="date"
                            value={goal.targetDate?.split("T")[0] || ""}
                            onChange={(e) => updateGoal(goal.id, {
                              targetDate: e.target.value ? new Date(e.target.value).toISOString() : undefined
                            })}
                            className="w-40"
                          />
                        </div>
                      </div>
                      <Button
                        type="button"
                        variant="danger"
                        onClick={() => removeGoal(goal.id)}
                        className="shrink-0"
                      >
                        ×
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>

          {message && (
            <p className={message.includes("Error") ? "text-red-400 text-sm" : "text-neon-green text-sm"}>
              {message}
            </p>
          )}

      <div className="flex gap-3 pb-8">
        <Button onClick={handleSave} isLoading={saving}>
          Guardar Perfil
        </Button>
      </div>
    </div>
  );
}
