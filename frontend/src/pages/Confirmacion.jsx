import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useCarrito } from '../context/CarritoContext'
import { usePuntos }  from '../context/PuntosContext'
import Stepper from '../components/Stepper'
import axios from 'axios'

export default function Confirmacion() {
  const { items, total, horario, vaciar } = useCarrito()
  const { registrarPedido, monedas }      = usePuntos()
  const [enviando, setEnviando]           = useState(false)
  const [exito,    setExito]              = useState(false)
  const [pedidoId, setPedidoId]           = useState(null)
  const navigate = useNavigate()

  async function confirmar() {
    if (!horario || items.length === 0) return
    setEnviando(true)
    try {
      const productos = items.map(i => ({
        id:       i.producto.id,
        nombre:   i.producto.nombre,
        precio:   i.producto.precio,
        cantidad: i.cantidad,
        nota:     i.nota,
      }))
      const { data } = await axios.post('/api/pedidos', { productos, horario })
      setPedidoId(data.id)

      // Registrar puntos y logros
      const categorias = [...new Set(items.map(i => i.producto.categoria || 'general'))]
      registrarPedido({ horario, categorias })

      setExito(true)
      vaciar()
    } catch (e) {
      console.error(e)
    } finally {
      setEnviando(false)
    }
  }

  // ── Pantalla de éxito ──────────────────────────────────────
  if (exito) return (
    <div style={{ minHeight: '100dvh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '32px 24px', textAlign: 'center' }}>
      <div style={{ fontSize: 72, animation: 'pop .4s ease' }}>✅</div>
      <h2 style={{ fontFamily: 'var(--fuente-titulo)', fontSize: 24, marginTop: 16 }}>
        ¡Pedido enviado!
      </h2>
      <p style={{ color: 'var(--gris-texto)', marginTop: 8, lineHeight: 1.6 }}>
        Tu pedido #{pedidoId} está en preparación.<br />
        Recógelo a las <strong>{horario}</strong>.
      </p>
      <div style={{
        background: 'var(--amber-light)', borderRadius: 16,
        padding: '14px 24px', marginTop: 24,
        display: 'flex', alignItems: 'center', gap: 10,
      }}>
        <span style={{ fontSize: 28 }}>🪙</span>
        <div style={{ textAlign: 'left' }}>
          <div style={{ fontWeight: 800, fontSize: 14 }}>+30 CaféCoins ganados</div>
          <div style={{ fontSize: 12, color: '#92400E' }}>Total: {monedas} monedas</div>
        </div>
      </div>
      <button
        className="btn btn-primary"
        style={{ marginTop: 28, maxWidth: 300 }}
        onClick={() => navigate('/historial')}
      >
        Ver mis pedidos
      </button>
      <button
        className="btn btn-secondary"
        style={{ marginTop: 10, maxWidth: 300 }}
        onClick={() => navigate('/')}
      >
        Volver al Menú
      </button>
    </div>
  )

  return (
    <div>
      <div className="topbar">
        <button className="topbar-back" onClick={() => navigate('/horario')}>←</button>
        <h1>Confirmar Pedido</h1>
      </div>
      <Stepper actual={3} />

      <div style={{ padding: '16px 18px', display: 'flex', flexDirection: 'column', gap: 14 }}>

        {/* ── Productos ── */}
        <div className="card" style={{ overflow: 'visible' }}>
          <div style={{ padding: '14px 16px', borderBottom: '1px solid var(--gris-borde)', fontWeight: 800 }}>
            🧾 Resumen del pedido
          </div>
          {items.map(({ producto, cantidad, nota }) => (
            <div key={producto.id} style={{
              padding: '12px 16px', borderBottom: '1px solid var(--gris-borde)',
              display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 12,
            }}>
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 700, fontSize: 14 }}>
                  {cantidad}× {producto.nombre}
                </div>
                {nota && (
                  <div style={{ fontSize: 12, color: 'var(--gris-texto)', marginTop: 2 }}>
                    📝 {nota}
                  </div>
                )}
              </div>
              <div style={{ fontWeight: 800, color: 'var(--verde-mid)', fontSize: 14, flexShrink: 0 }}>
                ${producto.precio * cantidad}
              </div>
            </div>
          ))}
          <div style={{
            padding: '14px 16px',
            display: 'flex', justifyContent: 'space-between', alignItems: 'center',
          }}>
            <span style={{ fontWeight: 800, fontSize: 16 }}>Total</span>
            <span style={{ fontWeight: 900, fontSize: 22, color: 'var(--verde-mid)' }}>${total}</span>
          </div>
        </div>

        {/* ── Horario ── */}
        <div className="card" style={{ padding: '14px 16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <span style={{ fontSize: 28 }}>⏰</span>
            <div>
              <div style={{ fontWeight: 800, fontSize: 14 }}>Hora de recolección</div>
              <div style={{ fontFamily: 'var(--fuente-titulo)', fontSize: 22, color: 'var(--verde-mid)', fontWeight: 800 }}>
                {horario}
              </div>
            </div>
            <button
              onClick={() => navigate('/horario')}
              style={{
                marginLeft: 'auto', background: 'var(--gris-bg)', border: 'none',
                borderRadius: 8, padding: '6px 12px',
                fontSize: 12, fontWeight: 700, cursor: 'pointer', color: 'var(--verde-mid)',
              }}
            >
              Cambiar
            </button>
          </div>
        </div>

        {/* ── Puntos que ganará ── */}
        <div style={{
          background: 'var(--amber-light)',
          border: '2px solid #FDE68A', borderRadius: 14,
          padding: '12px 16px', display: 'flex', alignItems: 'center', gap: 10,
        }}>
          <span style={{ fontSize: 22 }}>🪙</span>
          <div style={{ fontSize: 13, fontWeight: 700, color: '#92400E' }}>
            Ganarás +30 CaféCoins al confirmar este pedido
          </div>
        </div>

        {/* ── Botón ── */}
        <button
          className="btn btn-primary"
          onClick={confirmar}
          disabled={enviando}
          style={{ marginTop: 4 }}
        >
          {enviando ? 'Enviando...' : '¡Confirmar Pedido! ✓'}
        </button>
        <button className="btn btn-secondary" onClick={() => navigate('/carrito')}>
          Modificar pedido
        </button>
      </div>
    </div>
  )
}