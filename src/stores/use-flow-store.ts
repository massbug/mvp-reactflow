import { create } from 'zustand';
import { FlowState, FlowNode, FlowEdge } from '@/types';
import { 
  INITIAL_VIEWPORT_X, 
  INITIAL_VIEWPORT_Y, 
  INITIAL_VIEWPORT_ZOOM 
} from '@/constants'; // <-- 引入常量

const initialNodes: FlowNode[] = [
  { id: '1', x: 100, y: 100, label: 'Node A' },
  { id: '2', x: 400, y: 300, label: 'Node B' },
];

const initialEdges: FlowEdge[] = [
  { id: 'e1-2', source: '1', target: '2' },
];

export const useFlowStore = create<FlowState>((set) => ({
  // 使用常量设置初始视口
  viewport: { 
    x: INITIAL_VIEWPORT_X, 
    y: INITIAL_VIEWPORT_Y, 
    zoom: INITIAL_VIEWPORT_ZOOM 
  },
  nodes: initialNodes,
  edges: initialEdges,

  setViewport: (newViewport) => set({ viewport: newViewport }),
  
  updateNodePosition: (nodeId, x, y) => set((state) => ({
    nodes: state.nodes.map(n =>
      n.id === nodeId ? { ...n, x, y } : n
    ),
  })),
}));
