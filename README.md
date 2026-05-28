# cafeucol
Menú de cafetería
CaféUCOL — README

2. Descripción general
CaféUCOL es una aplicación web progresiva (PWA) orientada a estudiantes universitarios que permite realizar pedidos de alimentos y bebidas en la cafetería institucional de forma anticipada, reduciendo los tiempos de espera durante los recesos entre clases.
La aplicación permite consultar el menú organizado por categorías definidas mediante card sorting, seleccionar y personalizar productos, elegir un horario de recolección, confirmar el pedido y consultar el historial de pedidos anteriores. Incorpora además un sistema de ludificación con CaféCoins, rachas diarias y logros desbloqueables para motivar el uso frecuente y el pedido anticipado.

3. Materia, profesor e integrantes
CampoDatoMateriaInteracción Humano-ComputadoraProfesorPedro SantanaFacultadUniversidad de ColimaIntegrante 1Diego SanchezIntegrante 2Diego AlfonsoIntegrante 3Jose Juan Melquiades

4. Tecnologías y versiones utilizadas
Frontend
TecnologíaVersiónReact18.xVite5.xReact Router DOM6.xAxios1.xNode.jsv22.22.2npm10.9.7
Backend
TecnologíaVersiónNode.jsv22.22.2Express4.xCORS2.xNodemon3.x (desarrollo)
Despliegue
HerramientaUsoGit + GitHubControl de versionesVercelDespliegue del frontendRenderDespliegue del backend

5. Instrucciones para instalar y ejecutar
Requisitos previos

Node.js v18 o superior
npm v9 o superior
Git instalado

Clonar el repositorio
bashgit clone https://github.com/tu-usuario/cafeucol.git
cd cafeucol
Ejecutar el backend
bashcd backend
npm install
npm run dev
# Servidor en http://localhost:3001
Verifica que funciona abriendo en el navegador:
http://localhost:3001/api/menu
http://localhost:3001/api/horarios
Ejecutar el frontend
Abre una segunda terminal (deja el backend corriendo):
bashcd frontend
npm install
npm run dev
# App en http://localhost:5173
Estructura de carpetas
cafeucol/
├── backend/
│   ├── src/
│   │   └── index.js          ← API Express
│   └── package.json
├── frontend/
│   ├── public/
│   │   └── images/           ← Imágenes de productos
│   ├── src/
│   │   ├── components/       ← Sidebar, Topbar, Stepper, etc.
│   │   ├── context/          ← Estado global (carrito, puntos, toasts)
│   │   ├── pages/            ← Menu, Carrito, Horario, Confirmacion, Historial, Perfil
│   │   └── App.jsx
│   └── package.json
└── README.md

6. Enlace al prototipo funcional

URL: [Agregar enlace de Vercel/Netlify después del despliegue]


7. Funcionalidades implementadas
Consulta del menú

Menú organizado en 8 categorías definidas por card sorting: Desayunos, Comida Rápida, Antojitos, Plato del Día, Sandwiches, Tortas, Opciones Ligeras y Bebidas
Filtrado por categoría con chips interactivos
Búsqueda en tiempo real por nombre o descripción
Botón "Ver menú completo" con modal que lista todos los productos
Soporte de imágenes por producto con fallback automático a emoji

Creación de pedido

Selección de productos con controles de cantidad +/−
Resumen con subtotales y total en tiempo real
Feedback visual inmediato (toast) al agregar o quitar productos

Personalización

Campo de texto por producto para indicar preferencias (ej. sin cebolla, sin chile)

Selección de horario

Cuadrícula de horarios con indicadores de color (verde = disponible, rojo = saturado)
Mensajes de error amables y constructivos según guías NNG, aparecen junto al selector

Confirmación del pedido

Resumen completo antes de enviar: productos, notas, horario y total
Modal de confirmación antes de enviar para prevenir errores
Pantalla de éxito con número de pedido y CaféCoins ganados

Historial de pedidos

Lista con filtros: Todos, Activos, Completados
Barra de progreso: Recibido → En preparación → Listo
Cancelación de pedidos con confirmación previa

Ludificación

CaféCoins: +10 por pedido completado, +20 por pedido anticipado
Rachas diarias con indicador 🔥
6 logros desbloqueables con notificación toast al conseguirlos
Niveles: Nuevo Cliente → Cliente Regular → Favorito → VIP ⭐
Barra de progreso hacia el siguiente nivel

Accesibilidad y usabilidad

Diseño responsivo: sidebar en escritorio, bottom nav + menú hamburguesa en móvil
Contraste WCAG 2.1 Nivel AA
Roles ARIA y aria-label en elementos interactivos
Modales de confirmación para acciones destructivas
Stepper de 4 pasos visible durante el flujo de pedido


8. Declaración de uso de inteligencia artificial
El equipo utilizó herramientas de inteligencia artificial como apoyo durante el desarrollo del proyecto.
HerramientaPara qué se utilizó
Revisión del equipoClaude (Anthropic)Apoyo para la generación de código del frontend (React) y backend (Express), , CSS responsivo, reporte de guías de diseño y documentación README
Todo el código fue revisado, probado y ajustado por el equipo. Las decisiones de diseño (card sorting, gamificación, guías) fueron definidas por los integrantes
