import React from "react";
import { GRID_SIZE } from "@/constants"; // <-- 引入常量

interface GridBackgroundProps {
  offsetX: number;
  offsetY: number;
}

export const GridBackground: React.FC<GridBackgroundProps> = ({ offsetX, offsetY }) => (
  <div
    className="absolute w-full h-full"
    style={{
      backgroundImage: `radial-gradient(circle, #d1d5db 1px, transparent 1px)`,
      // 使用常量
      backgroundSize: `${GRID_SIZE}px ${GRID_SIZE}px`,
      backgroundPosition: `${offsetX}px ${offsetY}px`,
    }}
  />
);
