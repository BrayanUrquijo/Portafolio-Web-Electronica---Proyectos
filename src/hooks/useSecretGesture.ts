"use client";

import { useState, useCallback, useRef } from "react";
import { useRouter } from "next/navigation";

export function useSecretGesture(threshold = 5, timeWindow = 3000) {
  const router = useRouter();
  const [clicks, setClicks] = useState<number[]>([]);
  const singleClickTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const handleClick = useCallback(() => {
    const now = Date.now();
    const recentClicks = [...clicks, now].filter((t) => now - t < timeWindow);
    setClicks(recentClicks);

    if (recentClicks.length >= threshold) {
      setClicks([]);
      if (singleClickTimer.current) clearTimeout(singleClickTimer.current);
      router.push("/admin");
      return;
    }

    if (singleClickTimer.current) clearTimeout(singleClickTimer.current);

    singleClickTimer.current = setTimeout(() => {
      setClicks([]);
      router.push("/");
    }, 400);
  }, [clicks, threshold, timeWindow, router]);

  return handleClick;
}
