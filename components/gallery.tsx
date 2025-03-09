"use client"

import { useState, Suspense } from "react"
import { Canvas } from "@react-three/fiber"
import { Physics } from "@react-three/rapier"
import { KeyboardControls } from "@react-three/drei"
import { useLanguage } from "./language-context"
import { ModalProvider, useModal } from "./modal-context"
import PlayerControls from "./controls"
import GallerySections from "./gallery-sections"
import UI from "./ui"
import MusicPlayer from "./music-player"
import ArtworkModal from "./artwork-modal"
import * as THREE from "three"

export const GALLERY_CONTROLS = {
  forward: "forward",
  back: "back",
  left: "left",
  right: "right",
}

export default function Gallery() {
  const { t } = useLanguage()
  const [isMusicPlaying, setIsMusicPlaying] = useState(true)
  const [currentSection, setCurrentSection] = useState("popei")

  // Handle teleportation between sections
  const handleTeleport = (targetSection: string) => {
    // Immediate section change
    setCurrentSection(targetSection)
  }

  return (
    <ModalProvider>
      <GalleryContent
        isMusicPlaying={isMusicPlaying}
        setIsMusicPlaying={setIsMusicPlaying}
        currentSection={currentSection}
        handleTeleport={handleTeleport}
      />
    </ModalProvider>
  )
}

// Separate component to use the modal context
function GalleryContent({ isMusicPlaying, setIsMusicPlaying, currentSection, handleTeleport }) {
  const { isModalOpen, currentImage, currentMetadata, closeModal } = useModal()

  return (
    <KeyboardControls
      map={[
        { name: GALLERY_CONTROLS.forward, keys: ["ArrowUp", "w", "W"] },
        { name: GALLERY_CONTROLS.back, keys: ["ArrowDown", "s", "S"] },
        { name: GALLERY_CONTROLS.left, keys: ["ArrowLeft", "a", "A"] },
        { name: GALLERY_CONTROLS.right, keys: ["ArrowRight", "d", "D"] },
      ]}
    >
      <div className="w-full h-screen relative">
        <Canvas
          shadows
          camera={{
            fov: 75,
            near: 0.1,
            far: 300,
            position: [0, 1.7, 5],
            rotation: [0, Math.PI, 0],
          }}
          gl={{
            antialias: true,
            toneMapping: THREE.ACESFilmicToneMapping,
            toneMappingExposure: 1,
            pixelRatio: Math.min(window.devicePixelRatio, 2), // Limit pixel ratio for better performance
          }}
        >
          {/* Scene lighting */}
          <ambientLight intensity={0.8} />
          <directionalLight position={[0, 10, 0]} intensity={1} castShadow />

          <Suspense fallback={null}>
            <Physics>
              <GallerySections currentSection={currentSection} onTeleport={handleTeleport} />
              <PlayerControls currentSection={currentSection} />
            </Physics>
          </Suspense>
        </Canvas>

        {/* UI Elements */}
        <UI
          toggleMusic={() => setIsMusicPlaying(!isMusicPlaying)}
          isMusicPlaying={isMusicPlaying}
          currentSection={currentSection}
        />
        <MusicPlayer isPlaying={isMusicPlaying} />

        {/* Artwork Modal */}
        <ArtworkModal
          imageUrl={currentImage || ""}
          metadata={currentMetadata}
          isOpen={isModalOpen}
          onClose={closeModal}
        />
      </div>
    </KeyboardControls>
  )
}
