export interface PostMedia {
  type: "image" | "video";
  url: string;
  publicId: string;
  alt?: string;
  width?: number;
  height?: number;
}

export type PostCategory =
  | "proyecto"
  | "practica"
  | "investigacion"
  | "tutorial"
  | "nota"
  | "otro";

export const POST_CATEGORIES: { value: PostCategory; label: string }[] = [
  { value: "proyecto", label: "Proyecto" },
  { value: "practica", label: "Práctica" },
  { value: "investigacion", label: "Investigación" },
  { value: "tutorial", label: "Tutorial" },
  { value: "nota", label: "Nota" },
  { value: "otro", label: "Otro" },
];

export interface Post {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  category: PostCategory;
  semester: number;
  media: PostMedia[];
  coverImage?: PostMedia;
  tags: string[];
  createdAt: string;
  updatedAt: string;
  published: boolean;
}

export type GoalStatus = "pendiente" | "en-progreso" | "completada";

export interface Goal {
  id: string;
  title: string;
  description: string;
  status: GoalStatus;
  progress: number;
  targetDate?: string;
  completedAt?: string;
  order: number;
}

export interface SocialLinks {
  github?: string;
  linkedin?: string;
  email?: string;
  twitter?: string;
  website?: string;
}

export interface Career {
  name: string;
  semester: number;
}

export interface Profile {
  name: string;
  photoUrl: string;
  photoPublicId: string;
  bio: string;
  careers: Career[];
  university: string;
  socialLinks: SocialLinks;
  goals: Goal[];
  updatedAt: string;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}
