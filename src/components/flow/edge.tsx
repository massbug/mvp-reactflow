import React, { useMemo } from "react";
import { FlowNode, FlowEdge } from "@/types";
import { NODE_WIDTH, NODE_HEIGHT } from "@/constants"; // <-- 引入常量

interface EdgeProps {
  edge: FlowEdge;
  sourceNode: FlowNode | undefined;
  targetNode: FlowNode | undefined;
}

// ⚠️ 移除硬编码的 NODE_WIDTH 和 NODE_HEIGHT

const getCenter = (node: FlowNode) => ({
  x: node.x + NODE_WIDTH / 2, // 使用常量
  y: node.y + NODE_HEIGHT / 2, // 使用常量
});

// ... getStraightPath 和 Edge 组件逻辑保持不变 ...

const getStraightPath = (
  source: { x: number; y: number },
  target: { x: number; y: number }
) => {
  return `M ${source.x} ${source.y} L ${target.x} ${target.y}`;
};

export const Edge: React.FC<EdgeProps> = ({ edge, sourceNode, targetNode }) => {
  const pathD = useMemo(() => {
    if (!sourceNode || !targetNode) {
      return "";
    }

    const sourceCenter = getCenter(sourceNode);
    const targetCenter = getCenter(targetNode);
    return getStraightPath(sourceCenter, targetCenter);
  }, [sourceNode, targetNode]);

  if (!sourceNode || !targetNode) {
    return null;
  }

  return (
    <path 
      id={edge.id} 
      d={pathD} 
      className="stroke-[#1a192b] stroke-2 fill-none" 
    />
  );
};
