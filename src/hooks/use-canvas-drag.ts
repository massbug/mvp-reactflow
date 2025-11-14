import { useRef, useState } from "react";
import { Viewport } from "@/types";

export function useCanvasDrag(
  viewport: Viewport,
  setViewport: (vp: Viewport) => void
) {
  const [isDragging, setIsDragging] = useState(false);
  const dragStartRef = useRef({ x: 0, y: 0, vpX: 0, vpY: 0 });

  // 鼠标事件处理
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

  // 触摸事件处理
  const handleTouchStart = (e: React.TouchEvent<HTMLDivElement>) => {
    // 只处理单指触摸（拖拽），双指留给缩放
    if (e.touches.length !== 1 || (e.target as HTMLElement).closest(".node")) {
      return;
    }
    
    const touch = e.touches[0];
    setIsDragging(true);
    dragStartRef.current = {
      x: touch.clientX,
      y: touch.clientY,
      vpX: viewport.x,
      vpY: viewport.y,
    };
  };

  const handleTouchMove = (e: React.TouchEvent<HTMLDivElement>) => {
    if (!isDragging || e.touches.length !== 1) return;
    
    const touch = e.touches[0];
    const dx = touch.clientX - dragStartRef.current.x;
    const dy = touch.clientY - dragStartRef.current.y;
    setViewport({
      ...viewport,
      x: dragStartRef.current.vpX + dx,
      y: dragStartRef.current.vpY + dy,
    });
  };

  const handleTouchEnd = () => setIsDragging(false);

  return {
    isDragging,
    handlers: {
      onMouseDown: handleMouseDown,
      onMouseMove: handleMouseMove,
      onMouseUp: handleMouseUp,
      onMouseLeave: handleMouseUp,
      onTouchStart: handleTouchStart,
      onTouchMove: handleTouchMove,
      onTouchEnd: handleTouchEnd,
    },
  };
}
