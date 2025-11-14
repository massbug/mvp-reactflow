import { Canvas } from "@/components/flow/canvas";

export default function Home() {
  return (
    <div className="h-screen flex flex-col p-5 gap-4">
      <p className="text-gray-600 flex flex-none">
        按住鼠标左键实现拖拽画布以及节点移动
      </p>
      <Canvas />
    </div>
  );
}
