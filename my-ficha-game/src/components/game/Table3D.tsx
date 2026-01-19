import { DoubleSide } from 'three'

export function Table3D() {
    return (
        <group>
            {/* Main Table Body (Wood) - Darker, richer walnut */}
            <mesh position={[0, -0.25, 0]} receiveShadow castShadow>
                <boxGeometry args={[12, 0.5, 12]} />
                <meshStandardMaterial
                    color="#5A3825" // Darker mahogany
                    roughness={0.7}
                    metalness={0.0}
                />
            </mesh>

            {/* Felt Inlay - Deep emerald with high roughness */}
            <mesh position={[0, 0.01, 0]} receiveShadow rotation={[-Math.PI / 2, 0, 0]}>
                <planeGeometry args={[11, 11]} />
                <meshStandardMaterial
                    color="#0A4439" // Deep Emerald
                    roughness={0.95}
                    metalness={0.0}
                    side={DoubleSide}
                />
            </mesh>

            {/* Brass Edge / Trim - More prominent */}
            <mesh position={[0, 0.015, 0]} rotation={[-Math.PI / 2, 0, 0]}>
                <ringGeometry args={[5.5, 5.65, 64]} />
                <meshStandardMaterial
                    color="#D4AF37" // Bright gold
                    roughness={0.25}
                    metalness={0.9}
                    emissive="#B8941F"
                    emissiveIntensity={0.1}
                />
            </mesh>
        </group>
    )
}
