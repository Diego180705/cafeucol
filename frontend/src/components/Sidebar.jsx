import { NavLink } from 'react-router-dom'
import { useCarrito } from '../context/CarritoContext'
import { usePuntos }  from '../context/PuntosContext'

const NAV = [
  { to: '/',          icon: '🍽️', label: 'Menú',      title: 'Ver el menú de la cafetería' },
  { to: '/carrito',   icon: '🛒', label: 'Mi Pedido', title: 'Ver tu pedido actual'        },
  { to: '/historial', icon: '📋', label: 'Historial', title: 'Ver pedidos anteriores'      },
  { to: '/perfil',    icon: '⭐', label: 'Perfil',    title: 'Ver tus puntos y logros'     },
]

export default function Sidebar({ isOpen, onClose }) {
  const { cantidad }          = useCarrito()
  const { monedas, racha }    = usePuntos()

  return (
    <aside
      className={`sidebar ${isOpen ? 'open' : ''}`}
      role="navigation"
      aria-label="Menú principal"
    >
      {/* Logo */}
      <div className="sidebar-logo" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div>
          <h1>☕ CaféUCOL</h1>
          <span>Cafetería Universitaria</span>
        </div>
        {/* Botón cerrar — solo visible en móvil */}
        <button
          onClick={onClose}
          aria-label="Cerrar menú"
          style={{
            display: 'none',   // CSS lo muestra en móvil con .sidebar.open el close btn
            background: 'rgba(255,255,255,.15)', border: 'none',
            borderRadius: 8, width: 32, height: 32,
            color: 'white', fontSize: 18, cursor: 'pointer',
            alignItems: 'center', justifyContent: 'center',
          }}
          className="sidebar-close-btn"
        >✕</button>
      </div>

      {/* Navegación */}
      <nav className="sidebar-nav">
        {NAV.map(item => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.to === '/'}
            title={item.title}
            aria-label={item.label}
            className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
            onClick={onClose}   // cierra sidebar al navegar en móvil
          >
            <span className="nav-icon" aria-hidden="true">{item.icon}</span>
            {item.label}
            {item.to === '/carrito' && cantidad > 0 && (
              <span className="nav-badge" aria-label={`${cantidad} productos en el carrito`}>
                {cantidad}
              </span>
            )}
          </NavLink>
        ))}
      </nav>

      {/* Footer monedas + racha */}
      <div className="sidebar-footer">
        <div className="coins-sidebar">
          <span style={{ fontSize: 22 }}>🪙</span>
          <div>
            <div className="label">CaféCoins</div>
            <div className="valor">{monedas}</div>
          </div>
          {racha > 0 && (
            <div style={{ marginLeft: 'auto', textAlign: 'center' }}>
              <div style={{ fontSize: 18 }}>🔥</div>
              <div style={{ color: 'rgba(255,255,255,.75)', fontSize: 11, fontWeight: 700 }}>{racha} días</div>
            </div>
          )}
        </div>
      </div>
    </aside>
  )
}