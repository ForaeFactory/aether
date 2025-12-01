'use client'
/* eslint-disable */

import { useMemo, useRef, useState, useEffect } from 'react'
import { useFrame, useThree, ThreeEvent } from '@react-three/fiber'
import { Html } from '@react-three/drei'
import * as THREE from 'three'
import { vertexShader, fragmentShader } from './shaders/particleShader'
import { useAppStore } from '@/store/store'

/**
 * Generates the data for the galaxy particles.
 * @param {number} particleCount - The number of particles to generate.
 * @returns {[Float32Array, Float32Array, Float32Array]} - An array containing the positions, colors, and sizes of the particles.
 */
const generateGalaxyData = (particleCount: number) => {
  const positions = new Float32Array(particleCount * 3)
  const colors = new Float32Array(particleCount * 3)
  const sizes = new Float32Array(particleCount)

  const color1 = new THREE.Color('#4f46e5') // Indigo
  const color2 = new THREE.Color('#ec4899') // Pink
  const color3 = new THREE.Color('#06b6d4') // Cyan

  for (let i = 0; i < particleCount; i++) {
    // Spiral distribution for the particles to create a galaxy-like shape.
    const radius = Math.random() * Math.random() * 20 + 2
    const spinAngle = radius * 0.8
    const branchAngle = (i % 3) * ((2 * Math.PI) / 3)
    
    const x = Math.cos(branchAngle + spinAngle) * radius + (Math.random() - 0.5) * 2
    const y = (Math.random() - 0.5) * (radius * 0.2)
    const z = Math.sin(branchAngle + spinAngle) * radius + (Math.random() - 0.5) * 2

    positions[i * 3] = x
    positions[i * 3 + 1] = y
    positions[i * 3 + 2] = z

    // Color is based on a mix of three colors, providing a varied and vibrant look.
    const mixedColor = color1.clone().lerp(color2, Math.random()).lerp(color3, Math.random())
    colors[i * 3] = mixedColor.r
    colors[i * 3 + 1] = mixedColor.g
    colors[i * 3 + 2] = mixedColor.b

    sizes[i] = Math.random() * 2
  }

  return [positions, colors, sizes]
}

/**
 * Renders a 3D galaxy of particles with interactive elements.
 * The galaxy rotates, and particles can be hovered over to display a tooltip.
 */
export default function Galaxy() {
  const pointsRef = useRef<THREE.Points>(null)
  const { raycaster } = useThree()
  const { setSelectedParticle } = useAppStore()
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null)

  const particleCount = 10000

  // Uniforms for the shader material, used for animations and interactions.
  const uniforms = useMemo(() => ({
    uTime: { value: 0 },
    uPixelRatio: { value: Math.min(window.devicePixelRatio, 2) },
    uHoveredIndex: { value: -1 },
  }), [])

  // Generate the galaxy data once and memoize it.
  const [positions, colors, sizes] = useMemo(() => generateGalaxyData(particleCount), [])

  // Set the raycaster threshold for better performance.
  useEffect(() => {
    if (raycaster.params.Points) {
      raycaster.params.Points.threshold = 0.2
    }
  }, [raycaster])

  // Animation loop to rotate the galaxy and update shader uniforms.
  useFrame((state) => {
    if (pointsRef.current) {
      // Rotate the entire galaxy slowly
      pointsRef.current.rotation.y = state.clock.getElapsedTime() * 0.05
      
      // Update uniforms for the shader.
      const material = pointsRef.current.material as THREE.ShaderMaterial
      material.uniforms.uTime.value = state.clock.getElapsedTime()
      material.uniforms.uHoveredIndex.value = hoveredIndex !== null ? hoveredIndex : -1
    }
  })

  /**
   * Handles the pointer move event to detect hovered particles.
   * @param {ThreeEvent<PointerEvent>} e - The pointer event.
   */
  const handlePointerMove = (e: ThreeEvent<PointerEvent>) => {
    if (e.index !== undefined) {
      setHoveredIndex(e.index)
      document.body.style.cursor = 'pointer'
    } else {
      setHoveredIndex(null)
      document.body.style.cursor = 'auto'
    }
  }

  /**
   * Handles the pointer out event to reset the hovered particle.
   */
  const handlePointerOut = () => {
    setHoveredIndex(null)
    document.body.style.cursor = 'auto'
  }

  /**
   * Handles the click event to select a particle.
   * @param {ThreeEvent<PointerEvent>} e - The click event.
   */
  const handleClick = (e: ThreeEvent<PointerEvent>) => {
    if (e.index !== undefined) {
      setSelectedParticle(e.index)
    }
  }

  // Calculate the position for the tooltip when a particle is hovered.
  const hoveredPosition = useMemo(() => {
    if (hoveredIndex === null) return null
    const x = positions[hoveredIndex * 3]
    const y = positions[hoveredIndex * 3 + 1]
    const z = positions[hoveredIndex * 3 + 2]
    return new THREE.Vector3(x, y, z)
  }, [hoveredIndex, positions])

  return (
    <group>
      <points
        ref={pointsRef}
        onPointerMove={handlePointerMove}
        onPointerOut={handlePointerOut}
        onClick={handleClick}
        raycast={(params, intersection) => {
           // Default points raycast
           return THREE.Points.prototype.raycast.call(pointsRef.current, raycaster, intersection)
        }}
      >
        <bufferGeometry>
          {/* Attributes for the particle positions, colors, and sizes. */}
          <bufferAttribute
            attach="attributes-position"
            count={positions.length / 3}
            array={positions}
            itemSize={3}
            args={[positions, 3]}
          />
          <bufferAttribute
            attach="attributes-color"
            count={colors.length / 3}
            array={colors}
            itemSize={3}
            args={[colors, 3]}
          />
          <bufferAttribute
            attach="attributes-size"
            count={sizes.length}
            array={sizes}
            itemSize={1}
            args={[sizes, 1]}
          />
        </bufferGeometry>
        {/* Shader material for custom particle rendering. */}
        <shaderMaterial
          vertexShader={vertexShader}
          fragmentShader={fragmentShader}
          uniforms={uniforms}
          transparent
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </points>

      {/* Renders a tooltip when a particle is hovered. */}
      {hoveredIndex !== null && hoveredPosition && (
        <Html position={hoveredPosition} style={{ pointerEvents: 'none' }}>
          <div className="glass-panel p-3 rounded-sm w-48 transform -translate-x-1/2 -translate-y-full mt-[-15px] border-l-2 border-blue-500">
            <h3 className="text-[10px] font-bold text-blue-400 uppercase mb-1 tracking-widest">Data Point #{hoveredIndex}</h3>
            <div className="space-y-1">
              <div className="flex justify-between text-[10px] text-gray-400 font-mono">
                <span>VAL</span>
                <span className="text-white">{(hoveredIndex ? (hoveredIndex * 0.123 % 100).toFixed(2) : '0.00')}</span>
              </div>
              <div className="flex justify-between text-[10px] text-gray-400 font-mono">
                <span>CLS</span>
                <span className="text-white">A-7</span>
              </div>
            </div>
          </div>
        </Html>
      )}
    </group>
  )
}
