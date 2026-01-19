import { Canvas } from '@react-three/fiber'
import { PerspectiveCamera, OrbitControls } from '@react-three/drei'
import { Suspense } from 'react'
import { GameState } from '../../engine/types'
import { Table3D } from './Table3D'
import { Tile3D } from './Tile3D'

interface Scene3DProps {
  gameState: GameState
  onTileClick: (tileId: string) => void
}

export function Scene3D({ gameState, onTileClick }: Scene3DProps) {
  return (
    <div className="w-full h-full bg-cuban-navy relative">
      <Canvas shadows dpr={[1, 2]}>
        <Suspense fallback={null}>
          <PerspectiveCamera makeDefault position={[0, 6, 6]} fov={50} />
          <OrbitControls
            enablePan={false}
            minPolarAngle={Math.PI / 6}
            maxPolarAngle={Math.PI / 2.2}
            minDistance={4}
            maxDistance={12}
            enableDamping
            dampingFactor={0.05}
          />

          {/* Lighting - "Havana Night" - AGGRESSIVE pool of light */}
          <ambientLight intensity={0.05} />

          {/* Main warm overhead bulb - creates the dramatic "pool of light" */}
          <pointLight
            position={[0, 6, 0]}
            intensity={4.5}
            distance={15}
            decay={2}
            color="#ffaa44"
            castShadow
            shadow-mapSize={[2048, 2048]}
            shadow-bias={-0.0005}
          />

          {/* Subtle cool fill from "street window" - very dim */}
          <spotLight
            position={[-8, 1, 0]}
            angle={0.8}
            penumbra={1}
            intensity={0.4}
            color="#1a2a40"
          />

          {/* Very subtle rim light */}
          <spotLight
            position={[4, 4, 4]}
            angle={0.6}
            penumbra={1}
            intensity={0.3}
            color="#ffaa44"
          />

          <Table3D />

          {/* Render Tiles */}
          <group position={[0, 0.05, 0]}>
            {gameState.currentRound.chain.tiles.map((placedTile, index) => {
              // Simple linear layout for MVP
              // In a real implementation, this would need a "snake" algorithm
              const isDouble = placedTile.tile.left === placedTile.tile.right
              const x = (index - gameState.currentRound.chain.tiles.length / 2) * 1.2

              // Determine rotation based on orientation and if it's a double
              // If double, it's usually perpendicular (90 deg)
              // If normal tile, it flows with the line (0 or 180 depending on connection)
              // For this MVP, we'll just rotate doubles 90 degrees
              const rotationY = isDouble ? Math.PI / 2 : 0

              // Check if we need to flip the visual representation based on orientation
              // This is a simplification; real logic depends on connection points
              const visualRotationY = rotationY + (placedTile.orientation === 'flipped' ? Math.PI : 0)

              return (
                <Tile3D
                  key={placedTile.tile.id}
                  value={[placedTile.tile.left, placedTile.tile.right]}
                  position={[x, 0, 0]}
                  rotation={[0, visualRotationY, 0]}
                  onClick={() => onTileClick(placedTile.tile.id)}
                />
              )
            })}
          </group>
        </Suspense>
      </Canvas>

      {/* Vignette Overlay */}
      <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(circle_at_center,transparent_30%,rgba(0,0,0,0.6)_100%)]" />
    </div>
  )
}
