const PASOS = ['Menú', 'Carrito', 'Horario', 'Confirmar']

export default function Stepper({ actual }) {
  // actual: 0,1,2,3
  return (
    <div className="stepper">
      {PASOS.map((nombre, i) => {
        const estado = i < actual ? 'done' : i === actual ? 'active' : ''
        return (
          <div key={i} className={`step ${estado}`}>
            <div className="step-dot">
              {i < actual ? '✓' : i + 1}
            </div>
            {nombre}
          </div>
        )
      })}
    </div>
  )
}