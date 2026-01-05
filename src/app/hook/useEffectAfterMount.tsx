"use client";
import { useEffect, useRef } from "react";

export default function useEffectAfterMount(
  effect: () => void | (() => void),
  deps: any[]
) {
  const firstRun = useRef(true);
  useEffect(() => {
    if (firstRun.current) {
      firstRun.current = false;
      return;
    }
    return effect();
  }, deps);
}
