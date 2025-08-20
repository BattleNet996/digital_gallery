"use client"

import { Suspense } from "react"
import dynamic from "next/dynamic"
import LoadingScreen from "./loading-screen"
import { ArrowLeft } from "lucide-react"
import { useLanguage } from "./language-context"

// 动态导入 3D 画廊组件以避免 SSR 问题
const Gallery = dynamic(() => import("@/components/gallery"), {
  ssr: false,
  loading: () => <LoadingScreen />,
})

export default function GalleryExperience({ onExit }) {
  const { t } = useLanguage()

  return (
    <div className="relative w-full h-screen">
      <Suspense fallback={<LoadingScreen />}>
        <Gallery />
      </Suspense>

      {/* 退出按钮 */}
      <button
        onClick={onExit}
        className="absolute top-4 left-4 z-50 bg-black/50 hover:bg-black/70 text-white px-4 py-2 rounded-full flex items-center transition-colors"
      >
        <ArrowLeft className="mr-2 w-4 h-4" />
        {t.ui.exitGallery}
      </button>
    </div>
  )
}

