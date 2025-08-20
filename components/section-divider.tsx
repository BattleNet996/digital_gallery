"use client"

import { RigidBody } from "@react-three/rapier"
import { Html } from "@react-three/drei"
import * as THREE from "three"

type SectionDividerProps = {
  position: [number, number, number]
  title: string
  description: string
}

export default function SectionDivider({ position, title, description }: SectionDividerProps) {
  return (
    <RigidBody type="fixed" colliders="cuboid">
      {/* 半透明墙壁 */}
      <mesh position={position}>
        <planeGeometry args={[10, 4]} />
        <meshStandardMaterial color="#444" transparent={true} opacity={0.7} side={THREE.DoubleSide} />
      </mesh>

      {/* 标题 */}
      <Html position={[position[0], position[1] + 1, position[2] + 0.1]} transform occlude>
        <div className="px-6 py-3 bg-black/50 backdrop-blur-sm rounded text-center">
          <h2 className="text-xl font-bold text-white">{title}</h2>
        </div>
      </Html>

      {/* 描述文本 */}
      <Html position={[position[0], position[1], position[2] + 0.1]} transform occlude>
        <div className="w-64 p-4 bg-black/80 text-white rounded text-center">
          <p className="text-sm">{description}</p>
        </div>
      </Html>

      {/* 门洞 */}
      <mesh position={[position[0], position[1] - 1, position[2] - 0.05]}>
        <planeGeometry args={[2, 2]} />
        <meshBasicMaterial transparent={true} opacity={0} side={THREE.DoubleSide} />
      </mesh>
    </RigidBody>
  )
}
