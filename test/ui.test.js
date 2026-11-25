const { JSDOM } = require('jsdom');
const fs = require('fs');
const path = require('path');

const html = fs.readFileSync(path.join(__dirname, '..', 'index.html'), 'utf8');

const dom = new JSDOM(html, {
    runScripts: 'dangerously',
    resources: 'usable',
    url: 'http://localhost:8000/'
});

const { window } = dom;
const { document } = window;

// Esperar a que los scripts se carguen
setTimeout(() => {
    let exitCode = 0;

    function check(condition, message) {
        if (condition) {
            console.log(`✓ ${message}`);
        } else {
            console.error(`❌ ${message}`);
            exitCode = 1;
        }
    }

    // Verificar menú
    const menuButtons = document.querySelectorAll('#main-menu button');
    check(menuButtons.length === 7, 'Hay 7 botones de menú');

    // Verificar módulo inicial
    const app = document.getElementById('app');
    check(app, 'Contenedor app existe');
    check(app.querySelector('h2'), 'Módulo inicial renderizado');
    check(app.innerHTML.includes('Captura y validación'), 'Módulo inicial es Captura');

    // Simular navegación a Estado de resultados
    const incomeBtn = document.querySelector('[data-module="income"]');
    if (incomeBtn) {
        incomeBtn.click();
        check(app.innerHTML.includes('Estado de resultados'), 'Navegación a Estado de resultados funciona');
        check(app.innerHTML.includes('8,575,000'), 'Ventas netas 2024 renderizadas');
        check(app.innerHTML.includes('9,311,000'), 'Ventas netas 2025 renderizadas');
    }

    // Simular navegación a Razones
    const ratiosBtn = document.querySelector('[data-module="ratios"]');
    if (ratiosBtn) {
        ratiosBtn.click();
        check(app.innerHTML.includes('Razones financieras'), 'Navegación a Razones funciona');
        check(app.innerHTML.includes('Margen de utilidad'), 'Tabla de razones renderizada');
    }

    // Simular navegación a Análisis
    const analysisBtn = document.querySelector('[data-module="analysis"]');
    if (analysisBtn) {
        analysisBtn.click();
        check(app.innerHTML.includes('Análisis horizontal'), 'Navegación a Análisis funciona');
    }

    // Simular navegación a Indicadores
    const indicatorsBtn = document.querySelector('[data-module="indicators"]');
    if (indicatorsBtn) {
        indicatorsBtn.click();
        check(app.innerHTML.includes('Indicadores complementarios'), 'Navegación a Indicadores funciona');
        check(app.innerHTML.includes('Escudo fiscal'), 'Escudo fiscal renderizado');
    }

    console.log('\nPruebas de UI completadas.');
    process.exit(exitCode);
}, 1000);
