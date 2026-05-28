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

const BACK_DESTINO = {
  '/carrito':   '/',
  '/horario':   '/carrito',
  '/confirmar': '/horario',
}

export default function Topbar({ onMenuClick }) {
  const { cantidad, total } = useCarrito()
  const { racha }           = usePuntos()
  const location            = useLocation()
  const navigate            = useNavigate()

  const titulo    = TITULOS[location.pathname] || 'CaféUCOL'
  const backDest  = BACK_DESTINO[location.pathname]

  return (
    <header className="topbar" role="banner">

      {/* Botón hamburguesa — solo visible en móvil (CSS) */}
      <button
        className="topbar-menu-btn"
        onClick={onMenuClick}
        aria-label="Abrir menú de navegación"
        title="Menú"
      >
        ☰
      </button>

      {/* Botón regresar — solo en pantallas con back */}
      {backDest && (
        <button
          className="topbar-back"
          onClick={() => navigate(backDest)}
          aria-label="Regresar a la pantalla anterior"
        >
          ← Regresar
        </button>
      )}

      <h2 className="topbar-title">{titulo}</h2>

      {/* Racha — se oculta en móvil con CSS */}
      {racha > 0 && location.pathname === '/' && (
        <div className="topbar-racha" title={`${racha} días consecutivos`}>
          🔥 {racha} días en racha
        </div>
      )}

      {/* Botón carrito siempre visible */}
      <Link
        to="/carrito"
        className="topbar-cart-btn"
        aria-label={`Ver carrito: ${cantidad} productos, total $${total}`}
        title="Ver mi pedido"
      >
        🛒
        {/* La etiqueta se oculta en móvil con .topbar-cart-label */}
        <span className="topbar-cart-label">Mi Pedido</span>
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