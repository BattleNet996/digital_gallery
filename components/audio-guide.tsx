"use client"

import { useState, useRef, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Headphones, Play, Pause, SkipForward, Volume2, VolumeX } from "lucide-react"
import { useLanguage } from "./language-context"

// Audio guide content
const audioGuides = {
  en: [
    {
      id: "intro",
      title: "Welcome to Charles's Gallery",
      description: "Introduction to the virtual gallery experience",
      audioSrc: "https://assets.mixkit.co/music/preview/mixkit-relaxed-ambience-loop-145.mp3", // Placeholder
      duration: 30,
    },
    {
      id: "main-hall",
      title: "Main Exhibition Hall",
      description: "Overview of Pompeii's historical significance",
      audioSrc: "https://assets.mixkit.co/music/preview/mixkit-relaxed-ambience-loop-145.mp3", // Placeholder
      duration: 45,
    },
    {
      id: "ancient",
      title: "Ancient Ruins Section",
      description: "The preservation and discovery of Pompeii",
      audioSrc: "https://assets.mixkit.co/music/preview/mixkit-relaxed-ambience-loop-145.mp3", // Placeholder
      duration: 60,
    },
  ],
  zh: [
    {
      id: "intro",
      title: "欢迎来到Charles的画廊",
      description: "虚拟画廊体验介绍",
      audioSrc: "https://assets.mixkit.co/music/preview/mixkit-relaxed-ambience-loop-145.mp3", // Placeholder
      duration: 30,
    },
    {
      id: "main-hall",
      title: "主展厅",
      description: "庞贝古城的历史意义概述",
      audioSrc: "https://assets.mixkit.co/music/preview/mixkit-relaxed-ambience-loop-145.mp3", // Placeholder
      duration: 45,
    },
    {
      id: "ancient",
      title: "古代遗迹展区",
      description: "庞贝古城的保存与发现",
      audioSrc: "https://assets.mixkit.co/music/preview/mixkit-relaxed-ambience-loop-145.mp3", // Placeholder
      duration: 60,
    },
  ],
}

export default function AudioGuide() {
  const { language } = useLanguage()
  const [isOpen, setIsOpen] = useState(false)
  const [currentGuide, setCurrentGuide] = useState(0)
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const [volume, setVolume] = useState(0.5)
  const [isMuted, setIsMuted] = useState(false)

  const audioRef = useRef<HTMLAudioElement | null>(null)
  const guides = audioGuides[language]

  // Initialize audio
  useEffect(() => {
    if (!audioRef.current) {
      audioRef.current = new Audio()
      audioRef.current.volume = volume
    }

    return () => {
      if (audioRef.current) {
        audioRef.current.pause()
        audioRef.current = null
      }
    }
  }, [])

  // Update audio source when guide changes
  useEffect(() => {
    if (audioRef.current && guides[currentGuide]) {
      audioRef.current.src = guides[currentGuide].audioSrc
      audioRef.current.load()

      if (isPlaying) {
        audioRef.current.play().catch((e) => console.log("Audio play prevented:", e))
      }
    }
  }, [currentGuide, guides])

  // Handle play/pause
  useEffect(() => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.play().catch((e) => console.log("Audio play prevented:", e))
      } else {
        audioRef.current.pause()
      }
    }
  }, [isPlaying])

  // Update time display
  useEffect(() => {
    if (!audioRef.current) return

    const updateTime = () => {
      if (audioRef.current) {
        setCurrentTime(audioRef.current.currentTime)
      }
    }

    const handleEnded = () => {
      if (currentGuide < guides.length - 1) {
        setCurrentGuide(currentGuide + 1)
      } else {
        setIsPlaying(false)
        setCurrentTime(0)
      }
    }

    audioRef.current.addEventListener("timeupdate", updateTime)
    audioRef.current.addEventListener("ended", handleEnded)

    return () => {
      if (audioRef.current) {
        audioRef.current.removeEventListener("timeupdate", updateTime)
        audioRef.current.removeEventListener("ended", handleEnded)
      }
    }
  }, [currentGuide, guides.length])

  // Handle volume changes
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = isMuted ? 0 : volume
    }
  }, [volume, isMuted])

  // Format time display
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = Math.floor(seconds % 60)
    return `${mins}:${secs < 10 ? "0" : ""}${secs}`
  }

  // Play next guide
  const playNext = () => {
    if (currentGuide < guides.length - 1) {
      setCurrentGuide(currentGuide + 1)
    }
  }

  // Toggle mute
  const toggleMute = () => {
    setIsMuted(!isMuted)
  }

  return (
    <div className="absolute bottom-4 left-4 z-40">
      {!isOpen ? (
        <motion.button
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          whileHover={{ scale: 1.1 }}
          onClick={() => setIsOpen(true)}
          className="bg-black/60 p-3 rounded-full text-white hover:bg-black/80 transition-colors"
        >
          <Headphones className="w-6 h-6" />
        </motion.button>
      ) : (
        <AnimatePresence>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="bg-black/80 p-4 rounded-lg shadow-lg w-72"
          >
            <div className="flex justify-between items-center mb-3">
              <h3 className="text-white font-medium">Audio Guide</h3>
              <button onClick={() => setIsOpen(false)} className="text-white/70 hover:text-white">
                <Headphones className="w-5 h-5" />
              </button>
            </div>

            {/* Current guide info */}
            <div className="mb-3">
              <h4 className="text-white text-sm font-bold">{guides[currentGuide].title}</h4>
              <p className="text-white/70 text-xs">{guides[currentGuide].description}</p>
            </div>

            {/* Progress bar */}
            <div className="mb-3">
              <div className="bg-gray-700 h-1 rounded-full w-full">
                <div
                  className="bg-blue-500 h-1 rounded-full"
                  style={{
                    width: `${(currentTime / guides[currentGuide].duration) * 100}%`,
                  }}
                ></div>
              </div>
              <div className="flex justify-between text-xs text-white/70 mt-1">
                <span>{formatTime(currentTime)}</span>
                <span>{formatTime(guides[currentGuide].duration)}</span>
              </div>
            </div>

            {/* Controls */}
            <div className="flex justify-between items-center">
              <button onClick={toggleMute} className="text-white/80 hover:text-white p-2">
                {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
              </button>

              <div className="flex items-center space-x-2">
                <button
                  onClick={() => setIsPlaying(!isPlaying)}
                  className="bg-white text-black rounded-full p-2 hover:bg-white/90"
                >
                  {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
                </button>

                <button
                  onClick={playNext}
                  disabled={currentGuide >= guides.length - 1}
                  className={`text-white/80 hover:text-white p-2 ${
                    currentGuide >= guides.length - 1 ? "opacity-50 cursor-not-allowed" : ""
                  }`}
                >
                  <SkipForward className="w-4 h-4" />
                </button>
              </div>

              {/* Volume slider */}
              <input
                type="range"
                min="0"
                max="1"
                step="0.01"
                value={volume}
                onChange={(e) => setVolume(Number.parseFloat(e.target.value))}
                className="w-16 accent-blue-500"
              />
            </div>

            {/* Guide list */}
            <div className="mt-3 border-t border-white/20 pt-2">
              <p className="text-xs text-white/70 mb-1">All guides:</p>
              <div className="space-y-1 max-h-32 overflow-y-auto">
                {guides.map((guide, index) => (
                  <button
                    key={guide.id}
                    onClick={() => {
                      setCurrentGuide(index)
                      setIsPlaying(true)
                    }}
                    className={`w-full text-left text-xs p-1.5 rounded ${
                      currentGuide === index ? "bg-blue-600 text-white" : "text-white/80 hover:bg-white/10"
                    }`}
                  >
                    {guide.title}
                  </button>
                ))}
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
      )}
    </div>
  )
}

