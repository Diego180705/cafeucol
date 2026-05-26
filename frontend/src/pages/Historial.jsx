import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'

const ESTADOS = {
  recibido:       { label: 'Recibido',        clase: 'badge-recibido',    emoji: '🟡' },
  en_preparacion: { label: 'En preparación',  clase: 'badge-preparacion', emoji: '🔵' },
  listo:          { label: 'Listo ✓',         clase: 'badge-listo',       emoji: '🟢' },
}

export default function Historial() {
  const [pedidos,  setPedidos]  = useState([])
  const [cargando, setCargando] = useState(true)
  const [filtro,   setFiltro]   = useState('todos')  // todos | activos | anteriores
  const navigate = useNavigate()

  function cargar() {
    axios.get('/api/pedidos')
      .then(r => { setPedidos(r.data.reverse()); setCargando(false) })
      .catch(() => setCargando(false))
  }

  useEffect(() => { cargar() }, [])

  async function cancelar(id) {
    if (!confirm('¿Cancelar este pedido?')) return
    try {
      await axios.delete(`/api/pedidos/${id}`)
      cargar()
    } catch (e) {
      alert(e.response?.data?.error || 'No se puede cancelar')
    }
  }

  const filtrados = pedidos.filter(p => {
    if (filtro === 'activos')    return p.estado !== 'listo'
    if (filtro === 'anteriores') return p.estado === 'listo'
    return true
  })

  return (
    <div>
      <div className="topbar"><h1>Mis Pedidos</h1></div>

      {/* Filtros */}
      <div style={{ background: 'white', borderBottom: '1px solid var(--gris-borde)' }}>
        <div className="scroll-x" style={{ padding: '12px 18px' }}>
          {[['todos','Todos'],['activos','Activos'],['anteriores','Completados']].map(([k,l]) => (
            <button
              key={k}
              className={`chip ${filtro === k ? 'active' : ''}`}
              onClick={() => setFiltro(k)}
            >{l}</button>
          ))}
        </div>
      </div>

      <div style={{ padding: '16px 18px', display: 'flex', flexDirection: 'column', gap: 12 }}>
        {cargando ? (
          <div style={{ textAlign: 'center', padding: 40, color: 'var(--gris-texto)' }}>Cargando...</div>
        ) : filtrados.length === 0 ? (
          <div className="empty-state">
            <span className="icon">📋</span>
            <h3>Sin pedidos aquí</h3>
            <p>Cuando hagas un pedido aparecerá en esta sección.</p>
            <button className="btn btn-primary" style={{ marginTop: 8 }} onClick={() => navigate('/')}>
              Hacer un pedido
            </button>
          </div>
        ) : (
          filtrados.map(pedido => {
            const est = ESTADOS[pedido.estado] || ESTADOS.recibido
            const fecha = new Date(pedido.creadoEn).toLocaleString('es-MX', {
              day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit'
            })
            return (
              <div key={pedido.id} className="card fade-up" style={{ padding: 16 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 10 }}>
                  <div>
                    <div style={{ fontFamily: 'var(--fuente-titulo)', fontWeight: 800, fontSize: 16 }}>
                      Pedido #{pedido.id}
                    </div>
                    <div style={{ fontSize: 12, color: 'var(--gris-texto)', marginTop: 2 }}>{fecha}</div>
                  </div>
                  <span className={`badge ${est.clase}`}>{est.emoji} {est.label}</span>
                </div>

                {/* Barra de progreso */}
                <div style={{ marginBottom: 12 }}>
                  <div style={{ display: 'flex', gap: 4 }}>
                    {['recibido','en_preparacion','listo'].map((e, i) => {
                      const pasos = ['recibido','en_preparacion','listo']
                      const actual = pasos.indexOf(pedido.estado)
                      const lleno  = i <= actual
                      return (
                        <div key={e} style={{
                          flex: 1, height: 4, borderRadius: 100,
                          background: lleno ? 'var(--verde-soft)' : 'var(--gris-borde)',
                          transition: 'background .3s',
                        }} />
                      )
                    })}
                  </div>
                  <div style={{ fontSize: 11, color: 'var(--gris-texto)', marginTop: 4, display: 'flex', justifyContent: 'space-between' }}>
                    <span>Recibido</span><span>Preparando</span><span>Listo</span>
                  </div>
                </div>

                {/* Productos */}
                <div style={{ fontSize: 13, color: 'var(--gris-texto)', marginBottom: 12, lineHeight: 1.6 }}>
                  {pedido.productos.map(p => `${p.cantidad}× ${p.nombre}`).join(' · ')}
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <span style={{ fontSize: 12, color: 'var(--gris-texto)' }}>Recolección: </span>
                    <span style={{ fontWeight: 800, fontSize: 13 }}>{pedido.horario}</span>
                  </div>
                  <span style={{ fontWeight: 900, fontSize: 16, color: 'var(--verde-mid)' }}>${pedido.total}</span>
                </div>

                {pedido.estado === 'recibido' && (
                  <button
                    className="btn btn-danger"
                    style={{ marginTop: 10, padding: '8px', fontSize: 13 }}
                    onClick={() => cancelar(pedido.id)}
                  >
                    Cancelar pedido
                  </button>
                )}
              </div>
            )
          })
        )}
      </div>
    </div>
  )
}