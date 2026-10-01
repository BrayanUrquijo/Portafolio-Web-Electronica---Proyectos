import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Portafolio Electrónica Industrial",
    short_name: "Portafolio",
    description:
      "Portafolio de proyectos, prácticas y evidencias académicas de Tecnología en Electrónica Industrial",
    start_url: "/",
    display: "standalone",
    background_color: "#0a0a0f",
    theme_color: "#00f0ff",
    orientation: "portrait-primary",
    icons: [
      {
        src: "/api/pwa-icon?size=192",
        sizes: "192x192",
        type: "image/png",
      },
      {
        src: "/api/pwa-icon?size=512",
        sizes: "512x512",
        type: "image/png",
      },
    ],
  };
}
