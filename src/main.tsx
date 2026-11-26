import '@fontsource-variable/plus-jakarta-sans';
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import './index.css';
import { captureReferral } from './lib/share';
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
