import React from "react";

interface ZoomControlsProps {
  onZoomIn: () => void;
  onZoomOut: () => void;
  onReset: () => void;
}

export const ZoomControls: React.FC<ZoomControlsProps> = ({
  onZoomIn,
  onZoomOut,
  onReset,
}) => (
  <div
    className="
      absolute bottom-5 right-5 flex flex-col gap-2 z-50
    "
  >
    <button 
      className="
        w-8 h-8 border border-gray-300 rounded bg-white cursor-pointer
        flex items-center justify-center text-lg font-bold text-gray-700
        shadow-sm transition-all duration-150 hover:shadow-md
      "
      onClick={onZoomIn} 
      title="放大"
    >
      +
    </button>
    <button 
      className="
        w-8 h-8 border border-gray-300 rounded bg-white cursor-pointer
        flex items-center justify-center text-lg font-bold text-gray-700
        shadow-sm transition-all duration-150 hover:shadow-md
      "
      onClick={onZoomOut} 
      title="缩小"
    >
      −
    </button>
    <button
      className="
        w-8 h-8 border border-gray-300 rounded bg-white cursor-pointer
        flex items-center justify-center text-xs font-bold text-gray-700
        shadow-sm transition-all duration-150 hover:shadow-md
      "
      onClick={onReset}
      title="重置"
    >
      ⊙
    </button>
  </div>
);
