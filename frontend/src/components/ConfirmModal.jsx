// Modal reutilizable para confirmar acciones destructivas
// Cubre: "¿Se pregunta al usuario que confirme acciones drásticas?"
export default function ConfirmModal({ titulo, mensaje, labelConfirmar = 'Confirmar', labelCancelar = 'Cancelar', peligroso = false, onConfirmar, onCancelar }) {
  return (
    <div className="modal-overlay" role="dialog" aria-modal="true" aria-labelledby="modal-titulo">
      <div className="modal">
        <h3 id="modal-titulo">{titulo}</h3>
        <p>{mensaje}</p>
        <div className="modal-actions">
          <button className="btn btn-ghost btn-sm" onClick={onCancelar}>
            {labelCancelar}
          </button>
          <button
            className={`btn btn-sm ${peligroso ? 'btn-danger' : 'btn-primary'}`}
            onClick={onConfirmar}
            autoFocus
          >
            {labelConfirmar}
          </button>
        </div>
      </div>
    </div>
  )
}