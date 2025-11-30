'use client'

import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { OrbitControls, Preload } from '@react-three/drei'
import { EffectComposer, Bloom, DepthOfField } from '@react-three/postprocessing'
import { Suspense, useEffect, useRef } from 'react'
import { useAppStore } from '@/store/store'
import * as THREE from 'three'

function CameraController() {
  const { focusTarget } = useAppStore()
  const vec = new THREE.Vector3()

  useFrame((state, delta) => {
    if (focusTarget) {
      vec.set(focusTarget[0], focusTarget[1], focusTarget[2])
      state.camera.position.lerp(vec.clone().add(new THREE.Vector3(0, 0, 20)), delta * 2)
      // @ts-ignore
      state.controls?.target.lerp(vec, delta * 2)
      // @ts-ignore
      state.controls?.update()
    }
  })

  return null
}

export default function Scene({ children }: { children: React.ReactNode }) {
  return (
    <div className="absolute inset-0 z-0">
      <Canvas
        camera={{ position: [0, 0, 20], fov: 45 }}
        gl={{ antialias: false, alpha: true }}
        dpr={[1, 2]}
      >
        <Suspense fallback={null}>
          {children}
          <Preload all />
        </Suspense>
        <CameraController />
        <OrbitControls  
          makeDefault 
          enableDamping 
          dampingFactor={0.05} 
          minDistance={5}
          maxDistance={50}
        />
        <EffectComposer>
          <Bloom luminanceThreshold={0.2} mipmapBlur intensity={0.5} />
          <DepthOfField focusDistance={0} focalLength={0.02} bokehScale={2} height={480} />
        </EffectComposer>
      </Canvas>
    </div>
  )
}
