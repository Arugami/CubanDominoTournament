/**
 * ScoreBoard - Displays player scores and game progress
 */

import { Player } from '@/engine/types'

interface ScoreBoardProps {
  players: Player[]
  currentPlayerId: string
  targetScore: number
}

export function ScoreBoard({ players, currentPlayerId, targetScore }: ScoreBoardProps) {
  return (
    <div
      className="w-full wood-texture rounded-lg p-4 border border-cuban-mahogany/50"
      role="region"
      aria-label="Scoreboard"
    >
      <div className="text-cuban-gold text-xs font-bold mb-3 tracking-widest uppercase opacity-90 drop-shadow-sm">
        Scoreboard
      </div>
      <div className="space-y-3" role="list" aria-label="Player scores">
        {players.map((player) => {
          const isCurrent = player.id === currentPlayerId
          const progress = Math.min((player.score / targetScore) * 100, 100)

          return (
            <div
              key={player.id}
              role="listitem"
              aria-label={`${player.name}: ${player.score} out of ${targetScore} points${isCurrent ? ' - Current turn' : ''}`}
              className={`
                relative rounded p-3 transition-all duration-300
                ${isCurrent
                  ? 'bg-cuban-emerald/10 ring-2 ring-cuban-emerald/50 shadow-[0_0_16px_rgba(46,204,113,0.3)]'
                  : 'bg-black/20'
                }
              `}
            >
              {/* Active player indicator */}
              {isCurrent && (
                <div className="absolute -left-1 top-1/2 -translate-y-1/2 w-1 h-8 bg-cuban-emerald rounded-r-full shadow-[0_0_8px_rgba(46,204,113,0.6)] animate-pulse" />
              )}

              {/* "YOUR TURN" badge */}
              {isCurrent && (
                <div className="absolute -top-2 right-2 px-2 py-0.5 bg-cuban-emerald text-cuban-navy text-[10px] font-bold tracking-wider rounded-full shadow-lg animate-pulse">
                  YOUR TURN
                </div>
              )}

              <div className="flex items-center justify-between gap-3">
                {/* Player name */}
                <div className="flex items-center gap-2 flex-1 min-w-0">
                  {isCurrent && (
                    <div className="w-1.5 h-1.5 rounded-full bg-cuban-emerald animate-pulse" />
                  )}
                  <span
                    className={`font-semibold truncate text-sm ${isCurrent ? 'text-cuban-emerald' : 'text-cuban-cream/80'
                      }`}
                  >
                    {player.name}
                  </span>
                </div>

                {/* Score - embossed number style */}
                <div className="flex items-baseline gap-1">
                  <span className="text-2xl font-bold text-cuban-gold drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]" style={{
                    textShadow: '0 1px 0 rgba(255, 255, 255, 0.1), 0 3px 6px rgba(0, 0, 0, 0.8)'
                  }}>
                    {player.score}
                  </span>
                  <span className="text-xs text-cuban-gold/50 font-medium">
                    / {targetScore}
                  </span>
                </div>
              </div>

              {/* Progress bar */}
              <div className="mt-2 w-full h-1.5 bg-black/40 rounded-full overflow-hidden border border-cuban-mahogany/30">
                <div
                  className="h-full transition-all duration-500"
                  style={{
                    width: `${progress}%`,
                    background: 'linear-gradient(90deg, #2ECC71 0%, #FFC107 100%)',
                    boxShadow: progress > 0 ? '0 0 8px rgba(46, 204, 113, 0.5)' : 'none'
                  }}
                />
              </div>
            </div>
          )
        })}
      </div>

      {/* Target score footer */}
      <div className="mt-4 pt-3 border-t border-cuban-mahogany/30">
        <div className="flex justify-between items-center text-xs">
          <span className="text-cuban-gold/60 tracking-wide">Target Score</span>
          <span className="text-cuban-gold font-bold">{targetScore}</span>
        </div>
      </div>
    </div>
  )
}
