import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { CarritoProvider } from './context/CarritoContext'
import { PuntosProvider } from './context/PuntosContext'
import BottomNav from './components/BottomNav'
import Menu from './pages/Menu'
import Carrito from './pages/Carrito'
import Horario from './pages/Horario'
import Confirmacion from './pages/Confirmacion'
import Historial from './pages/Historial'
import Perfil from './pages/Perfil'
import './index.css'

export default function App() {
  return (
    <PuntosProvider>
      <CarritoProvider>
        <BrowserRouter>
          <div className="app-shell">
            <Routes>
              <Route path="/"            element={<Menu />} />
              <Route path="/carrito"     element={<Carrito />} />
              <Route path="/horario"     element={<Horario />} />
              <Route path="/confirmar"   element={<Confirmacion />} />
              <Route path="/historial"   element={<Historial />} />
              <Route path="/perfil"      element={<Perfil />} />
            </Routes>
            <BottomNav />
          </div>
        </BrowserRouter>
      </CarritoProvider>
    </PuntosProvider>
  )
}