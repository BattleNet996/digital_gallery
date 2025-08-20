"use client"

import { useEffect, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { X, MapPin, Calendar, Info } from "lucide-react"
import type { ArtworkMetadata } from "./modal-context"
import { useLanguage } from "./language-context"

type ArtworkModalProps = {
  imageUrl: string
  metadata: ArtworkMetadata | null
  isOpen: boolean
  onClose: () => void
}

export default function ArtworkModal({ imageUrl, metadata, isOpen, onClose }: ArtworkModalProps) {
  const [loaded, setLoaded] = useState(false)
  const { t } = useLanguage()

  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose()
      }
    }

    if (isOpen) {
      window.addEventListener("keydown", handleEsc)
    }

    return () => {
      window.removeEventListener("keydown", handleEsc)
    }
  }, [isOpen, onClose])

  // If no image URL, don't render anything
  if (!imageUrl && !isOpen) return null

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-sm"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.5, opacity: 0, y: 20 }}
            animate={{
              scale: 1,
              opacity: 1,
              y: 0,
              transition: {
                type: "spring",
                damping: 20,
                stiffness: 100,
              },
            }}
            exit={{
              scale: 0.8,
              opacity: 0,
              y: -20,
              transition: {
                duration: 0.3,
              },
            }}
            className="relative max-w-[90vw] max-h-[90vh]"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close button */}
            <motion.button
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={{ delay: 0.2 }}
              onClick={onClose}
              className="absolute -top-4 -right-4 z-10 p-2 rounded-full bg-black/50 text-white hover:bg-black/70 transition-colors"
            >
              <X size={24} />
            </motion.button>

            {/* Frame */}
            <motion.div
              className="p-4 bg-[#8a6d3b] rounded-lg shadow-2xl overflow-hidden"
              layoutId={`frame-${imageUrl}`}
            >
              {/* Image container */}
              <div className="relative">
                <motion.img
                  src={imageUrl}
                  alt={metadata?.title || "Artwork"}
                  className={`max-w-full max-h-[70vh] object-contain ${loaded ? "opacity-100" : "opacity-0"}`}
                  onLoad={() => setLoaded(true)}
                  layoutId={`artwork-${imageUrl}`}
                />

                {/* Loading state */}
                {!loaded && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="absolute inset-0 flex items-center justify-center"
                  >
                    <div className="w-8 h-8 border-4 border-t-white border-white/30 rounded-full animate-spin" />
                  </motion.div>
                )}
              </div>

              {/* Metadata information */}
              {metadata && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className="mt-4 text-white"
                >
                  <h3 className="text-xl font-bold">{metadata.title}</h3>

                  <div className="mt-2 space-y-1 text-sm">
                    {metadata.location && (
                      <div className="flex items-center">
                        <MapPin className="w-4 h-4 mr-2" />
                        <span>{metadata.location}</span>
                      </div>
                    )}

                    {metadata.date && (
                      <div className="flex items-center">
                        <Calendar className="w-4 h-4 mr-2" />
                        <span>{metadata.date}</span>
                      </div>
                    )}

                    {metadata.description && (
                      <div className="flex items-start mt-2">
                        <Info className="w-4 h-4 mr-2 mt-1 flex-shrink-0" />
                        <p className="text-sm">{metadata.description}</p>
                      </div>
                    )}
                  </div>
                </motion.div>
              )}
            </motion.div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

