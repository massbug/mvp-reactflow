// ===================================
// 视图 (Viewport/Zoom) 相关的常量
// ===================================

/** 最小缩放比例 */
export const MIN_ZOOM = 0.5;

/** 最大缩放比例 */
export const MAX_ZOOM = 2;

/** 每次滚动的缩放增量 (0.1 = 10%) */
export const ZOOM_SPEED = 0.1; 

/** 初始视口设置 - x 轴平移量 */
export const INITIAL_VIEWPORT_X = 150;

/** 初始视口设置 - y 轴平移量 */
export const INITIAL_VIEWPORT_Y = 50;

/** 初始缩放值 */
export const INITIAL_VIEWPORT_ZOOM = 1;

// ===================================
// 节点 (Node) 相关的常量
// ===================================

/** 节点默认宽度 (用于计算连线中心点) */
export const NODE_WIDTH = 100;

/** 节点默认高度 (用于计算连线中心点) */
export const NODE_HEIGHT = 40;

// ===================================
// 画布 (Canvas) 相关的常量
// ===================================

/** 包裹所有节点的容器尺寸，用于定义 SVG 连线的范围 */
export const CANVAS_WORLD_SIZE = 4000; 

/** 网格背景点阵尺寸 (20px 间隔) */
export const GRID_SIZE = 20;

/** 画布默认高度 */
export const CANVAS_DEFAULT_HEIGHT = "600px";

// ===================================
// 初始数据
// ===================================

// 注意：如果初始数据是固定不变的，也可以放在这里，但如果数据来自 API 或可能变化，
// 放在 store 文件中可能更灵活。目前保持在 store 中。