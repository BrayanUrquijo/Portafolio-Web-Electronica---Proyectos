"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

export function SplashScreen({ children }: { children: React.ReactNode }) {
  const [showSplash, setShowSplash] = useState(true);
  const [animationPhase, setAnimationPhase] = useState(0);

  useEffect(() => {
    const seen = sessionStorage.getItem("splash-seen");
    if (seen) {
      setShowSplash(false);
      return;
    }

    const timers = [
      setTimeout(() => setAnimationPhase(1), 300),
      setTimeout(() => setAnimationPhase(2), 1200),
      setTimeout(() => setAnimationPhase(3), 2400),
      setTimeout(() => {
        setShowSplash(false);
        sessionStorage.setItem("splash-seen", "1");
      }, 3200),
    ];

    return () => timers.forEach(clearTimeout);
  }, []);

  return (
    <>
      <AnimatePresence>
        {showSplash && (
          <motion.div
            exit={{ opacity: 0, y: -50 }}
            transition={{ duration: 0.6, ease: "easeInOut" }}
            className="fixed inset-0 z-[100] flex flex-col items-center justify-center
                       bg-surface-primary overflow-hidden"
          >
            <div className="absolute inset-0 overflow-hidden">
              <div className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full
                              bg-neon-cyan/5 blur-[100px]" />
              <div className="absolute bottom-1/4 right-1/4 w-96 h-96 rounded-full
                              bg-neon-magenta/5 blur-[100px]" />
            </div>

            <div className="relative z-10 text-center space-y-4">
              {animationPhase >= 0 && (
                <motion.div
                  initial={{ scaleX: 0 }}
                  animate={{ scaleX: 1 }}
                  transition={{ duration: 0.8, ease: "easeOut" }}
                  className="w-20 h-0.5 mx-auto bg-gradient-to-r from-neon-cyan to-neon-magenta rounded-full"
                />
              )}

              {animationPhase >= 1 && (
                <motion.h1
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6 }}
                  className="font-display text-4xl md:text-6xl font-bold text-neon-cyan text-glow-cyan"
                >
                  PORTAFOLIO
                </motion.h1>
              )}

              {animationPhase >= 2 && (
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.5 }}
                  className="text-text-secondary text-lg tracking-wider"
                >
                  Tecnologia En Electrónica Industrial
                </motion.p>
              )}

              {animationPhase >= 3 && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: [0, 1, 0.7, 1] }}
                  transition={{ duration: 0.4 }}
                  className="flex justify-center gap-1 mt-6"
                >
                  {[0, 1, 2].map((i) => (
                    <motion.span
                      key={i}
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ delay: i * 0.1 }}
                      className="w-1.5 h-1.5 rounded-full bg-neon-cyan"
                    />
                  ))}
                </motion.div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.div
        initial={false}
        animate={{ opacity: showSplash ? 0 : 1 }}
        transition={{ duration: 0.3 }}
      >
        {children}
      </motion.div>
    </>
  );
}
