import { useCallback, useRef } from "react";
import { Viewport } from "@/types";
import { useFlowStore } from "@/stores/use-flow-store";
import { MIN_ZOOM, MAX_ZOOM, ZOOM_SPEED } from "@/constants";

/**
 * 辅助函数：根据新的缩放值和固定的屏幕中心点计算新的平移量
 * @param screenX 固定的屏幕（Canvas容器内）X 坐标
 * @param screenY 固定的屏幕（Canvas容器内）Y 坐标
 * @param newZoom 新的缩放值
 * @param currentViewport 当前视口状态
 */
const calculateNewViewport = (
  screenX: number,
  screenY: number,
  newZoom: number,
  currentViewport: Viewport
): Viewport => {
  // 1. 将屏幕坐标 (ScreenX, ScreenY) 反向转换成世界坐标 (WorldX, WorldY)
  const worldX = (screenX - currentViewport.x) / currentViewport.zoom;
  const worldY = (screenY - currentViewport.y) / currentViewport.zoom;

  // 2. 计算新的平移量 (NewX, NewY)
  const newX = screenX - worldX * newZoom;
  const newY = screenY - worldY * newZoom;

  return { x: newX, y: newY, zoom: newZoom };
};

/**
 * 计算两个触摸点之间的距离
 */
const getTouchDistance = (touch1: React.Touch, touch2: React.Touch): number => {
  const dx = touch1.clientX - touch2.clientX;
  const dy = touch1.clientY - touch2.clientY;
  return Math.sqrt(dx * dx + dy * dy);
};

/**
 * 计算两个触摸点的中心位置
 */
const getTouchCenter = (touch1: React.Touch, touch2: React.Touch) => {
  return {
    x: (touch1.clientX + touch2.clientX) / 2,
    y: (touch1.clientY + touch2.clientY) / 2,
  };
};

export function useFlowControls(
  // 🌟 修复：允许 canvasRef.current 为 null
  canvasRef: React.RefObject<HTMLDivElement | null>
) {
  const { viewport, setViewport } = useFlowStore();
  
  // 用于记录双指缩放的初始状态
  const pinchRef = useRef<{
    distance: number;
    zoom: number;
    centerX: number;
    centerY: number;
  } | null>(null);

  /**
   * 🎯 处理右下角 ZoomControls 按钮点击事件 (以 Canvas 中心为缩放中心)
   * @param factor 缩放因子 (如放大 1/(1-ZOOM_SPEED), 缩小 (1-ZOOM_SPEED))
   */
  const handleZoom = useCallback((factor: number) => {
    const newZoom = Math.max(MIN_ZOOM, Math.min(MAX_ZOOM, viewport.zoom * factor));

    if (newZoom === viewport.zoom) return;

    if (!canvasRef.current) {
      // 仅更新 zoom，保持原有行为
      setViewport({ ...viewport, zoom: newZoom });
      return;
    }

    const canvasBounds = canvasRef.current.getBoundingClientRect();
    
    // 1. 确定 Canvas 中央的屏幕坐标 (ScreenX, ScreenY)
    const centerX = canvasBounds.width / 2;
    const centerY = canvasBounds.height / 2;

    // 2. 计算并设置以中心点为缩放中心的新视口
    const newViewport = calculateNewViewport(centerX, centerY, newZoom, viewport);

    setViewport(newViewport);
  }, [viewport, setViewport, canvasRef]);


  /**
   * 🖱️ 处理鼠标滚轮事件 (以鼠标点为中心)
   */
  const handleWheel = useCallback((event: React.WheelEvent<HTMLDivElement>) => {
    event.preventDefault(); // 阻止默认的滚动行为

    if (!canvasRef.current) return;

    const canvasBounds = canvasRef.current.getBoundingClientRect();

    // 1. 确定新的缩放值 (newZoom)
    const direction = event.deltaY < 0 ? 1 : -1; // deltaY < 0 放大
    const zoomFactor = 1 + direction * ZOOM_SPEED;
    const newZoom = Math.max(MIN_ZOOM, Math.min(MAX_ZOOM, viewport.zoom * zoomFactor));

    if (newZoom === viewport.zoom) return;

    // 2. 计算鼠标在**画布容器内**的相对坐标 (ScreenX, ScreenY)
    const mouseInCanvasX = event.clientX - canvasBounds.left;
    const mouseInCanvasY = event.clientY - canvasBounds.top;

    // 3. 计算并设置以鼠标点为缩放中心的新视口
    const newViewport = calculateNewViewport(mouseInCanvasX, mouseInCanvasY, newZoom, viewport);

    setViewport(newViewport);
  }, [viewport, setViewport, canvasRef]);


  /**
   * 🎯 重置功能 (缩放回 1)
   */
  const handleReset = useCallback(() => {
    setViewport({ ...viewport, zoom: 1 });
  }, [viewport, setViewport]);

  /**
   * 📱 处理触摸开始事件（双指缩放）
   */
  const handleTouchStart = useCallback((event: React.TouchEvent<HTMLDivElement>) => {
    if (event.touches.length === 2) {
      const touch1 = event.touches[0];
      const touch2 = event.touches[1];
      const distance = getTouchDistance(touch1, touch2);
      const center = getTouchCenter(touch1, touch2);

      if (!canvasRef.current) return;
      const canvasBounds = canvasRef.current.getBoundingClientRect();

      pinchRef.current = {
        distance,
        zoom: viewport.zoom,
        centerX: center.x - canvasBounds.left,
        centerY: center.y - canvasBounds.top,
      };
    }
  }, [viewport.zoom, canvasRef]);

  /**
   * 📱 处理触摸移动事件（双指缩放）
   */
  const handleTouchMove = useCallback((event: React.TouchEvent<HTMLDivElement>) => {
    if (event.touches.length === 2 && pinchRef.current) {
      event.preventDefault();

      const touch1 = event.touches[0];
      const touch2 = event.touches[1];
      const newDistance = getTouchDistance(touch1, touch2);
      
      // 计算缩放比例
      const scale = newDistance / pinchRef.current.distance;
      const newZoom = Math.max(MIN_ZOOM, Math.min(MAX_ZOOM, pinchRef.current.zoom * scale));

      if (newZoom === viewport.zoom) return;

      // 以初始的双指中心点为缩放中心
      const newViewport = calculateNewViewport(
        pinchRef.current.centerX,
        pinchRef.current.centerY,
        newZoom,
        viewport
      );

      setViewport(newViewport);
    }
  }, [viewport, setViewport]);

  /**
   * 📱 处理触摸结束事件
   */
  const handleTouchEnd = useCallback(() => {
    pinchRef.current = null;
  }, []);

  // 按钮点击使用的缩放因子
  const zoomInFactor = 1 / (1 - ZOOM_SPEED);
  const zoomOutFactor = 1 - ZOOM_SPEED;

  return {
    handleWheel,
    handleReset,
    handleZoomIn: () => handleZoom(zoomInFactor),
    handleZoomOut: () => handleZoom(zoomOutFactor),
    handleTouchStart,
    handleTouchMove,
    handleTouchEnd,
  };
}
