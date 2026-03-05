import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { AuthProvider, AppDataProvider, CartProvider } from '@shared/context'
import { ParticlesBackground } from '@shared/components'
import App from './App'
import './index.css'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <AppDataProvider>
          <CartProvider>
            <div className="relative min-h-screen bg-diamond-bg">
              <ParticlesBackground />
              <div className="relative z-10">
                <App />
              </div>
            </div>
          </CartProvider>
        </AppDataProvider>
      </AuthProvider>
    </BrowserRouter>
  </StrictMode>,
)
