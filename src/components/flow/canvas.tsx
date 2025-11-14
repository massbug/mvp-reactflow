// src/components/flow/canvas.tsx

"use client";

import { useMemo, useRef } from "react";
import { useFlowStore } from "@/stores/use-flow-store";
import { useCanvasDrag } from "@/hooks/use-canvas-drag";
import { useFlowControls } from "@/hooks/use-flow-controls"; // <-- 新引入
import { Node } from "@/components/flow/node";
import { Edge } from "@/components/flow/edge";
import { GridBackground } from "@/components/flow/grid-background";
import { ZoomControls } from "@/components/flow/zoom-controls";
import { FlowNode } from "@/types";
import { CANVAS_WORLD_SIZE } from "@/constants"; // <-- 引入常量

// ⚠️ 移除硬编码的缩放常量和相关的计算函数

export function Canvas() {
  const { viewport, nodes, edges, setViewport } = useFlowStore();
  const canvasRef = useRef<HTMLDivElement>(null); // 用于获取画布 DOM 元素
  
  // 使用新的 Hook 封装缩放/平移逻辑（包含触摸事件）
  const { 
    handleWheel, 
    handleReset, 
    handleZoomIn, 
    handleZoomOut,
    handleTouchStart: handlePinchStart,
    handleTouchMove: handlePinchMove,
    handleTouchEnd: handlePinchEnd,
  } = useFlowControls(canvasRef);
  
  // 画布拖拽 Hook（已支持鼠标和触摸）
  const { isDragging, handlers } = useCanvasDrag(viewport, setViewport);

  const nodeMap = useMemo(
    () =>
      nodes.reduce((acc, node) => {
        acc[node.id] = node;
        return acc;
      }, {} as Record<string, FlowNode>),
    [nodes]
  );
  
  // ⚠️ 移除 calculateNewViewport, handleZoom, handleWheel, handleReset 函数

  // 合并触摸事件处理器
  const handleTouchStart = (e: React.TouchEvent<HTMLDivElement>) => {
    if (e.touches.length === 2) {
      // 双指缩放
      handlePinchStart(e);
    } else if (e.touches.length === 1) {
      // 单指拖拽
      handlers.onTouchStart?.(e);
    }
  };

  const handleTouchMove = (e: React.TouchEvent<HTMLDivElement>) => {
    if (e.touches.length === 2) {
      // 双指缩放
      handlePinchMove(e);
    } else if (e.touches.length === 1) {
      // 单指拖拽
      handlers.onTouchMove?.(e);
    }
  };

  const handleTouchEnd = () => {
    handlePinchEnd();
    handlers.onTouchEnd?.();
  };

  return (
    <div
      ref={canvasRef} // 绑定 ref
      className={`
        size-full border-2 border-gray-300 relative overflow-hidden rounded-lg 
        bg-gray-50 ${isDragging ? 'cursor-grabbing' : 'cursor-grab'}
      `}
      style={{ touchAction: 'none' }} // 阻止浏览器默认触摸行为
      {...handlers}
      onWheel={handleWheel} // 绑定滚轮事件
      onTouchStart={handleTouchStart} // 绑定触摸事件
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      <GridBackground offsetX={viewport.x} offsetY={viewport.y} />

      <div
        className="absolute"
        style={{
          width: `${CANVAS_WORLD_SIZE}px`,
          height: `${CANVAS_WORLD_SIZE}px`,
          transform: `translate(${viewport.x}px, ${viewport.y}px) scale(${viewport.zoom})`,
          transformOrigin: "0 0",
        }}
      >
        {/* ... SVG 和节点渲染逻辑保持不变 ... */}
        <svg
          className="absolute w-full h-full pointer-events-none overflow-visible"
        >
          {edges.map((edge) => (
            <Edge
              key={edge.id}
              edge={edge}
              sourceNode={nodeMap[edge.source]}
              targetNode={nodeMap[edge.target]}
            />
          ))}
        </svg>

        {nodes.map((node) => (
          <Node key={node.id} {...node} />
        ))}
      </div>

      <ZoomControls
        onZoomIn={handleZoomIn} // <-- 使用 Hook 提供的函数
        onZoomOut={handleZoomOut} // <-- 使用 Hook 提供的函数
        onReset={handleReset} // <-- 使用 Hook 提供的函数
      />
    </div>
  );
}
