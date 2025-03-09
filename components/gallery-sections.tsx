"use client"

import { useEffect, useState } from "react"
import { RigidBody } from "@react-three/rapier"
import { useLanguage } from "./language-context"
import ArtworkFrame from "./artwork-frame"
import SectionInfo from "./section-info"
import TeleportPortal from "./teleport-portal"

// Artwork data with metadata for each city
const ARTWORKS = [
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
    id: "popei",
    title: "popei",
    position: [0, 0, 0],
    artworks: ARTWORKS.filter((artwork) => artwork.section === "popei"),
    nextSection: "rome",
  },
  {
    id: "rome",
    title: "rome",
    position: [0, 0, -100],
    artworks: ARTWORKS.filter((artwork) => artwork.section === "rome"),
    nextSection: "vatican",
  },
  {
    id: "vatican",
    title: "vatican",
    position: [0, 0, -200],
    artworks: ARTWORKS.filter((artwork) => artwork.section === "vatican"),
    nextSection: "venice",
  },
  {
    id: "venice",
    title: "venice",
    position: [0, 0, -300],
    artworks: ARTWORKS.filter((artwork) => artwork.section === "venice"),
    nextSection: "popei",
  },
]

type GallerySectionsProps = {
  currentSection?: string
  onTeleport: (targetSection: string) => void
}

export default function GallerySections({ currentSection = "popei", onTeleport }: GallerySectionsProps) {
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
  const sectionTitle = t.sections[id].title
  const sectionDescription = t.sections[id].description

  return (
    <group position={position}>
      {/* Corridor structure */}
      <Corridor />

      {/* Section title and description */}
      <SectionInfo title={sectionTitle} description={sectionDescription} />

      {/* Artworks */}
      {artworks.map((artwork) => (
        <ArtworkFrame
          key={artwork.id}
          position={artwork.position}
          rotation={artwork.rotation}
          imageUrl={artwork.imageUrl}
          size={artwork.size}
          metadata={artwork.metadata}
        />
      ))}

      {/* Teleport portal to next section */}
      <TeleportPortal position={[0, 1, -15]} targetSection={nextSection} onTeleport={onTeleport} />

      {/* Optimized lighting - fewer lights */}
      <pointLight position={[0, 3.5, -3]} intensity={15} distance={10} castShadow />
      <pointLight position={[0, 3.5, -8]} intensity={15} distance={10} castShadow />
      <pointLight position={[0, 3.5, -13]} intensity={15} distance={10} castShadow />
    </group>
  )
}

function Corridor() {
  return (
    <>
      {/* Floor */}
      <RigidBody type="fixed" colliders="cuboid">
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, -7.5]} receiveShadow>
          <planeGeometry args={[10, 20]} />
          <meshStandardMaterial color="#333" />
        </mesh>
      </RigidBody>

      {/* Ceiling */}
      <RigidBody type="fixed" colliders="cuboid">
        <mesh rotation={[Math.PI / 2, 0, 0]} position={[0, 4, -7.5]}>
          <planeGeometry args={[10, 20]} />
          <meshStandardMaterial color="#222" />
        </mesh>
      </RigidBody>

      {/* Left wall */}
      <RigidBody type="fixed" colliders="cuboid">
        <mesh rotation={[0, Math.PI / 2, 0]} position={[-5, 2, -7.5]}>
          <planeGeometry args={[20, 4]} />
          <meshStandardMaterial color="#333" />
        </mesh>
      </RigidBody>

      {/* Right wall */}
      <RigidBody type="fixed" colliders="cuboid">
        <mesh rotation={[0, -Math.PI / 2, 0]} position={[5, 2, -7.5]}>
          <planeGeometry args={[20, 4]} />
          <meshStandardMaterial color="#333" />
        </mesh>
      </RigidBody>

      {/* End wall (with portal hole) */}
      <RigidBody type="fixed" colliders="cuboid">
        <mesh position={[0, 2, -17.5]}>
          <planeGeometry args={[10, 4]} />
          <meshStandardMaterial color="#333" />
        </mesh>
      </RigidBody>

      {/* Entrance wall */}
      <RigidBody type="fixed" colliders="cuboid">
        <mesh rotation={[0, Math.PI, 0]} position={[0, 2, 2.5]}>
          <planeGeometry args={[10, 4]} />
          <meshStandardMaterial color="#333" />
        </mesh>
      </RigidBody>
    </>
  )
}
