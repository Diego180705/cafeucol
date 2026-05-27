import { usePuntos } from '../context/PuntosContext'

export default function LogroToast() {
  const { ultimoLogro } = usePuntos()
  if (!ultimoLogro) return null

  return (
    <div
      role="alert"
      aria-live="assertive"
      style={{
        position: 'fixed', top: 80, right: 24,
        background: 'white', borderRadius: 16, padding: '16px 20px',
        boxShadow: '0 8px 32px rgba(0,0,0,.18)',
        display: 'flex', alignItems: 'center', gap: 14,
        zIndex: 9998, animation: 'slideIn .35s ease',
        border: '2px solid var(--verde-light)',
        minWidth: 300,
      }}
    >
      <span style={{ fontSize: 36 }}>{ultimoLogro.emoji}</span>
      <div>
        <div style={{ fontWeight: 800, fontSize: 13, color: 'var(--gris-texto)', textTransform: 'uppercase', letterSpacing: '.05em' }}>
          ¡Logro desbloqueado!
        </div>
        <div style={{ fontWeight: 800, fontSize: 16, marginTop: 2 }}>{ultimoLogro.nombre}</div>
        <div style={{ fontSize: 13, color: 'var(--gris-texto)', marginTop: 2 }}>+{ultimoLogro.puntos} CaféCoins 🪙</div>
      </div>
    </div>
  )
}