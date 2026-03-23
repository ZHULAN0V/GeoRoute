import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import MainProvider from './providers/MainProvider.tsx'

document.oncontextmenu = function (){return false};
// document.querySelector('.leaflet-bottom')?.remove();

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <MainProvider>
      <App />
    </MainProvider>
  </StrictMode>,
)
