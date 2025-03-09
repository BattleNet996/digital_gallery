"use client"

import { useRef, useEffect, useState } from "react"
import { useThree, useFrame } from "@react-three/fiber"
import { useKeyboardControls } from "@react-three/drei"
import { RigidBody, CapsuleCollider } from "@react-three/rapier"
import { Vector3, Euler, MathUtils } from "three"

type PlayerControlsProps = {
  currentSection?: string
}

// Section positions
const SECTION_POSITIONS = {
  popei: [0, 1.7, 0],
  rome: [0, 1.7, -100],
  vatican: [0, 1.7, -200],
  venice: [0, 1.7, -300],
}

export default function PlayerControls({ currentSection = "popei" }: PlayerControlsProps) {
  const playerRef = useRef(null)
  const { camera } = useThree()
  const [pointerLocked, setPointerLocked] = useState(false)
  const [, getKeys] = useKeyboardControls()
  const velocity = useRef(new Vector3(0, 0, 0))
  const targetRotation = useRef(new Euler(0, 0, 0))
  const isMouseDown = useRef(false)

  // Movement speed and mouse sensitivity
  const SPEED = 5
  const MOUSE_SENSITIVITY = 0.002

  // Update position when teleporting
  useEffect(() => {
    if (playerRef.current) {
      const position = SECTION_POSITIONS[currentSection] || SECTION_POSITIONS.popei

      playerRef.current.setTranslation({
        x: position[0],
        y: position[1],
        z: position[2],
      })

      // Update camera position
      camera.position.set(position[0], position[1], position[2])
    }
  }, [currentSection, camera])

  useEffect(() => {
    const handleMouseMove = (event: MouseEvent) => {
      if (pointerLocked || isMouseDown.current) {
        camera.rotation.y -= event.movementX * MOUSE_SENSITIVITY
      }
    }

    const handleMouseDown = (event: MouseEvent) => {
      if (event.button === 0) {
        // Left click only
        isMouseDown.current = true
        const canvas = document.querySelector("canvas")
        if (canvas && !document.pointerLockElement) {
          canvas.requestPointerLock()
        }
      }
    }

    const handleMouseUp = (event: MouseEvent) => {
      if (event.button === 0) {
        isMouseDown.current = false
      }
    }

    const handlePointerLockChange = () => {
      setPointerLocked(document.pointerLockElement === document.querySelector("canvas"))
      if (!document.pointerLockElement) {
        isMouseDown.current = false
      }
    }

    document.addEventListener("mousemove", handleMouseMove)
    document.addEventListener("mousedown", handleMouseDown)
    document.addEventListener("mouseup", handleMouseUp)
    document.addEventListener("pointerlockchange", handlePointerLockChange)

    return () => {
      document.removeEventListener("mousemove", handleMouseMove)
      document.removeEventListener("mousedown", handleMouseDown)
      document.removeEventListener("mouseup", handleMouseUp)
      document.removeEventListener("pointerlockchange", handlePointerLockChange)
    }
  }, [camera, pointerLocked])

  useFrame((state, delta) => {
    if (!playerRef.current) return

    const { forward, back, left, right } = getKeys()

    // Get current camera direction
    const direction = new Vector3()
    const frontVector = new Vector3(0, 0, (back ? 1 : 0) - (forward ? 1 : 0))
    const sideVector = new Vector3((left ? 1 : 0) - (right ? 1 : 0), 0, 0)

    direction
      .subVectors(frontVector, sideVector)
      .normalize()
      .multiplyScalar(SPEED * delta)
      .applyEuler(camera.rotation)

    // Keep y-axis unchanged, only move in xz plane
    direction.y = 0

    // Update rigid body position
    const currentPosition = playerRef.current.translation()
    const targetPosition = {
      x: currentPosition.x + direction.x,
      y: currentPosition.y,
      z: currentPosition.z + direction.z,
    }

    // Get section bounds based on current section
    const sectionBounds = getSectionBounds(currentSection)

    // Limit movement range based on current section
    targetPosition.x = MathUtils.clamp(targetPosition.x, sectionBounds.minX, sectionBounds.maxX)
    targetPosition.z = MathUtils.clamp(targetPosition.z, sectionBounds.minZ, sectionBounds.maxZ)

    playerRef.current.setTranslation(targetPosition)

    // Update camera position
    camera.position.x = targetPosition.x
    camera.position.z = targetPosition.z
  })

  // Helper function to get section movement bounds
  const getSectionBounds = (section) => {
    // Base position for each section
    const basePos = SECTION_POSITIONS[section] || SECTION_POSITIONS.popei

    return {
      minX: basePos[0] - 4.5,
      maxX: basePos[0] + 4.5,
      minZ: basePos[2] - 17,
      maxZ: basePos[2] + 2,
    }
  }

  return (
    <RigidBody
      ref={playerRef}
      colliders={false}
      position={SECTION_POSITIONS[currentSection]}
      enabledRotations={[false, false, false]}
      type="dynamic"
    >
      <CapsuleCollider args={[0.75, 0.5]} />
    </RigidBody>
  )
}
