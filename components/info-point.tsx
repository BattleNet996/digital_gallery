"use client"

import { useState, useRef, useEffect } from "react"
import { Html } from "@react-three/drei"
import { useFrame } from "@react-three/fiber"
import type * as THREE from "three"
import { Info } from "lucide-react"

type InfoPointProps = {
  position: [number, number, number]
  title: string
  content: string
}

export default function InfoPoint({ position, title, content }: InfoPointProps) {
  const [isHovered, setIsHovered] = useState(false)
  const [isOpen, setIsOpen] = useState(false)
  const groupRef = useRef<THREE.Group>(null)

  // Pulsing animation
  useFrame((state) => {
    if (groupRef.current && !isOpen) {
      groupRef.current.scale.setScalar(1 + Math.sin(state.clock.elapsedTime * 2) * 0.05)
    }
  })

  // Close info point when clicking elsewhere
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      // Check if click is outside the info point
      const target = e.target as HTMLElement
      if (isOpen && !target.closest(".info-point-content")) {
        setIsOpen(false)
      }
    }

    window.addEventListener("click", handleClick)
    return () => window.removeEventListener("click", handleClick)
  }, [isOpen])

  return (
    <group ref={groupRef} position={position}>
      {/* Floating icon */}
      <mesh
        onPointerOver={() => setIsHovered(true)}
        onPointerOut={() => setIsHovered(false)}
        onClick={() => setIsOpen(true)}
      >
        <sphereGeometry args={[0.15, 16, 16]} />
        <meshStandardMaterial
          color={isHovered ? "#3b82f6" : "#1d4ed8"}
          emissive={isHovered ? "#3b82f6" : "#1d4ed8"}
          emissiveIntensity={0.5}
        />
      </mesh>

      {/* Info content */}
      <Html position={[0, 0.5, 0]} center distanceFactor={10}>
        {isOpen ? (
          <div
            className="info-point-content bg-black/90 p-4 rounded-lg shadow-lg w-64 text-white"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-lg font-bold mb-2">{title}</h3>
            <p className="text-sm">{content}</p>
            <button
              className="mt-3 bg-blue-600 hover:bg-blue-700 text-white text-xs px-3 py-1 rounded"
              onClick={() => setIsOpen(false)}
            >
              Close
            </button>
          </div>
        ) : (
          isHovered && (
            <div className="bg-black/70 px-2 py-1 rounded text-white text-sm">
              <Info className="inline-block w-3 h-3 mr-1" /> {title}
            </div>
          )
        )}
      </Html>
    </group>
  )
}

