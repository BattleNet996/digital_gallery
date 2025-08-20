"use client"

import { useLanguage } from "./language-context"

export default function LoadingScreen() {
  const { t } = useLanguage()

  return (
    <div className="w-full h-screen flex items-center justify-center bg-black text-white">
      <div className="text-center">
        <div className="w-16 h-16 border-4 border-t-primary rounded-full animate-spin mx-auto mb-4"></div>
        <h2 className="text-2xl font-bold">{t.ui.loading}</h2>
      </div>
    </div>
  )
}

