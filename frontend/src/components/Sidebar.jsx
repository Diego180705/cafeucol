import { NavLink } from 'react-router-dom'
import { useCarrito } from '../context/CarritoContext'
import { usePuntos }  from '../context/PuntosContext'

const NAV = [
  { to: '/',          icon: '🍽️',  label: 'Menú',      title: 'Ver el menú de la cafetería' },
  { to: '/carrito',   icon: '🛒',  label: 'Mi Pedido', title: 'Ver tu pedido actual'        },
  { to: '/historial', icon: '📋',  label: 'Historial', title: 'Ver pedidos anteriores'      },
  { to: '/perfil',    icon: '⭐',  label: 'Perfil',    title: 'Ver tus puntos y logros'     },
]

export default function Sidebar() {
  const { cantidad } = useCarrito()
  const { monedas, racha } = usePuntos()

  return (
    <aside className="sidebar" role="navigation" aria-label="Menú principal">
      {/* Logo */}
      <div className="sidebar-logo">
        <h1>☕ CaféUCOL</h1>
        <span>Cafetería Universitaria</span>
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

      {/* Footer con monedas y racha */}
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