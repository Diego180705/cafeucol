import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { useCarrito } from '../context/CarritoContext'
import { useToast }   from '../context/ToastContext'
import Stepper from '../components/Stepper'
import axios from 'axios'

export default function Horario() {
  const [horarios,  setHorarios]  = useState([])
  const [seleccion, setSeleccion] = useState(null)
  const [error,     setError]     = useState('')
  const [cargando,  setCargando]  = useState(true)
  const errorRef = useRef(null)    // para posicionar cursor/focus en error

  const { setHorario, horario } = useCarrito()
  const toast    = useToast()
  const navigate = useNavigate()

  useEffect(() => {
    axios.get('/api/horarios')
      .then(r => { setHorarios(r.data); setCargando(false) })
      .catch(() => {
        setCargando(false)
        toast.push('error', 'Error al cargar horarios', 'Verifica tu conexión e intenta de nuevo.')
      })
    if (horario) setSeleccion(horario)
  }, [])

  // Cuando aparece un error, hacer focus al mensaje (criterio: posicionar cursor en error)
  useEffect(() => {
    if (error && errorRef.current) errorRef.current.focus()
  }, [error])

  function handleSeleccion(h) {
    if (!h.disponible) {
      setError('Este horario no está disponible. Por favor selecciona otro.')
      return
    }
    if (h.saturado) {
      // Mensaje amable, sin palabras hostiles, con ayuda constructiva
      setError(`El horario ${h.hora} está lleno en este momento. Te sugerimos elegir un horario cercano marcado como "Disponible".`)
      setSeleccion(null)
      return
    }
    setSeleccion(h.hora)
    setError('')
    toast.push('success', 'Horario seleccionado', `Recogerás tu pedido a las ${h.hora}`)
  }

  function handleContinuar() {
    if (!seleccion) {
      setError('Por favor selecciona un horario antes de continuar.')
      return
    }
    setHorario(seleccion)
    navigate('/confirmar')
  }

  return (
    <div>
      <Stepper actual={2} />
      <div className="page-content" style={{ maxWidth: 720 }}>

        {/* Descripción clara de la tarea */}
        <div style={{ marginBottom: 24 }}>
          <p style={{ color: 'var(--gris-texto)', fontSize: 14, lineHeight: 1.7 }}>
            Elige a qué hora pasarás a recoger tu pedido a la cafetería.
            Los horarios <strong style={{ color: 'var(--rojo)' }}>rojos</strong> están llenos;
            los <strong style={{ color: 'var(--verde-mid)' }}>verdes</strong> están disponibles.
          </p>
        </div>

        {/* ── Leyenda (valores esperados según códigos de usuario) ── */}
        <div style={{ display: 'flex', gap: 20, marginBottom: 20, flexWrap: 'wrap' }}>
          {[
            { color: 'var(--verde-pale)', borde: 'var(--verde-soft)', texto: 'Disponible', desc: 'Puedes elegir este horario' },
            { color: 'var(--rojo-light)', borde: '#FCA5A5',           texto: 'Saturado',   desc: 'Sin cupo disponible' },
            { color: 'var(--gris-bg)',    borde: 'var(--gris-borde)', texto: 'No disponible', desc: 'Fuera de servicio' },
          ].map(l => (
            <div key={l.texto} style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13 }}>
              <div style={{ width: 14, height: 14, borderRadius: 4, background: l.color, border: `2px solid ${l.borde}` }} />
              <span style={{ fontWeight: 700 }}>{l.texto}</span>
              <span style={{ color: 'var(--gris-texto)' }}>— {l.desc}</span>
            </div>
          ))}
        </div>

        {/* ── Error (NNG: cerca del campo, rojo, amable, constructivo) ── */}
        {error && (
          <div
            ref={errorRef}
            tabIndex={-1}
            className="error-msg"
            role="alert"
            aria-live="assertive"
            style={{ fontSize: 14, marginBottom: 16, padding: '10px 14px',
              background: 'var(--rojo-light)', borderRadius: 10,
              border: '1px solid #FCA5A5' }}
          >
            ⚠️ {error}
          </div>
        )}

        {cargando ? (
          <div style={{ textAlign: 'center', padding: 60, color: 'var(--gris-texto)' }}>⏳ Cargando horarios...</div>
        ) : (
          <div
            style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(130px, 1fr))', gap: 12 }}
            role="group"
            aria-label="Selecciona un horario"
          >
            {horarios.map(h => {
              const isSelected = seleccion === h.hora
              const isSaturado = h.saturado
              const isNoDisp   = !h.disponible

              let bg    = 'white'
              let borde = '2px solid var(--gris-borde)'
              let color = 'var(--negro)'

              if (isSelected) { bg = 'var(--verde-pale)'; borde = '2px solid var(--verde-soft)'; color = 'var(--verde)' }
              if (isSaturado) { bg = 'var(--rojo-light)'; borde = '2px solid #FCA5A5'; color = 'var(--rojo)' }

              return (
                <button
                  key={h.hora}
                  disabled={isNoDisp}
                  onClick={() => handleSeleccion(h)}
                  aria-pressed={isSelected}
                  aria-disabled={isNoDisp}
                  aria-describedby={isSaturado ? `sat-${h.hora}` : undefined}
                  title={isSaturado ? `${h.hora} — Sin cupo` : isNoDisp ? `${h.hora} — No disponible` : `Seleccionar ${h.hora}`}
                  style={{
                    background: bg, border: borde, borderRadius: 14,
                    padding: '18px 12px', cursor: isNoDisp ? 'not-allowed' : 'pointer',
                    opacity: isNoDisp ? 0.4 : 1,
                    textAlign: 'center', transition: 'all .18s',
                    fontFamily: 'var(--fuente)',
                  }}
                >
                  <div style={{ fontFamily: 'var(--fuente-titulo)', fontSize: 22, fontWeight: 800, color }}>
                    {h.hora}
                  </div>
                  <div id={isSaturado ? `sat-${h.hora}` : undefined}
                    style={{ fontSize: 11, fontWeight: 700, marginTop: 5,
                      color: isSaturado ? 'var(--rojo)' : isSelected ? 'var(--verde-soft)' : 'var(--gris-texto)' }}>
                    {isSaturado ? '🔴 Saturado' : isNoDisp ? '⛔ No disponible' : isSelected ? '✓ Seleccionado' : '🟢 Disponible'}
                  </div>
                </button>
              )
            })}
          </div>
        )}

        {/* Confirmación del horario elegido */}
        {seleccion && !error && (
          <div style={{
            marginTop: 20, background: 'var(--verde-pale)',
            border: '2px solid var(--verde-light)', borderRadius: 14,
            padding: '14px 18px', display: 'flex', alignItems: 'center', gap: 12,
          }} role="status" aria-live="polite">
            <span style={{ fontSize: 26 }}>⏰</span>
            <div>
              <div style={{ fontWeight: 800, fontSize: 15, color: 'var(--verde)' }}>
                Recogerás a las {seleccion}
              </div>
              <div style={{ fontSize: 13, color: 'var(--gris-texto)', marginTop: 2 }}>
                +20 CaféCoins por pedir con anticipación 🪙
              </div>
            </div>
          </div>
        )}

        <div style={{ display: 'flex', gap: 12, marginTop: 24 }}>
          <button className="btn btn-ghost" onClick={() => navigate('/carrito')}>← Volver al carrito</button>
          <button className="btn btn-primary" disabled={!seleccion} onClick={handleContinuar}>
            Revisar Pedido →
          </button>
        </div>
      </div>
    </div>
  )
}