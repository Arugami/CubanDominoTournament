/**
 * LoadingTransition - Smooth transition overlay for game state changes
 */

interface LoadingTransitionProps {
  visible: boolean
  message?: string
  type?: 'fade' | 'round-change' | 'game-start'
}

export function LoadingTransition({ visible, message, type = 'fade' }: LoadingTransitionProps) {
  if (!visible) return null

  return (
    <div
      className="fixed inset-0 z-40 flex items-center justify-center animate-fade-in"
      style={{
        background: type === 'round-change'
          ? 'radial-gradient(circle at center, rgba(0, 31, 63, 0.95) 0%, rgba(0, 8, 20, 0.98) 100%)'
          : 'rgba(0, 0, 0, 0.7)',
        backdropFilter: 'blur(4px)'
      }}
    >
      {message && (
        <div className="text-center space-y-4 animate-slide-up">
          {/* Animated domino icon */}
          <div className="mx-auto w-16 h-16 relative">
            <div className="absolute inset-0 animate-spin-slow">
              <div className="w-full h-full rounded-lg bg-gradient-to-br from-cuban-cream to-cuban-gold shadow-2xl" style={{
                transform: 'perspective(100px) rotateX(20deg)'
              }}>
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-2 h-2 rounded-full bg-cuban-navy" />
                </div>
              </div>
            </div>
          </div>

          {/* Message */}
          <div className="text-cuban-gold text-xl font-bold tracking-wide drop-shadow-[0_2px_8px_rgba(212,175,55,0.4)]">
            {message}
          </div>
        </div>
      )}
    </div>
  )
}
