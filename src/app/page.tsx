import { Canvas } from "@/components/flow/canvas";

export default function Home() {
  return (
    <div className="h-screen flex flex-col p-5 gap-4 overflow-hidden">
      <p className="text-gray-600 flex-none">
        桌面端：按住鼠标左键拖拽画布，滚轮缩放 | 移动端：单指拖拽，双指缩放
      </p>
      <div className="flex-1 min-h-0">
        <Canvas />
      </div>
    </div>
  );
}
