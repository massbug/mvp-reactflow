import { useRef, useState } from "react";
import { Viewport } from "@/types";

export function useCanvasDrag(
  viewport: Viewport,
  setViewport: (vp: Viewport) => void
) {
  const [isDragging, setIsDragging] = useState(false);
  const dragStartRef = useRef({ x: 0, y: 0, vpX: 0, vpY: 0 });

  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.button !== 0 || (e.target as HTMLElement).closest(".node")) {
      return;
    }
    e.preventDefault();
    setIsDragging(true);
    dragStartRef.current = {
      x: e.clientX,
      y: e.clientY,
      vpX: viewport.x,
      vpY: viewport.y,
    };
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!isDragging) return;
    const dx = e.clientX - dragStartRef.current.x;
    const dy = e.clientY - dragStartRef.current.y;
    setViewport({
      ...viewport,
      x: dragStartRef.current.vpX + dx,
      y: dragStartRef.current.vpY + dy,
    });
  };

  const handleMouseUp = () => setIsDragging(false);

  return {
    isDragging,
    handlers: {
      onMouseDown: handleMouseDown,
      onMouseMove: handleMouseMove,
      onMouseUp: handleMouseUp,
      onMouseLeave: handleMouseUp,
    },
  };
}
