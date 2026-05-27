import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useCarrito } from '../context/CarritoContext'
import { useToast }   from '../context/ToastContext'
import Stepper from '../components/Stepper'
import ConfirmModal from '../components/ConfirmModal'

export default function Carrito() {
  const { items, agregar, quitar, eliminar, actualizarNota, vaciar, total } = useCarrito()
  const [eliminarId, setEliminarId] = useState(null)   // modal confirmar eliminación
  const [vaciarModal, setVaciarModal] = useState(false) // modal confirmar vaciar
  const toast    = useToast()
  const navigate = useNavigate()

  function handleEliminar(item) {
    eliminar(item.producto.id)
    setEliminarId(null)
    toast.push('info', 'Producto eliminado', `${item.producto.nombre} quitado del pedido`)
  }

  function handleVaciar() {
    vaciar()
    setVaciarModal(false)
    toast.push('info', 'Pedido vaciado', 'Tu carrito está vacío. Puedes agregar nuevos productos.')
  }

  if (items.length === 0) return (
    <div>
      <Stepper actual={1} />
      <div className="empty-state">
        <span className="icon">🛒</span>
        <h3>Tu pedido está vacío</h3>
        <p>Explora el menú y agrega los productos que deseas. Puedes personalizar cada uno antes de confirmar.</p>
        <button className="btn btn-primary" onClick={() => navigate('/')}>
          🍽️ Ver el Menú
        </button>
      </div>
    </div>
  )

  // Item que se quiere eliminar (para el modal)
  const itemAEliminar = items.find(i => i.producto.id === eliminarId)

  return (
    <div>
      <Stepper actual={1} />

      {/* Modal confirmar eliminar producto */}
      {eliminarId && itemAEliminar && (
        <ConfirmModal
          titulo="¿Quitar producto?"
          mensaje={`¿Estás seguro de que deseas quitar "${itemAEliminar.producto.nombre}" de tu pedido?`}
          labelConfirmar="Sí, quitar"
          labelCancelar="Cancelar"
          peligroso
          onConfirmar={() => handleEliminar(itemAEliminar)}
          onCancelar={() => setEliminarId(null)}
        />
      )}

      {/* Modal confirmar vaciar */}
      {vaciarModal && (
        <ConfirmModal
          titulo="¿Vaciar pedido?"
          mensaje="Se eliminarán todos los productos de tu pedido. Esta acción no se puede deshacer."
          labelConfirmar="Sí, vaciar todo"
          labelCancelar="Cancelar"
          peligroso
          onConfirmar={handleVaciar}
          onCancelar={() => setVaciarModal(false)}
        />
      )}

      <div className="page-content" style={{ display: 'grid', gridTemplateColumns: '1fr 360px', gap: 24, alignItems: 'start' }}>

        {/* ── Lista de productos ── */}
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
            <div className="section-title" style={{ marginBottom: 0 }}>
              Productos seleccionados ({items.reduce((s,i)=>s+i.cantidad,0)})
            </div>
            <button
              className="btn btn-danger btn-sm"
              onClick={() => setVaciarModal(true)}
              title="Vaciar todo el pedido"
            >
              🗑️ Vaciar pedido
            </button>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {items.map(({ producto, cantidad, nota }) => (
              <div key={producto.id} className="card" style={{ padding: 18 }}>
                <div style={{ display: 'flex', gap: 16, alignItems: 'flex-start' }}>
                  <div style={{
                    width: 56, height: 56, borderRadius: 12, flexShrink: 0,
                    background: 'var(--verde-pale)', display: 'grid', placeItems: 'center', fontSize: 26,
                  }} aria-hidden="true">🍴</div>

                  <div style={{ flex: 1 }}>
                    <h3 style={{ fontWeight: 800, fontSize: 15 }}>{producto.nombre}</h3>
                    <p style={{ color: 'var(--gris-texto)', fontSize: 13, marginTop: 2 }}>
                      ${producto.precio} por unidad
                    </p>

                    {/* Personalización — campo con label y hint */}
                    <div className="form-group" style={{ marginTop: 10 }}>
                      <label htmlFor={`nota-${producto.id}`} className="form-label" style={{ fontSize: 12 }}>
                        📝 Personalización
                        <button
                          className="help-tooltip"
                          data-tip="Ej: sin cebolla, sin chile, término medio"
                          style={{ marginLeft: 6 }}
                          aria-label="Ayuda: ejemplos de personalización"
                          tabIndex={0}
                        >?</button>
                      </label>
                      <input
                        id={`nota-${producto.id}`}
                        placeholder="Ej: sin cebolla, sin chile..."
                        value={nota}
                        onChange={e => actualizarNota(producto.id, e.target.value)}
                        style={{ fontSize: 13, padding: '8px 12px' }}
                        aria-label={`Nota de personalización para ${producto.nombre}`}
                        maxLength={100}
                      />
                      <span className="form-hint">Opcional · máximo 100 caracteres</span>
                    </div>
                  </div>

                  {/* Controles derecha */}
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 12 }}>
                    <button
                      onClick={() => setEliminarId(producto.id)}
                      className="btn btn-danger btn-sm"
                      aria-label={`Eliminar ${producto.nombre} del pedido`}
                      title="Eliminar este producto"
                      style={{ padding: '5px 10px', fontSize: 12 }}
                    >✕ Quitar</button>

                    <div style={{ display: 'flex', alignItems: 'center', gap: 10,
                      background: 'var(--gris-bg)', borderRadius: 100, padding: '5px 10px' }}
                      role="group" aria-label={`Cantidad de ${producto.nombre}`}
                    >
                      <button
                        onClick={() => quitar(producto.id)}
                        style={{ width: 28, height: 28, border: 'none', background: 'white',
                          borderRadius: '50%', cursor: 'pointer', fontWeight: 900, fontSize: 18,
                          display: 'grid', placeItems: 'center', boxShadow: '0 1px 4px rgba(0,0,0,.1)' }}
                        aria-label="Reducir cantidad"
                      >–</button>
                      <span style={{ fontWeight: 800, minWidth: 20, textAlign: 'center' }}
                            aria-live="polite" aria-label={`Cantidad: ${cantidad}`}>
                        {cantidad}
                      </span>
                      <button
                        onClick={() => agregar(producto)}
                        style={{ width: 28, height: 28, border: 'none', background: 'var(--verde-mid)',
                          borderRadius: '50%', cursor: 'pointer', fontWeight: 900, fontSize: 18,
                          display: 'grid', placeItems: 'center', color: 'white' }}
                        aria-label="Aumentar cantidad"
                      >+</button>
                    </div>

                    <span style={{ fontWeight: 900, color: 'var(--verde-mid)', fontSize: 16 }}
                          aria-label={`Subtotal: $${producto.precio * cantidad}`}>
                      ${producto.precio * cantidad}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <button className="btn btn-ghost btn-sm" style={{ marginTop: 16 }} onClick={() => navigate('/')}>
            + Agregar más productos
          </button>
        </div>

        {/* ── Panel de resumen ── */}
        <div style={{ position: 'sticky', top: 80 }}>
          <div className="card" style={{ overflow: 'visible' }}>
            <div style={{ padding: '18px 20px', borderBottom: '1px solid var(--gris-borde)' }}>
              <div className="section-title" style={{ marginBottom: 0 }}>🧾 Resumen</div>
            </div>

            <div style={{ padding: '16px 20px', display: 'flex', flexDirection: 'column', gap: 8 }}>
              {items.map(({ producto, cantidad }) => (
                <div key={producto.id} style={{ display: 'flex', justifyContent: 'space-between', fontSize: 14 }}>
                  <span style={{ color: 'var(--gris-texto)' }}>{cantidad}× {producto.nombre}</span>
                  <span style={{ fontWeight: 700 }}>${producto.precio * cantidad}</span>
                </div>
              ))}
            </div>

            <div style={{ padding: '14px 20px', borderTop: '1px solid var(--gris-borde)', borderBottom: '1px solid var(--gris-borde)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, color: 'var(--gris-texto)', marginBottom: 6 }}>
                <span>Subtotal</span><span>${total}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, color: 'var(--gris-texto)' }}>
                <span>Servicio</span><span>Gratis</span>
              </div>
            </div>

            <div style={{ padding: '16px 20px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
                <span style={{ fontWeight: 800, fontSize: 17 }}>Total</span>
                <span style={{ fontWeight: 900, fontSize: 24, color: 'var(--verde-mid)' }}
                      aria-label={`Total del pedido: $${total}`}>${total}</span>
              </div>
              <div style={{ background: 'var(--amber-light)', borderRadius: 10, padding: '10px 14px',
                fontSize: 13, fontWeight: 700, color: '#92400E', marginBottom: 14 }}>
                🪙 Ganarás +30 CaféCoins al confirmar
              </div>
              <button className="btn btn-primary btn-full" onClick={() => navigate('/horario')}>
                Elegir Horario →
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}