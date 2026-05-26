import { usePuntos } from '../context/PuntosContext'

export default function LogroToast() {
  const { ultimoLogro } = usePuntos()
  if (!ultimoLogro) return null

  return (
    <div style={{
      position: 'fixed', top: 16, left: '50%', transform: 'translateX(-50%)',
      background: 'white', borderRadius: 16, padding: '12px 20px',
      boxShadow: '0 8px 32px rgba(0,0,0,.18)',
      display: 'flex', alignItems: 'center', gap: 12,
      zIndex: 999, animation: 'fadeUp .35s ease',
      border: '2px solid #C8E6C9', maxWidth: 340, width: '90%',
    }}>
      <span style={{ fontSize: 32 }}>{ultimoLogro.emoji}</span>
      <div>
        <div style={{ fontWeight: 800, fontSize: 14, color: '#1B5E20' }}>
          ¡Logro desbloqueado!
        </div>
        <div style={{ fontWeight: 700, fontSize: 13 }}>{ultimoLogro.nombre}</div>
        <div style={{ fontSize: 12, color: '#6B7280' }}>+{ultimoLogro.puntos} CaféCoins</div>
      </div>
    </div>
  )
}