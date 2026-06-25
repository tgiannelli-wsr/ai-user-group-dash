import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
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