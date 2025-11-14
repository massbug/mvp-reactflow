/**
 * 视口（Viewport）状态的接口
 * x, y: 平移量
 * zoom: 缩放值
 */
export interface Viewport {
    x: number;
    y: number;
    zoom: number;
}

/**
 * 流程图节点（Node）的接口
 */
export interface FlowNode {
    id: string;
    x: number;
    y: number;
    label: string;
}

/**
 * 边（Edge）的接口
 */
export interface FlowEdge {
    id: string;
    source: string;
    target: string;
}

/**
 * Zustand Store 的完整状态和 Action 接口
 */
export interface FlowState {
    viewport: Viewport;
    nodes: FlowNode[];
    edges: FlowEdge[];

    // Actions
    setViewport: (newViewport: Viewport) => void;
    updateNodePosition: (nodeId: string, x: number, y: number) => void;
}
