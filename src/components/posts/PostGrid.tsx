"use client";

import { motion } from "framer-motion";
import { PostCard } from "./PostCard";
import type { Post, PostAnalytics } from "@/lib/data/types";

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.1 },
  },
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 },
};

export function PostGrid({ posts, analytics }: { posts: Post[]; analytics?: Record<string, PostAnalytics> }) {
  if (posts.length === 0) {
    return (
      <div className="text-center py-20">
        <svg className="w-16 h-16 mx-auto text-surface-border mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1}
            d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
        </svg>
        <p className="text-text-muted text-lg">No hay publicaciones aún</p>
        <p className="text-text-muted text-sm mt-1">Las publicaciones aparecerán aquí</p>
      </div>
    );
  }

  return (
    <motion.div
      variants={container}
      initial="hidden"
      animate="show"
      className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3"
    >
      {posts.map((post) => (
        <motion.div key={post.id} variants={item}>
          <PostCard post={post} analytics={analytics?.[post.id]} />
        </motion.div>
      ))}
    </motion.div>
  );
}
