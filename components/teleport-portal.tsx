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
            emissiveIntensity={1.2}
            metalness={0.8}
            roughness={0.2}
          />
        </mesh>

        {/* Inner ring */}
        <mesh position={[0, 0, 0]}>
          <torusGeometry args={[1, 0.1, 16, 32]} />
          <meshStandardMaterial
            color="#8e2de2"
            emissive="#8e2de2"
            emissiveIntensity={1.5}
            metalness={0.7}
            roughness={0.2}
          />
        </mesh>

        {/* Portal center */}
        <mesh position={[0, 0, 0.05]}>
          <circleGeometry args={[0.9, 32]} />
          <meshBasicMaterial color="#d9a4ff" transparent opacity={0.8} side={THREE.DoubleSide} />
        </mesh>

        {/* Particle system */}
        <points ref={particlesRef}>
          <bufferGeometry>
            {(() => {
              // Create a fixed array of particles with a fixed seed
              const particles = new Float32Array(200 * 3);
              for (let i = 0; i < 200 * 3; i += 3) {
                particles[i] = (Math.random() - 0.5) * 2;     // x
                particles[i + 1] = (Math.random() - 0.5) * 2; // y
                particles[i + 2] = (Math.random() - 0.5) * 2; // z
              }
              
              return (
                <bufferAttribute
                  attach="attributes-position"
                  args={[particles, 3]}
                />
              )
            })()}
          </bufferGeometry>
          <pointsMaterial size={0.02} color="#8e2de2" transparent opacity={0.6} blending={THREE.AdditiveBlending} />
        </points>

        {/* Portal glow */}
        <pointLight position={[0, 0, 2]} intensity={2} distance={4} color="#4a00e0" />

        {/* Teleport text */}
        <Html position={[0, -1.8, 0]} center>
          <div style={{ 
            background: 'rgba(0,0,0,0.5)',
            color: 'white',
            padding: '5px 10px',
            borderRadius: '4px',
            fontSize: '12px',
            fontWeight: 'bold',
            pointerEvents: 'none'
          }}>
            点击传送 | Click to Teleport
          </div>
        </Html>
      </group>
    </group>
  )
}
