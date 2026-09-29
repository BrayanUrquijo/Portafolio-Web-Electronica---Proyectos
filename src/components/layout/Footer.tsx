export function Footer() {
  return (
    <footer className="border-t border-surface-border py-8 mt-16">
      <div className="max-w-6xl mx-auto px-4 text-center">
        <p className="text-text-muted text-sm">
          &copy; {new Date().getFullYear()} — Portafolio de Tecnología en Electrónica Industrial.
        </p>
        <p className="text-text-muted text-xs mt-1">
          Construido con Next.js &middot; Desplegado en Vercel
        </p>
      </div>
    </footer>
  );
}
