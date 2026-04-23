# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Overview

DrinkMate is a mobile-first React web app for tracking alcohol consumption, styled after Apple Watch activity rings (合上圆环饮酒版). It is a pure client-side SPA with no backend.

## Tech Stack

- **Build**: Vite 5 with `@vitejs/plugin-react`
- **Framework**: React 18 (JSX, not TypeScript)
- **Router**: Wouter (lightweight, hook-based, no `<Router>` wrapper needed)
- **State**: Zustand (no persist middleware currently; stores are in-memory only)
- **Styling**: CSS Modules + global CSS variables in `src/index.css`
- **Icons**: Lucide React

## Common Commands

```bash
# Start dev server
npm run dev

# Production build (outputs to dist/)
npm run build

# Preview production build locally
npm run preview
```

There is no test runner or lint npm script configured. ESLint config exists at `eslint.config.js` but must be run manually via `npx eslint` if needed.

## Architecture

### Layout & Routing

The app is constrained to a mobile viewport (`max-width: 480px`, centered). `AppShell` (`src/components/layout/AppShell`) wraps all routes and conditionally renders `BottomNav` — navigation is hidden on `/onboarding` and `/add`.

Routes are defined in `src/App.jsx`:
- `/` — Root route; renders `OnboardingPage` if onboarding incomplete, otherwise `HomePage`
- `/onboarding` — First-time user setup
- `/add` — Drink record form
- `/calculator` — Alcohol calculator
- `/guide` — Drinking guidelines
- `/settings` — User preferences

### State Management

Two Zustand stores in `src/stores/`:
- **`drinkStore`** (`drinkStore.js`): Holds `records[]`. Derived stats (total alcohol, percentage, ring color) are computed in components or via `getTodayStats()`.
- **`userStore`** (`userStore.js`): Holds `gender`, `dailyLimit`, `hasCompletedOnboarding`, and `preferences`.

**Important**: Neither store currently uses Zustand's `persist` middleware. All data is lost on page refresh. If adding persistence, use `zustand/middleware` and the `STORAGE_KEYS` defined in `src/utils/constants.ts`.

### Design System

CSS variables are defined in `src/index.css`. Key variables:
- Backgrounds: `--bg-primary` (#0a0a0f), `--bg-card` (#1a1a24)
- Ring colors: `--ring-gold`, `--ring-amber`, `--ring-orange`, `--ring-red` (with corresponding `-glow` variants)
- Text: `--text-primary`, `--text-secondary`, `--text-tertiary`

The app is dark-themed by default. Utility classes (`.flex`, `.gap-md`, `.text-secondary`, etc.) are also defined in `index.css`.

### Drink Data Model

A drink record shape:
```js
{
  id: string,
  type: 'wine' | 'beer' | 'spirit' | 'cocktail' | 'sake' | 'whiskey',
  name: string,
  volume: number,      // ml
  abv: number,         // %
  timestamp: string,   // ISO 8601
  pureAlcohol: number  // g, computed on add
}
```

Presets and constants (daily limits, alcohol density, calories per gram) live in `src/utils/constants.ts`. Calculation utilities live in `src/utils/calculator.ts`.

### Component Conventions

- Pages live in `src/pages/{PageName}/index.jsx` with a co-located `.module.css` file.
- Shared components live in `src/components/{category}/{ComponentName}/`.
- Barrel exports: `src/stores/index.js`, `src/utils/index.ts`, `src/types/index.ts`.
- Emoji icons are used for drink type icons in quick-add buttons; Lucide icons are used for UI actions.

## Important Files

- `src/index.css` — Global styles, CSS variable design system, utility classes
- `src/utils/constants.ts` — Drink presets, daily limits, storage keys, guide content
- `src/utils/calculator.ts` — Pure alcohol, standard drinks, calories, ring color logic
- `src/stores/drinkStore.js` & `src/stores/userStore.js` — App state
- `vite.config.js` — Vite config with `base: './'` for relative asset paths

## Notes

- The project contains `.ts` type definition files (`src/types/`, some `utils/`) but the runtime code is plain JSX/JS. The build does not use TypeScript.
- `ARCHITECTURE.md` and `TECH_SPEC.md` are design documents from project inception and may not reflect the current implementation (e.g., they mention TypeScript, Vitest, and Zustand persistence which are not currently active).
- `src/styles/`, `src/hooks/`, and `src/components/ui/` directories exist but are currently empty or unused.
