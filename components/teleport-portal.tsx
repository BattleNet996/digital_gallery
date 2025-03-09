"use client"

import { useRef } from "react"
import { useFrame } from "@react-three/fiber"
import { Html } from "@react-three/drei"
import * as THREE from "three"

type TeleportPortalProps = {
  position: [number, number, number]
  targetSection: string
  onTeleport: (targetSection: string) => void
}

export default function TeleportPortal({ position, targetSection, onTeleport }: TeleportPortalProps) {
  const portalRef = useRef<THREE.Group>(null)
  const ringRef = useRef<THREE.Mesh>(null)
  const particlesRef = useRef<THREE.Points>(null)
  const time = useRef(0)

  // Animate portal
  useFrame((state, delta) => {
    time.current += delta

    if (portalRef.current) {
      portalRef.current.rotation.z = Math.sin(time.current * 0.5) * 0.1
    }

    if (ringRef.current) {
      ringRef.current.rotation.z = time.current * 0.2
    }

    if (particlesRef.current) {
      particlesRef.current.rotation.z = -time.current * 0.1
    }
  })

  const handleTeleport = () => {
    onTeleport(targetSection)
  }

  return (
    <group position={position} onClick={handleTeleport}>
      {/* Portal frame */}
      <group ref={portalRef}>
        {/* Outer ring */}
        <mesh ref={ringRef} position={[0, 0, -0.1]}>
          <torusGeometry args={[1.3, 0.15, 16, 32]} />
          <meshStandardMaterial
            color="#4a00e0"
            emissive="#4a00e0"
            emissiveIntensity={0.5}
            metalness={0.8}
            roughness={0.2}
          />
        </mesh>

        {/* Inner ring */}
        <mesh position={[0, 0, -0.05]}>
          <torusGeometry args={[1.1, 0.08, 16, 32]} />
          <meshStandardMaterial
            color="#8e2de2"
            emissive="#8e2de2"
            emissiveIntensity={0.5}
            metalness={0.8}
            roughness={0.2}
          />
        </mesh>

        {/* Portal surface */}
        <mesh position={[0, 0, 0]}>
          <circleGeometry args={[1, 32]} />
          <meshBasicMaterial color="#000000" transparent opacity={0.8} />
        </mesh>

        {/* Particle system */}
        <points ref={particlesRef}>
          <bufferGeometry>
            <bufferAttribute
              attach="attributes-position"
              count={200}
              array={new Float32Array(200 * 3).map((_, i) => {
                if (i % 3 === 0) return (Math.random() - 0.5) * 2 // x
                if (i % 3 === 1) return (Math.random() - 0.5) * 2 // y
                return (Math.random() - 0.5) * 2 // z
              })}
              itemSize={3}
            />
          </bufferGeometry>
          <pointsMaterial size={0.02} color="#8e2de2" transparent opacity={0.6} blending={THREE.AdditiveBlending} />
        </points>

        {/* Portal glow */}
        <pointLight position={[0, 0, 2]} intensity={2} distance={4} color="#4a00e0" />
      </group>

      {/* Label */}
      <Html position={[0, -2, 0]} center transform>
        <div
          className="text-white text-center px-4 py-2 rounded-full cursor-pointer whitespace-nowrap"
          style={{ fontFamily: "Arial, sans-serif", pointerEvents: "none" }}
        >
          TP to the Next Exhibition Area
        </div>
      </Html>
    </group>
  )
}
