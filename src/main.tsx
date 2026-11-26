import '@fontsource-variable/plus-jakarta-sans';
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import './index.css';
import { captureReferral } from './lib/share';
import { hideSplash } from './lib/splash';
import { PlayerProvider } from './state/PlayerContext';

// Lien d'invitation (?ref=CODE) : mémorisé jusqu'à la création du compte.
captureReferral();

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <PlayerProvider>
      <App />
    </PlayerProvider>
  </StrictMode>,
);

// L'app est montée : on retire l'écran d'ouverture (après son animation à la 1re ouverture).
hideSplash();
