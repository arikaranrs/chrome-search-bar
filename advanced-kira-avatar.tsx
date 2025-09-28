"use client"

import { useEffect, useRef, useState } from "react"
import { Canvas, useFrame } from "@react-three/fiber"
import { OrbitControls, Environment, Html, PerspectiveCamera } from "@react-three/drei"
import { type Mesh, type Group, Vector3 } from "three"
import { cn } from "@/lib/utils"

interface AdvancedKiraAvatarProps {
  isListening: boolean
  isSpeaking: boolean
  audioLevel: number
  currentEmotion?: "neutral" | "happy" | "thinking" | "speaking"
}

function HumanoidAvatar({ isListening, isSpeaking, audioLevel, currentEmotion = "neutral" }: AdvancedKiraAvatarProps) {
  const groupRef = useRef<Group>(null)
  const headRef = useRef<Mesh>(null)
  const eyesRef = useRef<Group>(null)
  const mouthRef = useRef<Mesh>(null)
  const bodyRef = useRef<Mesh>(null)

  const [blinkTimer, setBlinkTimer] = useState(0)
  const [eyePosition, setEyePosition] = useState(new Vector3(0, 0, 0))

  useFrame((state) => {
    if (!groupRef.current) return

    const time = state.clock.elapsedTime

    // Gentle breathing animation
    const breathScale = 1 + Math.sin(time * 1.5) * 0.02
    if (bodyRef.current) {
      bodyRef.current.scale.y = breathScale
    }

    // Head movements based on state
    if (headRef.current) {
      if (isListening) {
        // Attentive head position
        headRef.current.rotation.x = Math.sin(time * 2) * 0.05
        headRef.current.rotation.y = Math.sin(time * 1.5) * 0.1
      } else if (isSpeaking) {
        // Speaking head movements
        headRef.current.rotation.x = Math.sin(time * 4) * 0.08
        headRef.current.rotation.y = Math.sin(time * 3) * 0.06
      } else {
        // Idle subtle movements
        headRef.current.rotation.x = Math.sin(time * 0.8) * 0.03
        headRef.current.rotation.y = Math.sin(time * 0.6) * 0.04
      }
    }

    // Eye blinking animation
    setBlinkTimer((prev) => {
      const newTimer = prev + 0.016 // ~60fps
      if (newTimer > 3 + Math.random() * 2) {
        // Blink every 3-5 seconds
        return 0
      }
      return newTimer
    })

    // Eye tracking (subtle)
    if (eyesRef.current) {
      const eyeX = Math.sin(time * 0.5) * 0.1
      const eyeY = Math.cos(time * 0.3) * 0.05
      setEyePosition(new Vector3(eyeX, eyeY, 0))
    }

    // Mouth animation for speaking
    if (mouthRef.current && isSpeaking) {
      const mouthScale = 1 + Math.sin(time * 8 + audioLevel * 10) * 0.3
      mouthRef.current.scale.setScalar(mouthScale)
    }

    // Overall body animation based on audio level
    if (groupRef.current) {
      const intensity = audioLevel * 0.5 + (isSpeaking ? 0.3 : 0)
      groupRef.current.position.y = Math.sin(time * 2) * intensity * 0.1
    }
  })

  const getEmotionColor = () => {
    switch (currentEmotion) {
      case "happy":
        return "#10b981"
      case "thinking":
        return "#f59e0b"
      case "speaking":
        return "#06b6d4"
      default:
        return "#6366f1"
    }
  }

  const isBlinking = blinkTimer < 0.15

  return (
    <group ref={groupRef} position={[0, -0.5, 0]}>
      {/* Body */}
      <mesh ref={bodyRef} position={[0, -1, 0]}>
        <cylinderGeometry args={[0.8, 1.2, 2, 8]} />
        <meshStandardMaterial color="#e5e7eb" metalness={0.1} roughness={0.8} />
      </mesh>

      {/* Head */}
      <mesh ref={headRef} position={[0, 0.5, 0]}>
        <sphereGeometry args={[0.8, 32, 32]} />
        <meshStandardMaterial color="#f3f4f6" metalness={0.2} roughness={0.6} />
      </mesh>

      {/* Eyes */}
      <group ref={eyesRef} position={[0, 0.6, 0.6]}>
        {/* Left Eye */}
        <mesh position={[-0.25, 0, 0]}>
          <sphereGeometry args={[0.12, 16, 16]} />
          <meshStandardMaterial color="#ffffff" />
        </mesh>
        <mesh position={[-0.25 + eyePosition.x * 0.05, eyePosition.y * 0.05, 0.1]}>
          <sphereGeometry args={[0.06, 16, 16]} />
          <meshStandardMaterial color="#1f2937" />
        </mesh>

        {/* Right Eye */}
        <mesh position={[0.25, 0, 0]}>
          <sphereGeometry args={[0.12, 16, 16]} />
          <meshStandardMaterial color="#ffffff" />
        </mesh>
        <mesh position={[0.25 + eyePosition.x * 0.05, eyePosition.y * 0.05, 0.1]}>
          <sphereGeometry args={[0.06, 16, 16]} />
          <meshStandardMaterial color="#1f2937" />
        </mesh>

        {/* Eyelids for blinking */}
        {isBlinking && (
          <>
            <mesh position={[-0.25, 0, 0.05]}>
              <sphereGeometry args={[0.13, 16, 8]} />
              <meshStandardMaterial color="#f3f4f6" />
            </mesh>
            <mesh position={[0.25, 0, 0.05]}>
              <sphereGeometry args={[0.13, 16, 8]} />
              <meshStandardMaterial color="#f3f4f6" />
            </mesh>
          </>
        )}
      </group>

      {/* Mouth */}
      <mesh ref={mouthRef} position={[0, 0.2, 0.7]}>
        <sphereGeometry args={[0.15, 16, 8]} />
        <meshStandardMaterial color={isSpeaking ? "#ef4444" : "#374151"} transparent opacity={isSpeaking ? 0.8 : 0.6} />
      </mesh>

      {/* Emotion Indicator Halo */}
      <mesh position={[0, 1.5, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[1.2, 0.05, 8, 32]} />
        <meshBasicMaterial color={getEmotionColor()} transparent opacity={0.6} />
      </mesh>

      {/* Floating Particles */}
      {Array.from({ length: 12 }).map((_, i) => {
        const angle = (i / 12) * Math.PI * 2
        const radius = 2 + Math.sin(i) * 0.5
        return (
          <mesh
            key={i}
            position={[Math.cos(angle) * radius, Math.sin(angle * 0.5) * 0.8 + 0.5, Math.sin(angle) * radius]}
          >
            <sphereGeometry args={[0.03, 8, 8]} />
            <meshBasicMaterial color={getEmotionColor()} transparent opacity={isListening || isSpeaking ? 0.8 : 0.4} />
          </mesh>
        )
      })}

      {/* Status Display */}
      <Html center position={[0, -2.5, 0]}>
        <div className="text-center space-y-2">
          <div
            className={cn(
              "text-sm font-medium px-4 py-2 rounded-full backdrop-blur-sm",
              isListening && "bg-blue-100/80 text-blue-800 dark:bg-blue-900/80 dark:text-blue-200",
              isSpeaking && "bg-cyan-100/80 text-cyan-800 dark:bg-cyan-900/80 dark:text-cyan-200",
              !isListening && !isSpeaking && "bg-gray-100/80 text-gray-800 dark:bg-gray-800/80 dark:text-gray-200",
            )}
          >
            {isListening ? "👂 Listening..." : isSpeaking ? "🗣️ Speaking..." : "😊 Ready to help"}
          </div>

          {audioLevel > 0 && (
            <div className="text-xs text-muted-foreground">Audio Level: {Math.round(audioLevel * 100)}%</div>
          )}
        </div>
      </Html>
    </group>
  )
}

function ParticleField({ isActive }: { isActive: boolean }) {
  const particlesRef = useRef<Group>(null)

  useFrame((state) => {
    if (!particlesRef.current) return

    particlesRef.current.rotation.y = state.clock.elapsedTime * 0.1

    particlesRef.current.children.forEach((child, i) => {
      const mesh = child as Mesh
      mesh.position.y = Math.sin(state.clock.elapsedTime + i) * 0.5
      mesh.rotation.x = state.clock.elapsedTime + i
      mesh.rotation.z = state.clock.elapsedTime * 0.5 + i
    })
  })

  return (
    <group ref={particlesRef}>
      {Array.from({ length: 50 }).map((_, i) => {
        const radius = 5 + Math.random() * 10
        const angle = Math.random() * Math.PI * 2
        const height = (Math.random() - 0.5) * 10

        return (
          <mesh key={i} position={[Math.cos(angle) * radius, height, Math.sin(angle) * radius]}>
            <sphereGeometry args={[0.02, 4, 4]} />
            <meshBasicMaterial color="#8b5cf6" transparent opacity={isActive ? 0.6 : 0.2} />
          </mesh>
        )
      })}
    </group>
  )
}

export function AdvancedKiraAvatar({ isListening, isSpeaking, audioLevel, currentEmotion }: AdvancedKiraAvatarProps) {
  const [cameraPosition, setCameraPosition] = useState<[number, number, number]>([0, 2, 8])

  useEffect(() => {
    // Adjust camera based on interaction state
    if (isListening) {
      setCameraPosition([0, 1, 6]) // Closer for listening
    } else if (isSpeaking) {
      setCameraPosition([1, 2, 7]) // Slight angle for speaking
    } else {
      setCameraPosition([0, 2, 8]) // Default position
    }
  }, [isListening, isSpeaking])

  return (
    <div className="w-full h-96 mx-auto rounded-xl overflow-hidden bg-gradient-to-br from-blue-50 to-purple-50 dark:from-gray-900 dark:to-blue-900">
      <Canvas shadows>
        <PerspectiveCamera makeDefault position={cameraPosition} fov={50} />

        {/* Lighting Setup */}
        <ambientLight intensity={0.4} />
        <pointLight position={[10, 10, 10]} intensity={1} castShadow />
        <pointLight position={[-10, -10, -10]} intensity={0.5} color="#8b5cf6" />
        <spotLight position={[0, 10, 0]} angle={0.3} penumbra={1} intensity={0.8} castShadow />

        {/* Main Avatar */}
        <HumanoidAvatar
          isListening={isListening}
          isSpeaking={isSpeaking}
          audioLevel={audioLevel}
          currentEmotion={currentEmotion}
        />

        {/* Background Particles */}
        <ParticleField isActive={isListening || isSpeaking} />

        {/* Environment */}
        <Environment preset="city" background={false} />

        {/* Controls */}
        <OrbitControls
          enableZoom={false}
          enablePan={false}
          autoRotate={!isListening && !isSpeaking}
          autoRotateSpeed={0.5}
          maxPolarAngle={Math.PI / 2}
          minPolarAngle={Math.PI / 4}
        />
      </Canvas>
    </div>
  )
}
