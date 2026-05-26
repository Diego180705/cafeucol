import { useState, useEffect } from 'react'
import { useCarrito } from '../context/CarritoContext'
import { usePuntos }  from '../context/PuntosContext'
import LogroToast from '../components/LogroToast'
import axios from 'axios'

const CATEGORIAS = [
  { key: 'desayunos',      emoji: '🌅', label: 'Desayunos'       },
  { key: 'comida_rapida',  emoji: '🍔', label: 'Comida Rápida'   },
  { key: 'antojitos',      emoji: '🌮', label: 'Antojitos'       },
  { key: 'plato_del_dia',  emoji: '🍽️', label: 'Plato del Día'  },
  { key: 'sandwiches',     emoji: '🥪', label: 'Sandwiches'      },
  { key: 'tortas',         emoji: '🫓', label: 'Tortas'          },
  { key: 'opciones_ligeras',emoji: '🥗', label: 'Ligeras'        },
  { key: 'bebidas',        emoji: '🥤', label: 'Bebidas'         },
]

export default function Menu() {
  const [menu,      setMenu]      = useState({})
  const [categActiva, setCateg]   = useState('desayunos')
  const [cargando,  setCargando]  = useState(true)
  const [agregados, setAgregados] = useState({})   // id → animación

  const { agregar, items } = useCarrito()
  const { monedas, racha } = usePuntos()

  useEffect(() => {
    axios.get('/api/menu')
      .then(r => { setMenu(r.data); setCargando(false) })
      .catch(() => setCargando(false))
  }, [])

  function cantidadEnCarrito(id) {
    return items.find(i => i.producto.id === id)?.cantidad || 0
  }

  function handleAgregar(prod) {
    agregar(prod)
    setAgregados(prev => ({ ...prev, [prod.id]: true }))
    setTimeout(() => setAgregados(prev => ({ ...prev, [prod.id]: false })), 300)
  }

  const productos = menu[categActiva] || []

  return (
    <div className="page-content">
      <LogroToast />

      {/* ── Header ── */}
      <div style={{
        background: 'linear-gradient(135deg, #1B5E20 0%, #2E7D32 100%)',
        padding: '20px 18px 16px',
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <div>
            <div style={{ color: 'rgba(255,255,255,.75)', fontSize: 13, fontWeight: 600 }}>
              ¡Buen día! 👋
            </div>
            <div style={{
              fontFamily: 'var(--fuente-titulo)',
              color: 'white', fontSize: 22, fontWeight: 800, marginTop: 2
            }}>
              ¿Qué vas a pedir hoy?
            </div>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 6 }}>
            <div className="coins-pill">🪙 {monedas}</div>
            {racha > 0 && (
              <div style={{
                background: 'rgba(255,255,255,.15)', color: 'white',
                borderRadius: 100, padding: '3px 10px',
                fontSize: 12, fontWeight: 700
              }}>
                🔥 {racha} días
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ── Filtros de categoría ── */}
      <div style={{ background: 'white', borderBottom: '1px solid var(--gris-borde)' }}>
        <div className="scroll-x" style={{ padding: '12px 18px' }}>
          {CATEGORIAS.map(c => (
            <button
              key={c.key}
              className={`chip ${categActiva === c.key ? 'active' : ''}`}
              onClick={() => setCateg(c.key)}
            >
              {c.emoji} {c.label}
            </button>
          ))}
        </div>
      </div>

      {/* ── Productos ── */}
      <div style={{ padding: '16px 18px' }}>
        {cargando ? (
          <div style={{ textAlign: 'center', padding: 40, color: 'var(--gris-texto)' }}>
            Cargando menú...
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            {productos.map((prod, idx) => {
              const enCarrito = cantidadEnCarrito(prod.id)
              return (
                <div
                  key={prod.id}
                  className="card fade-up"
                  style={{ animationDelay: `${idx * 40}ms` }}
                >
                  {/* Imagen placeholder */}
                  <div style={{
                    background: 'linear-gradient(135deg, #E8F5E9, #C8E6C9)',
                    height: 90,
                    display: 'grid', placeItems: 'center',
                    fontSize: 36,
                  }}>
                    {CATEGORIAS.find(c => c.key === categActiva)?.emoji || '🍴'}
                  </div>

                  <div style={{ padding: '10px 10px 12px' }}>
                    <div style={{ fontWeight: 800, fontSize: 13, lineHeight: 1.3, marginBottom: 3 }}>
                      {prod.nombre}
                    </div>
                    <div style={{ fontSize: 11, color: 'var(--gris-texto)', marginBottom: 8, lineHeight: 1.4 }}>
                      {prod.descripcion}
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{ fontWeight: 900, fontSize: 15, color: 'var(--verde-mid)' }}>
                        ${prod.precio}
                      </span>
                      {enCarrito > 0 ? (
                        <div style={{
                          display: 'flex', alignItems: 'center', gap: 6,
                          background: 'var(--verde-pale)', borderRadius: 100,
                          padding: '3px 4px',
                        }}>
                          <button
                            onClick={() => {/* quitar handled in carrito */}}
                            style={{
                              width: 22, height: 22, border: 'none',
                              background: 'var(--verde-light)', borderRadius: '50%',
                              cursor: 'pointer', fontWeight: 900, fontSize: 14,
                              display: 'grid', placeItems: 'center', color: 'var(--verde)',
                            }}
                          >–</button>
                          <span style={{ fontWeight: 800, fontSize: 13, color: 'var(--verde)', minWidth: 14, textAlign: 'center' }}>
                            {enCarrito}
                          </span>
                          <button
                            onClick={() => handleAgregar(prod)}
                            style={{
                              width: 22, height: 22, border: 'none',
                              background: 'var(--verde-mid)', borderRadius: '50%',
                              cursor: 'pointer', fontWeight: 900, fontSize: 14,
                              display: 'grid', placeItems: 'center', color: 'white',
                            }}
                          >+</button>
                        </div>
                      ) : (
                        <button
                          onClick={() => handleAgregar(prod)}
                          className={agregados[prod.id] ? 'pop' : ''}
                          style={{
                            width: 30, height: 30, border: 'none',
                            background: 'var(--verde-mid)', borderRadius: '50%',
                            cursor: 'pointer', fontSize: 18,
                            display: 'grid', placeItems: 'center', color: 'white',
                            boxShadow: '0 2px 8px rgba(46,125,50,.35)',
                          }}
                        >+</button>
                      )}
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}