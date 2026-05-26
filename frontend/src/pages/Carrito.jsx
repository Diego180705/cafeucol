import { useNavigate } from 'react-router-dom'
import { useCarrito } from '../context/CarritoContext'
import Stepper from '../components/Stepper'

export default function Carrito() {
  const { items, agregar, quitar, eliminar, actualizarNota, total } = useCarrito()
  const navigate = useNavigate()

  if (items.length === 0) return (
    <div>
      <div className="topbar"><h1>Mi Pedido</h1></div>
      <div className="empty-state">
        <span className="icon">🛒</span>
        <h3>Tu carrito está vacío</h3>
        <p>Explora el menú y agrega productos a tu pedido.</p>
        <button className="btn btn-primary" style={{ marginTop: 8 }} onClick={() => navigate('/')}>
          Ver Menú
        </button>
      </div>
    </div>
  )

  return (
    <div>
      <div className="topbar">
        <button className="topbar-back" onClick={() => navigate('/')}>←</button>
        <h1>Mi Pedido</h1>
        <div className="topbar-badge">{items.reduce((s,i)=>s+i.cantidad,0)} items</div>
      </div>
      <Stepper actual={1} />

      <div style={{ padding: '16px 18px', display: 'flex', flexDirection: 'column', gap: 12 }}>
        {items.map(({ producto, cantidad, nota }) => (
          <div key={producto.id} className="card fade-up" style={{ padding: 14 }}>
            <div style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
              {/* Emoji placeholder */}
              <div style={{
                width: 52, height: 52, borderRadius: 12, flexShrink: 0,
                background: 'var(--verde-pale)',
                display: 'grid', placeItems: 'center', fontSize: 24,
              }}>🍴</div>

              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 800, fontSize: 14 }}>{producto.nombre}</div>
                <div style={{ color: 'var(--gris-texto)', fontSize: 12, marginTop: 1 }}>
                  ${producto.precio} c/u
                </div>

                {/* Personalización */}
                <input
                  placeholder="Personalización: sin cebolla, sin chile..."
                  value={nota}
                  onChange={e => actualizarNota(producto.id, e.target.value)}
                  style={{ marginTop: 8, fontSize: 12, padding: '6px 10px' }}
                />
              </div>

              {/* Controles cantidad */}
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 8 }}>
                <button
                  onClick={() => eliminar(producto.id)}
                  style={{
                    background: 'var(--rojo-light)', border: 'none',
                    borderRadius: 8, padding: '2px 8px',
                    color: 'var(--rojo)', fontWeight: 700, fontSize: 12, cursor: 'pointer',
                  }}
                >✕</button>

                <div style={{
                  display: 'flex', alignItems: 'center', gap: 10,
                  background: 'var(--gris-bg)', borderRadius: 100, padding: '4px 8px',
                }}>
                  <button
                    onClick={() => quitar(producto.id)}
                    style={{
                      width: 26, height: 26, border: 'none',
                      background: 'white', borderRadius: '50%',
                      cursor: 'pointer', fontWeight: 900, fontSize: 16,
                      display: 'grid', placeItems: 'center',
                      boxShadow: '0 1px 4px rgba(0,0,0,.1)',
                    }}
                  >–</button>
                  <span style={{ fontWeight: 800, minWidth: 18, textAlign: 'center' }}>{cantidad}</span>
                  <button
                    onClick={() => agregar(producto)}
                    style={{
                      width: 26, height: 26, border: 'none',
                      background: 'var(--verde-mid)', borderRadius: '50%',
                      cursor: 'pointer', fontWeight: 900, fontSize: 16,
                      display: 'grid', placeItems: 'center', color: 'white',
                    }}
                  >+</button>
                </div>

                <span style={{ fontWeight: 900, color: 'var(--verde-mid)', fontSize: 15 }}>
                  ${producto.precio * cantidad}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* ── Resumen ── */}
      <div style={{ margin: '0 18px' }} className="card">
        <div style={{ padding: '14px 16px', borderBottom: '1px solid var(--gris-borde)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, color: 'var(--gris-texto)', marginBottom: 6 }}>
            <span>Subtotal</span><span>${total}</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, color: 'var(--gris-texto)' }}>
            <span>Servicio</span><span>$0</span>
          </div>
        </div>
        <div style={{
          padding: '14px 16px', display: 'flex',
          justifyContent: 'space-between', alignItems: 'center',
        }}>
          <span style={{ fontWeight: 800, fontSize: 16 }}>Total</span>
          <span style={{ fontWeight: 900, fontSize: 20, color: 'var(--verde-mid)' }}>${total}</span>
        </div>
      </div>

      <div style={{ padding: '16px 18px' }}>
        <button className="btn btn-primary" onClick={() => navigate('/horario')}>
          Elegir Horario →
        </button>
      </div>
    </div>
  )
}