import { useRef, useState, useCallback } from 'react';
import { useCursor } from '../hooks/useCursorContext';

interface MagneticButtonProps {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
  href?: string;
}

export default function MagneticButton({ children, className = '', onClick, href }: MagneticButtonProps) {
  const btnRef = useRef<HTMLButtonElement | HTMLAnchorElement>(null);
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const { setCursorState } = useCursor();

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    const el = btnRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    const dx = e.clientX - cx;
    const dy = e.clientY - cy;
    setOffset({ x: dx * 0.3, y: dy * 0.3 });
    setCursorState('magnetic');
  }, [setCursorState]);

  const handleMouseLeave = useCallback(() => {
    setOffset({ x: 0, y: 0 });
    setCursorState('default');
  }, [setCursorState]);

  const style = {
    transform: `translate(${offset.x}px, ${offset.y}px)`,
    transition: 'transform 0.3s cubic-bezier(0.23, 1, 0.32, 1)',
  };

  const commonProps = {
    onMouseMove: handleMouseMove,
    onMouseLeave: handleMouseLeave,
    style,
    className: `inline-flex items-center justify-center gap-2 font-orbitron text-sm tracking-widest px-8 py-3 rounded-sm border transition-all duration-300 ${className}`,
  };

  if (href) {
    return (
      <a
        ref={btnRef as React.RefObject<HTMLAnchorElement>}
        href={href}
        {...commonProps}
      >
        {children}
      </a>
    );
  }

  return (
    <button
      ref={btnRef as React.RefObject<HTMLButtonElement>}
      onClick={onClick}
      {...commonProps}
    >
      {children}
    </button>
  );
}
