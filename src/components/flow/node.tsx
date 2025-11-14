import React, { useRef } from "react";
import { FlowNode } from "@/types";
import { useFlowStore } from "@/stores/use-flow-store";

type NodeProps = FlowNode

export function Node({ id, x, y, label }: NodeProps) {
  const updateNodePosition = useFlowStore((state) => state.updateNodePosition);
  const zoom = useFlowStore((state) => state.viewport.zoom);

  const isDraggingRef = useRef(false);
  const dragStartRef = useRef({ x: 0, y: 0, nodeX: 0, nodeY: 0 });

  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.button !== 0) return;

    e.stopPropagation(); // 防止触发画布拖拽
    e.preventDefault();

    isDraggingRef.current = true;
    dragStartRef.current = {
      x: e.clientX,
      y: e.clientY,
      nodeX: x,
      nodeY: y,
    };

    document.body.style.cursor = "grabbing";

    const handleMouseMove = (moveEvent: MouseEvent) => {
      if (!isDraggingRef.current) return;

      const dx = (moveEvent.clientX - dragStartRef.current.x) / zoom;
      const dy = (moveEvent.clientY - dragStartRef.current.y) / zoom;

      updateNodePosition(
        id,
        dragStartRef.current.nodeX + dx,
        dragStartRef.current.nodeY + dy
      );
    };

    const handleMouseUp = () => {
      isDraggingRef.current = false;
      document.body.style.cursor = "default";
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
    };

    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);
  };

  return (
    <div
      id={`node-${id}`}
      className="
        absolute py-2 px-4 
        border-2 border-gray-800 rounded-lg 
        bg-white cursor-grab 
        min-w-[100px] text-center 
        shadow-sm z-10 select-none
        node
      "
      style={{
        left: x,
        top: y,
      }}
      onMouseDown={handleMouseDown}
    >
      <strong className="font-semibold">{label}</strong>
    </div>
  );
}
