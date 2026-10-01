"use client";

import { useState } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { Lightbox } from "@/components/ui/Lightbox";
import type { Profile } from "@/lib/data/types";

export function ProfileHero({ profile }: { profile: Profile }) {
  const [photoOpen, setPhotoOpen] = useState(false);

  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="text-center space-y-6"
    >
      <div className="relative inline-block">
        <div
          className={`w-32 h-32 rounded-full overflow-hidden border-2 border-neon-cyan glow-cyan mx-auto
                      ${profile.photoUrl ? "cursor-pointer hover:border-neon-magenta transition-colors" : ""}`}
          onClick={() => profile.photoUrl && setPhotoOpen(true)}
        >
          {profile.photoUrl ? (
            <Image
              src={profile.photoUrl}
              alt={profile.name}
              width={128}
              height={128}
              className="object-cover w-full h-full"
            />
          ) : (
            <div className="w-full h-full bg-surface-elevated flex items-center justify-center">
              <span className="text-4xl font-display font-bold text-neon-cyan">
                {profile.name.charAt(0).toUpperCase()}
              </span>
            </div>
          )}
        </div>
      </div>

      {profile.photoUrl && (
        <Lightbox
          images={[{ url: profile.photoUrl, alt: profile.name, width: 512, height: 512 }]}
          index={0}
          open={photoOpen}
          onClose={() => setPhotoOpen(false)}
          enableZoom={false}
        />
      )}

      <div>
        <h1 className="font-display text-3xl md:text-4xl font-bold text-text-primary">
          {profile.name}
        </h1>
        <div className="mt-2 space-y-1">
          {profile.careers.map((c, i) => (
            <p key={i} className="text-neon-cyan font-medium text-sm">
              {c.name} <span className="text-text-muted">· Semestre {c.semester}</span>
            </p>
          ))}
        </div>
        <p className="text-text-secondary text-sm mt-1">
          {profile.university}
        </p>
      </div>

      <p className="text-text-secondary max-w-2xl mx-auto leading-relaxed">
        {profile.bio}
      </p>

      {Object.values(profile.socialLinks).some(Boolean) && (
        <div className="flex justify-center gap-4">
          {profile.socialLinks.github && (
            <a
              href={profile.socialLinks.github}
              target="_blank"
              rel="noopener noreferrer"
              className="text-text-muted hover:text-neon-cyan transition-colors"
              aria-label="GitHub"
            >
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
              </svg>
            </a>
          )}
          {profile.socialLinks.linkedin && (
            <a
              href={profile.socialLinks.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              className="text-text-muted hover:text-neon-cyan transition-colors"
              aria-label="LinkedIn"
            >
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
              </svg>
            </a>
          )}
          {profile.socialLinks.email && (
            <a
              href={`mailto:${profile.socialLinks.email}`}
              className="text-text-muted hover:text-neon-cyan transition-colors"
              aria-label="Email"
            >
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            </a>
          )}
        </div>
      )}
    </motion.section>
  );
}
