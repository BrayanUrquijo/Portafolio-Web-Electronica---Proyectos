"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Modal } from "@/components/ui/Modal";

export default function AdminLoginPage() {
  const router = useRouter();
  const [mode, setMode] = useState<"loading" | "setup" | "login">("loading");

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showForgot, setShowForgot] = useState(false);

  useEffect(() => {
    fetch("/api/auth/status")
      .then((r) => r.json())
      .then((data) => setMode(data.setupComplete ? "login" : "setup"))
      .catch(() => setMode("login"));
  }, []);

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });

      if (res.ok) {
        router.push("/admin/posts");
      } else {
        const data = await res.json();
        setError(data.error || "Contraseña incorrecta");
      }
    } catch {
      setError("Error de conexión");
    } finally {
      setLoading(false);
    }
  }

  async function handleSetup(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    if (password.length < 4) {
      setError("Mínimo 4 caracteres");
      return;
    }
    if (password !== confirmPassword) {
      setError("Las contraseñas no coinciden");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("/api/auth/setup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password, confirmPassword }),
      });

      if (res.ok) {
        router.push("/admin/posts");
      } else {
        const data = await res.json();
        setError(data.error || "Error al configurar");
      }
    } catch {
      setError("Error de conexión");
    } finally {
      setLoading(false);
    }
  }

  if (mode === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center px-4 -mt-16">
        <div className="w-full max-w-sm space-y-4">
          <div className="h-8 w-32 mx-auto rounded bg-surface-card animate-pulse" />
          <div className="h-4 w-48 mx-auto rounded bg-surface-card animate-pulse" />
          <div className="h-10 rounded bg-surface-card animate-pulse" />
          <div className="h-10 rounded bg-surface-card animate-pulse" />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4 -mt-16">
      <div className="w-full max-w-sm space-y-8">
        <div className="text-center">
          <h1 className="font-display text-2xl font-bold text-neon-cyan text-glow-cyan">
            {mode === "setup" ? "BIENVENIDO" : "ADMIN"}
          </h1>
          <p className="text-text-muted text-sm mt-2">
            {mode === "setup"
              ? "Configura tu contraseña de administrador"
              : "Panel de administración"}
          </p>
        </div>

        {mode === "setup" ? (
          <form onSubmit={handleSetup} className="space-y-4">
            <Input
              id="password"
              type="password"
              label="Nueva contraseña"
              placeholder="Mínimo 4 caracteres"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoFocus
            />
            <Input
              id="confirmPassword"
              type="password"
              label="Confirmar contraseña"
              placeholder="Repite tu contraseña"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
            {error && <p className="text-sm text-red-400">{error}</p>}
            <Button type="submit" isLoading={loading} className="w-full">
              Configurar y entrar
            </Button>
            <Button type="button" variant="ghost" className="w-full" onClick={() => router.push("/")}>
              Volver al inicio
            </Button>
          </form>
        ) : (
          <form onSubmit={handleLogin} className="space-y-4">
            <Input
              id="password"
              type="password"
              label="Contraseña"
              placeholder="Ingresa tu contraseña"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              error={error}
              autoFocus
            />
            <Button type="submit" isLoading={loading} className="w-full">
              Ingresar
            </Button>
            <Button type="button" variant="ghost" className="w-full" onClick={() => router.push("/")}>
              Volver al inicio
            </Button>
            <button
              type="button"
              onClick={() => setShowForgot(true)}
              className="w-full text-center text-xs text-text-muted hover:text-neon-cyan transition-colors"
            >
              ¿Olvidaste tu contraseña?
            </button>
          </form>
        )}
      </div>

      <Modal open={showForgot} onClose={() => setShowForgot(false)} title="Recuperar contraseña">
        <div className="space-y-4 text-sm text-text-secondary">
          <p>Para restablecer tu contraseña, sigue estos pasos:</p>
          <ol className="list-decimal list-inside space-y-2">
            <li>Ingresa a <span className="text-neon-cyan">vercel.com</span> y abre tu proyecto</li>
            <li>Ve a <span className="text-neon-cyan">Settings → Environment Variables</span></li>
            <li>Cambia el valor de <code className="text-neon-cyan bg-surface-elevated px-1 rounded">ADMIN_PASSWORD</code> por una nueva contraseña</li>
            <li>Redespliega el proyecto (un nuevo push o clic en <span className="text-neon-cyan">Redeploy</span>)</li>
            <li>Ingresa con esa contraseña</li>
            <li>Una vez dentro, cambia tu contraseña desde <span className="text-neon-cyan">Perfil</span></li>
          </ol>
          <p className="text-xs text-text-muted border-t border-surface-border pt-3">
            La variable ADMIN_PASSWORD funciona como llave maestra de recuperación.
          </p>
        </div>
      </Modal>
    </div>
  );
}
