# Industrias Plásticas Altamira, S.A. — Aplicativo Financiero

Aplicativo web de análisis financiero para el caso de examen parcial n.º 3 de Administración Financiera.

## Tecnología

- HTML5, CSS3 y JavaScript vanilla (sin dependencias de servidor).
- Persistencia local mediante `localStorage`.
- Gráficos nativos con Canvas API.

## Ejecución

### Opción recomendada: `npm run dev`

```bash
npm install
npm run dev
```

Esto inicia el servidor Express con nodemon en http://localhost:8000. El servidor sirve el frontend y expone un endpoint de salud en `/api/health`.

### Producción

```bash
npm start
```

### Opción alternativa: servidor Python

```bash
python3 -m http.server 8000
```

### Opción directa

Abrir `index.html` en cualquier navegador moderno (Chrome, Firefox, Edge).

## Estructura

```
├── index.html          # Menú principal y contenedores
├── css/styles.css      # Estilos
├── js/
│   ├── data.js         # Catálogo de cuentas y parámetros base
│   ├── engine.js       # Motor de cálculo financiero
│   ├── charts.js       # Gráficos de canvas
│   └── app.js          # Interfaz y navegación
├── test/
│   ├── engine.test.js  # Pruebas del motor de cálculo
│   └── ui.test.js      # Pruebas básicas de interfaz
└── README.md
```

## Módulos

1. **Captura y validación**: edición de los 50 saldos de la balanza y parámetros; alertas de descuadre.
2. **Estado de resultados**: del cierre 2024 y 2025 con utilidad por acción.
3. **Balance comparativo**: activos, pasivos, capital y conciliación de retenidas.
4. **Flujo de efectivo**: método indirecto, operación, inversión, financiamiento y flujo libre.
5. **Razones y Du Pont**: 13 razones financieras con semáforo y descomposición Du Pont.
6. **Análisis horizontal y vertical**: variaciones absolutas, porcentuales y dos gráficos.
7. **Indicadores complementarios**: escudo fiscal, costo después de ISR, P/U, ventas por producto, utilidad vs. flujo, Du Pont y costo del crédito.

## Pruebas

```bash
npm install
npm test        # Motor de cálculo
npm run test-ui # Interfaz con jsdom
```

## Datos de entrada

Los datos base provienen del caso Altamira (2023-2025). El usuario puede editar cualquier cuenta y recalcular todos los estados en tiempo real.

## Licencia

Proyecto académico — UTP, Licenciatura en Gestión y Desarrollo de Software.
