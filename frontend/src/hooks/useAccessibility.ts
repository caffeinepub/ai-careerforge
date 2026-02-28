import { createContext, useContext, useState, useEffect, useCallback } from 'react';

interface AccessibilityState {
  reducedMotion: boolean;
  highContrast: boolean;
  toggleReducedMotion: () => void;
  toggleHighContrast: () => void;
}

export const AccessibilityContext = createContext<AccessibilityState>({
  reducedMotion: false,
  highContrast: false,
  toggleReducedMotion: () => {},
  toggleHighContrast: () => {},
});

export function useAccessibilityState(): AccessibilityState {
  const osReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const [reducedMotion, setReducedMotion] = useState<boolean>(() => {
    const stored = localStorage.getItem('nexus-reduced-motion');
    if (stored !== null) return stored === 'true';
    return osReducedMotion;
  });

  const [highContrast, setHighContrast] = useState<boolean>(() => {
    const stored = localStorage.getItem('nexus-high-contrast');
    return stored === 'true';
  });

  useEffect(() => {
    localStorage.setItem('nexus-reduced-motion', String(reducedMotion));
    document.documentElement.setAttribute('data-reduced-motion', String(reducedMotion));
  }, [reducedMotion]);

  useEffect(() => {
    localStorage.setItem('nexus-high-contrast', String(highContrast));
    document.documentElement.setAttribute('data-high-contrast', String(highContrast));
  }, [highContrast]);

  // Listen for OS preference changes
  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    const handler = (e: MediaQueryListEvent) => {
      const stored = localStorage.getItem('nexus-reduced-motion');
      if (stored === null) setReducedMotion(e.matches);
    };
    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  }, []);

  const toggleReducedMotion = useCallback(() => setReducedMotion(v => !v), []);
  const toggleHighContrast = useCallback(() => setHighContrast(v => !v), []);

  return { reducedMotion, highContrast, toggleReducedMotion, toggleHighContrast };
}

export function useAccessibility() {
  return useContext(AccessibilityContext);
}
