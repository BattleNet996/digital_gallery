"use client"

import { Html } from "@react-three/drei"

type SectionInfoProps = {
  title: string
  description: string
}

export default function SectionInfo({ title, description }: SectionInfoProps) {
  return (
    <group position={[0, 2.5, 1]} rotation={[0, Math.PI, 0]}>
      <Html position={[0, 0, 0]} transform occlude>
        <div className="w-80 flex flex-col items-center justify-center">
          {/* 标题 */}
          <h2 className="text-xl font-bold text-white mb-2">{title}</h2>
          
          {/* 装饰线条 */}
          <div className="w-20 h-0.5 bg-white opacity-50 mb-4"></div>
          
          {/* 描述内容 */}
          <div className="bg-black bg-opacity-70 p-4 rounded">
            <p className="text-white text-sm leading-relaxed text-center">{description}</p>
          </div>
        </div>
      </Html>
    </group>
  )
}
