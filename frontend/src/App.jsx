import { useState } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { CarritoProvider } from './context/CarritoContext'
import { PuntosProvider }  from './context/PuntosContext'
import { ToastProvider }   from './context/ToastContext'
import Sidebar        from './components/Sidebar'
import Topbar         from './components/Topbar'
import BottomNavMobile from './components/BottomNavMobile'
import LogroToast     from './components/LogroToast'
import Menu           from './pages/Menu'
import Carrito        from './pages/Carrito'
import Horario        from './pages/Horario'
import Confirmacion   from './pages/Confirmacion'
import Historial      from './pages/Historial'
import Perfil         from './pages/Perfil'
import './index.css'

export default function App() {
  const [sidebarOpen, setSidebarOpen] = useState(false)

  return (
    <ToastProvider>
      <PuntosProvider>
        <CarritoProvider>
          <BrowserRouter>
            <div className="app-shell">

              {/* Overlay oscuro para cerrar sidebar en móvil */}
              {sidebarOpen && (
                <div
                  className="sidebar-overlay"
                  onClick={() => setSidebarOpen(false)}
                  aria-hidden="true"
                />
              )}

              <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

              <div className="main-area">
                <Topbar onMenuClick={() => setSidebarOpen(o => !o)} />
                <LogroToast />

                <Routes>
                  <Route path="/"          element={<Menu />} />
                  <Route path="/carrito"   element={<Carrito />} />
                  <Route path="/horario"   element={<Horario />} />
                  <Route path="/confirmar" element={<Confirmacion />} />
                  <Route path="/historial" element={<Historial />} />
                  <Route path="/perfil"    element={<Perfil />} />
                </Routes>

                {/* Navegación inferior solo en móvil */}
                <BottomNavMobile />
              </div>

            </div>
          </BrowserRouter>
        </CarritoProvider>
      </PuntosProvider>
    </ToastProvider>
  )
}