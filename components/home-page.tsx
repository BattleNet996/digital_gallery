"use client"

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from "framer-motion"
import { useLanguage } from "./language-context"
import { ChevronRight, Globe, Volume2, VolumeX, Camera, Info, ArrowRight } from "lucide-react"

export default function HomePage({ onEnterGallery }) {
  const { t, toggleLanguage } = useLanguage()
  const [isMusicPlaying, setIsMusicPlaying] = useState(true)
  const [isLoaded, setIsLoaded] = useState(false)
  const [activeSlide, setActiveSlide] = useState(0)
  const [showAbout, setShowAbout] = useState(false)

  // Background images for the slideshow
  const backgroundImages = [
    "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/DJI_20250201221859_0973_D.JPG-1eq2QZR7x6aDeuJ5AxuhwZBcsCeGAU.jpeg",
    "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/DJI_20250201225405_0981_D.JPG-5OIp1zWJ93jWHw78RqUx7JH7e1DDSA.jpeg",
    "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/DJI_20250201221022_0967_D.JPG-kOWGwUFqbHvT7XVdznuswH5ochEahh.jpeg",
    "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/DJI_20250202000936_0004_D.JPG-E1AtEimf30epVC6siRsrFyTuZV3Edy.jpeg",
  ]

  useEffect(() => {
    // Simulate loading
    const timer = setTimeout(() => {
      setIsLoaded(true)
    }, 1000)

    return () => clearTimeout(timer)
  }, [])

  // Auto-advance slideshow
  useEffect(() => {
    if (isLoaded) {
      const interval = setInterval(() => {
        setActiveSlide((prev) => (prev + 1) % backgroundImages.length)
      }, 6000)
      return () => clearInterval(interval)
    }
  }, [isLoaded, backgroundImages.length])

  const toggleMusic = () => {
    setIsMusicPlaying(!isMusicPlaying)
    // Trigger music play/pause event
    const event = new CustomEvent("toggleMusic", { detail: { playing: !isMusicPlaying } })
    window.dispatchEvent(event)
  }

  return (
    <div className="relative w-full h-screen bg-black text-white overflow-hidden">
      {/* Background slideshow */}
      <AnimatePresence mode="wait">
        {backgroundImages.map(
          (image, index) =>
            activeSlide === index && (
              <motion.div
                key={`slide-${index}`}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 1.5 }}
                className="absolute inset-0 bg-cover bg-center"
                style={{
                  backgroundImage: `url(${image})`,
                  filter: "brightness(0.6) saturate(1.2)",
                }}
              />
            ),
        )}
      </AnimatePresence>

      {/* Gradient overlay - adjusted to be smaller and moved down */}
      <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent translate-y-[20%]" />
      <div className="absolute inset-0 bg-gradient-to-r from-black/40 via-transparent to-black/40" />

      {/* Animated particles effect */}
      <div className="absolute inset-0 z-0 opacity-30">
        <ParticlesEffect />
      </div>

      {/* Content */}
      <div className="relative z-10 flex flex-col items-center justify-center h-full px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="text-center max-w-3xl"
        >
          {/* Title with decorative elements */}
          <div className="mb-6 relative">
            <motion.div
              className="absolute -top-8 left-1/2 transform -translate-x-1/2 w-20 h-1 bg-gradient-to-r from-purple-500 to-blue-500"
              initial={{ width: 0 }}
              animate={{ width: 80 }}
              transition={{ duration: 1, delay: 0.5 }}
            />
            <h1 className="text-5xl md:text-7xl font-bold mb-2 text-white tracking-tight">{t.ui.galleryTitle}</h1>
            <p className="text-xl md:text-2xl mb-2 text-gray-300 italic">{t.ui.gallerySubtitle}</p>
            <motion.div
              className="absolute -bottom-4 left-1/2 transform -translate-x-1/2 w-40 h-1 bg-gradient-to-r from-blue-500 to-purple-500"
              initial={{ width: 0 }}
              animate={{ width: 160 }}
              transition={{ duration: 1, delay: 0.5 }}
            />
          </div>

          {/* Brief introduction text */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.7 }}
            className="text-lg text-gray-200 mb-6 max-w-2xl mx-auto"
          >
            Step into a virtual journey through the ancient ruins of Pompeii. Explore stunning photography and immerse
            yourself in Roman history.
          </motion.p>

          {/* Slideshow indicators */}
          <div className="flex justify-center space-x-2 mb-8">
            {backgroundImages.map((_, index) => (
              <button
                key={`indicator-${index}`}
                onClick={() => setActiveSlide(index)}
                className={`w-2 h-2 rounded-full transition-all duration-300 ${
                  activeSlide === index ? "bg-white w-6" : "bg-white/40"
                }`}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>

          {/* Enter gallery button - centered */}
          <div className="flex justify-center">
            <motion.button
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.6 }}
              whileHover={{ scale: 1.05, boxShadow: "0 0 15px rgba(255,255,255,0.3)" }}
              whileTap={{ scale: 0.95 }}
              onClick={onEnterGallery}
              className="bg-gradient-to-r from-purple-600 to-blue-600 text-white px-8 py-4 rounded-full text-lg font-medium flex items-center justify-center group shadow-lg shadow-purple-900/20"
            >
              <Camera className="mr-2 h-5 w-5" />
              {t.ui.enterGallery}
              <ChevronRight className="ml-2 group-hover:translate-x-1 transition-transform" />
            </motion.button>
          </div>

          {/* About button */}
          <motion.button
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.8 }}
            onClick={() => setShowAbout(true)}
            className="mt-4 text-white/80 hover:text-white flex items-center justify-center text-sm underline underline-offset-4 decoration-white/30 mx-auto"
          >
            <Info className="w-4 h-4 mr-1" />
            Learn more about this gallery
          </motion.button>
        </motion.div>

        {/* Featured artwork preview */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1 }}
          className="absolute bottom-16 left-0 right-0 flex justify-center"
        >
          <div className="flex space-x-4 overflow-x-auto px-4 py-2 max-w-4xl mx-auto">
            {backgroundImages.map((image, index) => (
              <motion.div
                key={`preview-${index}`}
                whileHover={{ y: -5, scale: 1.02 }}
                className="relative flex-shrink-0 cursor-pointer"
                onClick={() => setActiveSlide(index)}
              >
                <div
                  className={`w-24 h-16 md:w-32 md:h-20 bg-cover bg-center rounded-lg overflow-hidden border-2 transition-all duration-300 ${
                    activeSlide === index ? "border-white" : "border-transparent"
                  }`}
                  style={{ backgroundImage: `url(${image})` }}
                />
                {activeSlide === index && (
                  <motion.div
                    layoutId="activeIndicator"
                    className="absolute -bottom-1 left-0 right-0 h-1 bg-white rounded-full mx-2"
                  />
                )}
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Control buttons */}
      <div className="absolute top-4 right-4 flex gap-2 z-20">
        <motion.button
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          onClick={toggleLanguage}
          className="bg-white/10 hover:bg-white/20 p-2 rounded-full transition-colors backdrop-blur-sm"
          aria-label="Toggle language"
        >
          <Globe className="w-5 h-5" />
        </motion.button>
        <motion.button
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          onClick={toggleMusic}
          className="bg-white/10 hover:bg-white/20 p-2 rounded-full transition-colors backdrop-blur-sm"
          aria-label="Toggle music"
        >
          {isMusicPlaying ? <Volume2 className="w-5 h-5" /> : <VolumeX className="w-5 h-5" />}
        </motion.button>
      </div>

      {/* About modal */}
      <AnimatePresence>
        {showAbout && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4"
            onClick={() => setShowAbout(false)}
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="bg-gray-900 rounded-xl p-6 max-w-2xl relative border border-gray-800"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={() => setShowAbout(false)}
                className="absolute top-4 right-4 text-gray-400 hover:text-white"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <line x1="18" y1="6" x2="6" y2="18"></line>
                  <line x1="6" y1="6" x2="18" y2="18"></line>
                </svg>
              </button>
              <h2 className="text-2xl font-bold mb-4 text-white">{t.ui.aboutTitle}</h2>
              <div className="prose prose-invert max-w-none">
                <p className="text-gray-300 mb-4">{t.ui.aboutText}</p>
                <h3 className="text-xl font-semibold mb-2 text-white">Gallery Sections</h3>
                <ul className="space-y-3 mb-4">
                  <li className="flex items-start">
                    <ArrowRight className="w-5 h-5 mr-2 text-purple-400 flex-shrink-0 mt-0.5" />
                    <div>
                      <span className="font-semibold text-white">Main Exhibition Hall:</span>
                      <p className="text-gray-400 text-sm mt-1">
                        Panoramic views and overviews of Pompeii, providing context for your journey.
                      </p>
                    </div>
                  </li>
                  <li className="flex items-start">
                    <ArrowRight className="w-5 h-5 mr-2 text-purple-400 flex-shrink-0 mt-0.5" />
                    <div>
                      <span className="font-semibold text-white">Ancient Ruins Section:</span>
                      <p className="text-gray-400 text-sm mt-1">
                        Explore the well-preserved ancient Roman architecture and streets of Pompeii.
                      </p>
                    </div>
                  </li>
                  <li className="flex items-start">
                    <ArrowRight className="w-5 h-5 mr-2 text-purple-400 flex-shrink-0 mt-0.5" />
                    <div>
                      <span className="font-semibold text-white">Modern Perspective Section:</span>
                      <p className="text-gray-400 text-sm mt-1">
                        See Pompeii from a modern perspective, showing its relationship with the surrounding
                        environment.
                      </p>
                    </div>
                  </li>
                </ul>
                <p className="text-gray-300">
                  Navigate between sections using the teleportation portals at the end of each corridor. Click on
                  artworks to view them in detail.
                </p>
              </div>
              <div className="mt-6 pt-4 border-t border-gray-800 flex justify-end">
                <button
                  onClick={() => setShowAbout(false)}
                  className="bg-white/10 hover:bg-white/20 text-white px-4 py-2 rounded-lg transition-colors"
                >
                  Close
                </button>
                <button
                  onClick={() => {
                    setShowAbout(false)
                    onEnterGallery()
                  }}
                  className="ml-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white px-4 py-2 rounded-lg flex items-center"
                >
                  Enter Gallery <ChevronRight className="ml-1 w-4 h-4" />
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Loading screen */}
      <AnimatePresence>
        {!isLoaded && (
          <motion.div
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            className="absolute inset-0 bg-black z-50 flex items-center justify-center"
          >
            <div className="text-center">
              <div className="w-16 h-16 relative mx-auto mb-6">
                <div className="absolute top-0 left-0 w-full h-full border-4 border-t-purple-500 border-r-blue-500 border-b-purple-500 border-l-blue-500 rounded-full animate-spin"></div>
                <div className="absolute top-2 left-2 right-2 bottom-2 bg-black rounded-full flex items-center justify-center">
                  <Camera className="w-6 h-6 text-white" />
                </div>
              </div>
              <h2 className="text-2xl font-bold">{t.ui.loading}</h2>
              <p className="text-gray-400 mt-2 text-sm">Preparing your gallery experience...</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

// Animated particles background effect
function ParticlesEffect() {
  // 使用useEffect确保只在客户端渲染
  const [mounted, setMounted] = useState(false)
  
  // 预先生成所有粒子的随机属性
  const [particles] = useState(() => 
    Array.from({ length: 50 }).map(() => ({
      top: `${Math.random() * 100}%`,
      left: `${Math.random() * 100}%`,
      opacity: Math.random() * 0.5 + 0.3,
      duration: `${Math.random() * 10 + 10}s`,
      delay: `${Math.random() * 10}s`,
      offset: Math.random() * 100 - 50
    }))
  )
  
  useEffect(() => {
    setMounted(true)
  }, [])
  
  // 如果组件尚未挂载，返回占位符
  if (!mounted) return <div className="absolute inset-0" />
  
  return (
    <div className="absolute inset-0">
      {particles.map((particle, i) => (
        <div
          key={i}
          className="absolute w-1 h-1 bg-white rounded-full"
          style={{
            top: particle.top,
            left: particle.left,
            opacity: particle.opacity,
            animation: `float-${i} ${particle.duration} linear infinite`,
            animationDelay: particle.delay,
          }}
        />
      ))}
      <style jsx>{`
        ${particles.map((particle, i) => `
          @keyframes float-${i} {
            0% {
              transform: translateY(0) translateX(0);
              opacity: 0;
            }
            50% {
              opacity: 0.8;
            }
            100% {
              transform: translateY(-100vh) translateX(${particle.offset}px);
              opacity: 0;
            }
          }
        `).join('\n')}
      `}</style>
    </div>
  )
}
