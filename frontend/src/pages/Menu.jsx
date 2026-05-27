import { useState, useEffect } from 'react'
import { useCarrito } from '../context/CarritoContext'
import { usePuntos }  from '../context/PuntosContext'
import { useToast }   from '../context/ToastContext'
import axios from 'axios'

const CATEGORIAS = [
  { key: 'desayunos',       emoji: '🌅', label: 'Desayunos'       },
  { key: 'comida_rapida',   emoji: '🍔', label: 'Comida Rápida'   },
  { key: 'antojitos',       emoji: '🌮', label: 'Antojitos'       },
  { key: 'plato_del_dia',   emoji: '🍽️', label: 'Plato del Día'  },
  { key: 'sandwiches',      emoji: '🥪', label: 'Sandwiches'      },
  { key: 'tortas',          emoji: '🫓', label: 'Tortas'          },
  { key: 'opciones_ligeras',emoji: '🥗', label: 'Opciones Ligeras'},
  { key: 'bebidas',         emoji: '🥤', label: 'Bebidas'         },
]

export default function Menu() {
  const [menu,      setMenu]      = useState({})
  const [categActiva, setCateg]   = useState('desayunos')
  const [cargando,  setCargando]  = useState(true)
  const [busqueda,  setBusqueda]  = useState('')
  const [animados,  setAnimados]  = useState({})

  const { agregar, quitar, items } = useCarrito()
  const { monedas }                = usePuntos()
  const toast                      = useToast()

  useEffect(() => {
    axios.get('/api/menu')
      .then(r => { setMenu(r.data); setCargando(false) })
      .catch(() => {
        setCargando(false)
        toast.push('error', 'Error de conexión', 'No se pudo cargar el menú. Verifica tu conexión.')
      })
  }, [])

  function cantidadEnCarrito(id) {
    return items.find(i => i.producto.id === id)?.cantidad || 0
  }

  function handleAgregar(prod) {
    agregar(prod)
    // Feedback visual inmediato (criterio de usabilidad: feedback por cada acción)
    setAnimados(prev => ({ ...prev, [prod.id]: true }))
    setTimeout(() => setAnimados(prev => ({ ...prev, [prod.id]: false })), 280)
    toast.push('success', `${prod.nombre} agregado`, `$${prod.precio} — ya está en tu pedido`)
  }

  function handleQuitar(prod) {
    quitar(prod.id)
    toast.push('info', `${prod.nombre} eliminado`, 'Cantidad reducida en el pedido')
  }

  // Búsqueda: filtra por nombre en todas las categorías
  const productosBusqueda = busqueda.trim()
    ? Object.values(menu).flat().filter(p =>
        p.nombre.toLowerCase().includes(busqueda.toLowerCase()) ||
        p.descripcion.toLowerCase().includes(busqueda.toLowerCase())
      )
    : null

  const productos = productosBusqueda || menu[categActiva] || []
  const emojiActivo = CATEGORIAS.find(c => c.key === categActiva)?.emoji || '🍴'

  return (
    <div style={{ padding: '24px 28px', width: '100%' }}>
      {/* ── Header con búsqueda ── */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 20, gap: 20 }}>
        <div>
          <h1 style={{ fontFamily: 'var(--fuente-titulo)', fontSize: 26, fontWeight: 800, marginBottom: 4 }}>
            ¿Qué vas a pedir hoy? 👋
          </h1>
          <p style={{ color: 'var(--gris-texto)', fontSize: 14 }}>
            Selecciona una categoría o busca un producto
          </p>
        </div>
        <div className="coins-pill" title="Tus CaféCoins acumulados">🪙 {monedas} CaféCoins</div>
      </div>

      {/* ── Buscador ── */}
      <div className="form-group" style={{ marginBottom: 16, maxWidth: 400 }}>
        <label htmlFor="busqueda" className="form-label">🔍 Buscar producto</label>
        <input
          id="busqueda"
          type="search"
          placeholder="Ej: torta, jugo, hotcakes..."
          value={busqueda}
          onChange={e => setBusqueda(e.target.value)}
          aria-label="Buscar producto en el menú"
        />
        <span className="form-hint">Puedes buscar por nombre o descripción</span>
      </div>

      {/* ── Filtros de categoría ── */}
      {!busqueda && (
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 20 }} role="group" aria-label="Filtrar por categoría">
          {CATEGORIAS.map(c => (
            <button
              key={c.key}
              className={`chip ${categActiva === c.key ? 'active' : ''}`}
              onClick={() => setCateg(c.key)}
              aria-pressed={categActiva === c.key}
              title={`Ver ${c.label}`}
            >
              {c.emoji} {c.label}
            </button>
          ))}
        </div>
      )}

      {/* ── Título de sección ── */}
      <div className="section-title">
        {busqueda
          ? `Resultados para "${busqueda}" (${productos.length})`
          : `${emojiActivo} ${CATEGORIAS.find(c => c.key === categActiva)?.label}`}
      </div>

      {/* ── Grid de productos ── */}
      {cargando ? (
        <div style={{ textAlign: 'center', padding: 60, color: 'var(--gris-texto)', fontSize: 16 }}>
          ⏳ Cargando menú...
        </div>
      ) : productos.length === 0 ? (
        <div className="empty-state">
          <span className="icon">🔍</span>
          <h3>Sin resultados</h3>
          <p>No encontramos productos que coincidan con tu búsqueda.</p>
          <button className="btn btn-secondary" onClick={() => setBusqueda('')}>Limpiar búsqueda</button>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 14 }}>
          {productos.map((prod, idx) => {
            const cantidad = cantidadEnCarrito(prod.id)
            return (
              <article
                key={prod.id}
                className="card fade-up"
                style={{ animationDelay: `${idx * 30}ms` }}
                aria-label={`${prod.nombre}, $${prod.precio}`}
              >
                {/* Imagen placeholder */}
                <div style={{
                  background: 'linear-gradient(135deg, #E8F5E9, #C8E6C9)',
                  height: 100, display: 'grid', placeItems: 'center', fontSize: 40,
                }} aria-hidden="true">
                  {emojiActivo}
                </div>

                <div style={{ padding: '12px 14px 14px' }}>
                  {/* Nombre — etiqueta tipográficamente distinta del precio */}
                  <h3 style={{ fontWeight: 800, fontSize: 14, lineHeight: 1.3, marginBottom: 4 }}>
                    {prod.nombre}
                  </h3>
                  <p style={{ fontSize: 12, color: 'var(--gris-texto)', marginBottom: 10, lineHeight: 1.4 }}>
                    {prod.descripcion}
                  </p>

                  {/* Disponibilidad */}
                  {!prod.disponible && (
                    <span style={{ fontSize: 11, fontWeight: 700, color: 'var(--rojo)', display: 'block', marginBottom: 6 }}>
                      ⛔ No disponible hoy
                    </span>
                  )}

                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 8 }}>
                    {/* Precio — visualmente diferente al nombre */}
                    <span style={{ fontWeight: 900, fontSize: 18, color: 'var(--verde-mid)' }}
                          aria-label={`Precio: ${prod.precio} pesos`}>
                      ${prod.precio}
                    </span>

                    {/* Control de cantidad o botón agregar */}
                    {!prod.disponible ? null : cantidad > 0 ? (
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8,
                        background: 'var(--verde-pale)', borderRadius: 100, padding: '4px 6px' }}
                        role="group" aria-label={`Cantidad de ${prod.nombre}`}
                      >
                        <button
                          onClick={() => handleQuitar(prod)}
                          aria-label={`Quitar uno de ${prod.nombre}`}
                          style={{ width: 26, height: 26, border: 'none', background: 'var(--verde-light)',
                            borderRadius: '50%', cursor: 'pointer', fontWeight: 900, fontSize: 16,
                            display: 'grid', placeItems: 'center', color: 'var(--verde)' }}
                        >–</button>
                        <span style={{ fontWeight: 800, minWidth: 16, textAlign: 'center', fontSize: 14 }}
                              aria-live="polite">{cantidad}</span>
                        <button
                          onClick={() => handleAgregar(prod)}
                          aria-label={`Agregar otro de ${prod.nombre}`}
                          style={{ width: 26, height: 26, border: 'none', background: 'var(--verde-mid)',
                            borderRadius: '50%', cursor: 'pointer', fontWeight: 900, fontSize: 16,
                            display: 'grid', placeItems: 'center', color: 'white' }}
                        >+</button>
                      </div>
                    ) : (
                      <button
                        onClick={() => handleAgregar(prod)}
                        className={animados[prod.id] ? 'pop' : ''}
                        aria-label={`Agregar ${prod.nombre} al pedido`}
                        style={{ width: 34, height: 34, border: 'none', background: 'var(--verde-mid)',
                          borderRadius: '50%', cursor: 'pointer', fontSize: 20,
                          display: 'grid', placeItems: 'center', color: 'white',
                          boxShadow: '0 2px 8px rgba(46,125,50,.3)' }}
                      >+</button>
                    )}
                  </div>
                </div>
              </article>
            )
          })}
        </div>
      )}
    </div>
  )
}