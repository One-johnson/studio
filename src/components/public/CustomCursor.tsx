
'use client';

import { useState, useEffect } from 'react';
import { useIsMobile } from '@/hooks/use-mobile';
import { cn } from '@/lib/utils';

export default function CustomCursor() {
  const [position, setPosition] = useState({ x: -100, y: -100 });
  const [isPointer, setIsPointer] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const isMobile = useIsMobile();

  useEffect(() => {
    if (isMobile) {
        setIsVisible(false);
        return;
    };

    const onMouseMove = (e: MouseEvent) => {
      setPosition({ x: e.clientX, y: e.clientY });
      if (!isVisible) setIsVisible(true);
    };

    const onMouseOver = (e: MouseEvent) => {
        if (e.target instanceof Element) {
             if (
                window.getComputedStyle(e.target).cursor === 'pointer' ||
                e.target.closest('a, button, [role="button"]')
            ) {
                setIsPointer(true);
            } else {
                setIsPointer(false);
            }
        }
    };
    
    const onMouseLeave = () => {
        setIsVisible(false);
    }

    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseover', onMouseOver);
    document.body.addEventListener('mouseleave', onMouseLeave);


    return () => {
      document.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseover', onMouseOver);
      document.body.removeEventListener('mouseleave', onMouseLeave);
    };
  }, [isMobile, isVisible]);

  if (isMobile) {
    return null;
  }

  return (
    <div
      className={cn(
        'fixed top-0 left-0 z-[9999] rounded-full pointer-events-none transition-transform duration-150 ease-in-out',
        'bg-primary/20 border border-primary',
        isPointer ? 'scale-150' : 'scale-100',
        isVisible ? 'opacity-100' : 'opacity-0'
      )}
      style={{
        width: '32px',
        height: '32px',
        transform: `translate3d(${position.x - 16}px, ${position.y - 16}px, 0)`,
      }}
    />
  );
}
