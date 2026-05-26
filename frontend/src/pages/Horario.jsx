import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useCarrito } from '../context/CarritoContext'
import Stepper from '../components/Stepper'
import axios from 'axios'

export default function Horario() {
  const [horarios,  setHorarios]  = useState([])
  const [seleccion, setSeleccion] = useState(null)
  const [error,     setError]     = useState('')
  const [cargando,  setCargando]  = useState(true)

  const { setHorario, horario } = useCarrito()
  const navigate = useNavigate()

  useEffect(() => {
    axios.get('/api/horarios')
      .then(r => { setHorarios(r.data); setCargando(false) })
      .catch(() => setCargando(false))
    if (horario) setSeleccion(horario)
  }, [])

  function handleSeleccion(h) {
    if (!h.disponible) {
      setError('Este horario no está disponible.')
      return
    }
    if (h.saturado) {
      setError(`El horario ${h.hora} está lleno. Elige otro horario cercano.`)
      setSeleccion(null)
      return
    }
    setSeleccion(h.hora)
    setError('')
  }

  function handleContinuar() {
    if (!seleccion) { setError('Por favor selecciona un horario.'); return }
    setHorario(seleccion)
    navigate('/confirmar')
  }

  return (
    <div>
      <div className="topbar">
        <button className="topbar-back" onClick={() => navigate('/carrito')}>←</button>
        <h1>Horario de Recolección</h1>
      </div>
      <Stepper actual={2} />

      <div style={{ padding: '20px 18px 0' }}>
        <p style={{ color: 'var(--gris-texto)', fontSize: 14, lineHeight: 1.6, marginBottom: 20 }}>
          Elige la hora en que recogerás tu pedido en la cafetería. Los horarios
          marcados en <strong style={{ color: 'var(--rojo)' }}>rojo</strong> están saturados.
        </p>

        {cargando ? (
          <div style={{ textAlign: 'center', padding: 40, color: 'var(--gris-texto)' }}>
            Cargando horarios...
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
            {horarios.map(h => {
              const isSelected  = seleccion === h.hora
              const isSaturado  = h.saturado
              const isNoDisp    = !h.disponible

              let bg     = 'white'
              let border = '2px solid var(--gris-borde)'
              let color  = 'var(--negro)'
              let opacity = 1

              if (isSelected)  { bg = 'var(--verde-pale)'; border = '2px solid var(--verde-soft)'; color = 'var(--verde)' }
              if (isSaturado)  { bg = 'var(--rojo-light)'; border = '2px solid #FCA5A5'; color = 'var(--rojo)' }
              if (isNoDisp)    { opacity = 0.4 }

              return (
                <button
                  key={h.hora}
                  disabled={isNoDisp}
                  onClick={() => handleSeleccion(h)}
                  style={{
                    background: bg, border, borderRadius: 14,
                    padding: '16px 12px', cursor: isNoDisp ? 'not-allowed' : 'pointer',
                    opacity, textAlign: 'center', transition: 'all .2s',
                    fontFamily: 'var(--fuente)',
                  }}
                >
                  <div style={{ fontFamily: 'var(--fuente-titulo)', fontSize: 20, fontWeight: 800, color }}>
                    {h.hora}
                  </div>
                  <div style={{ fontSize: 11, fontWeight: 700, marginTop: 4, color: isSaturado ? 'var(--rojo)' : isSelected ? 'var(--verde-soft)' : 'var(--gris-texto)' }}>
                    {isSaturado ? '🔴 Saturado' : isNoDisp ? '⛔ No disponible' : isSelected ? '✓ Seleccionado' : 'Disponible'}
                  </div>
                </button>
              )
            })}
          </div>
        )}

        {/* ── Error NNG: cerca del campo, rojo, constructivo ── */}
        {error && (
          <div className="error-msg" style={{ marginTop: 14, fontSize: 13 }}>
            ⚠️ {error}
          </div>
        )}

        {/* ── Horario seleccionado ── */}
        {seleccion && !error && (
          <div style={{
            marginTop: 16, background: 'var(--verde-pale)',
            border: '2px solid var(--verde-light)', borderRadius: 14,
            padding: '12px 16px', display: 'flex', alignItems: 'center', gap: 10,
          }}>
            <span style={{ fontSize: 22 }}>⏰</span>
            <div>
              <div style={{ fontWeight: 800, fontSize: 14, color: 'var(--verde)' }}>
                Recogerás a las {seleccion}
              </div>
              <div style={{ fontSize: 12, color: 'var(--gris-texto)', marginTop: 2 }}>
                Llegarás a tiempo y ganarás +20 CaféCoins 🪙
              </div>
            </div>
          </div>
        )}
      </div>

      <div style={{ padding: '20px 18px' }}>
        <button
          className="btn btn-primary"
          disabled={!seleccion}
          onClick={handleContinuar}
        >
          Revisar Pedido →
        </button>
      </div>
    </div>
  )
}