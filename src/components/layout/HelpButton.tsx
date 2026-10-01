"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

type Section = null | "about" | "admin";

export function HelpButton() {
  const [open, setOpen] = useState(false);
  const [section, setSection] = useState<Section>(null);

  function close() {
    setOpen(false);
    setSection(null);
  }

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="fixed bottom-6 right-6 z-40 w-11 h-11 rounded-full
                   bg-neon-cyan/15 border border-neon-cyan/30 backdrop-blur-md
                   text-neon-cyan hover:bg-neon-cyan/25 hover:border-neon-cyan/50
                   transition-all duration-300 flex items-center justify-center
                   shadow-lg shadow-neon-cyan/10"
        title="Ayuda"
      >
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M9.879 7.519c1.171-1.025 3.071-1.025 4.242 0 1.172 1.025 1.172 2.687 0 3.712-.203.179-.43.326-.67.442-.745.361-1.45.999-1.45 1.827v.75M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9 5.25h.008v.008H12v-.008z" />
        </svg>
      </button>

      <AnimatePresence>
        {open && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm"
              onClick={close}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="fixed left-1/2 top-1/2 z-50 w-full max-w-lg -translate-x-1/2 -translate-y-1/2
                         rounded-xl border border-surface-border bg-surface-card p-6 shadow-xl
                         max-h-[80vh] overflow-y-auto"
            >
              <div className="flex items-center justify-between mb-5">
                <h2 className="text-lg font-display font-bold text-neon-cyan">
                  {section === "about"
                    ? "¿Qué es esta web?"
                    : section === "admin"
                    ? "¿Cómo administrar?"
                    : "Centro de ayuda"}
                </h2>
                <button onClick={close} className="text-text-muted hover:text-text-primary">
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              {!section ? (
                <div className="space-y-3">
                  <button
                    onClick={() => setSection("about")}
                    className="w-full p-4 rounded-lg border border-surface-border bg-surface-elevated
                               hover:border-neon-cyan/40 transition-colors text-left group"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-neon-cyan/10 flex items-center justify-center shrink-0">
                        <svg className="w-5 h-5 text-neon-cyan" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M12 21a9.004 9.004 0 008.716-6.747M12 21a9.004 9.004 0 01-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0a8.997 8.997 0 017.843 4.582M12 3a8.997 8.997 0 00-7.843 4.582m15.686 0A11.953 11.953 0 0112 10.5c-2.998 0-5.74-1.1-7.843-2.918m15.686 0A8.959 8.959 0 0121 12c0 .778-.099 1.533-.284 2.253m0 0A17.919 17.919 0 0112 16.5c-3.162 0-6.133-.815-8.716-2.247m0 0A9.015 9.015 0 013 12c0-1.605.42-3.113 1.157-4.418" />
                        </svg>
                      </div>
                      <div>
                        <h3 className="font-medium text-text-primary group-hover:text-neon-cyan transition-colors">
                          ¿Qué es esta web?
                        </h3>
                        <p className="text-xs text-text-muted mt-0.5">Propósito, funciones y tecnologías</p>
                      </div>
                    </div>
                  </button>

                  <button
                    onClick={() => setSection("admin")}
                    className="w-full p-4 rounded-lg border border-surface-border bg-surface-elevated
                               hover:border-neon-cyan/40 transition-colors text-left group"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-neon-cyan/10 flex items-center justify-center shrink-0">
                        <svg className="w-5 h-5 text-neon-cyan" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 6h9.75M10.5 6a1.5 1.5 0 11-3 0m3 0a1.5 1.5 0 10-3 0M3.75 6H7.5m3 12h9.75m-9.75 0a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m-3.75 0H7.5m9-6h3.75m-3.75 0a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m-9.75 0h9.75" />
                        </svg>
                      </div>
                      <div>
                        <h3 className="font-medium text-text-primary group-hover:text-neon-cyan transition-colors">
                          ¿Cómo administrar tus publicaciones?
                        </h3>
                        <p className="text-xs text-text-muted mt-0.5">Acceso al panel, crear y gestionar contenido</p>
                      </div>
                    </div>
                  </button>
                </div>
              ) : section === "about" ? (
                <div className="space-y-4 text-sm text-text-secondary">
                  <p>
                    Este es un <span className="text-neon-cyan font-medium">portafolio web académico</span> diseñado
                    para estudiantes de carreras técnicas y tecnológicas. Permite documentar y mostrar
                    tus proyectos, prácticas, investigaciones y notas de forma organizada.
                  </p>
                  <div className="space-y-2">
                    <h4 className="font-medium text-text-primary">¿Qué puedes hacer?</h4>
                    <ul className="list-disc list-inside space-y-1 text-text-muted">
                      <li>Publicar proyectos con imágenes, videos, PDFs y documentos</li>
                      <li>Organizar por categorías y semestres</li>
                      <li>Editar tu perfil, carreras, redes sociales y metas</li>
                      <li>Vista previa antes de publicar</li>
                    </ul>
                  </div>
                  <div className="space-y-2">
                    <h4 className="font-medium text-text-primary">Tecnologías</h4>
                    <p className="text-text-muted">
                      Next.js, Tailwind CSS, Cloudinary (imágenes), Vercel Blob (datos) y Vercel (hosting).
                    </p>
                  </div>
                  <button
                    onClick={() => setSection(null)}
                    className="text-neon-cyan text-xs hover:underline"
                  >
                    ← Volver al menú
                  </button>
                </div>
              ) : (
                <div className="space-y-4 text-sm text-text-secondary">
                  <div className="space-y-2">
                    <h4 className="font-medium text-text-primary">1. Acceder al panel de administración</h4>
                    <p className="text-text-muted">
                      Haz <span className="text-neon-cyan">5 clics rápidos</span> sobre el logo en la esquina
                      superior izquierda. Esto te llevará a la pantalla de inicio de sesión.
                    </p>
                  </div>
                  <div className="space-y-2">
                    <h4 className="font-medium text-text-primary">2. Iniciar sesión</h4>
                    <p className="text-text-muted">
                      La primera vez, configura tu contraseña. Las siguientes veces, ingresa con tu contraseña.
                    </p>
                  </div>
                  <div className="space-y-2">
                    <h4 className="font-medium text-text-primary">3. Crear una publicación</h4>
                    <p className="text-text-muted">
                      En el panel, haz clic en <span className="text-neon-cyan">+ Nueva</span>. Llena el formulario,
                      sube archivos y haz clic en <span className="text-neon-cyan">Guardar y Previsualizar</span>.
                      Desde la vista previa puedes publicar o dejar como borrador.
                    </p>
                  </div>
                  <div className="space-y-2">
                    <h4 className="font-medium text-text-primary">4. Gestionar publicaciones</h4>
                    <p className="text-text-muted">
                      Desde la lista puedes ver la vista previa (icono de ojo), editar o eliminar cada publicación.
                    </p>
                  </div>
                  <div className="space-y-2">
                    <h4 className="font-medium text-text-primary">5. Editar perfil</h4>
                    <p className="text-text-muted">
                      En la barra lateral, accede a <span className="text-neon-cyan">Perfil</span> para cambiar
                      tu información, foto, carreras, redes sociales, metas y contraseña.
                    </p>
                  </div>
                  <button
                    onClick={() => setSection(null)}
                    className="text-neon-cyan text-xs hover:underline"
                  >
                    ← Volver al menú
                  </button>
                </div>
              )}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
