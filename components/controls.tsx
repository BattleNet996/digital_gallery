"use client"

import { useRef, useEffect, useState } from "react"
import { useThree, useFrame } from "@react-three/fiber"
import { useKeyboardControls } from "@react-three/drei"
import { RigidBody, CapsuleCollider } from "@react-three/rapier"
import { Vector3, Euler, MathUtils } from "three"

type PlayerControlsProps = {
  currentSection?: string
}

interface SectionPositions {
  [key: string]: [number, number, number];
  iceland: [number, number, number];
  popei: [number, number, number];
  rome: [number, number, number];
  vatican: [number, number, number];
  venice: [number, number, number];
}

const SECTION_POSITIONS: SectionPositions = {
  iceland: [0, 1.7, -4],
  popei: [0, 1.7, -100],
  rome: [0, 1.7, -200],
  vatican: [0, 1.7, -300],
  venice: [0, 1.7, -400],
}

export default function PlayerControls({ currentSection = "iceland" }: PlayerControlsProps) {
  const playerRef = useRef<any>(null)
  const { camera } = useThree()
  const [pointerLocked, setPointerLocked] = useState(false)
  const [, getKeys] = useKeyboardControls()
  const velocity = useRef(new Vector3(0, 0, 0))
  const targetRotation = useRef(new Euler(0, 0, 0))
  const isMouseDown = useRef(false)

  const SPEED = 10
  const MOUSE_SENSITIVITY = 0.002

  useEffect(() => {
    if (playerRef.current) {
      const position = SECTION_POSITIONS[currentSection] || SECTION_POSITIONS.iceland

      playerRef.current.setTranslation({
        x: position[0],
        y: position[1],
        z: position[2],
      })

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

    const direction = new Vector3()
    camera.getWorldDirection(direction)
    direction.y = 0
    direction.normalize()

    const forwardVector = direction.clone().multiplyScalar((forward ? 1 : 0) - (back ? 1 : 0))
    
    const rightVector = direction.clone().cross(new Vector3(0, 1, 0)).normalize()
    const sideVector = rightVector.clone().multiplyScalar((right ? 1 : 0) - (left ? 1 : 0))

    const moveVector = new Vector3().addVectors(forwardVector, sideVector)
    if (moveVector.length() > 0) {
      moveVector.normalize()
    }

    velocity.current.x = moveVector.x * SPEED * delta
    velocity.current.z = moveVector.z * SPEED * delta

    if (playerRef.current) {
      const currentPosition = playerRef.current.translation()
      
      playerRef.current.setTranslation({
        x: currentPosition.x + velocity.current.x,
        y: currentPosition.y,
        z: currentPosition.z + velocity.current.z,
      })

      camera.position.x = currentPosition.x + velocity.current.x
      camera.position.z = currentPosition.z + velocity.current.z
    }
  })

  const getSectionBounds = (section: string) => {
    const basePos = SECTION_POSITIONS[section] || SECTION_POSITIONS.iceland

    return {
      minX: basePos[0] - 7,
      maxX: basePos[0] + 7,
      minZ: basePos[2] - 50,
      maxZ: basePos[2] + 5,
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
