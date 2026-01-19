# MyFicha - Cuban Dominoes 🎲🇨🇺

> An authentic Cuban Dominoes experience that captures the soul of Friday night games

## Overview

MyFicha is a Progressive Web App (PWA) that brings the authentic experience of Cuban Dominoes to the digital world. Built with love, attention to cultural detail, and modern web technologies.

### Key Features

- ✨ **Authentic Cuban Theme** - Warm mahogany table, vintage lighting, cultural details
- 🎮 **Double-Nine Dominoes** - Traditional Cuban rules with 55 tiles
- 👥 **Multiplayer** - 1v1 and 2v2 modes with real-time sync
- 📊 **Cuban Domino Score (CDS)** - Custom Elo-based rating system
- 💬 **Ephemeral Chat** - Text and GIF support with Cuban lingo
- 🏆 **Special Plays** - Capicúa, Pollona, Viajera tracking
- 📱 **Mobile-First** - Optimized for portrait play, works everywhere
- 🌙 **Cuban Color Palette** - Deep navy, emerald, gold, tobacco brown

## Tech Stack

- **Frontend**: React 18 + TypeScript + Vite
- **Styling**: Tailwind CSS with custom Cuban theme
- **Backend**: Supabase (PostgreSQL + Realtime + Auth)
- **Testing**: Vitest + React Testing Library
- **PWA**: Vite PWA Plugin with offline support

## Project Structure

```
my-ficha-game/
├── src/
│   ├── components/        # React components
│   │   ├── game/          # Game-specific components
│   │   ├── ui/            # Reusable UI components
│   │   └── layout/        # Layout components
│   ├── engine/            # Pure TS game logic
│   │   ├── types.ts       # Type definitions
│   │   ├── tiles.ts       # Tile utilities
│   │   ├── game.ts        # Core game engine
│   │   └── *.test.ts      # Unit tests
│   ├── lib/               # Utilities & helpers
│   ├── hooks/             # Custom React hooks
│   ├── styles/            # Global styles
│   └── types/             # Shared TypeScript types
├── docs/                  # Documentation
│   ├── Overview for _My Ficha_.md
│   ├── Cuban Dominoes Lingo and Feature Integrations.md
│   ├── Cuban Domino Score (CDS).md
│   └── SUPABASE_SCHEMA.md
└── public/                # Static assets
```

## Getting Started

### Prerequisites

- Node.js 18+ and npm
- A Supabase account (free tier works)

### Installation

1. **Clone and install dependencies:**

```bash
npm install
```

2. **Set up Supabase:**

- Create a new project at [supabase.com](https://supabase.com)
- Run the SQL from `docs/SUPABASE_SCHEMA.md` in the SQL Editor
- Copy your project URL and anon key

3. **Configure environment variables:**

Create a `.env.local` file:

```env
VITE_SUPABASE_URL=your_project_url
VITE_SUPABASE_ANON_KEY=your_anon_key
```

4. **Start development server:**

```bash
npm run dev
```

Visit `http://localhost:5173` to see the app.

### Running Tests

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Generate coverage report
npm run test:coverage

# Run tests with UI
npm run test:ui
```

### Building for Production

```bash
npm run build
npm run preview
```

## Development Roadmap

### ✅ Phase 1: Foundation (Current)
- [x] Project setup with Vite + React + TypeScript
- [x] Tailwind CSS with Cuban color palette
- [x] Core domino engine with tests
- [x] Database schema design

### 🚧 Phase 2: Core Gameplay (Next)
- [ ] Game board component with 2D rendering
- [ ] Tile drag-and-drop with animations
- [ ] Turn management and valid move detection
- [ ] Local gameplay (single device)

### 📋 Phase 3: Multiplayer
- [ ] Supabase integration
- [ ] Real-time game state sync
- [ ] Matchmaking system
- [ ] Private room codes

### 🎨 Phase 4: Polish
- [ ] Cuban lingo overlays
- [ ] Sound effects and haptics
- [ ] Chat with GIF support
- [ ] Leaderboards and CDS

### 🔮 Phase 5: Advanced
- [ ] 3D "Havana table" mode (React Three Fiber)
- [ ] AI opponents
- [ ] Tournaments
- [ ] Advanced analytics

## Game Engine

The core game logic is isolated in `src/engine/` as pure TypeScript modules with no React dependencies. This makes it:

- **Testable**: Comprehensive unit tests
- **Portable**: Can be used in Node.js, Web Workers, or other frameworks
- **Deterministic**: No side effects, same input = same output

### Key Functions

```typescript
import { createGame, playTile, getValidMoves } from '@/engine'

// Create a new 1v1 game
const game = createGame(['Alice', 'Bob'], '1v1')

// Get valid moves for current player
const moves = getValidMoves(game)

// Play a tile
const updatedGame = playTile(game, tileId, 'left')
```

## Cuban Lingo Integration

MyFicha includes authentic Cuban domino phrases:

- **Me pegué** - "I sealed the deal" (winning play)
- **Capicúa** - Palindrome play (fits both ends)
- **Pollona** - Shutout (opponent scores 0)
- **Viajera** - 100+ points in a round
- **Bota gorda** - Playing high tiles early
- **Estoy en la playa** - "I'm at the beach" (low tiles)

See `docs/Cuban Dominoes Lingo and Feature Integrations.md` for full list.

## Contributing

This is a personal project, but feedback and suggestions are welcome! Open an issue or reach out.

## Design Philosophy

> "Think of it as sitting down at your grandparents' plastic table in Hialeah or Union City, but inside a phone."

Every design decision is guided by cultural authenticity:
- Warm, dark, intimate atmosphere
- Physical, tactile interactions
- Respect for Cuban traditions
- Modern tech, timeless soul

## License

Private project - all rights reserved.

---

**¡Dale!** Let's play some dominoes. 🎲

Built with ❤️ for the Cuban diaspora and domino lovers everywhere.
