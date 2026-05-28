import { NavLink } from 'react-router-dom'
import { useCarrito } from '../context/CarritoContext'

const NAV = [
  { to: '/',          icon: '🍽️', label: 'Menú'      },
  { to: '/carrito',   icon: '🛒', label: 'Pedido',    badge: true },
  { to: '/historial', icon: '📋', label: 'Historial'  },
  { to: '/perfil',    icon: '⭐', label: 'Perfil'     },
]

export default function BottomNavMobile() {
  const { cantidad } = useCarrito()

  return (
    <nav className="bottom-nav-mobile" role="navigation" aria-label="Navegación principal">
      {NAV.map(item => (
        <NavLink
          key={item.to}
          to={item.to}
          end={item.to === '/'}
          className={({ isActive }) => isActive ? 'active' : ''}
          aria-label={item.label}
        >
          <span className="nav-icon" aria-hidden="true">{item.icon}</span>
          {item.label}
          {item.badge && cantidad > 0 && (
            <span className="bnav-badge" aria-label={`${cantidad} productos`}>{cantidad}</span>
          )}
        </NavLink>
      ))}
    </nav>
  )
}