"use client"
import { useLanguage } from "./language-context"
import { useState } from "react"
import { ChevronUp, ChevronDown } from "lucide-react"

export default function UI({ toggleMusic, isMusicPlaying, debug = false, currentSection = "popei" }) {
  const { t, toggleLanguage } = useLanguage()
  const [showControls, setShowControls] = useState(true)

  return (
    <div className="absolute top-0 left-0 w-full h-full pointer-events-none">
      {/* Controls panel with toggle */}
      <div className="absolute top-4 left-4 z-10 pointer-events-auto">
        <div className="bg-black/80 rounded-lg overflow-hidden">
          {/* Toggle button */}
          <button
            onClick={() => setShowControls(!showControls)}
            className="w-full px-4 py-2 flex items-center justify-between text-white hover:bg-black/90"
          >
            <span className="font-bold">{t.controls.title}</span>
            {showControls ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>

          {/* Controls content */}
          {showControls && (
            <div className="p-4 space-y-1 text-sm text-white">
              <ul className="space-y-1">
                <li>{t.controls.forward}</li>
                <li>{t.controls.backward}</li>
                <li>{t.controls.left}</li>
                <li>{t.controls.right}</li>
                <li>{t.controls.mouse}</li>
                <li>{t.controls.click}</li>
                <li>{t.controls.escape}</li>
              </ul>

              <div className="mt-2 pt-2 border-t border-white/20">
                <p className="text-green-400 text-xs">Tip: Click and drag to look around</p>
                <p className="text-xs text-white/80 mt-1">Look for portals at the end of each corridor</p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Language and music controls */}
      <div className="absolute top-4 right-4 flex gap-2 pointer-events-auto z-10">
        <button
          onClick={toggleLanguage}
          className="bg-black/80 hover:bg-black text-white px-3 py-1 rounded transition-colors"
        >
          {t.ui.languageSwitch}
        </button>
        <button
          onClick={toggleMusic}
          className="bg-black/80 hover:bg-black text-white px-3 py-1 rounded transition-colors"
        >
          {isMusicPlaying ? "🔊 Chopin Nocturne" : "🔇 Play Chopin"}
        </button>
      </div>

      {/* Section title */}
      <div className="absolute top-4 left-1/2 -translate-x-1/2 bg-black/80 text-white px-4 py-2 rounded text-center">
        {t.sections[currentSection].title}
      </div>

      {/* Debug overlay */}
      {debug && (
        <div className="absolute bottom-4 right-4 bg-black/80 text-white p-3 rounded text-xs space-y-1 pointer-events-auto">
          <div className="opacity-50">Debug Info</div>
          <div>Section: {currentSection}</div>
        </div>
      )}
    </div>
  )
}
