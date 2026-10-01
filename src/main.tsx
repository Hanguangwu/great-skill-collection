import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import './index.css'
import App from './App.tsx'

/**
 * Deploy sub-path, injected by Vite from `.env` (VITE_BASE_PATH) — the same
 * value that becomes `base` in vite.config.ts. Change it there, not here.
 */
const BASE_PATH = import.meta.env.BASE_URL.replace(/\/+$/, '')

/**
 * GitHub Pages serves public/404.html for unknown deep links, and that page
 * redirects to `index.html?path=<original path>`. Rewrite the history entry
 * back to the real route here, before React mounts, so BrowserRouter reads a
 * location that matches an actual route instead of `/index.html`.
 */
function restoreSpaPath() {
  if (typeof window === 'undefined') return

  const params = new URLSearchParams(window.location.search)
  const path = params.get('path')
  if (!path) return

  params.delete('path')
  const rest = params.toString()

  window.history.replaceState(
    null,
    '',
    `${BASE_PATH}${path.startsWith('/') ? path : `/${path}`}${rest ? `?${rest}` : ''}`,
  )
}

restoreSpaPath()

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter basename={BASE_PATH}>
      <App />
    </BrowserRouter>
  </StrictMode>,
)
