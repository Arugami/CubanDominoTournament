import { useEffect, useState } from 'react'

interface TurnTimerProps {
    startTime: number
    duration: number // seconds
    onTimeout?: () => void
    isActive: boolean
}

export function TurnTimer({ startTime, duration, onTimeout, isActive }: TurnTimerProps) {
    const [timeLeft, setTimeLeft] = useState(duration)
    const [progress, setProgress] = useState(100)

    useEffect(() => {
        if (!isActive) {
            setTimeLeft(duration)
            setProgress(100)
            return
        }

        const interval = setInterval(() => {
            const elapsed = (Date.now() - startTime) / 1000
            const remaining = Math.max(0, duration - elapsed)

            setTimeLeft(remaining)
            setProgress((remaining / duration) * 100)

            if (remaining <= 0) {
                clearInterval(interval)
                if (onTimeout) onTimeout()
            }
        }, 100)

        return () => clearInterval(interval)
    }, [startTime, duration, isActive, onTimeout])

    // Color transition based on progress
    const getColor = () => {
        if (progress > 50) return 'stroke-cuban-emerald'
        if (progress > 20) return 'stroke-cuban-gold'
        return 'stroke-red-500'
    }

    return (
        <div className="relative w-12 h-12 flex items-center justify-center">
            {/* Background circle */}
            <svg className="w-full h-full transform -rotate-90">
                <circle
                    cx="24"
                    cy="24"
                    r="20"
                    className="stroke-black/20"
                    strokeWidth="4"
                    fill="none"
                />
                {/* Progress circle */}
                <circle
                    cx="24"
                    cy="24"
                    r="20"
                    className={`${getColor()} transition-colors duration-300`}
                    strokeWidth="4"
                    fill="none"
                    strokeDasharray={126} // 2 * PI * 20
                    strokeDashoffset={126 - (126 * progress) / 100}
                    strokeLinecap="round"
                />
            </svg>
            <div className="absolute text-xs font-bold text-cuban-off-white">
                {Math.ceil(timeLeft)}
            </div>
        </div>
    )
}
