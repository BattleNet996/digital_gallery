"use client"

import { useState } from "react"
import { LanguageProvider } from "@/components/language-context"
import HomePage from "@/components/home-page"
import GalleryExperience from "@/components/gallery-experience"

export default function Home() {
  const [showGallery, setShowGallery] = useState(false)

  const enterGallery = () => {
    setShowGallery(true)
  }

  const exitGallery = () => {
    setShowGallery(false)
  }

  return (
    <LanguageProvider defaultLanguage="en">
      {showGallery ? <GalleryExperience onExit={exitGallery} /> : <HomePage onEnterGallery={enterGallery} />}
    </LanguageProvider>
  )
}

