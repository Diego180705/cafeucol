import { createContext, useContext, useState, useCallback } from 'react'

const ToastCtx = createContext()

// Tipos: success | error | warn | info
let _id = 0

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([])

  const push = useCallback((tipo, titulo, mensaje, duracion = 3500) => {
    const id = ++_id
    setToasts(prev => [...prev, { id, tipo, titulo, mensaje }])
    setTimeout(() => setToasts(prev => prev.filter(t => t.id !== id)), duracion)
    return id
  }, [])

  const remove = useCallback((id) => setToasts(prev => prev.filter(t => t.id !== id)), [])

  const ICONOS = { success:'✅', error:'❌', warn:'⚠️', info:'ℹ️' }

  return (
    <ToastCtx.Provider value={{ push, remove }}>
      {children}
      <div className="toast-container" role="status" aria-live="polite">
        {toasts.map(t => (
          <div key={t.id} className={`toast ${t.tipo === 'error' ? 'error' : t.tipo === 'warn' ? 'warn' : t.tipo === 'info' ? 'info' : ''}`}>
            <span className="toast-icon">{ICONOS[t.tipo]}</span>
            <div className="toast-body">
              <div className="toast-title">{t.titulo}</div>
              {t.mensaje && <div className="toast-msg">{t.mensaje}</div>}
            </div>
            <button className="toast-close" onClick={() => remove(t.id)} aria-label="Cerrar notificación">✕</button>
          </div>
        ))}
      </div>
    </ToastCtx.Provider>
  )
}

export const useToast = () => useContext(ToastCtx)