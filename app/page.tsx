import Scene from '@/components/canvas/Scene'
import Galaxy from '@/components/canvas/GalaxyNew'
import Overlay from '@/components/ui/Overlay'

export default function Home() {
  return (
    <main className="relative w-full h-screen overflow-hidden bg-black text-white">
      {/* 3D Scene Background */}
      <Scene>
        <Galaxy />
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} />
      </Scene>

      {/* UI Overlay */}
      <Overlay />
    </main>
  )
}
