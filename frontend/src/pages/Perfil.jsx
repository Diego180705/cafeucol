import { usePuntos } from '../context/PuntosContext'

const NIVELES = [
  { min: 0,   max: 99,  n: 1, nombre: 'Nuevo Cliente'   },
  { min: 100, max: 299, n: 2, nombre: 'Cliente Regular'  },
  { min: 300, max: 599, n: 3, nombre: 'Favorito'         },
  { min: 600, max: 999, n: 4, nombre: 'VIP Cafetería ⭐' },
]

export default function Perfil() {
  const { monedas, racha, totalPedidos, logros, LOGROS_DEF } = usePuntos()

  const nivel = NIVELES.find(n => monedas >= n.min && monedas <= n.max) || NIVELES[3]
  const siguiente = NIVELES[nivel.n] // undefined si ya es max
  const pct = siguiente
    ? Math.round(((monedas - nivel.min) / (siguiente.min - nivel.min)) * 100)
    : 100

  return (
    <div className="page-content">
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24, alignItems: 'start' }} data-grid="perfil">

        {/* ── Columna izquierda ── */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>

          {/* Tarjeta de nivel */}
          <div style={{
            background: 'linear-gradient(135deg, #1B5E20, #388E3C)',
            borderRadius: 18, padding: '24px 24px 28px', color: 'white',
          }}>
            <div style={{ fontSize: 12, opacity: .7, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '.06em', marginBottom: 4 }}>
              Nivel {nivel.n}
            </div>
            <div style={{ fontFamily: 'var(--fuente-titulo)', fontSize: 26, fontWeight: 800, marginBottom: 16 }}>
              {nivel.nombre}
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 14 }}>
              <div>
                <div style={{ fontSize: 12, opacity: .7, marginBottom: 2 }}>CaféCoins acumulados</div>
                <div style={{ fontFamily: 'var(--fuente-titulo)', fontSize: 36, fontWeight: 800 }}>🪙 {monedas}</div>
              </div>
              {siguiente && (
                <div style={{ textAlign: 'right', fontSize: 12, opacity: .75 }}>
                  <div>Siguiente nivel:</div>
                  <div style={{ fontWeight: 800 }}>{siguiente.nombre}</div>
                  <div>en {siguiente.min - monedas} monedas</div>
                </div>
              )}
            </div>
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, opacity: .8, marginBottom: 6 }}>
                <span>Progreso al nivel {siguiente?.n ?? 'máx'}</span>
                <span>{pct}%</span>
              </div>
              <div style={{ background: 'rgba(255,255,255,.25)', borderRadius: 100, height: 8 }}
                   role="progressbar" aria-valuenow={pct} aria-valuemin={0} aria-valuemax={100}
                   aria-label={`Progreso de nivel: ${pct}%`}>
                <div style={{ background: 'white', borderRadius: 100, height: '100%', width: `${pct}%`, transition: 'width .6s ease' }} />
              </div>
            </div>
          </div>

          {/* Estadísticas */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 12 }}>
            {[
              { emoji: '📦', valor: totalPedidos, label: 'Pedidos totales',   desc: 'Pedidos completados' },
              { emoji: '🔥', valor: racha,         label: 'Días en racha',    desc: 'Días consecutivos activo' },
              { emoji: '🏅', valor: logros.length,  label: 'Logros',          desc: `De ${LOGROS_DEF.length} posibles` },
            ].map(s => (
              <div key={s.label} className="card" style={{ padding: '16px 12px', textAlign: 'center' }}
                   title={s.desc}>
                <div style={{ fontSize: 28 }}>{s.emoji}</div>
                <div style={{ fontFamily: 'var(--fuente-titulo)', fontSize: 28, fontWeight: 800, marginTop: 6 }}>{s.valor}</div>
                <div style={{ fontSize: 12, color: 'var(--gris-texto)', fontWeight: 700, marginTop: 2 }}>{s.label}</div>
              </div>
            ))}
          </div>

          {/* Racha */}
          {racha > 0 && (
            <div style={{ background: '#FFF7ED', border: '2px solid #FED7AA', borderRadius: 14, padding: '16px 18px',
              display: 'flex', alignItems: 'center', gap: 14 }}
              role="status" aria-label={`Racha activa de ${racha} días`}>
              <span style={{ fontSize: 36 }}>🔥</span>
              <div>
                <div style={{ fontWeight: 800, fontSize: 16 }}>{racha} días en racha</div>
                <div style={{ fontSize: 13, color: '#92400E', marginTop: 3 }}>
                  {racha >= 5
                    ? '¡Logro "En Racha" desbloqueado! Sigue así 🎉'
                    : `Faltan ${5 - racha} días más para el logro "En Racha"`}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* ── Columna derecha: Logros ── */}
        <div>
          <div className="section-title">🏅 Logros ({logros.length}/{LOGROS_DEF.length})</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {LOGROS_DEF.map(def => {
              const desbloqueado = logros.includes(def.id)
              return (
                <div key={def.id} className="card" style={{
                  padding: '14px 16px', display: 'flex', alignItems: 'center', gap: 14,
                  opacity: desbloqueado ? 1 : 0.55,
                  borderLeft: desbloqueado ? '4px solid var(--verde-mid)' : '4px solid var(--gris-borde)',
                }}
                aria-label={`Logro: ${def.nombre}. ${desbloqueado ? 'Desbloqueado' : 'Bloqueado'}. ${def.desc}`}
                >
                  <div style={{
                    width: 52, height: 52, borderRadius: 14, flexShrink: 0,
                    background: desbloqueado ? 'var(--verde-pale)' : 'var(--gris-bg)',
                    display: 'grid', placeItems: 'center', fontSize: 26,
                    border: `2px solid ${desbloqueado ? 'var(--verde-light)' : 'var(--gris-borde)'}`,
                  }} aria-hidden="true">
                    {desbloqueado ? def.emoji : '🔒'}
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: 800, fontSize: 14 }}>{def.nombre}</div>
                    <div style={{ fontSize: 12, color: 'var(--gris-texto)', marginTop: 2 }}>{def.desc}</div>
                  </div>
                  <div style={{
                    background: desbloqueado ? 'var(--amber-light)' : 'var(--gris-bg)',
                    borderRadius: 100, padding: '5px 12px',
                    fontSize: 13, fontWeight: 800,
                    color: desbloqueado ? '#92400E' : 'var(--gris-texto)',
                    flexShrink: 0,
                  }}>
                    +{def.puntos}🪙
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </div>
  )
}