"use client"

import { useState, useRef, useEffect } from "react"
import { useTexture, Html } from "@react-three/drei"
import { useModal } from "./modal-context"
import type { ArtworkMetadata } from "./modal-context"
import * as THREE from "three"

type ArtworkFrameProps = {
  position: [number, number, number]
  rotation: [number, number, number]
  imageUrl: string
  size: [number, number]
  metadata?: ArtworkMetadata
}

export default function ArtworkFrame({ position, rotation, imageUrl, size, metadata }: ArtworkFrameProps) {
  const [width, height] = size
  const [isHovered, setIsHovered] = useState(false)
  const { openModal } = useModal()
  const groupRef = useRef<THREE.Group>(null)

  // Load texture
  const texture = useTexture(imageUrl)

  // Set texture properties
  useEffect(() => {
    if (texture) {
      texture.colorSpace = THREE.SRGBColorSpace
      texture.minFilter = THREE.LinearFilter
      texture.magFilter = THREE.LinearFilter
      texture.needsUpdate = true
    }
  }, [texture])

  // Handle click to open modal
  const handleClick = () => {
    openModal(imageUrl, metadata)
  }

  return (
    <group ref={groupRef} position={position} rotation={rotation}>
      {/* Frame */}
      <mesh position={[0, 0, -0.1]}>
        <boxGeometry args={[width + 0.2, height + 0.2, 0.1]} />
        <meshStandardMaterial color={isHovered ? "#2a2a2a" : "#1a1a1a"} metalness={0.5} roughness={0.5} />
      </mesh>

      {/* Inner frame border */}
      <mesh position={[0, 0, -0.05]}>
        <boxGeometry args={[width + 0.1, height + 0.1, 0.02]} />
        <meshStandardMaterial color={isHovered ? "#3a3a3a" : "#2a2a2a"} metalness={0.6} roughness={0.4} />
      </mesh>

      {/* Artwork */}
      <mesh onPointerOver={() => setIsHovered(true)} onPointerOut={() => setIsHovered(false)} onClick={handleClick}>
        <planeGeometry args={[width, height]} />
        <meshBasicMaterial map={texture} toneMapped={false} />
      </mesh>

      {/* Artwork spotlight */}
      <pointLight position={[0, height / 2 + 0.5, 1]} intensity={1} distance={3} color="#ffffff" />

      {/* Hover info */}
      {isHovered && (
        <Html position={[0, -height / 2 - 0.3, 0.1]} center>
          <div className="bg-black/70 text-white px-3 py-1.5 rounded-full text-sm font-medium backdrop-blur-sm">
            {metadata?.title || "Click to enlarge"}
          </div>
        </Html>
      )}
    </group>
  )
}
