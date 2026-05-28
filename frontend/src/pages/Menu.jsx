import { useState, useEffect, useRef } from 'react'
import { useCarrito } from '../context/CarritoContext'
import { usePuntos }  from '../context/PuntosContext'
import { useToast }   from '../context/ToastContext'
import axios from 'axios'

const CATEGORIAS = [
  { key: 'desayunos',        emoji: '🌅', label: 'Desayunos'        },
  { key: 'comida_rapida',    emoji: '🍔', label: 'Comida Rápida'    },
  { key: 'antojitos',        emoji: '🌮', label: 'Antojitos'        },
  { key: 'plato_del_dia',    emoji: '🍽️', label: 'Plato del Día'   },
  { key: 'sandwiches',       emoji: '🥪', label: 'Sandwiches'       },
  { key: 'tortas',           emoji: '🫓', label: 'Tortas'           },
  { key: 'opciones_ligeras', emoji: '🥗', label: 'Opciones Ligeras' },
  { key: 'bebidas',          emoji: '🥤', label: 'Bebidas'          },
]

// ── Imágenes por producto (id → ruta en /public/images/)
// Agrega aquí la ruta de cada imagen. Si no hay imagen, muestra el emoji.
const IMAGENES = {
  // Desayunos
  1:  '/images/desayuno-completo.jpg',
  2:  '/images/orden-huevos.jpg',
  3:  '/images/hotcakes.jpg',
  4:  '/images/molletes.jpg',
  5:  '/images/chilaquiles.jpg',
  6:  '/images/enfrijoladas.jpg',
  7:  '/images/crepas.jpg',
  8:  '/images/sincronizada.jpg',
  // Comida rápida
  9:  '/images/hamburguesa-papas.jpg',
  10: '/images/hamburguesa-sencilla.jpg',
  11: '/images/hot-dog.jpg',
  12: '/images/papas-francesa.jpg',
  13: '/images/burritos.jpg',
  // Antojitos
  14: '/images/taquitos-adobada.jpg',
  15: '/images/tacos-tuxpenos.jpg',
  16: '/images/sopitos.jpg',
  17: '/images/flautas-pollo.jpg',
  18: '/images/enchiladas-suizas.jpg',
  // Plato del día
  19: '/images/guiso-con-agua.jpg',
  20: '/images/guiso-sin-agua.jpg',
  // Sandwiches
  21: '/images/sandwich-lomo.jpg',
  22: '/images/sandwich-pollo.jpg',
  23: '/images/sandwich-panela.jpg',
  24: '/images/sandwich-jamon.jpg',
  // Tortas
  25: '/images/torta-lomo.jpg',
  26: '/images/torta-hawaiana.jpg',
  27: '/images/torta-cubana.jpg',
  28: '/images/torta-panela.jpg',
  29: '/images/torta-jamon.jpeg',
  30: '/images/medio-pachuco.jpg',
  31: '/images/medio-pachuco-carne.jpg',
  // Opciones ligeras
  32: '/images/ensalada-pollo.jpg',
  33: '/images/fruta.jpg',
  34: '/images/gelatina.jpg',
  // Bebidas
  35: '/images/agua-sabor.jpg',
  36: '/images/jugo-naranja.jpg',
  37: '/images/jugo-verde.jpg',
  38: '/images/licuado.jpg',
  39: '/images/chocomilk.jpg',
  40: '/images/leche.jpg',
  41: '/images/cafe.jpg',
  42: '/images/te.jpg',
}

// Componente de imagen con fallback al emoji
function ProductoImagen({ id, emoji, nombre }) {
  const [error, setError] = useState(false)
  const src = IMAGENES[id]

  if (!src || error) {
    return (
      <div style={{
        background: 'linear-gradient(135deg, #E8F5E9, #C8E6C9)',
        height: 110, display: 'grid', placeItems: 'center', fontSize: 44,
      }} aria-hidden="true">
        {emoji}
      </div>
    )
  }

  return (
    <img
      src={src}
      alt={nombre}
      onError={() => setError(true)}
      style={{ width: '100%', height: 110, objectFit: 'cover', display: 'block' }}
    />
  )
}

// ── Modal "Ver todo el menú" ──────────────────────────────
function ModalTodoElMenu({ menu, onClose, onAgregar, onQuitar, cantidadFn }) {
  const overlayRef = useRef(null)

  function handleOverlayClick(e) {
    if (e.target === overlayRef.current) onClose()
  }

  const todas = CATEGORIAS.flatMap(cat =>
    (menu[cat.key] || []).map(p => ({ ...p, _cat: cat }))
  )

  return (
    <div
      ref={overlayRef}
      onClick={handleOverlayClick}
      style={{
        position: 'fixed', inset: 0,
        background: 'rgba(0,0,0,.55)',
        zIndex: 400,
        display: 'flex', alignItems: 'flex-start', justifyContent: 'center',
        padding: '24px 16px',
        overflowY: 'auto',
        animation: 'fadeIn .2s ease',
      }}
      role="dialog"
      aria-modal="true"
      aria-label="Todo el menú"
    >
      <div style={{
        background: 'white',
        borderRadius: 20,
        width: '100%', maxWidth: 900,
        boxShadow: '0 24px 64px rgba(0,0,0,.2)',
        animation: 'slideUp .25s ease',
        overflow: 'hidden',
      }}>
        {/* Header del modal */}
        <div style={{
          background: 'linear-gradient(135deg, #1B5E20, #2E7D32)',
          padding: '20px 24px',
          display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        }}>
          <div>
            <h2 style={{ fontFamily: 'var(--fuente-titulo)', color: 'white', fontSize: 22, fontWeight: 800 }}>
              📋 Menú Completo
            </h2>
            <p style={{ color: 'rgba(255,255,255,.75)', fontSize: 13, marginTop: 2 }}>
              {todas.length} productos disponibles
            </p>
          </div>
          <button
            onClick={onClose}
            aria-label="Cerrar menú completo"
            style={{
              background: 'rgba(255,255,255,.15)', border: 'none',
              borderRadius: 10, padding: '8px 14px',
              color: 'white', fontFamily: 'var(--fuente)',
              fontSize: 14, fontWeight: 800, cursor: 'pointer',
            }}
          >✕ Cerrar</button>
        </div>

        {/* Contenido por categorías */}
        <div style={{ padding: '20px 24px', maxHeight: '72vh', overflowY: 'auto' }}>
          {CATEGORIAS.map(cat => {
            const prods = menu[cat.key] || []
            if (prods.length === 0) return null
            return (
              <div key={cat.key} style={{ marginBottom: 28 }}>
                {/* Título de categoría */}
                <div style={{
                  display: 'flex', alignItems: 'center', gap: 10,
                  marginBottom: 12, paddingBottom: 8,
                  borderBottom: '2px solid var(--verde-light)',
                }}>
                  <span style={{ fontSize: 24 }}>{cat.emoji}</span>
                  <h3 style={{ fontFamily: 'var(--fuente-titulo)', fontSize: 18, fontWeight: 800, color: 'var(--verde)' }}>
                    {cat.label}
                  </h3>
                  <span style={{ fontSize: 12, color: 'var(--gris-texto)', fontWeight: 700 }}>
                    ({prods.length} productos)
                  </span>
                </div>

                {/* Tabla de productos */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                  {prods.map(prod => {
                    const cant = cantidadFn(prod.id)
                    return (
                      <div key={prod.id} style={{
                        display: 'flex', alignItems: 'center', gap: 14,
                        padding: '10px 14px',
                        background: cant > 0 ? 'var(--verde-pale)' : 'var(--gris-bg)',
                        borderRadius: 10,
                        border: cant > 0 ? '2px solid var(--verde-light)' : '2px solid transparent',
                        transition: 'all .18s',
                      }}>
                        {/* Mini imagen */}
                        <div style={{
                          width: 48, height: 48, borderRadius: 8, overflow: 'hidden',
                          flexShrink: 0, background: '#E8F5E9',
                          display: 'grid', placeItems: 'center',
                        }}>
                          {IMAGENES[prod.id] ? (
                            <img
                              src={IMAGENES[prod.id]}
                              alt={prod.nombre}
                              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                              onError={e => { e.target.style.display='none'; e.target.nextSibling.style.display='grid' }}
                            />
                          ) : null}
                          <span style={{ fontSize: 22, display: IMAGENES[prod.id] ? 'none' : 'block' }}>{cat.emoji}</span>
                        </div>

                        {/* Nombre y descripción */}
                        <div style={{ flex: 1 }}>
                          <div style={{ fontWeight: 800, fontSize: 14 }}>{prod.nombre}</div>
                          <div style={{ fontSize: 12, color: 'var(--gris-texto)' }}>{prod.descripcion}</div>
                        </div>

                        {/* Disponibilidad */}
                        {!prod.disponible && (
                          <span style={{ fontSize: 11, color: 'var(--rojo)', fontWeight: 700 }}>Sin stock</span>
                        )}

                        {/* Precio */}
                        <span style={{ fontWeight: 900, fontSize: 16, color: 'var(--verde-mid)', minWidth: 44, textAlign: 'right' }}>
                          ${prod.precio}
                        </span>

                        {/* Control cantidad */}
                        {prod.disponible && (
                          cant > 0 ? (
                            <div style={{ display: 'flex', alignItems: 'center', gap: 8,
                              background: 'white', borderRadius: 100, padding: '4px 8px',
                              border: '2px solid var(--verde-light)' }}>
                              <button onClick={() => onQuitar(prod)}
                                style={{ width: 26, height: 26, border: 'none', background: 'var(--verde-light)',
                                  borderRadius: '50%', cursor: 'pointer', fontWeight: 900, fontSize: 16,
                                  display: 'grid', placeItems: 'center', color: 'var(--verde)' }}>–</button>
                              <span style={{ fontWeight: 800, minWidth: 18, textAlign: 'center' }}>{cant}</span>
                              <button onClick={() => onAgregar(prod)}
                                style={{ width: 26, height: 26, border: 'none', background: 'var(--verde-mid)',
                                  borderRadius: '50%', cursor: 'pointer', fontWeight: 900, fontSize: 16,
                                  display: 'grid', placeItems: 'center', color: 'white' }}>+</button>
                            </div>
                          ) : (
                            <button onClick={() => onAgregar(prod)}
                              style={{ width: 34, height: 34, border: 'none', background: 'var(--verde-mid)',
                                borderRadius: '50%', cursor: 'pointer', fontSize: 18,
                                display: 'grid', placeItems: 'center', color: 'white',
                                boxShadow: '0 2px 8px rgba(46,125,50,.3)', flexShrink: 0 }}>+</button>
                          )
                        )}
                      </div>
                    )
                  })}
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}

// ── Página principal del Menú ─────────────────────────────
export default function Menu() {
  const [menu,        setMenu]        = useState({})
  const [categActiva, setCateg]       = useState('desayunos')
  const [cargando,    setCargando]    = useState(true)
  const [busqueda,    setBusqueda]    = useState('')
  const [animados,    setAnimados]    = useState({})
  const [verTodo,     setVerTodo]     = useState(false)

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
    setAnimados(prev => ({ ...prev, [prod.id]: true }))
    setTimeout(() => setAnimados(prev => ({ ...prev, [prod.id]: false })), 280)
    toast.push('success', `${prod.nombre} agregado`, `$${prod.precio} — ya está en tu pedido`)
  }

  function handleQuitar(prod) {
    quitar(prod.id)
    toast.push('info', `${prod.nombre} reducido`, 'Cantidad actualizada en el pedido')
  }

  const productosBusqueda = busqueda.trim()
    ? Object.values(menu).flat().filter(p =>
        p.nombre.toLowerCase().includes(busqueda.toLowerCase()) ||
        p.descripcion.toLowerCase().includes(busqueda.toLowerCase())
      )
    : null

  const productos   = productosBusqueda || menu[categActiva] || []
  const catActual   = CATEGORIAS.find(c => c.key === categActiva)
  const emojiActivo = catActual?.emoji || '🍴'

  const totalProductos = Object.values(menu).reduce((s, arr) => s + arr.length, 0)

  return (
    <div style={{ padding: '24px 28px', width: '100%' }}>

      {/* Modal todo el menú */}
      {verTodo && (
        <ModalTodoElMenu
          menu={menu}
          onClose={() => setVerTodo(false)}
          onAgregar={handleAgregar}
          onQuitar={handleQuitar}
          cantidadFn={cantidadEnCarrito}
        />
      )}

      {/* ── Header ── */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 20, gap: 16, flexWrap: 'wrap' }}>
        <div>
          <h1 style={{ fontFamily: 'var(--fuente-titulo)', fontSize: 26, fontWeight: 800, marginBottom: 4 }}>
            ¿Qué vas a pedir hoy? 👋
          </h1>
          <p style={{ color: 'var(--gris-texto)', fontSize: 14 }}>
            Selecciona una categoría o busca un producto
          </p>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
          {/* ── BOTÓN VER TODO EL MENÚ ── */}
          <button
            className="btn btn-secondary"
            onClick={() => setVerTodo(true)}
            title="Ver todos los productos disponibles"
            style={{ gap: 8 }}
          >
            📋 Ver menú completo
            {totalProductos > 0 && (
              <span style={{
                background: 'var(--verde-mid)', color: 'white',
                borderRadius: 100, padding: '1px 8px',
                fontSize: 12, fontWeight: 900,
              }}>{totalProductos}</span>
            )}
          </button>
          <div className="coins-pill" title="Tus CaféCoins acumulados">🪙 {monedas}</div>
        </div>
      </div>

      {/* ── Buscador ── */}
      <div className="form-group" style={{ marginBottom: 16, maxWidth: 420 }}>
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

      {/* ── Chips de categoría ── */}
      {!busqueda && (
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 20 }}
             role="group" aria-label="Filtrar por categoría">
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

      {/* ── Título sección ── */}
      <div className="section-title">
        {busqueda
          ? `Resultados para "${busqueda}" (${productos.length})`
          : `${emojiActivo} ${catActual?.label}`}
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
        <div
          style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 14 }}
          data-grid="menu"
        >
          {productos.map((prod, idx) => {
            const cantidad = cantidadEnCarrito(prod.id)
            return (
              <article
                key={prod.id}
                className="card fade-up"
                style={{ animationDelay: `${idx * 30}ms` }}
                aria-label={`${prod.nombre}, $${prod.precio}`}
              >
                {/* ── Imagen del producto ── */}
                <ProductoImagen id={prod.id} emoji={emojiActivo} nombre={prod.nombre} />

                <div style={{ padding: '12px 14px 14px' }}>
                  <h3 style={{ fontWeight: 800, fontSize: 14, lineHeight: 1.3, marginBottom: 4 }}>
                    {prod.nombre}
                  </h3>
                  <p style={{ fontSize: 12, color: 'var(--gris-texto)', marginBottom: 10, lineHeight: 1.4 }}>
                    {prod.descripcion}
                  </p>

                  {!prod.disponible && (
                    <span style={{ fontSize: 11, fontWeight: 700, color: 'var(--rojo)', display: 'block', marginBottom: 6 }}>
                      ⛔ No disponible hoy
                    </span>
                  )}

                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 8 }}>
                    <span style={{ fontWeight: 900, fontSize: 18, color: 'var(--verde-mid)' }}
                          aria-label={`Precio: ${prod.precio} pesos`}>
                      ${prod.precio}
                    </span>

                    {!prod.disponible ? null : cantidad > 0 ? (
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8,
                        background: 'var(--verde-pale)', borderRadius: 100, padding: '4px 6px' }}
                        role="group" aria-label={`Cantidad de ${prod.nombre}`}
                      >
                        <button onClick={() => handleQuitar(prod)}
                          aria-label={`Quitar uno de ${prod.nombre}`}
                          style={{ width: 26, height: 26, border: 'none', background: 'var(--verde-light)',
                            borderRadius: '50%', cursor: 'pointer', fontWeight: 900, fontSize: 16,
                            display: 'grid', placeItems: 'center', color: 'var(--verde)' }}>–</button>
                        <span style={{ fontWeight: 800, minWidth: 16, textAlign: 'center', fontSize: 14 }}
                              aria-live="polite">{cantidad}</span>
                        <button onClick={() => handleAgregar(prod)}
                          aria-label={`Agregar otro de ${prod.nombre}`}
                          style={{ width: 26, height: 26, border: 'none', background: 'var(--verde-mid)',
                            borderRadius: '50%', cursor: 'pointer', fontWeight: 900, fontSize: 16,
                            display: 'grid', placeItems: 'center', color: 'white' }}>+</button>
                      </div>
                    ) : (
                      <button onClick={() => handleAgregar(prod)}
                        className={animados[prod.id] ? 'pop' : ''}
                        aria-label={`Agregar ${prod.nombre} al pedido`}
                        style={{ width: 34, height: 34, border: 'none', background: 'var(--verde-mid)',
                          borderRadius: '50%', cursor: 'pointer', fontSize: 20,
                          display: 'grid', placeItems: 'center', color: 'white',
                          boxShadow: '0 2px 8px rgba(46,125,50,.3)' }}>+</button>
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