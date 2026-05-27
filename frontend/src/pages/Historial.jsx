import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useToast }   from '../context/ToastContext'
import ConfirmModal   from '../components/ConfirmModal'
import axios from 'axios'

const ESTADOS = {
  recibido:       { label: 'Recibido',       clase: 'badge-recibido',    emoji: '🟡', paso: 0 },
  en_preparacion: { label: 'En preparación', clase: 'badge-preparacion', emoji: '🔵', paso: 1 },
  listo:          { label: 'Listo ✓',        clase: 'badge-listo',       emoji: '🟢', paso: 2 },
}

export default function Historial() {
  const [pedidos,       setPedidos]       = useState([])
  const [cargando,      setCargando]      = useState(true)
  const [filtro,        setFiltro]        = useState('todos')
  const [cancelarId,    setCancelarId]    = useState(null)
  const navigate = useNavigate()
  const toast    = useToast()

  function cargar() {
    axios.get('/api/pedidos')
      .then(r => { setPedidos(r.data.reverse()); setCargando(false) })
      .catch(() => {
        setCargando(false)
        toast.push('error', 'Error al cargar pedidos', 'No se pudo obtener tu historial.')
      })
  }

  useEffect(() => { cargar() }, [])

  async function confirmarCancelar() {
    try {
      await axios.delete(`/api/pedidos/${cancelarId}`)
      setCancelarId(null)
      toast.push('info', 'Pedido cancelado', 'El pedido fue cancelado exitosamente.')
      cargar()
    } catch (e) {
      setCancelarId(null)
      toast.push('error', 'No se puede cancelar', e.response?.data?.error || 'El pedido ya está en preparación.')
    }
  }

  const filtrados = pedidos.filter(p => {
    if (filtro === 'activos')    return p.estado !== 'listo'
    if (filtro === 'anteriores') return p.estado === 'listo'
    return true
  })

  const pedidoACancelar = pedidos.find(p => p.id === cancelarId)

  return (
    <div className="page-content">
      {cancelarId && pedidoACancelar && (
        <ConfirmModal
          titulo="¿Cancelar este pedido?"
          mensaje={`¿Estás seguro de que deseas cancelar el Pedido #${cancelarId}? Esta acción no se puede deshacer.`}
          labelConfirmar="Sí, cancelar pedido"
          labelCancelar="No, conservar"
          peligroso
          onConfirmar={confirmarCancelar}
          onCancelar={() => setCancelarId(null)}
        />
      )}

      {/* Filtros */}
      <div style={{ display: 'flex', gap: 8, marginBottom: 24, flexWrap: 'wrap', alignItems: 'center' }}>
        <div className="section-title" style={{ marginBottom: 0, marginRight: 12 }}>Filtrar:</div>
        {[['todos','Todos los pedidos'],['activos','Solo activos'],['anteriores','Completados']].map(([k,l]) => (
          <button
            key={k}
            className={`chip ${filtro === k ? 'active' : ''}`}
            onClick={() => setFiltro(k)}
            aria-pressed={filtro === k}
          >{l}</button>
        ))}
        <button className="btn btn-ghost btn-sm" style={{ marginLeft: 'auto' }} onClick={cargar} title="Actualizar lista de pedidos">
          🔄 Actualizar
        </button>
      </div>

      {cargando ? (
        <div style={{ textAlign: 'center', padding: 60, color: 'var(--gris-texto)' }}>⏳ Cargando pedidos...</div>
      ) : filtrados.length === 0 ? (
        <div className="empty-state">
          <span className="icon">📋</span>
          <h3>Sin pedidos en esta sección</h3>
          <p>Cuando realices un pedido aparecerá aquí. Puedes ver el estado en tiempo real.</p>
          <button className="btn btn-primary" onClick={() => navigate('/')}>Hacer un pedido</button>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(380px, 1fr))', gap: 16 }}>
          {filtrados.map(pedido => {
            const est   = ESTADOS[pedido.estado] || ESTADOS.recibido
            const fecha = new Date(pedido.creadoEn).toLocaleString('es-MX', {
              day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit'
            })
            return (
              <article key={pedido.id} className="card fade-up" style={{ padding: 18 }}>
                {/* Encabezado: título claro y distintivo de la pantalla */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 14 }}>
                  <div>
                    <h3 style={{ fontFamily: 'var(--fuente-titulo)', fontWeight: 800, fontSize: 17 }}>
                      Pedido #{pedido.id}
                    </h3>
                    <div style={{ fontSize: 12, color: 'var(--gris-texto)', marginTop: 2 }}>{fecha}</div>
                  </div>
                  <span className={`badge ${est.clase}`} aria-label={`Estado: ${est.label}`}>
                    {est.emoji} {est.label}
                  </span>
                </div>

                {/* Barra de progreso con etiquetas */}
                <div style={{ marginBottom: 14 }}>
                  <div style={{ display: 'flex', gap: 4, marginBottom: 4 }}>
                    {['recibido','en_preparacion','listo'].map((e, i) => (
                      <div key={e} style={{
                        flex: 1, height: 5, borderRadius: 100,
                        background: i <= est.paso ? 'var(--verde-soft)' : 'var(--gris-borde)',
                        transition: 'background .3s',
                      }} />
                    ))}
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, color: 'var(--gris-texto)', fontWeight: 700 }}>
                    <span>Recibido</span><span>Preparando</span><span>Listo</span>
                  </div>
                </div>

                {/* Productos — campo tipográficamente distinto */}
                <div style={{ fontSize: 13, color: 'var(--gris-texto)', marginBottom: 14, lineHeight: 1.7 }}>
                  {pedido.productos.map(p => `${p.cantidad}× ${p.nombre}`).join(' · ')}
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 8 }}>
                  <div style={{ fontSize: 13 }}>
                    <span style={{ color: 'var(--gris-texto)' }}>Recolección: </span>
                    <span style={{ fontWeight: 800 }}>{pedido.horario}</span>
                  </div>
                  <span style={{ fontWeight: 900, fontSize: 18, color: 'var(--verde-mid)' }}>
                    ${pedido.total}
                  </span>
                </div>

                {/* Solo mostrar cancelar si el estado lo permite */}
                {pedido.estado === 'recibido' && (
                  <button
                    className="btn btn-danger btn-sm btn-full"
                    style={{ marginTop: 12 }}
                    onClick={() => setCancelarId(pedido.id)}
                    aria-label={`Cancelar pedido #${pedido.id}`}
                  >
                    Cancelar este pedido
                  </button>
                )}
              </article>
            )
          })}
        </div>
      )}
    </div>
  )
}