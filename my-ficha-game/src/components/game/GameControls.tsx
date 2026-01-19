/**
 * GameControls - Action buttons for game interactions
 */



interface GameControlsProps {
  canPass: boolean
  onPass: () => void
  disabled?: boolean
}

export function GameControls({ canPass, onPass, disabled = false }: GameControlsProps) {
  return (
    <div
      className="w-full wood-texture rounded-lg p-4 border border-cuban-mahogany/50"
      role="region"
      aria-label="Game Controls"
    >
      <div className="flex gap-3 justify-center">
        <button
          onClick={onPass}
          disabled={!canPass || disabled}
          aria-label={canPass ? 'Pass your turn' : 'Cannot pass - you have valid moves'}
          aria-disabled={!canPass || disabled}
          className={`
            px-6 py-3 rounded-md font-bold text-sm
            transition-all transform
            ${canPass && !disabled
              ? 'brass-coin text-cuban-navy hover:scale-105 active:scale-95'
              : 'bg-black/40 text-cuban-cream/30 cursor-not-allowed border border-cuban-mahogany/20'
            }
          `}
        >
          {canPass ? 'Pass Turn' : 'Blocked'}
        </button>
      </div>

      {!canPass && !disabled && (
        <div
          className="mt-3 text-center text-cuban-emerald/80 text-xs font-medium tracking-wide"
          role="status"
          aria-live="polite"
        >
          You have valid moves!
        </div>
      )}
    </div>
  )
}
