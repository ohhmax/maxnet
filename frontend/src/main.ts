/// <reference types="vite/client" />

// 1. Process and bundle master cyberpunk styles with Vite & PostCSS
import './styles/maxnet.css';

// 2. Import raw semantic HTML templates via Vite's native ?raw string loader
import templatesRaw from './templates/templates.raw.html?raw';

// 3. Inject DOM tree into #maxnet-root immediately upon DOM ready
function bootstrapDOM(): void {
  const root = document.getElementById('maxnet-root') || document.body;
  if (root && !document.getElementById('loginScreen')) {
    root.innerHTML = templatesRaw;
  }
}
bootstrapDOM();

// 4. Load verified core logic engine and bind functions to window scope
import './core/maxnet-engine.js';
import './core/maxnet-bridge.js';
