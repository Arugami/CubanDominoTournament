import { useState } from 'react'

export interface GameConfig {
    mode: '1v1' | '2v2'
    targetScore: number
    playerNames: string[]
}

interface GameSetupProps {
    onStartGame: (config: GameConfig) => void
}

export function GameSetup({ onStartGame }: GameSetupProps) {
    const [mode, setMode] = useState<'1v1' | '2v2'>('1v1')
    const [targetScore, setTargetScore] = useState<number>(150)
    const [playerNames, setPlayerNames] = useState<string[]>(['Player 1', 'Player 2'])

    const handleModeChange = (newMode: '1v1' | '2v2') => {
        setMode(newMode)
        if (newMode === '1v1') {
            setPlayerNames(prev => [prev[0] || 'Player 1', prev[1] || 'Player 2'])
        } else {
            setPlayerNames(prev => [
                prev[0] || 'Player 1',
                prev[1] || 'Player 2',
                prev[2] || 'Player 3',
                prev[3] || 'Player 4'
            ])
        }
    }

    const handleNameChange = (index: number, name: string) => {
        const newNames = [...playerNames]
        newNames[index] = name
        setPlayerNames(newNames)
    }

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        onStartGame({
            mode,
            targetScore,
            playerNames
        })
    }

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-cuban-navy p-4">
            <div className="w-full max-w-md bg-cuban-mahogany rounded-lg shadow-2xl border border-cuban-gold/30 p-8">
                <h1 className="text-4xl font-serif text-cuban-gold text-center mb-8 drop-shadow-md">
                    My Ficha
                </h1>

                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Game Mode Selection */}
                    <div className="space-y-2">
                        <label className="block text-cuban-off-white text-sm font-bold uppercase tracking-wider">
                            Game Mode
                        </label>
                        <div className="grid grid-cols-2 gap-4">
                            <button
                                type="button"
                                onClick={() => handleModeChange('1v1')}
                                className={`p-3 rounded-md border-2 transition-all font-bold ${mode === '1v1'
                                    ? 'border-cuban-emerald bg-cuban-emerald/20 text-cuban-emerald'
                                    : 'border-white/10 bg-white/5 text-white/60 hover:bg-white/10'
                                    }`}
                            >
                                1 vs 1
                            </button>
                            <button
                                type="button"
                                onClick={() => handleModeChange('2v2')}
                                className={`p-3 rounded-md border-2 transition-all font-bold ${mode === '2v2'
                                    ? 'border-cuban-emerald bg-cuban-emerald/20 text-cuban-emerald'
                                    : 'border-white/10 bg-white/5 text-white/60 hover:bg-white/10'
                                    }`}
                            >
                                2 vs 2
                            </button>
                        </div>
                    </div>

                    {/* Target Score Selection */}
                    <div className="space-y-2">
                        <label className="block text-cuban-off-white text-sm font-bold uppercase tracking-wider">
                            Target Score
                        </label>
                        <div className="grid grid-cols-3 gap-2">
                            {[100, 150, 200].map((score) => (
                                <button
                                    key={score}
                                    type="button"
                                    onClick={() => setTargetScore(score)}
                                    className={`p-2 rounded-md border transition-all ${targetScore === score
                                        ? 'border-cuban-gold bg-cuban-gold/20 text-cuban-gold'
                                        : 'border-white/10 bg-white/5 text-white/60 hover:bg-white/10'
                                        }`}
                                >
                                    {score}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Player Names */}
                    <div className="space-y-3">
                        <label className="block text-cuban-off-white text-sm font-bold uppercase tracking-wider">
                            Players
                        </label>
                        {playerNames.map((name, index) => (
                            <div key={index} className="flex items-center gap-2">
                                <span className="text-white/40 text-xs w-6">{index + 1}.</span>
                                <div className="flex-1 flex gap-2">
                                    <input
                                        type="text"
                                        value={name}
                                        onChange={(e) => handleNameChange(index, e.target.value)}
                                        className="flex-1 bg-black/20 border border-white/10 rounded px-3 py-2 text-cuban-off-white focus:border-cuban-gold focus:outline-none transition-colors"
                                        placeholder={`Player ${index + 1}`}
                                        required
                                    />
                                    <button
                                        type="button"
                                        onClick={() => handleNameChange(index, `Bot ${index + 1}`)}
                                        className="px-2 py-1 bg-cuban-emerald/20 text-cuban-emerald text-xs rounded hover:bg-cuban-emerald/30 border border-cuban-emerald/30"
                                        title="Set as Bot"
                                    >
                                        🤖
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Start Button */}
                    <button
                        type="submit"
                        className="w-full mt-8 bg-cuban-gold text-cuban-navy font-bold py-4 rounded-md shadow-lg hover:bg-white hover:scale-[1.02] transition-all transform active:scale-95"
                    >
                        Start Game
                    </button>
                </form>
            </div>

            <div className="mt-8 text-white/20 text-xs text-center">
                Cuban Dominoes • Capicúa!
            </div>
        </div>
    )
}
