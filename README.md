# PARLOG VIEW - Premium Movie Streaming

A complete, production-ready movie streaming website featuring a premium dark interface with purple accents, inspired by Netflix, EgyBest, and FlixMomo. 

Built with **React 18**, **TypeScript**, **Tailwind CSS**, and the **TMDB API**.

## Features
- **Premium Dark Design**: Deep black `#0a0a0a` background with `#8B5CF6` purple accents.
- **Dynamic Content**: Fetches real movies from the TMDB API using `TanStack Query` for caching.
- **Search & Filtering**: Real-time debounced search.
- **My List**: LocalStorage-based watchlist functionality.
- **Detailed Pages**: Full backdrop images, custom video player skeleton, and similar movie suggestions.
- **Responsive**: Fully responsive design for mobile, tablet, and desktop.

## Free TMDB API Setup Instructions
To get real data flowing into the app, you need a free TMDB API Key.

1. Go to [The Movie Database (TMDB)](https://www.themoviedb.org/) and create a free account.
2. Navigate to **Settings** -> **API** from the left sidebar.
3. Click on **Create** or **Request an API Key** (choose Developer).
4. Fill out the form, and you will instantly receive your `v3 auth` API Key.
5. Create a `.env` file in the root of this project and add:
   ```env
   VITE_TMDB_API_KEY=your_api_key_here
   ```
6. Restart the Vite development server.

## Installation & Running Locally

1. Install dependencies:
   ```bash
   npm install
   ```

2. Start the development server:
   ```bash
   npm run dev
   ```

3. Open `http://localhost:5173` in your browser.

## Tech Stack & Architecture
- **React 18** with **TypeScript**
- **Vite** for fast building
- **Tailwind CSS** for styling and animations
- **Framer Motion** for UI micro-animations
- **React Query** for server state management
- **React Router v6** for navigation
- **Laravel-inspired Structure**: `src/app`, `src/config`, `src/resources`, `src/routes`, `src/services`, `src/utils`

## Performance & Rate Limiting
- **Caching**: API responses are cached via TanStack Query to reduce network requests.
- **Debouncing**: Search inputs are debounced by 500ms to avoid hitting TMDB's 50 requests/sec limit.
- **Lazy Loading**: Images use optimized loading (if expanded with `framer-motion`).
