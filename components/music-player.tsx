"use client"

import { useEffect, useRef, useState } from "react"

export default function MusicPlayer({ isPlaying = true }) {
  const audioRef = useRef<HTMLAudioElement | null>(null)
  const [volume, setVolume] = useState(0.3)

  useEffect(() => {
    // 创建音频元素
    if (!audioRef.current) {
      // 使用本地音乐文件
      audioRef.current = new Audio("/audio/chopin-nocturne-9-116605.mp3")
      audioRef.current.loop = true
      audioRef.current.volume = volume
    }

    // 监听自定义事件
    const handleToggleMusic = (e: CustomEvent) => {
      if (e.detail.playing) {
        audioRef.current?.play()
      } else {
        audioRef.current?.pause()
      }
    }

    window.addEventListener("toggleMusic", handleToggleMusic as EventListener)

    // 初始状态
    if (isPlaying) {
      audioRef.current.play().catch((e) => console.log("Audio autoplay was prevented:", e))
    }

    return () => {
      window.removeEventListener("toggleMusic", handleToggleMusic as EventListener)
      audioRef.current?.pause()
      audioRef.current = null
    }
  }, [])

  // 当isPlaying属性变化时控制音频
  useEffect(() => {
    if (isPlaying) {
      audioRef.current?.play().catch((e) => console.log("Audio play was prevented:", e))
    } else {
      audioRef.current?.pause()
    }
  }, [isPlaying])

  return null // 无需渲染任何UI元素
}
