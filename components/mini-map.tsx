"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Map, X } from "lucide-react"

type Position = {
  x: number
  z: number
}

type MiniMapProps = {
  playerPosition: Position
}

export default function MiniMap({ playerPosition }: MiniMapProps) {
  const [isOpen, setIsOpen] = useState(false)

  // Map dimensions and scale
  const mapWidth = 200
  const mapHeight = 500
  const mapScale = 10 // 1 unit in 3D space = 10px on map

  // Calculate player position on map
  const playerX = (playerPosition.x + 5) * (mapWidth / 10)
  const playerY = (-playerPosition.z + 5) * (mapHeight / 60)

  // Section positions on map
  const sections = [
    { name: "Entrance", y: mapHeight * 0.08 },
    { name: "Main Hall", y: mapHeight * 0.25 },
    { name: "Ancient Ruins", y: mapHeight * 0.58 },
    { name: "Modern Perspective", y: mapHeight * 0.75 },
  ]

  return (
    <div className="absolute bottom-4 right-4 z-40">
      {!isOpen ? (
        <motion.button
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          whileHover={{ scale: 1.1 }}
          onClick={() => setIsOpen(true)}
          className="bg-black/60 p-3 rounded-full text-white hover:bg-black/80 transition-colors"
        >
          <Map className="w-6 h-6" />
        </motion.button>
      ) : (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
          className="bg-black/80 p-4 rounded-lg shadow-lg"
        >
          <div className="flex justify-between items-center mb-2">
            <h3 className="text-white font-medium">Gallery Map</h3>
            <button onClick={() => setIsOpen(false)} className="text-white/70 hover:text-white">
              <X className="w-5 h-5" />
            </button>
          </div>

          <div
            className="relative bg-gray-800 rounded-md overflow-hidden"
            style={{ width: mapWidth, height: mapHeight }}
          >
            {/* Gallery layout */}
            <div className="absolute inset-0">
              {/* Main corridor */}
              <div
                className="absolute bg-gray-700 rounded-md"
                style={{
                  left: mapWidth * 0.35,
                  top: 0,
                  width: mapWidth * 0.3,
                  height: mapHeight,
                }}
              />

              {/* Section dividers */}
              {sections.map((section, index) => (
                <div key={index} className="absolute bg-gray-600 w-full h-1" style={{ top: section.y }} />
              ))}

              {/* Section labels */}
              {sections.map((section, index) => (
                <div
                  key={`label-${index}`}
                  className="absolute text-xs text-white/80 font-medium"
                  style={{
                    left: 5,
                    top: section.y - 10,
                  }}
                >
                  {section.name}
                </div>
              ))}

              {/* Artwork positions */}
              <div
                className="absolute w-2 h-2 bg-yellow-500 rounded-full"
                style={{ left: mapWidth * 0.2, top: mapHeight * 0.25 }}
              />
              <div
                className="absolute w-2 h-2 bg-yellow-500 rounded-full"
                style={{ left: mapWidth * 0.8, top: mapHeight * 0.25 }}
              />
              <div
                className="absolute w-2 h-2 bg-yellow-500 rounded-full"
                style={{ left: mapWidth * 0.2, top: mapHeight * 0.58 }}
              />
              <div
                className="absolute w-2 h-2 bg-yellow-500 rounded-full"
                style={{ left: mapWidth * 0.8, top: mapHeight * 0.58 }}
              />
              <div
                className="absolute w-2 h-2 bg-yellow-500 rounded-full"
                style={{ left: mapWidth * 0.2, top: mapHeight * 0.75 }}
              />
              <div
                className="absolute w-2 h-2 bg-yellow-500 rounded-full"
                style={{ left: mapWidth * 0.8, top: mapHeight * 0.75 }}
              />
            </div>

            {/* Player position */}
            <motion.div
              className="absolute w-3 h-3 bg-blue-500 rounded-full shadow-md"
              style={{
                left: playerX,
                top: playerY,
                transform: "translate(-50%, -50%)",
              }}
              initial={{ scale: 1 }}
              animate={{ scale: [1, 1.2, 1], transition: { repeat: Number.POSITIVE_INFINITY, duration: 2 } }}
            />
          </div>

          <div className="mt-2 text-xs text-white/70">
            <div className="flex items-center">
              <div className="w-2 h-2 bg-blue-500 rounded-full mr-1"></div>
              <span>Your position</span>
            </div>
            <div className="flex items-center mt-1">
              <div className="w-2 h-2 bg-yellow-500 rounded-full mr-1"></div>
              <span>Artwork</span>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  )
}

