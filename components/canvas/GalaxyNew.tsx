'use client'
/* eslint-disable */

import { useMemo, useRef, useState, useEffect } from 'react'
import { useFrame, useThree, ThreeEvent } from '@react-three/fiber'
import { Html } from '@react-three/drei'
import * as THREE from 'three'
import { vertexShader, fragmentShader } from './shaders/particleShader'
import { useAppStore } from '@/store/store'

const generateGalaxyData = (particleCount: number) => {
  const positions = new Float32Array(particleCount * 3)
  const colors = new Float32Array(particleCount * 3)
  const sizes = new Float32Array(particleCount)

  const color1 = new THREE.Color('#4f46e5') // Indigo
  const color2 = new THREE.Color('#ec4899') // Pink
  const color3 = new THREE.Color('#06b6d4') // Cyan

  for (let i = 0; i < particleCount; i++) {
    // Spiral distribution
    const radius = Math.random() * Math.random() * 20 + 2
    const spinAngle = radius * 0.8
    const branchAngle = (i % 3) * ((2 * Math.PI) / 3)
    
    const x = Math.cos(branchAngle + spinAngle) * radius + (Math.random() - 0.5) * 2
    const y = (Math.random() - 0.5) * (radius * 0.2)
    const z = Math.sin(branchAngle + spinAngle) * radius + (Math.random() - 0.5) * 2

    positions[i * 3] = x
    positions[i * 3 + 1] = y
    positions[i * 3 + 2] = z

    // Color based on radius/mix
    const mixedColor = color1.clone().lerp(color2, Math.random()).lerp(color3, Math.random())
    colors[i * 3] = mixedColor.r
    colors[i * 3 + 1] = mixedColor.g
    colors[i * 3 + 2] = mixedColor.b

    sizes[i] = Math.random() * 2
  }

  return [positions, colors, sizes]
}

export default function Galaxy() {
  const pointsRef = useRef<THREE.Points>(null)
  const { raycaster } = useThree()
  const { setSelectedParticle } = useAppStore()
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null)

  const particleCount = 10000

  const uniforms = useMemo(() => ({
    uTime: { value: 0 },
    uPixelRatio: { value: Math.min(window.devicePixelRatio, 2) },
    uHoveredIndex: { value: -1 },
  }), [])

  const [positions, colors, sizes] = useMemo(() => generateGalaxyData(particleCount), [])

  useEffect(() => {
    if (raycaster.params.Points) {
      raycaster.params.Points.threshold = 0.2
    }
  }, [raycaster])

  useFrame((state) => {
    if (pointsRef.current) {
      // Rotate the entire galaxy slowly
      pointsRef.current.rotation.y = state.clock.getElapsedTime() * 0.05
      
      // Update uniforms
      const material = pointsRef.current.material as THREE.ShaderMaterial
      material.uniforms.uTime.value = state.clock.getElapsedTime()
      material.uniforms.uHoveredIndex.value = hoveredIndex !== null ? hoveredIndex : -1
    }
  })

  const handlePointerMove = (e: ThreeEvent<PointerEvent>) => {
    // e.index is the index of the particle
    if (e.index !== undefined) {
      setHoveredIndex(e.index)
      document.body.style.cursor = 'pointer'
    } else {
      setHoveredIndex(null)
      document.body.style.cursor = 'auto'
    }
  }

  const handlePointerOut = () => {
    setHoveredIndex(null)
    document.body.style.cursor = 'auto'
  }

  const handleClick = (e: ThreeEvent<PointerEvent>) => {
    if (e.index !== undefined) {
      setSelectedParticle(e.index)
    }
  }

  // Calculate position for tooltip if hovered
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
        <shaderMaterial
          vertexShader={vertexShader}
          fragmentShader={fragmentShader}
          uniforms={uniforms}
          transparent
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </points>

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
