import { RoundedBox } from '@react-three/drei'
import { useSpring, animated } from '@react-spring/three'

interface Tile3DProps {
    value: [number, number]
    position?: [number, number, number]
    rotation?: [number, number, number]
    isSelected?: boolean
    onClick?: () => void
}

const PIP_POSITIONS: Record<number, [number, number][]> = {
    0: [],
    1: [[0, 0]],
    2: [[-0.2, 0.2], [0.2, -0.2]],
    3: [[-0.2, 0.2], [0, 0], [0.2, -0.2]],
    4: [[-0.2, 0.2], [0.2, 0.2], [-0.2, -0.2], [0.2, -0.2]],
    5: [[-0.2, 0.2], [0.2, 0.2], [0, 0], [-0.2, -0.2], [0.2, -0.2]],
    6: [[-0.2, 0.2], [0, 0.2], [0.2, 0.2], [-0.2, -0.2], [0, -0.2], [0.2, -0.2]],
    // 9 is needed for Cuban dominoes (double 9)
    7: [[-0.2, 0.2], [0, 0.2], [0.2, 0.2], [0, 0], [-0.2, -0.2], [0, -0.2], [0.2, -0.2]], // Simplified
    8: [[-0.2, 0.2], [0, 0.2], [0.2, 0.2], [-0.2, 0], [0.2, 0], [-0.2, -0.2], [0, -0.2], [0.2, -0.2]],
    9: [[-0.2, 0.2], [0, 0.2], [0.2, 0.2], [-0.2, 0], [0, 0], [0.2, 0], [-0.2, -0.2], [0, -0.2], [0.2, -0.2]],
}

export function Tile3D({ value, position = [0, 0, 0], rotation = [0, 0, 0], isSelected, onClick }: Tile3DProps) {
    const [top, bottom] = value

    // Animation for selection
    const { scale, y } = useSpring({
        scale: isSelected ? 1.1 : 1,
        y: isSelected ? 0.5 : position[1],
        config: { mass: 1, tension: 170, friction: 26 }
    })

    const tileColor = "#FFFEF0" // Aged ivory
    const pipColor = "#2a2a2a" // Dark charcoal

    const Pips = ({ count, offset }: { count: number, offset: number }) => {
        const positions = PIP_POSITIONS[count] || []
        return (
            <group position={[0, 0, offset]}>
                {positions.map((pos, i) => (
                    <mesh key={i} position={[pos[0], 0.055, pos[1]]}>
                        <sphereGeometry args={[0.035, 16, 16]} />
                        <meshStandardMaterial color={pipColor} roughness={0.3} metalness={0.1} />
                    </mesh>
                ))}
            </group>
        )
    }

    return (
        <animated.group
            position={[position[0], y, position[2]]}
            rotation={rotation as any}
            scale={scale}
            onClick={(e) => {
                e.stopPropagation()
                onClick?.()
            }}
        >
            {/* Tile Body - Aged Ivory */}
            <RoundedBox args={[1, 0.12, 2]} radius={0.025} smoothness={4} castShadow receiveShadow>
                <meshStandardMaterial
                    color={tileColor}
                    roughness={0.3}
                    metalness={0.05}
                />
            </RoundedBox>

            {/* Divider Line */}
            <mesh position={[0, 0.061, 0]}>
                <boxGeometry args={[0.85, 0.002, 0.025]} />
                <meshStandardMaterial color={pipColor} roughness={0.4} />
            </mesh>

            {/* Pips */}
            <Pips count={top} offset={-0.5} />
            <Pips count={bottom} offset={0.5} />
        </animated.group>
    )
}
