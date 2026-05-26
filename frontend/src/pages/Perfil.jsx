import { usePuntos } from '../context/PuntosContext'

export default function Perfil() {
  const { monedas, racha, totalPedidos, logros, LOGROS_DEF } = usePuntos()

  const nivel = monedas < 100 ? { n: 1, nombre: 'Nuevo Cliente',    sig: 100  }
              : monedas < 300 ? { n: 2, nombre: 'Cliente Regular',  sig: 300  }
              : monedas < 600 ? { n: 3, nombre: 'Favorito',          sig: 600  }
                              : { n: 4, nombre: '⭐ VIP Cafetería',   sig: 1000 }

  const pct = Math.min(100, Math.round((monedas / nivel.sig) * 100))

  return (
    <div>
      <div className="topbar"><h1>Mi Perfil</h1></div>

      <div style={{ padding: '20px 18px', display: 'flex', flexDirection: 'column', gap: 16 }}>

        {/* ── Tarjeta principal ── */}
        <div style={{
          background: 'linear-gradient(135deg, #1B5E20, #388E3C)',
          borderRadius: 20, padding: '20px 20px 24px', color: 'white',
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div>
              <div style={{ fontSize: 13, opacity: .75, marginBottom: 4 }}>Nivel {nivel.n}</div>
              <div style={{ fontFamily: 'var(--fuente-titulo)', fontSize: 20, fontWeight: 800 }}>
                {nivel.nombre}
              </div>
            </div>
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontSize: 13, opacity: .75 }}>CaféCoins</div>
              <div style={{ fontFamily: 'var(--fuente-titulo)', fontSize: 28, fontWeight: 800 }}>
                🪙 {monedas}
              </div>
            </div>
          </div>

          {/* Barra de progreso nivel */}
          <div style={{ marginTop: 16 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, opacity: .8, marginBottom: 6 }}>
              <span>{monedas} / {nivel.sig} para nivel {nivel.n + 1}</span>
              <span>{pct}%</span>
            </div>
            <div style={{ background: 'rgba(255,255,255,.25)', borderRadius: 100, height: 8 }}>
              <div style={{
                background: 'white', borderRadius: 100, height: '100%',
                width: `${pct}%`, transition: 'width .6s ease',
              }} />
            </div>
          </div>
        </div>

        {/* ── Estadísticas ── */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 10 }}>
          {[
            { emoji: '📦', valor: totalPedidos, label: 'Pedidos' },
            { emoji: '🔥', valor: racha,        label: 'Días racha' },
            { emoji: '🏅', valor: logros.length, label: 'Logros' },
          ].map(s => (
            <div key={s.label} className="card" style={{ padding: '14px 10px', textAlign: 'center' }}>
              <div style={{ fontSize: 24 }}>{s.emoji}</div>
              <div style={{ fontFamily: 'var(--fuente-titulo)', fontSize: 22, fontWeight: 800, marginTop: 4 }}>
                {s.valor}
              </div>
              <div style={{ fontSize: 11, color: 'var(--gris-texto)', fontWeight: 700 }}>{s.label}</div>
            </div>
          ))}
        </div>

        {/* ── Racha ── */}
        {racha > 0 && (
          <div style={{
            background: '#FFF7ED', border: '2px solid #FED7AA',
            borderRadius: 14, padding: '14px 16px',
            display: 'flex', alignItems: 'center', gap: 12,
          }}>
            <span style={{ fontSize: 32 }}>🔥</span>
            <div>
              <div style={{ fontWeight: 800, fontSize: 15 }}>{racha} días en racha</div>
              <div style={{ fontSize: 12, color: '#92400E', marginTop: 2 }}>
                {racha >= 5
                  ? '¡Logro desbloqueado! Sigue así 🎉'
                  : `${5 - racha} días más para el logro "En Racha"`}
              </div>
            </div>
          </div>
        )}

        {/* ── Logros ── */}
        <div>
          <div className="section-title">Logros</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {LOGROS_DEF.map(def => {
              const desbloqueado = logros.includes(def.id)
              return (
                <div key={def.id} className="card" style={{
                  padding: '14px 16px', display: 'flex', alignItems: 'center', gap: 14,
                  opacity: desbloqueado ? 1 : 0.5,
                }}>
                  <div style={{
                    width: 48, height: 48, borderRadius: 14, flexShrink: 0,
                    background: desbloqueado ? 'var(--verde-pale)' : 'var(--gris-bg)',
                    display: 'grid', placeItems: 'center', fontSize: 24,
                    border: desbloqueado ? '2px solid var(--verde-light)' : '2px solid var(--gris-borde)',
                  }}>
                    {desbloqueado ? def.emoji : '🔒'}
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: 800, fontSize: 14 }}>{def.nombre}</div>
                    <div style={{ fontSize: 12, color: 'var(--gris-texto)', marginTop: 2 }}>{def.desc}</div>
                  </div>
                  <div style={{
                    background: desbloqueado ? 'var(--amber-light)' : 'var(--gris-bg)',
                    borderRadius: 100, padding: '4px 10px',
                    fontSize: 12, fontWeight: 800,
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