"use client";

import { useCallback, useRef } from "react";
import { useRouter } from "next/navigation";

export function useSecretGesture(threshold = 5, timeWindow = 3000) {
  const router = useRouter();
  const clicksRef = useRef<number[]>([]);
  const singleClickTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const triggered = useRef(false);

  const handleClick = useCallback(() => {
    if (triggered.current) return;

    const now = Date.now();
    clicksRef.current = [...clicksRef.current, now].filter((t) => now - t < timeWindow);

    if (clicksRef.current.length >= threshold) {
      triggered.current = true;
      clicksRef.current = [];
      if (singleClickTimer.current) clearTimeout(singleClickTimer.current);
      router.push("/admin");
      return;
    }

    if (singleClickTimer.current) clearTimeout(singleClickTimer.current);

    singleClickTimer.current = setTimeout(() => {
      clicksRef.current = [];
      if (!triggered.current) router.push("/");
    }, 400);
  }, [threshold, timeWindow, router]);

  return handleClick;
}
