const PASOS = [
  { label: 'Menú',      desc: 'Selecciona productos' },
  { label: 'Carrito',   desc: 'Revisa tu pedido'     },
  { label: 'Horario',   desc: 'Elige cuándo recoger' },
  { label: 'Confirmar', desc: 'Envía tu pedido'      },
]

export default function Stepper({ actual }) {
  return (
    <div className="stepper" role="progressbar" aria-valuenow={actual + 1} aria-valuemin={1} aria-valuemax={4} aria-label={`Paso ${actual + 1} de 4: ${PASOS[actual].label}`}>
      {PASOS.map((paso, i) => {
        const estado = i < actual ? 'done' : i === actual ? 'active' : ''
        return (
          <div key={i} className={`step ${estado}`} aria-current={i === actual ? 'step' : undefined}>
            <div className="step-dot" aria-hidden="true">
              {i < actual ? '✓' : i + 1}
            </div>
            <div>
              <div style={{ fontWeight: 800 }}>{paso.label}</div>
              <div style={{ fontSize: 11, fontWeight: 600, opacity: .7 }}>{paso.desc}</div>
            </div>
          </div>
        )
      })}
    </div>
  )
}