import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Build metadata injected at build time (BUILD_ID set by CI to the run number).
const BUILD_ID = process.env.BUILD_ID || 'dev'
const BUILD_DATE = new Date().toISOString().slice(0, 10)

export default defineConfig({
  plugins: [react()],
  define: {
    __BUILD_ID__: JSON.stringify(BUILD_ID),
    __BUILD_DATE__: JSON.stringify(BUILD_DATE),
  },
  server: {
    host: '0.0.0.0',
    port: 5173,
    // Bind mounts on Windows/Docker don't emit inotify events, so Vite
    // can't see file changes. Polling makes HMR work inside the container.
    watch: { usePolling: true },
    // Forward API calls to the Express server when running it alongside `vite`.
    // (If the server isn't running, the app falls back to localStorage offline mode.)
    proxy: { '/api': 'http://localhost:8080' },
  }
})