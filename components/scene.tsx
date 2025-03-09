"use client"

import { useState, useEffect } from "react"
import { RigidBody } from "@react-three/rapier"
import ArtworkFrame from "./artwork-frame"

// 使用您提供的图片
const GALLERY_IMAGES = [
  "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/DJI_20250201221859_0973_D.JPG-1eq2QZR7x6aDeuJ5AxuhwZBcsCeGAU.jpeg", // 庞贝古城遗址鸟瞰图
  "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/DJI_20250201225405_0981_D.JPG-5OIp1zWJ93jWHw78RqUx7JH7e1DDSA.jpeg", // 庞贝古城街道与人物
  "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/DJI_20250202000936_0004_D.JPG-E1AtEimf30epVC6siRsrFyTuZV3Edy.jpeg", // 庞贝火车站
  "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/DJI_20250201221022_0967_D.JPG-kOWGwUFqbHvT7XVdznuswH5ochEahh.jpeg", // 庞贝壁画
  "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/DJI_20250201230358_0991_D.JPG-LUlSBLwb26WIbbuO6s58cOfwh4B2L8.jpeg", // 庞贝古城街道
  // 右侧墙面的图片（重复使用相同图片以填满墙面）
  "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/DJI_20250201221859_0973_D.JPG-1eq2QZR7x6aDeuJ5AxuhwZBcsCeGAU.jpeg",
  "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/DJI_20250201225405_0981_D.JPG-5OIp1zWJ93jWHw78RqUx7JH7e1DDSA.jpeg",
  "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/DJI_20250202000936_0004_D.JPG-E1AtEimf30epVC6siRsrFyTuZV3Edy.jpeg",
  "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/DJI_20250201221022_0967_D.JPG-kOWGwUFqbHvT7XVdznuswH5ochEahh.jpeg",
  "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/DJI_20250201230358_0991_D.JPG-LUlSBLwb26WIbbuO6s58cOfwh4B2L8.jpeg",
]

// 预加载图片函数
function preloadImages(urls: string[]) {
  return urls.map((url) => {
    const img = new Image()
    img.src = url
    img.crossOrigin = "anonymous" // 解决CORS问题
    return img
  })
}

export default function Scene() {
  const [artworks, setArtworks] = useState(GALLERY_IMAGES)

  // 预加载图片
  useEffect(() => {
    const preloadedImages = preloadImages(GALLERY_IMAGES)

    // 确保图片加载完成
    Promise.all(
      preloadedImages.map(
        (img) =>
          new Promise((resolve) => {
            img.onload = resolve
            img.onerror = resolve // 即使加载失败也继续
          }),
      ),
    ).then(() => {
      console.log("所有图片预加载完成")
    })
  }, [])

  return (
    <>
      {/* 地板 */}
      <RigidBody type="fixed" colliders="cuboid">
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]} receiveShadow>
          <planeGeometry args={[50, 50]} />
          <meshStandardMaterial color="#333" />
        </mesh>
      </RigidBody>

      {/* 天花板 */}
      <RigidBody type="fixed" colliders="cuboid">
        <mesh rotation={[Math.PI / 2, 0, 0]} position={[0, 4, 0]}>
          <planeGeometry args={[50, 50]} />
          <meshStandardMaterial color="#222" />
        </mesh>
      </RigidBody>

      {/* 左墙 */}
      <RigidBody type="fixed" colliders="cuboid">
        <mesh rotation={[0, Math.PI / 2, 0]} position={[-5, 2, 0]}>
          <planeGeometry args={[50, 4]} />
          <meshStandardMaterial color="#333" />
        </mesh>

        {/* 左墙上的画作 */}
        {artworks.slice(0, 5).map((artwork, index) => (
          <ArtworkFrame
            key={`left-${index}`}
            position={[-4.9, 2, -10 + index * 5]}
            rotation={[0, Math.PI / 2, 0]}
            imageUrl={artwork}
            size={[3, 2]}
          />
        ))}
      </RigidBody>

      {/* 右墙 */}
      <RigidBody type="fixed" colliders="cuboid">
        <mesh rotation={[0, -Math.PI / 2, 0]} position={[5, 2, 0]}>
          <planeGeometry args={[50, 4]} />
          <meshStandardMaterial color="#333" />
        </mesh>

        {/* 右墙上的画作 */}
        {artworks.slice(5, 10).map((artwork, index) => (
          <ArtworkFrame
            key={`right-${index}`}
            position={[4.9, 2, -10 + index * 5]}
            rotation={[0, -Math.PI / 2, 0]}
            imageUrl={artwork}
            size={[3, 2]}
          />
        ))}
      </RigidBody>

      {/* 走廊尽头的墙 */}
      <RigidBody type="fixed" colliders="cuboid">
        <mesh position={[0, 2, -20]}>
          <planeGeometry args={[10, 4]} />
          <meshStandardMaterial color="#333" />
        </mesh>
      </RigidBody>

      {/* 走廊入口的墙 */}
      <RigidBody type="fixed" colliders="cuboid">
        <mesh rotation={[0, Math.PI, 0]} position={[0, 2, 10]}>
          <planeGeometry args={[10, 4]} />
          <meshStandardMaterial color="#333" />
        </mesh>
      </RigidBody>

      {/* 灯光 */}
      <ambientLight intensity={0.5} />
      {Array.from({ length: 5 }).map((_, index) => (
        <pointLight
          key={`light-${index}`}
          position={[0, 3.5, -10 + index * 5]}
          intensity={10}
          distance={10}
          castShadow
        />
      ))}
    </>
  )
}

