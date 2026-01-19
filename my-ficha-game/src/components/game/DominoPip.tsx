/**
 * DominoPip - Renders authentic domino pip patterns (dots)
 * Supports values 0-9 with traditional domino/dice layouts
 */

import { PipValue } from '@/engine/types'

interface DominoPipProps {
    value: PipValue
    size?: 'sm' | 'md' | 'lg'
}

export function DominoPip({ value, size = 'md' }: DominoPipProps) {
    // Size configurations
    // Size configurations - Larger pips for readability
    const sizes = {
        sm: { container: 'w-8 h-8', pip: 'w-1.5 h-1.5' },
        md: { container: 'w-12 h-12', pip: 'w-2.5 h-2.5' },
        lg: { container: 'w-16 h-16', pip: 'w-3.5 h-3.5' }
    }

    const { container, pip } = sizes[size]

    // Pip patterns based on traditional domino layouts
    const getPipPositions = (val: PipValue): string[] => {
        const positions: Record<PipValue, string[]> = {
            0: [], // Blank
            1: ['center'],
            2: ['top-left', 'bottom-right'],
            3: ['top-left', 'center', 'bottom-right'],
            4: ['top-left', 'top-right', 'bottom-left', 'bottom-right'],
            5: ['top-left', 'top-right', 'center', 'bottom-left', 'bottom-right'],
            6: ['top-left', 'top-right', 'middle-left', 'middle-right', 'bottom-left', 'bottom-right'],
            7: ['top-left', 'top-right', 'middle-left', 'center', 'middle-right', 'bottom-left', 'bottom-right'],
            8: ['top-left', 'top-center', 'top-right', 'middle-left', 'middle-right', 'bottom-left', 'bottom-center', 'bottom-right'],
            9: ['top-left', 'top-center', 'top-right', 'middle-left', 'center', 'middle-right', 'bottom-left', 'bottom-center', 'bottom-right']
        }
        return positions[val] || []
    }

    const pipPositions = getPipPositions(value)

    // CSS classes for pip positioning
    const positionClasses: Record<string, string> = {
        'top-left': 'top-[15%] left-[15%]',
        'top-center': 'top-[15%] left-1/2 -translate-x-1/2',
        'top-right': 'top-[15%] right-[15%]',
        'middle-left': 'top-1/2 -translate-y-1/2 left-[15%]',
        'center': 'top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2',
        'middle-right': 'top-1/2 -translate-y-1/2 right-[15%]',
        'bottom-left': 'bottom-[15%] left-[15%]',
        'bottom-center': 'bottom-[15%] left-1/2 -translate-x-1/2',
        'bottom-right': 'bottom-[15%] right-[15%]'
    }

    return (
        <div className={`relative ${container} flex items-center justify-center`}>
            {pipPositions.map((position, index) => (
                <div
                    key={`${position}-${index}`}
                    className={`
            absolute ${pip} rounded-full 
            bg-gradient-to-br from-black to-gray-900
            ${positionClasses[position]}
            shadow-[inset_0_1px_3px_rgba(0,0,0,0.9),0_1px_0_rgba(255,255,255,0.2)]
            ring-1 ring-black/10
          `}
                />
            ))}
        </div>
    )
}
