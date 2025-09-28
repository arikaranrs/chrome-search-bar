"use client"

import { useRef } from "react"
import { Canvas, useFrame } from "@react-three/fiber"
import { OrbitControls, Environment, Html } from "@react-three/drei"
import type { Mesh } from "three"
import { cn } from "@/lib/utils"

interface KiraAvatarProps {
  isListening: boolean
  isSpeaking: boolean
  audioLevel: number
}

function Avatar3D({ isListening, isSpeaking, audioLevel }: KiraAvatarProps) {
  const meshRef = useRef<Mesh>(null)
  const glowRef = useRef<Mesh>(null)

  useFrame((state) => {
    if (meshRef.current) {
      // Gentle rotation
      meshRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.5) * 0.1

      // Scale based on audio level or speaking state
      const scale = 1 + (isSpeaking ? Math.sin(state.clock.elapsedTime * 8) * 0.1 : 0) + audioLevel * 0.2
      meshRef.current.scale.setScalar(scale)
    }

    if (glowRef.current) {
      // Pulsing glow effect
      const intensity = isListening ? 1 + Math.sin(state.clock.elapsedTime * 4) * 0.3 : 0.5
      glowRef.current.scale.setScalar(intensity)
    }
  })

  return (
    <group>
      {/* Main Avatar Sphere */}
      <mesh ref={meshRef} position={[0, 0, 0]}>
        <sphereGeometry args={[1, 32, 32]} />
        <meshStandardMaterial
          color={isListening ? "#4f46e5" : isSpeaking ? "#06b6d4" : "#6366f1"}
          metalness={0.7}
          roughness={0.3}
          emissive={isListening ? "#1e1b4b" : "#0f172a"}
          emissiveIntensity={0.2}
        />
      </mesh>

      {/* Glow Effect */}
      <mesh ref={glowRef} position={[0, 0, 0]}>
        <sphereGeometry args={[1.2, 16, 16]} />
        <meshBasicMaterial color={isListening ? "#4f46e5" : "#6366f1"} transparent opacity={0.2} />
      </mesh>

      {/* Floating Particles */}
      {Array.from({ length: 8 }).map((_, i) => (
        <mesh
          key={i}
          position={[
            Math.cos((i * Math.PI) / 4) * 2,
            Math.sin((i * Math.PI) / 4) * 0.5,
            Math.sin((i * Math.PI) / 4) * 2,
          ]}
        >
          <sphereGeometry args={[0.05, 8, 8]} />
          <meshBasicMaterial color="#8b5cf6" transparent opacity={isListening || isSpeaking ? 0.8 : 0.3} />
        </mesh>
      ))}

      {/* Status Text */}
      <Html center position={[0, -2, 0]}>
        <div className="text-center">
          <div
            className={cn(
              "text-sm font-medium px-3 py-1 rounded-full",
              isListening && "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200",
              isSpeaking && "bg-cyan-100 text-cyan-800 dark:bg-cyan-900 dark:text-cyan-200",
              !isListening && !isSpeaking && "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200",
            )}
          >
            {isListening ? "Listening..." : isSpeaking ? "Speaking..." : "Ready"}
          </div>
        </div>
      </Html>
    </group>
  )
}

export function KiraAvatar({ isListening, isSpeaking, audioLevel }: KiraAvatarProps) {
  return (
    <div className="w-80 h-80 mx-auto">
      <Canvas camera={{ position: [0, 0, 5], fov: 50 }}>
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} intensity={1} />
        <pointLight position={[-10, -10, -10]} intensity={0.5} color="#8b5cf6" />

        <Avatar3D isListening={isListening} isSpeaking={isSpeaking} audioLevel={audioLevel} />

        <Environment preset="city" />
        <OrbitControls enableZoom={false} enablePan={false} autoRotate autoRotateSpeed={0.5} />
      </Canvas>
    </div>
  )
}
