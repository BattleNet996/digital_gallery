"use client"

import { createContext, useContext, useState, type ReactNode } from "react"

// Artwork metadata type
export type ArtworkMetadata = {
  title: string
  location?: string
  date?: string
  description?: string
}

type ModalContextType = {
  openModal: (imageUrl: string, metadata?: ArtworkMetadata) => void
  closeModal: () => void
  isModalOpen: boolean
  currentImage: string | null
  currentMetadata: ArtworkMetadata | null
}

const ModalContext = createContext<ModalContextType | undefined>(undefined)

export function ModalProvider({ children }: { children: ReactNode }) {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [currentImage, setCurrentImage] = useState<string | null>(null)
  const [currentMetadata, setCurrentMetadata] = useState<ArtworkMetadata | null>(null)

  const openModal = (imageUrl: string, metadata?: ArtworkMetadata) => {
    setCurrentImage(imageUrl)
    setCurrentMetadata(metadata || null)
    setIsModalOpen(true)
  }

  const closeModal = () => {
    setIsModalOpen(false)
    // Delay clearing image URL to allow exit animation to complete
    setTimeout(() => {
      setCurrentImage(null)
      setCurrentMetadata(null)
    }, 300)
  }

  return (
    <ModalContext.Provider
      value={{
        openModal,
        closeModal,
        isModalOpen,
        currentImage,
        currentMetadata,
      }}
    >
      {children}
    </ModalContext.Provider>
  )
}

export function useModal() {
  const context = useContext(ModalContext)
  if (context === undefined) {
    throw new Error("useModal must be used within a ModalProvider")
  }
  return context
}

