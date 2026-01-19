import { useEffect, useState } from 'react'

export type LingoType = 'me-pegue' | 'tranque' | 'pollona' | 'capicua'

interface LingoOverlayProps {
    type: LingoType
    visible: boolean
    onComplete?: () => void
}

export function LingoOverlay({ type, visible, onComplete }: LingoOverlayProps) {
    const [show, setShow] = useState(visible)

    useEffect(() => {
        setShow(visible)
        if (visible) {
            const timer = setTimeout(() => {
                setShow(false)
                onComplete?.()
            }, 4000) // 4 seconds duration
            return () => clearTimeout(timer)
        }
    }, [visible, onComplete])

    if (!show) return null

    const getContent = () => {
        switch (type) {
            case 'me-pegue':
                return {
                    text: '¡ME PEGUÉ!',
                    subtext: 'Dale agua que se secó',
                    color: 'bg-cuban-emerald',
                    textColor: 'text-cuban-navy'
                }
            case 'tranque':
                return {
                    text: '¡TRANQUE!',
                    subtext: 'A virarse todo el mundo',
                    color: 'bg-cuban-tobacco',
                    textColor: 'text-cuban-cream'
                }
            case 'pollona':
                return {
                    text: '¡POLLONA!',
                    subtext: '0 puntos... ¡Qué pena!',
                    color: 'bg-cuban-gold',
                    textColor: 'text-cuban-navy'
                }
            case 'capicua':
                return {
                    text: '¡CAPICÚA!',
                    subtext: 'Por las dos puntas',
                    color: 'bg-cuban-mahogany',
                    textColor: 'text-cuban-gold'
                }
        }
    }

    const content = getContent()

    return (
        <div className="fixed inset-0 pointer-events-none z-50 flex items-center justify-center overflow-hidden">
            {/* Cigar Band Animation */}
            <div
                className={`
          transform transition-all duration-700 ease-out
          ${show ? 'translate-x-0 opacity-100' : 'translate-x-full opacity-0'}
          absolute right-0 top-1/4 w-full max-w-2xl
        `}
            >
                <div className={`
          relative ${content.color} ${content.textColor}
          py-6 px-12 shadow-2xl transform -rotate-2
          border-y-4 border-cuban-gold/50
        `}>
                    {/* Paper Texture Overlay */}
                    <div className="absolute inset-0 opacity-20 bg-[url('/paper-texture.png')] mix-blend-multiply"></div>

                    <div className="relative flex items-center justify-between">
                        <div className="flex flex-col">
                            <h2 className="text-6xl font-display font-black tracking-tighter uppercase drop-shadow-md">
                                {content.text}
                            </h2>
                            <p className="text-xl font-serif italic opacity-90">
                                {content.subtext}
                            </p>
                        </div>

                        {/* Decorative Icon or Stamp */}
                        <div className="w-24 h-24 border-4 border-current rounded-full flex items-center justify-center opacity-50 transform rotate-12">
                            <span className="text-4xl">★</span>
                        </div>
                    </div>

                    {/* Torn Edge Effect (CSS) */}
                    <div className="absolute left-0 top-0 bottom-0 w-4 bg-black/10 -translate-x-full skew-x-6"></div>
                </div>
            </div>

            {/* Confetti for Win */}
            {type === 'me-pegue' && (
                <div className="absolute inset-0 pointer-events-none">
                    {/* Simple CSS Confetti could go here */}
                </div>
            )}
        </div>
    )
}
