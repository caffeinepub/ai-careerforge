import { createContext, useContext, useState, useCallback } from 'react';

export type CursorState = 'default' | 'orb' | 'beam' | 'magnetic' | 'pointer';

interface CursorContextType {
  cursorState: CursorState;
  setCursorState: (state: CursorState) => void;
}

export const CursorContext = createContext<CursorContextType>({
  cursorState: 'default',
  setCursorState: () => {},
});

export function useCursorState() {
  const [cursorState, setCursorStateRaw] = useState<CursorState>('default');
  const setCursorState = useCallback((state: CursorState) => setCursorStateRaw(state), []);
  return { cursorState, setCursorState };
}

export function useCursor() {
  return useContext(CursorContext);
}
