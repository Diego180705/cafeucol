const express = require('express');
const cors = require('cors');
const app = express();

app.use(cors());
app.use(express.json());

// Datos del menú basados en tu card sorting
const menu = {
  desayunos: [
    { id: 1, nombre: "Desayuno completo", descripcion: "Huevo, frijoles, café", precio: 45, disponible: true },
    { id: 2, nombre: "Orden de huevos", descripcion: "Al gusto", precio: 35, disponible: true },
    { id: 3, nombre: "Hotcakes", descripcion: "3 piezas con miel", precio: 30, disponible: true },
    { id: 4, nombre: "Molletes", descripcion: "Con mantequilla", precio: 28, disponible: true },
    { id: 5, nombre: "Chilaquiles", descripcion: "Rojos o verdes", precio: 38, disponible: true },
    { id: 6, nombre: "Enfrijoladas", descripcion: "Con queso y crema", precio: 35, disponible: true },
    { id: 7, nombre: "Crepas", descripcion: "Con mermelada o nutella", precio: 32, disponible: true },
    { id: 8, nombre: "Sincronizada", descripcion: "Jamón y queso", precio: 30, disponible: true },
  ],
  comida_rapida: [
    { id: 9, nombre: "Hamburguesa con papas", descripcion: "Carne de res, lechuga, tomate", precio: 55, disponible: true },
    { id: 10, nombre: "Hamburguesa sencilla", descripcion: "Sin guarnición", precio: 40, disponible: true },
    { id: 11, nombre: "Hot dog", descripcion: "Con catsup y mostaza", precio: 25, disponible: true },
    { id: 12, nombre: "Papas a la francesa", descripcion: "Porción grande", precio: 20, disponible: true },
    { id: 13, nombre: "Burritos", descripcion: "De frijol o carne", precio: 18, disponible: true },
  ],
  antojitos: [
    { id: 14, nombre: "Taquitos de adobada", descripcion: "3 piezas", precio: 30, disponible: true },
    { id: 15, nombre: "Tacos tuxpeños", descripcion: "3 piezas con salsa", precio: 35, disponible: true },
    { id: 16, nombre: "Sopitos", descripcion: "4 piezas", precio: 28, disponible: true },
    { id: 17, nombre: "Flautas de pollo", descripcion: "3 piezas con crema", precio: 32, disponible: true },
    { id: 18, nombre: "Enchiladas suizas", descripcion: "Con crema y queso", precio: 38, disponible: true },
  ],
  plato_del_dia: [
    { id: 19, nombre: "Guiso del día con agua", descripcion: "Pregunta en caja el guiso de hoy", precio: 50, disponible: true },
    { id: 20, nombre: "Guiso del día sin agua", descripcion: "Solo el plato", precio: 42, disponible: true },
  ],
  sandwiches: [
    { id: 21, nombre: "Sandwich de lomo", descripcion: "Con jitomate y lechuga", precio: 35, disponible: true },
    { id: 22, nombre: "Sandwich de pollo", descripcion: "A la plancha", precio: 35, disponible: true },
    { id: 23, nombre: "Sandwich de panela", descripcion: "Con aguacate", precio: 33, disponible: true },
    { id: 24, nombre: "Sandwich de jamón", descripcion: "Con queso", precio: 30, disponible: true },
  ],
  tortas: [
    { id: 25, nombre: "Torta de lomo", descripcion: "Con frijoles y aguacate", precio: 38, disponible: true },
    { id: 26, nombre: "Torta hawaiana", descripcion: "Con piña y jamón", precio: 40, disponible: true },
    { id: 27, nombre: "Torta cubana", descripcion: "Surtida", precio: 45, disponible: true },
    { id: 28, nombre: "Torta de panela", descripcion: "Con rajas", precio: 35, disponible: true },
    { id: 29, nombre: "Torta de jamón", descripcion: "Clásica", precio: 33, disponible: true },
    { id: 30, nombre: "Medio pachuco sencillo", descripcion: "Torta chica", precio: 22, disponible: true },
    { id: 31, nombre: "Medio pachuco con carne", descripcion: "Torta chica con carne", precio: 28, disponible: true },
  ],
  opciones_ligeras: [
    { id: 32, nombre: "Ensalada de pollo", descripcion: "Con aderezo", precio: 40, disponible: true },
    { id: 33, nombre: "Fruta", descripcion: "De temporada", precio: 20, disponible: true },
    { id: 34, nombre: "Gelatina", descripcion: "Del día", precio: 12, disponible: true },
  ],
  bebidas: [
    { id: 35, nombre: "Agua de sabor", descripcion: "Jamaica, horchata o limón", precio: 12, disponible: true },
    { id: 36, nombre: "Jugo natural de naranja", descripcion: "Vaso grande", precio: 20, disponible: true },
    { id: 37, nombre: "Jugo verde", descripcion: "Pepino, apio, naranja", precio: 22, disponible: true },
    { id: 38, nombre: "Licuado de frutas", descripcion: "Fresa, plátano o mango", precio: 25, disponible: true },
    { id: 39, nombre: "Chocomilk", descripcion: "Vaso frío", precio: 18, disponible: true },
    { id: 40, nombre: "Vaso con leche", descripcion: "Fría o caliente", precio: 15, disponible: true },
    { id: 41, nombre: "Café", descripcion: "Americano o con leche", precio: 14, disponible: true },
    { id: 42, nombre: "Té", descripcion: "Manzanilla, canela o limón", precio: 12, disponible: true },
  ],
};

const horarios = [
  { hora: "07:30", disponible: true, saturado: false },
  { hora: "08:00", disponible: true, saturado: false },
  { hora: "08:30", disponible: true, saturado: true },
  { hora: "09:00", disponible: true, saturado: false },
  { hora: "10:00", disponible: true, saturado: false },
  { hora: "10:30", disponible: false, saturado: false },
  { hora: "11:00", disponible: true, saturado: false },
  { hora: "12:00", disponible: true, saturado: true },
  { hora: "13:00", disponible: true, saturado: false },
  { hora: "14:00", disponible: true, saturado: false },
];

// ── RUTAS ─────────────────────────────────────────────────
app.get('/api/menu', (req, res) => res.json(menu));
app.get('/api/horarios', (req, res) => res.json(horarios));

// Pedidos guardados en memoria (para el prototipo)
let pedidos = [];
let contadorId = 1;

app.post('/api/pedidos', (req, res) => {
  const { productos, horario, personalizacion } = req.body;
  if (!productos || productos.length === 0)
    return res.status(400).json({ error: 'El pedido no puede estar vacío' });
  if (!horario)
    return res.status(400).json({ error: 'Debes seleccionar un horario' });

  const total = productos.reduce((sum, p) => sum + (p.precio * p.cantidad), 0);
  const pedido = {
    id: contadorId++,
    productos,
    horario,
    personalizacion: personalizacion || '',
    total,
    estado: 'recibido',   // recibido → en_preparacion → listo
    creadoEn: new Date().toISOString(),
  };
  pedidos.push(pedido);
  res.status(201).json(pedido);
});

app.get('/api/pedidos', (req, res) => res.json(pedidos));

app.get('/api/pedidos/:id', (req, res) => {
  const pedido = pedidos.find(p => p.id === parseInt(req.params.id));
  if (!pedido) return res.status(404).json({ error: 'Pedido no encontrado' });
  res.json(pedido);
});

app.patch('/api/pedidos/:id/estado', (req, res) => {
  const pedido = pedidos.find(p => p.id === parseInt(req.params.id));
  if (!pedido) return res.status(404).json({ error: 'Pedido no encontrado' });
  pedido.estado = req.body.estado;
  res.json(pedido);
});

app.delete('/api/pedidos/:id', (req, res) => {
  const idx = pedidos.findIndex(p => p.id === parseInt(req.params.id));
  if (idx === -1) return res.status(404).json({ error: 'Pedido no encontrado' });
  if (pedidos[idx].estado !== 'recibido')
    return res.status(400).json({ error: 'No se puede cancelar un pedido en preparación' });
  pedidos.splice(idx, 1);
  res.json({ mensaje: 'Pedido cancelado' });
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`🚀 CaféUCOL API corriendo en http://localhost:${PORT}`));