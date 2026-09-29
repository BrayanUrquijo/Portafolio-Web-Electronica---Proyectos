# Portafolio Web - Tecnología En Electrónica Industrial

Portafolio web personal para estudiantes de Tecnología En Electrónica Industrial. Permite publicar proyectos, prácticas y evidencias académicas con imágenes, videos y texto.

## Stack

- **Next.js 15** (App Router) + TypeScript
- **Tailwind CSS v4** — Tema Cyberpunk/Neón
- **Framer Motion** — Animaciones
- **Cloudinary** — Almacenamiento de imágenes y videos
- **Vercel Blob** — Almacenamiento de datos (producción)
- **Vercel** — Deploy

## Setup Local

```bash
# Instalar dependencias
npm install

# Copiar variables de entorno
cp .env.example .env.local

# Editar .env.local con tus credenciales
# ADMIN_PASSWORD=tu-contraseña-secreta
# JWT_SECRET=una-cadena-aleatoria-de-64-caracteres

# Iniciar servidor de desarrollo
npm run dev
```

Abre [http://localhost:3000](http://localhost:3000).

## Configurar Cloudinary (opcional)

1. Crea una cuenta en [cloudinary.com](https://cloudinary.com)
2. En Settings → Upload, crea un **Unsigned Upload Preset**
3. Agrega a `.env.local`:
   ```
   NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=tu-cloud-name
   NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET=tu-preset
   ```

## Panel de Administración

- Accede via `/admin` o haciendo click 5 veces en el logo
- La contraseña está en tu archivo `.env.local` (`ADMIN_PASSWORD`)
- Desde el admin puedes: crear/editar/eliminar publicaciones, editar tu perfil y gestionar metas

## Deploy en Vercel

1. Sube el repositorio a GitHub
2. Importa el proyecto en [vercel.com](https://vercel.com)
3. Configura las variables de entorno en Vercel:
   - `ADMIN_PASSWORD`
   - `JWT_SECRET`
   - `NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME`
   - `NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET`
4. Crea un **Blob Store** en tu proyecto de Vercel (Storage → Create → Blob)
   - Esto genera automáticamente `BLOB_READ_WRITE_TOKEN`
5. Deploy automático al hacer push

## Estructura

```
src/
├── app/           # Páginas y API routes
├── components/    # Componentes React
├── lib/           # Lógica de negocio (datos, auth, utils)
└── hooks/         # Custom hooks
data/              # Datos JSON para desarrollo local
```
