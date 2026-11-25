const express = require('express');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 8000;

// Servir archivos estáticos desde la raíz del proyecto
app.use(express.static(path.join(__dirname)));

// Ruta de salud del backend
app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', app: 'Altamira Financiero', timestamp: new Date().toISOString() });
});

// Cualquier otra ruta va al frontend SPA
app.use((req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

app.listen(PORT, () => {
    console.log(`🚀 Altamira Financiero corriendo en http://localhost:${PORT}`);
});
