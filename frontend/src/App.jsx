import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { CarritoProvider } from './context/CarritoContext'
import { PuntosProvider }  from './context/PuntosContext'
import { ToastProvider }   from './context/ToastContext'
import Sidebar   from './components/Sidebar'
import Topbar    from './components/Topbar'
import LogroToast from './components/LogroToast'
import Menu          from './pages/Menu'
import Carrito       from './pages/Carrito'
import Horario       from './pages/Horario'
import Confirmacion  from './pages/Confirmacion'
import Historial     from './pages/Historial'
import Perfil        from './pages/Perfil'
import './index.css'

export default function App() {
  return (
    <ToastProvider>
      <PuntosProvider>
        <CarritoProvider>
          <BrowserRouter>
            <div className="app-shell">
              <Sidebar />
              <div className="main-area">
                <Topbar />
                <LogroToast />
                <Routes>
                  <Route path="/"           element={<Menu />} />
                  <Route path="/carrito"    element={<Carrito />} />
                  <Route path="/horario"    element={<Horario />} />
                  <Route path="/confirmar"  element={<Confirmacion />} />
                  <Route path="/historial"  element={<Historial />} />
                  <Route path="/perfil"     element={<Perfil />} />
                </Routes>
              </div>
            </div>
          </BrowserRouter>
        </CarritoProvider>
      </PuntosProvider>
    </ToastProvider>
  )
}