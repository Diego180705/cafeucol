import { createContext, useContext, useState, useEffect } from 'react'

const PuntosCtx = createContext()

const LOGROS_DEF = [
  { id: 'primer_pedido',   emoji: '🎉', nombre: 'Primer Pedido',    desc: 'Completa tu primer pedido',               puntos: 50  },
  { id: 'madrugador',      emoji: '🌅', nombre: 'Madrugador',       desc: 'Pide antes de las 8:00 AM',               puntos: 30  },
  { id: 'anticipado',      emoji: '⏰', nombre: 'Muy Puntual',      desc: 'Pide con +30 min de anticipación',        puntos: 20  },
  { id: 'explorador',      emoji: '🗺️', nombre: 'Explorador',       desc: 'Prueba productos de 5 categorías',        puntos: 40  },
  { id: 'frecuente',       emoji: '⭐', nombre: 'Cliente Frecuente', desc: 'Completa 5 pedidos',                     puntos: 100 },
  { id: 'racha_5',         emoji: '🔥', nombre: 'En Racha',         desc: '5 días consecutivos usando la app',       puntos: 50  },
]

export function PuntosProvider({ children }) {
  const [monedas, setMonedas]     = useState(() => Number(localStorage.getItem('monedas') || 0))
  const [racha, setRacha]         = useState(() => Number(localStorage.getItem('racha')   || 0))
  const [totalPedidos, setTotal]  = useState(() => Number(localStorage.getItem('totalPed')|| 0))
  const [categUsadas, setCateg]   = useState(() => JSON.parse(localStorage.getItem('categUsadas') || '[]'))
  const [logros, setLogros]       = useState(() => JSON.parse(localStorage.getItem('logros') || '[]'))
  const [ultimoLogro, setUltimo]  = useState(null)

  useEffect(() => { localStorage.setItem('monedas',     monedas)             }, [monedas])
  useEffect(() => { localStorage.setItem('racha',       racha)               }, [racha])
  useEffect(() => { localStorage.setItem('totalPed',    totalPedidos)        }, [totalPedidos])
  useEffect(() => { localStorage.setItem('categUsadas', JSON.stringify(categUsadas)) }, [categUsadas])
  useEffect(() => { localStorage.setItem('logros',      JSON.stringify(logros))      }, [logros])

  function desbloquear(id) {
    if (logros.includes(id)) return
    const def = LOGROS_DEF.find(l => l.id === id)
    if (!def) return
    setLogros(prev => [...prev, id])
    setMonedas(prev => prev + def.puntos)
    setUltimo(def)
    setTimeout(() => setUltimo(null), 3500)
  }

  function registrarPedido({ horario, categorias = [] }) {
    const nuevo = totalPedidos + 1
    setTotal(nuevo)
    setMonedas(prev => prev + 10)

    // Racha
    const hoy = new Date().toDateString()
    const ultima = localStorage.getItem('ultimoPedidoDia')
    if (ultima !== hoy) {
      const ayer = new Date(Date.now() - 86400000).toDateString()
      setRacha(prev => ultima === ayer ? prev + 1 : 1)
      localStorage.setItem('ultimoPedidoDia', hoy)
    }

    // Bonus anticipado (hora < 30 min desde ahora — simplificado para prototipo)
    setMonedas(prev => prev + 20)

    // Logros
    if (nuevo === 1) desbloquear('primer_pedido')
    if (nuevo >= 5)  desbloquear('frecuente')

    const hora = horario?.split(':')[0]
    if (hora && parseInt(hora) < 8) desbloquear('madrugador')

    // Categorías exploradas
    const nuevas = [...new Set([...categUsadas, ...categorias])]
    setCateg(nuevas)
    if (nuevas.length >= 5) desbloquear('explorador')
  }

  // Racha 5 días
  useEffect(() => { if (racha >= 5) desbloquear('racha_5') }, [racha])

  return (
    <PuntosCtx.Provider value={{
      monedas, racha, totalPedidos, logros,
      LOGROS_DEF, registrarPedido, ultimoLogro
    }}>
      {children}
    </PuntosCtx.Provider>
  )
}

export const usePuntos = () => useContext(PuntosCtx)