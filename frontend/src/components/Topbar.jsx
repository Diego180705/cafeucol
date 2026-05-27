import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useCarrito } from '../context/CarritoContext'
import { usePuntos }  from '../context/PuntosContext'

const TITULOS = {
  '/':          'Menú de la Cafetería',
  '/carrito':   'Mi Pedido',
  '/horario':   'Selección de Horario',
  '/confirmar': 'Confirmar Pedido',
  '/historial': 'Historial de Pedidos',
  '/perfil':    'Mi Perfil y Logros',
}

const CON_BACK = ['/carrito', '/horario', '/confirmar']

const BACK_DESTINO = {
  '/carrito':   '/',
  '/horario':   '/carrito',
  '/confirmar': '/horario',
}

export default function Topbar() {
  const { cantidad, total } = useCarrito()
  const { racha } = usePuntos()
  const location  = useLocation()
  const navigate  = useNavigate()

  const titulo   = TITULOS[location.pathname] || 'CaféUCOL'
  const tieneBack = CON_BACK.includes(location.pathname)

  return (
    <header className="topbar" role="banner">
      {tieneBack && (
        <button
          className="topbar-back"
          onClick={() => navigate(BACK_DESTINO[location.pathname])}
          aria-label="Regresar a la pantalla anterior"
          title="Regresar"
        >
          ← Regresar
        </button>
      )}

      <h2 className="topbar-title">{titulo}</h2>

      {/* Racha activa */}
      {racha > 0 && location.pathname === '/' && (
        <div className="topbar-racha" title={`Llevas ${racha} días consecutivos usando la app`}>
          🔥 {racha} días en racha
        </div>
      )}

      {/* ── BOTÓN CARRITO en topbar ── */}
      <Link
        to="/carrito"
        className="topbar-cart-btn"
        aria-label={`Ver carrito: ${cantidad} productos, total $${total}`}
        title="Ver mi pedido actual"
      >
        🛒 Mi Pedido
        {cantidad > 0 && (
          <>
            <span style={{ fontWeight: 900, color: 'var(--verde)' }}>${total}</span>
            <span className="topbar-cart-badge" aria-hidden="true">{cantidad}</span>
          </>
        )}
      </Link>
    </header>
  )
}