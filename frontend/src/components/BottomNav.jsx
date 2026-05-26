import { NavLink } from 'react-router-dom'
import { useCarrito } from '../context/CarritoContext'

export default function BottomNav() {
  const { cantidad } = useCarrito()

  const items = [
    { to: '/',          icon: '🍽️',  label: 'Menú'      },
    { to: '/carrito',   icon: '🛒',  label: 'Mi Pedido', badge: cantidad },
    { to: '/historial', icon: '📋',  label: 'Historial'  },
    { to: '/perfil',    icon: '⭐',  label: 'Perfil'     },
  ]

  return (
    <nav className="bottom-nav">
      {items.map(it => (
        <NavLink
          key={it.to}
          to={it.to}
          end={it.to === '/'}
          className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
        >
          <span className="icon">{it.icon}</span>
          {it.label}
          {it.badge > 0 && <span className="nav-badge">{it.badge}</span>}
        </NavLink>
      ))}
    </nav>
  )
}