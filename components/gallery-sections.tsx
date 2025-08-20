"use client"

import { useEffect, useState } from "react"
import { RigidBody } from "@react-three/rapier"
import { useLanguage } from "./language-context"
import ArtworkFrame from "./artwork-frame"
import SectionInfo from "./section-info"
import TeleportPortal from "./teleport-portal"

// Artwork data with metadata for each city
const ARTWORKS = [
  // Iceland section (10 artworks)
  {
    id: "iceland-1",
    imageUrl: "/images/Iceland/" + encodeURIComponent("极光3.jpeg"),
    section: "iceland",
    position: [-4.9, 2, -3],
    rotation: [0, Math.PI / 2, 0],
    size: [3, 2],
    metadata: {
      title: "Northern Lights",
      location: "Iceland",
      date: "March 2025",
      description: "The mesmerizing aurora borealis dancing across the Icelandic night sky.",
    },
  },
  {
    id: "iceland-2",
    imageUrl: "/images/Iceland/" + encodeURIComponent("蓝冰洞1.jpeg"),
    section: "iceland",
    position: [4.9, 2, -3],
    rotation: [0, -Math.PI / 2, 0],
    size: [3, 2],
    metadata: {
      title: "Blue Ice Cave",
      location: "Vatnajökull Glacier, Iceland",
      date: "March 2025",
      description: "Inside the stunning blue ice cave of Vatnajökull, Europe's largest glacier.",
    },
  },
  {
    id: "iceland-3",
    imageUrl: "/images/Iceland/" + encodeURIComponent("蓝冰洞2.jpeg"),
    section: "iceland",
    position: [-4.9, 2, -8],
    rotation: [0, Math.PI / 2, 0],
    size: [3, 2],
    metadata: {
      title: "Ice Cave Formations",
      location: "Vatnajökull Glacier, Iceland",
      date: "March 2025",
      description: "The magical ice formations inside a glacier cave, shaped by centuries of ice flow and meltwater.",
    },
  },
  {
    id: "iceland-4",
    imageUrl: "/images/Iceland/" + encodeURIComponent("蓝冰洞3.jpeg"),
    section: "iceland",
    position: [4.9, 2, -8],
    rotation: [0, -Math.PI / 2, 0],
    size: [3, 2],
    metadata: {
      title: "Crystal Ice Ceiling",
      location: "Vatnajökull Ice Cave, Iceland",
      date: "March 2025",
      description: "The translucent blue ceiling of an ice cave, revealing layers of compressed ancient ice.",
    },
  },
  {
    id: "iceland-5",
    imageUrl: "/images/Iceland/" + encodeURIComponent("霍芬_天涯海角.jpeg"),
    section: "iceland",
    position: [-4.9, 2, -13],
    rotation: [0, Math.PI / 2, 0],
    size: [3, 2],
    metadata: {
      title: "Höfn Coastline",
      location: "Höfn, Iceland",
      date: "March 2025",
      description: "The dramatic meeting of land and sea at Höfn, often called 'the edge of the world' for its remote beauty.",
    },
  },
  {
    id: "iceland-6",
    imageUrl: "/images/Iceland/" + encodeURIComponent("霍芬_极光.jpeg"),
    section: "iceland",
    position: [4.9, 2, -13],
    rotation: [0, -Math.PI / 2, 0],
    size: [3, 2],
    metadata: {
      title: "Aurora Over Höfn",
      location: "Höfn, Iceland",
      date: "March 2025",
      description: "The northern lights illuminating the night sky over the coastal town of Höfn.",
    },
  },
  {
    id: "iceland-7",
    imageUrl: "/images/Iceland/" + encodeURIComponent("彩虹.jpeg"),
    section: "iceland",
    position: [-4.9, 2, -18],
    rotation: [0, Math.PI / 2, 0],
    size: [3, 2],
    metadata: {
      title: "Icelandic Rainbow",
      location: "Southern Iceland",
      date: "March 2025",
      description: "A vibrant rainbow arching over Iceland's dramatic landscape after a brief rain shower.",
    },
  },
  {
    id: "iceland-8",
    imageUrl: "/images/Iceland/" + encodeURIComponent("飞机残骸.jpeg"),
    section: "iceland",
    position: [4.9, 2, -18],
    rotation: [0, -Math.PI / 2, 0],
    size: [3, 2],
    metadata: {
      title: "Sólheimasandur Plane Wreck",
      location: "Sólheimasandur, Iceland",
      date: "March 2025",
      description: "The hauntingly beautiful wreckage of a US Navy DC-3 plane that crashed on the black sand beach in 1973.",
    },
  },
  {
    id: "iceland-9",
    imageUrl: "/images/Iceland/" + encodeURIComponent("Vik_ 红房子.jpeg"),
    section: "iceland",
    position: [-4.9, 2, -23],
    rotation: [0, Math.PI / 2, 0],
    size: [3, 2],
    metadata: {
      title: "Red House in Vík",
      location: "Vík í Mýrdal, Iceland",
      date: "March 2025",
      description: "A charming red house in the picturesque coastal village of Vík, surrounded by Iceland's dramatic landscapes.",
    },
  },
  {
    id: "iceland-10",
    imageUrl: "/images/Iceland/" + encodeURIComponent("雷克雅未克.jpeg"),
    section: "iceland",
    position: [4.9, 2, -23],
    rotation: [0, -Math.PI / 2, 0],
    size: [3, 2],
    metadata: {
      title: "Reykjavík Cityscape",
      location: "Reykjavík, Iceland",
      date: "March 2025",
      description: "A view of Reykjavík, the world's northernmost capital city, with its colorful buildings and Hallgrímskirkja church.",
    },
  },

  // Popei (Pompeii) section (6 artworks)
  {
    id: "popei-1",
    imageUrl: "/images/Popei/DJI_20250201220109_0959_D.JPG",
    section: "popei",
    position: [-4.9, 2, -3],
    rotation: [0, Math.PI / 2, 0],
    size: [3, 2],
    metadata: {
      title: "Pompeii Forum Overview",
      location: "Pompeii Archaeological Park, Italy",
      date: "2025",
      description: "Aerial view of the ancient Roman forum in Pompeii, the central public space of the city.",
    },
  },
  {
    id: "popei-2",
    imageUrl: "/images/Popei/DJI_20250201220902_0966_D.JPG",
    section: "popei",
    position: [4.9, 2, -3],
    rotation: [0, -Math.PI / 2, 0],
    size: [3, 2],
    metadata: {
      title: "Pompeii Streets",
      location: "Via dell'Abbondanza, Pompeii",
      date: "2025",
      description: "The main commercial street of ancient Pompeii with well-preserved stone pavements and buildings.",
    },
  },
  {
    id: "popei-3",
    imageUrl: "/images/Popei/DJI_20250201221022_0967_D.JPG",
    section: "popei",
    position: [-4.9, 2, -8],
    rotation: [0, Math.PI / 2, 0],
    size: [3, 2],
    metadata: {
      title: "House of the Faun",
      location: "Pompeii Archaeological Park, Italy",
      date: "2025",
      description: "One of the largest and most impressive residences in Pompeii, known for its exquisite mosaics.",
    },
  },
  {
    id: "popei-4",
    imageUrl: "/images/Popei/DJI_20250201221859_0973_D.JPG",
    section: "popei",
    position: [4.9, 2, -8],
    rotation: [0, -Math.PI / 2, 0],
    size: [3, 2],
    metadata: {
      title: "Pompeii Amphitheater",
      location: "Pompeii Archaeological Park, Italy",
      date: "2025",
      description: "The ancient Roman amphitheater in Pompeii, one of the oldest surviving stone amphitheaters.",
    },
  },
  {
    id: "popei-5",
    imageUrl: "/images/Popei/DJI_20250202210832_0015_D.JPG",
    section: "popei",
    position: [-4.9, 2, -13],
    rotation: [0, Math.PI / 2, 0],
    size: [3, 2],
    metadata: {
      title: "Temple of Apollo",
      location: "Pompeii Forum, Italy",
      date: "2025",
      description: "The ruins of the Temple of Apollo, one of the oldest religious buildings in Pompeii.",
    },
  },
  {
    id: "popei-6",
    imageUrl: "/images/Popei/DJI_20250202213115_0028_D.JPG",
    section: "popei",
    position: [4.9, 2, -13],
    rotation: [0, -Math.PI / 2, 0],
    size: [3, 2],
    metadata: {
      title: "Villa of the Mysteries",
      location: "Pompeii Archaeological Park, Italy",
      date: "2025",
      description: "A well-preserved Roman villa on the outskirts of Pompeii, famous for its exceptional frescoes.",
    },
  },

  // Rome section (6 artworks)
  {
    id: "rome-1",
    imageUrl: "/images/Rome/DJI_20250119230401_0089_D.JPG",
    section: "rome",
    position: [-4.9, 2, -3],
    rotation: [0, Math.PI / 2, 0],
    size: [3, 2],
    metadata: {
      title: "Roman Colosseum",
      location: "Rome, Italy",
      date: "2025",
      description: "The iconic Colosseum, the largest amphitheater ever built, symbolizing imperial Rome's power.",
    },
  },
  {
    id: "rome-2",
    imageUrl: "/images/Rome/DJI_20250120222428_0136_D.jpg",
    section: "rome",
    position: [4.9, 2, -3],
    rotation: [0, -Math.PI / 2, 0],
    size: [3, 2],
    metadata: {
      title: "Roman Forum",
      location: "Rome, Italy",
      date: "2025",
      description: "The heart of ancient Rome, containing the ruins of several important ancient government buildings.",
    },
  },
  {
    id: "rome-3",
    imageUrl: "/images/Rome/DJI_20250128001948_0674_D.jpg",
    section: "rome",
    position: [-4.9, 2, -8],
    rotation: [0, Math.PI / 2, 0],
    size: [3, 2],
    metadata: {
      title: "Trevi Fountain",
      location: "Rome, Italy",
      date: "2025",
      description: "The largest Baroque fountain in Rome and one of the most famous fountains in the world.",
    },
  },
  {
    id: "rome-4",
    imageUrl: "/images/Rome/DJI_20250128022635_0679_D.jpg",
    section: "rome",
    position: [4.9, 2, -8],
    rotation: [0, -Math.PI / 2, 0],
    size: [3, 2],
    metadata: {
      title: "Pantheon",
      location: "Rome, Italy",
      date: "2025",
      description: "A former Roman temple, now a church, featuring the world's largest unreinforced concrete dome.",
    },
  },
  {
    id: "rome-5",
    imageUrl: "/images/Rome/DJI_20250128221559_0693_D.jpg",
    section: "rome",
    position: [-4.9, 2, -13],
    rotation: [0, Math.PI / 2, 0],
    size: [3, 2],
    metadata: {
      title: "Piazza Navona",
      location: "Rome, Italy",
      date: "2025",
      description: "A public square built on the site of the Stadium of Domitian, featuring beautiful Baroque architecture.",
    },
  },
  {
    id: "rome-6",
    imageUrl: "/images/Rome/DJI_20250204003251_0078_D.JPG",
    section: "rome",
    position: [4.9, 2, -13],
    rotation: [0, -Math.PI / 2, 0],
    size: [3, 2],
    metadata: {
      title: "Spanish Steps",
      location: "Rome, Italy",
      date: "2025",
      description: "A monumental stairway of 135 steps connecting the Piazza di Spagna and Trinità dei Monti church.",
    },
  },

  // Vatican section (6 artworks)
  {
    id: "vatican-1",
    imageUrl: "/images/Vatican/DJI_20250121222137_0237_D.jpg",
    section: "vatican",
    position: [-4.9, 2, -3],
    rotation: [0, Math.PI / 2, 0],
    size: [3, 2],
    metadata: {
      title: "St. Peter's Basilica",
      location: "Vatican City",
      date: "2025",
      description: "The largest church in the world and a masterpiece of Renaissance architecture.",
    },
  },
  {
    id: "vatican-2",
    imageUrl: "/images/Vatican/DJI_20250121222959_0250_D.jpg",
    section: "vatican",
    position: [4.9, 2, -3],
    rotation: [0, -Math.PI / 2, 0],
    size: [3, 2],
    metadata: {
      title: "St. Peter's Square",
      location: "Vatican City",
      date: "2025",
      description: "The iconic plaza designed by Bernini in front of St. Peter's Basilica, with its distinctive colonnade.",
    },
  },
  {
    id: "vatican-3",
    imageUrl: "/images/Vatican/DJI_20250121232010_0281_D.jpg",
    section: "vatican",
    position: [-4.9, 2, -8],
    rotation: [0, Math.PI / 2, 0],
    size: [3, 2],
    metadata: {
      title: "Sistine Chapel",
      location: "Vatican Museums, Vatican City",
      date: "2025",
      description: "The chapel famous for its ceiling painted by Michelangelo, showing scenes from Genesis.",
    },
  },
  {
    id: "vatican-4",
    imageUrl: "/images/Vatican/DJI_20250122002419_0295_D.jpg",
    section: "vatican",
    position: [4.9, 2, -8],
    rotation: [0, -Math.PI / 2, 0],
    size: [3, 2],
    metadata: {
      title: "Vatican Museums",
      location: "Vatican City",
      date: "2025",
      description: "The museums containing works from the immense collection built up by the Roman Catholic Church.",
    },
  },
  {
    id: "vatican-5",
    imageUrl: "/images/Vatican/DJI_20250122003726_0309_D.jpg",
    section: "vatican",
    position: [-4.9, 2, -13],
    rotation: [0, Math.PI / 2, 0],
    size: [3, 2],
    metadata: {
      title: "Castel Sant'Angelo",
      location: "Adjacent to Vatican City, Rome",
      date: "2025",
      description: "A towering cylindrical building originally commissioned by Emperor Hadrian as a mausoleum.",
    },
  },
  {
    id: "vatican-6",
    imageUrl: "/images/Vatican/DJI_20250122003835_0311_D.jpg",
    section: "vatican",
    position: [4.9, 2, -13],
    rotation: [0, -Math.PI / 2, 0],
    size: [3, 2],
    metadata: {
      title: "Raphael Rooms",
      location: "Vatican Museums, Vatican City",
      date: "2025",
      description: "A group of four reception rooms with walls decorated by Raphael and his workshop.",
    },
  },

  // Venice section (6 artworks)
  {
    id: "venice-1",
    imageUrl: "/images/Venice/DJI_20250125194335_0479_D.jpg",
    section: "venice",
    position: [-4.9, 2, -3],
    rotation: [0, Math.PI / 2, 0],
    size: [3, 2],
    metadata: {
      title: "Grand Canal",
      location: "Venice, Italy",
      date: "2025",
      description: "The main waterway through Venice, lined with stunning palaces and historical buildings.",
    },
  },
  {
    id: "venice-2",
    imageUrl: "/images/Venice/DJI_20250125202014_0501_D.jpg",
    section: "venice",
    position: [4.9, 2, -3],
    rotation: [0, -Math.PI / 2, 0],
    size: [3, 2],
    metadata: {
      title: "St. Mark's Square",
      location: "Venice, Italy",
      date: "2025",
      description: "The principal public square of Venice, with its beautiful basilica and campanile.",
    },
  },
  {
    id: "venice-3",
    imageUrl: "/images/Venice/DJI_20250125203104_0504_D.jpg",
    section: "venice",
    position: [-4.9, 2, -8],
    rotation: [0, Math.PI / 2, 0],
    size: [3, 2],
    metadata: {
      title: "Rialto Bridge",
      location: "Venice, Italy",
      date: "2025",
      description: "The oldest of the four bridges spanning the Grand Canal, and one of the most photographed in Venice.",
    },
  },
  {
    id: "venice-4",
    imageUrl: "/images/Venice/DJI_20250125210155_0523_D.jpg",
    section: "venice",
    position: [4.9, 2, -8],
    rotation: [0, -Math.PI / 2, 0],
    size: [3, 2],
    metadata: {
      title: "Bridge of Sighs",
      location: "Venice, Italy",
      date: "2025",
      description: "A enclosed bridge made of white limestone with windows with stone bars, connecting the New Prison to the Doge's Palace.",
    },
  },
  {
    id: "venice-5",
    imageUrl: "/images/Venice/DJI_20250126000238_0529_D.jpg",
    section: "venice",
    position: [-4.9, 2, -13],
    rotation: [0, Math.PI / 2, 0],
    size: [3, 2],
    metadata: {
      title: "Venetian Gondolas",
      location: "Venice, Italy",
      date: "2025",
      description: "The traditional, flat-bottomed Venetian rowing boats, perfectly suited to the conditions of the Venetian lagoon.",
    },
  },
  {
    id: "venice-6",
    imageUrl: "/images/Venice/DJI_20250126220101_0637_D.jpg",
    section: "venice",
    position: [4.9, 2, -13],
    rotation: [0, -Math.PI / 2, 0],
    size: [3, 2],
    metadata: {
      title: "Venetian Islands",
      location: "Venice Lagoon, Italy",
      date: "2025",
      description: "The colorful islands of Burano and Murano, famous for their glass-making and brightly painted houses.",
    },
  },
]

// Section data
const SECTIONS = [
  {
    id: "iceland",
    title: "iceland",
    position: [0, 0, 0],
    artworks: ARTWORKS.filter((artwork) => artwork.section === "iceland"),
    nextSection: "popei",
  },
  {
    id: "popei",
    title: "popei",
    position: [0, 0, -100],
    artworks: ARTWORKS.filter((artwork) => artwork.section === "popei"),
    nextSection: "rome",
  },
  {
    id: "rome",
    title: "rome",
    position: [0, 0, -200],
    artworks: ARTWORKS.filter((artwork) => artwork.section === "rome"),
    nextSection: "vatican",
  },
  {
    id: "vatican",
    title: "vatican",
    position: [0, 0, -300],
    artworks: ARTWORKS.filter((artwork) => artwork.section === "vatican"),
    nextSection: "venice",
  },
  {
    id: "venice",
    title: "venice",
    position: [0, 0, -400],
    artworks: ARTWORKS.filter((artwork) => artwork.section === "venice"),
    nextSection: "iceland",
  }
]

type GallerySectionsProps = {
  currentSection?: string
  onTeleport: (targetSection: string) => void
}

export default function GallerySections({ currentSection = "iceland", onTeleport }: GallerySectionsProps) {
  const { t } = useLanguage()
  const [imagesLoaded, setImagesLoaded] = useState(false)

  useEffect(() => {
    // Preload images
    Promise.all(
      ARTWORKS.map(
        (artwork) =>
          new Promise((resolve) => {
            const img = new Image()
            img.src = artwork.imageUrl
            img.crossOrigin = "anonymous"
            img.onload = resolve
            img.onerror = resolve
          }),
      ),
    ).then(() => {
      setImagesLoaded(true)
    })
  }, [])

  return (
    <group>
      {/* Only render the current section to improve performance */}
      {SECTIONS.filter((section) => section.id === currentSection).map((section) => (
        <Section key={section.id} section={section} t={t} onTeleport={onTeleport} />
      ))}
    </group>
  )
}

function Section({ section, t, onTeleport }) {
  const { id, position, artworks, nextSection } = section
  const sectionTitle = t?.sections?.[id]?.title || id
  const sectionDescription = t?.sections?.[id]?.description || ""
  
  // 计算展区所需长度，基于艺术品数量 - 增加每对艺术品的间距
  // 每对艺术品（左右各一幅）占用6单位长度，最少长度为25
  const pairsCount = Math.ceil(artworks.length / 2)
  const corridorLength = Math.max(25, pairsCount * 6 + 8) // 额外8单位给传送门区域
  
  // 根据新计算的长度重新布局艺术品 - 增加间距
  const adjustedArtworks = artworks.map((artwork, index) => {
    const pair = Math.floor(index / 2)
    const isLeft = index % 2 === 0
    const zPos = -4 - pair * 6 // 增加每对艺术品之间的间距
    
    return {
      ...artwork,
      position: [
        isLeft ? -4.9 : 4.9,
        2,
        zPos
      ]
    }
  })

  return (
    <group position={position}>
      {/* 自适应长度的走廊 */}
      <Corridor length={corridorLength} />

      {/* Section title and description */}
      <SectionInfo title={sectionTitle} description={sectionDescription} />

      {/* Artworks with adjusted positions */}
      {adjustedArtworks.map((artwork) => (
        <ArtworkFrame
          key={artwork.id}
          position={artwork.position}
          rotation={artwork.rotation}
          imageUrl={artwork.imageUrl}
          size={artwork.size}
          metadata={artwork.metadata}
        />
      ))}

      {/* Teleport portal positioned at the end of adjusted corridor */}
      <TeleportPortal position={[0, 1, -corridorLength + 6]} targetSection={nextSection} onTeleport={onTeleport} />

      {/* 基础灯光 - 所有展区都有，减少灯光数量并禁用部分阴影 */}
      <ambientLight intensity={0.5} />
      
      {/* 关键位置添加少量灯光，最多4个 */}
      <pointLight 
        position={[0, 3, -corridorLength/2]} 
        intensity={25} 
        distance={20} 
        castShadow={false} 
      />
      <pointLight 
        position={[0, 3, -5]} 
        intensity={20} 
        distance={15} 
        castShadow={false} 
      />
      <pointLight 
        position={[0, 3, -corridorLength + 10]} 
        intensity={20} 
        distance={15} 
        castShadow={false} 
      />
      
      {/* 冰岛展区仅添加一个额外的环境光和两个关键位置灯光 */}
      {id === "iceland" && (
        <>
          <ambientLight intensity={0.3} color="#b3d9ff" />
          <pointLight 
            position={[-4, 2.5, -corridorLength/3]} 
            intensity={15} 
            distance={12} 
            castShadow={false} 
          />
          <pointLight 
            position={[4, 2.5, -corridorLength*2/3]} 
            intensity={15} 
            distance={12} 
            castShadow={false} 
          />
        </>
      )}
    </group>
  )
}

function Corridor({ length = 20 }) {
  return (
    <>
      {/* Floor - 调整位置和大小使走廊边界更准确 */}
      <RigidBody type="fixed" colliders="cuboid" position={[0, 0, -length/2]}>
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]} receiveShadow>
          <planeGeometry args={[10, length]} />
          <meshStandardMaterial color="#333" />
        </mesh>
      </RigidBody>

      {/* Ceiling */}
      <RigidBody type="fixed" colliders="cuboid" position={[0, 4, -length/2]}>
        <mesh rotation={[Math.PI / 2, 0, 0]} position={[0, 0, 0]}>
          <planeGeometry args={[10, length]} />
          <meshStandardMaterial color="#222" />
        </mesh>
      </RigidBody>

      {/* Left wall - 调整碰撞体位置以匹配视觉边界 */}
      <RigidBody type="fixed" colliders="cuboid" position={[-5, 2, -length/2]}>
        <mesh rotation={[0, Math.PI / 2, 0]} position={[0, 0, 0]}>
          <planeGeometry args={[length, 4]} />
          <meshStandardMaterial color="#333" />
        </mesh>
      </RigidBody>

      {/* Right wall - 调整碰撞体位置以匹配视觉边界 */}
      <RigidBody type="fixed" colliders="cuboid" position={[5, 2, -length/2]}>
        <mesh rotation={[0, -Math.PI / 2, 0]} position={[0, 0, 0]}>
          <planeGeometry args={[length, 4]} />
          <meshStandardMaterial color="#333" />
        </mesh>
      </RigidBody>

      {/* End wall (with portal hole) - 位置稍微后移以确保走道尽头有足够空间 */}
      <RigidBody type="fixed" colliders="cuboid" position={[0, 2, -length-0.5]}>
        <mesh position={[0, 0, 0]}>
          <planeGeometry args={[10, 4]} />
          <meshStandardMaterial color="#333" />
        </mesh>
      </RigidBody>

      {/* Entrance wall */}
      <RigidBody type="fixed" colliders="cuboid" position={[0, 2, 2.5]}>
        <mesh rotation={[0, Math.PI, 0]} position={[0, 0, 0]}>
          <planeGeometry args={[10, 4]} />
          <meshStandardMaterial color="#333" />
        </mesh>
      </RigidBody>
    </>
  )
}
