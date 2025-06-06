"use client"

import { Canvas, useFrame } from "@react-three/fiber"
import { OrbitControls, Environment } from "@react-three/drei"
import { useRef, useState } from "react"
import type { Mesh } from "three"

function TorusRing({
  position,
  rotation,
  scale,
  color,
}: {
  position: [number, number, number]
  rotation: [number, number, number]
  scale: number
  color: string
}) {
  const meshRef = useRef<Mesh>(null)
  const [hovered, setHovered] = useState(false)

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.x += 0.005
      meshRef.current.rotation.y += 0.003
      if (hovered) {
        meshRef.current.rotation.z += 0.01
      }
    }
  })

  return (
    <mesh
      ref={meshRef}
      position={position}
      rotation={rotation}
      scale={hovered ? scale * 1.1 : scale}
      onPointerOver={() => setHovered(true)}
      onPointerOut={() => setHovered(false)}
    >
      <torusGeometry args={[1, 0.4, 16, 100]} />
      <meshPhysicalMaterial
        color={color}
        metalness={0.9}
        roughness={hovered ? 0.05 : 0.1}
        iridescence={hovered ? 1.2 : 1}
        iridescenceIOR={1.3}
        iridescenceThicknessRange={[100, 800]}
        transmission={0.1}
        thickness={0.5}
        envMapIntensity={hovered ? 3 : 2}
      />
    </mesh>
  )
}

function Scene() {
  return (
    <>
      <ambientLight intensity={0.2} />
      <directionalLight position={[10, 10, 5]} intensity={1} />
      <pointLight position={[-10, -10, -5]} intensity={0.5} color="#8b5cf6" />
      <pointLight position={[10, -10, 5]} intensity={0.5} color="#ec4899" />

      {/* Large torus in upper left */}
      <TorusRing position={[-3, 2, -1]} rotation={[0.3, -0.5, 0.2]} scale={1.5} color="#3b82f6" />

      {/* Middle right torus */}
      <TorusRing position={[3, 0, -2]} rotation={[-0.2, 0.8, -0.3]} scale={1.2} color="#8b5cf6" />

      {/* Bottom left torus (partially visible) */}
      <TorusRing position={[-4, -3, 0]} rotation={[0.5, -0.3, 0.7]} scale={1.8} color="#ec4899" />

      {/* Additional floating torus for depth */}
      <TorusRing position={[1, 1.5, -4]} rotation={[0.1, 1.2, -0.1]} scale={0.8} color="#06b6d4" />

      <Environment preset="night" />
    </>
  )
}

export default function Component() {
  return (
    <div className="relative w-full h-screen overflow-hidden">
      {/* 3D Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-indigo-950 via-blue-950 to-slate-900">
        <Canvas camera={{ position: [0, 0, 8], fov: 50 }}>
          <Scene />
          <OrbitControls
            enableZoom={true}
            enablePan={false}
            enableRotate={true}
            enableDamping={true}
            dampingFactor={0.05}
            autoRotate={true}
            autoRotateSpeed={0.3}
            minDistance={5}
            maxDistance={15}
            touches={{
              ONE: 2, // ROTATE
              TWO: 1, // DOLLY (zoom)
            }}
            mouseButtons={{
              LEFT: 2, // ROTATE
              MIDDLE: 1, // DOLLY
              RIGHT: 0, // PAN (disabled)
            }}
          />
        </Canvas>
      </div>

      {/* Content Overlay */}
      <div className="relative z-10 flex flex-col items-center justify-center h-full text-center px-4">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-6xl md:text-8xl font-bold text-white mb-6 tracking-tight">
            Future
            <span className="bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
              Tech
            </span>
          </h1>
          <p className="text-xl md:text-2xl text-blue-100 mb-8 max-w-2xl mx-auto leading-relaxed">
            Experience the next generation of digital innovation with cutting-edge technology that transforms
            possibilities into reality.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="px-8 py-4 bg-gradient-to-r from-pink-500 to-indigo-600 text-white font-semibold rounded-full hover:from-pink-600 hover:to-indigo-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105">
              Get Started
            </button>
            <button className="px-8 py-4 border-2 border-pink-400 text-pink-400 font-semibold rounded-full hover:bg-pink-400 hover:text-indigo-900 transition-all duration-300">
              Learn More
            </button>
          </div>
        </div>
      </div>

      {/* Gradient Overlay for better text readability */}
      <div className="absolute inset-0 bg-gradient-to-t from-indigo-950/50 via-transparent to-indigo-950/30 pointer-events-none" />
    </div>
  )
}
