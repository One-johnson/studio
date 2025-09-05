
'use client';

import { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';

export default function CustomCursor() {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isPointer, setIsPointer] = useState(false);
  const [isHovering, setIsHovering] = useState(false);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setPosition({ x: e.clientX, y: e.clientY });

      const target = e.target as HTMLElement;
      const pointer = window.getComputedStyle(target).getPropertyValue('cursor') === 'pointer';
      setIsPointer(pointer);
    };

    const handleMouseOver = () => setIsHovering(true);
    const handleMouseOut = () => setIsHovering(false);

    window.addEventListener('mousemove', handleMouseMove);
    document.body.addEventListener('mouseover', handleMouseOver);
    document.body.addEventListener('mouseout', handleMouseOut);
    
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      document.body.removeEventListener('mouseover', handleMouseOver);
      document.body.removeEventListener('mouseout', handleMouseOut);
    };
  }, []);

  return (
     <div className="hidden md:block">
        <div
        className={cn(
            'pointer-events-none fixed z-[9999] h-2 w-2 rounded-full bg-primary transition-transform duration-100 ease-in-out',
            isHovering ? 'opacity-100' : 'opacity-0',
            isPointer ? 'scale-[3]' : 'scale-100'
        )}
        style={{
            left: `${position.x}px`,
            top: `${position.y}px`,
            transform: `translate(-50%, -50%) scale(${isPointer ? 3 : 1})`,
        }}
        />
     </div>
  );
}
