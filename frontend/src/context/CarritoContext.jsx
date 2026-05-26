import { createContext, useContext, useState } from 'react'

const CarritoCtx = createContext()

export function CarritoProvider({ children }) {
  const [items, setItems] = useState([])   // [{ producto, cantidad, nota }]
  const [horario, setHorario] = useState(null)

  function agregar(producto) {
    setItems(prev => {
      const existe = prev.find(i => i.producto.id === producto.id)
      if (existe) return prev.map(i =>
        i.producto.id === producto.id ? { ...i, cantidad: i.cantidad + 1 } : i
      )
      return [...prev, { producto, cantidad: 1, nota: '' }]
    })
  }

  function quitar(id) {
    setItems(prev => {
      const item = prev.find(i => i.producto.id === id)
      if (!item) return prev
      if (item.cantidad === 1) return prev.filter(i => i.producto.id !== id)
      return prev.map(i => i.producto.id === id ? { ...i, cantidad: i.cantidad - 1 } : i)
    })
  }

  function eliminar(id) {
    setItems(prev => prev.filter(i => i.producto.id !== id))
  }

  function actualizarNota(id, nota) {
    setItems(prev => prev.map(i => i.producto.id === id ? { ...i, nota } : i))
  }

  function vaciar() {
    setItems([])
    setHorario(null)
  }

  const total    = items.reduce((s, i) => s + i.producto.precio * i.cantidad, 0)
  const cantidad = items.reduce((s, i) => s + i.cantidad, 0)

  return (
    <CarritoCtx.Provider value={{
      items, agregar, quitar, eliminar, actualizarNota, vaciar,
      total, cantidad, horario, setHorario
    }}>
      {children}
    </CarritoCtx.Provider>
  )
}

export const useCarrito = () => useContext(CarritoCtx)