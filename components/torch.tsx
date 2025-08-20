"use client"

import { useRef, useEffect } from "react"
import { useFrame } from "@react-three/fiber"
import * as THREE from "three"

type TorchProps = {
  position: [number, number, number]
  rotation?: [number, number, number]
}

export default function Torch({ position, rotation = [0, 0, 0] }: TorchProps) {
  const lightRef = useRef<THREE.PointLight>(null)
  const particlesRef = useRef<THREE.Points>(null)

  // 创建火把粒子
  useEffect(() => {
    if (!particlesRef.current) return

    // 更新粒子位置
    const updateParticles = () => {
      const positions = particlesRef.current.geometry.attributes.position
      const count = positions.count

      for (let i = 0; i < count; i++) {
        const ix = i * 3
        const iy = i * 3 + 1
        const iz = i * 3 + 2

        // 随机移动粒子
        positions.array[iy] += (Math.random() - 0.5) * 0.05
        if (positions.array[iy] > 0.5) positions.array[iy] = 0

        positions.array[ix] += (Math.random() - 0.5) * 0.05
        positions.array[iz] += (Math.random() - 0.5) * 0.05
      }

      positions.needsUpdate = true
    }

    const interval = setInterval(updateParticles, 50)

    return () => {
      clearInterval(interval)
    }
  }, [])

  // 火焰闪烁效果
  useFrame(() => {
    if (lightRef.current) {
      lightRef.current.intensity = 1 + Math.random() * 0.5
    }
  })

  return (
    <group position={position} rotation={rotation}>
      {/* 火把支架 */}
      <mesh position={[0, 0, 0]}>
        <cylinderGeometry args={[0.03, 0.03, 0.5, 8]} />
        <meshStandardMaterial color="#444" metalness={0.8} roughness={0.2} />
      </mesh>

      {/* 火把底座 */}
      <mesh position={[0, -0.2, 0]}>
        <cylinderGeometry args={[0.1, 0.05, 0.1, 8]} />
        <meshStandardMaterial color="#333" metalness={0.8} roughness={0.2} />
      </mesh>

      {/* 火焰光源 */}
      <pointLight
        ref={lightRef}
        position={[0, 0.3, 0]}
        intensity={3} // Increased from 1.5
        distance={8} // Increased from 5
        color="#ff7700"
        castShadow
      />

      {/* 火焰粒子 */}
      <points ref={particlesRef} position={[0, 0.3, 0]}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            count={50}
            array={new Float32Array(50 * 3).map((_, i) => {
              if (i % 3 === 0) return (Math.random() - 0.5) * 0.1 // x
              if (i % 3 === 1) return Math.random() * 0.3 // y
              return (Math.random() - 0.5) * 0.1 // z
            })}
            itemSize={3}
          />
        </bufferGeometry>
        <pointsMaterial size={0.1} color="#ff7700" transparent opacity={0.8} blending={THREE.AdditiveBlending} />
      </points>
    </group>
  )
}

