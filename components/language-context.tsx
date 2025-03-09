"use client"

import { createContext, useContext, useState, type ReactNode } from "react"

type Language = "zh" | "en"

type Translations = {
  controls: {
    title: string
    forward: string
    backward: string
    left: string
    right: string
    mouse: string
    click: string
    escape: string
  }
  ui: {
    loading: string
    languageSwitch: string
    musicToggle: string
    enterGallery: string
    exitGallery: string
    galleryTitle: string
    gallerySubtitle: string
    aboutTitle: string
    aboutText: string
  }
  sections: {
    popei: {
      title: string
      description: string
    }
    rome: {
      title: string
      description: string
    }
    vatican: {
      title: string
      description: string
    }
    venice: {
      title: string
      description: string
    }
  }
}

const translations: Record<Language, Translations> = {
  zh: {
    controls: {
      title: "控制说明：",
      forward: "W / ↑ - 前进",
      backward: "S / ↓ - 后退",
      left: "A / ← - 左移",
      right: "D / → - 右移",
      mouse: "鼠标 - 左右视角控制",
      click: "点击画作 - 放大图片",
      escape: "Press ESC - 退出放大",
    },
    ui: {
      loading: "加载中...",
      languageSwitch: "English",
      musicToggle: "肖邦夜曲：开/关",
      enterGallery: "进入画廊",
      exitGallery: "退出画廊",
      galleryTitle: "Charles的画廊",
      gallerySubtitle: "一场穿越时空的艺术之旅",
      aboutTitle: "关于画廊",
      aboutText:
        "这个虚拟画廊展示了Charles在意大利庞贝古城的旅行摄影作品。通过这个沉浸式3D体验，您可以探索古罗马文明的遗迹和艺术。",
    },
    sections: {
      popei: {
        title: "庞贝遗址",
        description: "这个展区展示了庞贝古城保存完好的古罗马建筑和街道。这些遗迹被火山灰完美保存了近2000年。",
      },
      rome: {
        title: "罗马风光",
        description: "这个展区展示了罗马市区的著名建筑和历史古迹，展现了古代罗马文明的辉煌成就。",
      },
      vatican: {
        title: "梵蒂冈艺术",
        description: "这个展区集中展示梵蒂冈的宗教艺术和建筑，包括圣彼得大教堂和梵蒂冈博物馆的艺术珍品。",
      },
      venice: {
        title: "威尼斯水城",
        description: "这个展区带您领略威尼斯的水城风光，包括运河、桥梁和独特的水上建筑，展现意大利水城的魅力。",
      },
    },
  },
  en: {
    controls: {
      title: "Controls:",
      forward: "W / ↑ - Move Forward",
      backward: "S / ↓ - Move Backward",
      left: "A / ← - Move Left",
      right: "D / → - Move Right",
      mouse: "Mouse - Horizontal View Control",
      click: "Click Artwork - Enlarge",
      escape: "Press ESC - Exit Enlarged View",
    },
    ui: {
      loading: "Loading...",
      languageSwitch: "中文",
      musicToggle: "Music: On/Off",
      enterGallery: "Enter Gallery",
      exitGallery: "Exit Gallery",
      galleryTitle: "Charles's Gallery",
      gallerySubtitle: "An Artistic Journey Through Time and Space",
      aboutTitle: "About the Gallery",
      aboutText:
        "This virtual gallery showcases Charles's travel photography from Pompeii, Italy. Through this immersive 3D experience, you can explore the ruins and art of ancient Roman civilization.",
    },
    sections: {
      popei: {
        title: "Pompeii Ruins",
        description: "This section showcases the well-preserved ancient Roman architecture and streets of Pompeii. These ruins were perfectly preserved by volcanic ash for nearly 2000 years.",
      },
      rome: {
        title: "Rome Cityscape",
        description: "This section displays famous buildings and historical monuments in Rome, showcasing the magnificent achievements of ancient Roman civilization.",
      },
      vatican: {
        title: "Vatican Arts",
        description: "This section focuses on religious art and architecture in Vatican City, including St. Peter's Basilica and art treasures from the Vatican Museums.",
      },
      venice: {
        title: "Venice Waterways",
        description: "This section takes you through the waterways of Venice, including canals, bridges, and unique water-based architecture, showcasing the charm of Italy's water city.",
      },
    },
  },
}

type LanguageContextType = {
  language: Language
  t: Translations
  toggleLanguage: () => void
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined)

export function LanguageProvider({
  children,
  defaultLanguage = "zh",
}: { children: ReactNode; defaultLanguage?: Language }) {
  const [language, setLanguage] = useState<Language>(defaultLanguage)

  const toggleLanguage = () => {
    setLanguage((prev) => (prev === "zh" ? "en" : "zh"))
  }

  const value = {
    language,
    t: translations[language],
    toggleLanguage,
  }

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>
}

export function useLanguage() {
  const context = useContext(LanguageContext)
  if (context === undefined) {
    throw new Error("useLanguage must be used within a LanguageProvider")
  }
  return context
}
