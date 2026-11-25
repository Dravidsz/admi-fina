const fs = require('fs');
const vm = require('vm');
const path = require('path');

// Simular localStorage
const storage = {};
const localStorageMock = {
    getItem: (key) => storage[key] || null,
    setItem: (key, value) => { storage[key] = value; },
    removeItem: (key) => { delete storage[key]; }
};

// Simular document/window para que los scripts no fallen al cargar
const sandbox = {
    localStorage: localStorageMock,
    document: { addEventListener: () => {} },
    window: {},
    console,
    JSON,
    Math,
    parseFloat,
    parseInt,
    isNaN,
    Array,
    Object,
    String,
    Number,
    Date,
    RegExp,
    Error,
    Set,
    Map
};

const context = vm.createContext(sandbox);

function runFile(file) {
    const code = fs.readFileSync(path.join(__dirname, '..', file), 'utf8');
    vm.runInContext(code, context);
}

runFile('js/data.js');
runFile('js/engine.js');

const data = context.loadData();
const accounts = data.accounts;
const params = data.params;

function assertApprox(actual, expected, message, tolerance = 0.5) {
    const diff = Math.abs(actual - expected);
    if (diff > tolerance) {
        console.error(`❌ ${message}: esperado ${expected}, obtenido ${actual}, dif ${diff}`);
        process.exitCode = 1;
    } else {
        console.log(`✓ ${message}: ${actual} (esperado ${expected})`);
    }
}

function assertExact(actual, expected, message) {
    if (Math.abs(actual - expected) > 0.005) {
        console.error(`❌ ${message}: esperado ${expected}, obtenido ${actual}`);
        process.exitCode = 1;
    } else {
        console.log(`✓ ${message}: ${actual}`);
    }
}

console.log('\n--- Estado de resultados 2024 ---');
const inc24 = context.calcIncomeStatement(accounts, params, 2024);
assertExact(inc24.ventasNetas, 8575000, 'Ventas netas 2024');
assertExact(inc24.costoVentas, 5573000, 'Costo de ventas 2024');
assertExact(inc24.utilidadBruta, 3002000, 'Utilidad bruta 2024');
assertExact(inc24.uaii, 783000, 'UAII 2024');
assertExact(inc24.uai, 611000, 'UAI 2024');
assertExact(inc24.isr, 152750, 'ISR 2024');
assertExact(inc24.utilidadNeta, 458250, 'Utilidad neta 2024');

console.log('\n--- Estado de resultados 2025 ---');
const inc25 = context.calcIncomeStatement(accounts, params, 2025);
assertExact(inc25.ventasNetas, 9311000, 'Ventas netas 2025');
assertExact(inc25.costoVentas, 6271000, 'Costo de ventas 2025');
assertExact(inc25.utilidadBruta, 3040000, 'Utilidad bruta 2025');
assertExact(inc25.uaii, 518000, 'UAII 2025');
assertExact(inc25.uai, 278000, 'UAI 2025');
assertExact(inc25.isr, 69500, 'ISR 2025');
assertExact(inc25.utilidadNeta, 208500, 'Utilidad neta 2025');

console.log('\n--- Balance 2025 ---');
const bal25 = context.calcBalance(accounts, params, 2025);
assertExact(bal25.totalActivos, 7793750, 'Total activos 2025');
assertExact(bal25.totalPasivosCapital, 7793750, 'Total pasivos + capital 2025');
assertExact(bal25.diferencia, 0, 'Balance cuadrado');
assertExact(bal25.retenidasCierre, 2101750, 'Retenidas cierre 2025');

console.log('\n--- Flujo de efectivo ---');
const cf = context.calcCashFlow(accounts, params);
assertExact(cf[2024].op.operacion, 734250, 'Flujo operación 2024');
assertExact(cf[2024].flujoLibre, 227250, 'Flujo libre 2024');
assertExact(cf[2025].op.operacion, 194500, 'Flujo operación 2025');
assertExact(cf[2025].inv.inversion, -775000, 'Flujo inversión 2025');
assertExact(cf[2025].fin.financiamiento, 481000, 'Flujo financiamiento 2025');
assertExact(cf[2025].flujoLibre, -669500, 'Flujo libre 2025');
assertExact(cf[2025].cajaFin, 337750, 'Caja final 2025');

console.log('\n--- Razones financieras ---');
const ratios = context.calcRatios(accounts, params);
assertApprox(ratios[2024].margenUtilidad.value * 100, 5.34, 'Margen 2024 %', 0.01);
assertApprox(ratios[2025].margenUtilidad.value * 100, 2.24, 'Margen 2025 %', 0.01);
assertApprox(ratios[2024].roa.value * 100, 6.56, 'ROA 2024 %', 0.01);
assertApprox(ratios[2025].roa.value * 100, 2.68, 'ROA 2025 %', 0.01);
assertApprox(ratios[2024].roe.value * 100, 13.57, 'ROE 2024 %', 0.01);
assertApprox(ratios[2025].roe.value * 100, 5.95, 'ROE 2025 %', 0.01);
assertApprox(ratios[2025].ppc.value, 50.07, 'PPC 2025', 0.01);
assertApprox(ratios[2025].rotacionCxc.value, 7.19, 'Rotación CxC 2025', 0.01);

console.log('\n--- Du Pont ---');
const dupont = context.calcDuPont(accounts, params);
assertApprox(dupont.aportes.margen * 100, -7.89, 'Aporte margen Du Pont', 0.01);
assertApprox(dupont.aportes.rotacion * 100, -0.15, 'Aporte rotación Du Pont', 0.01);
assertApprox(dupont.aportes.apalancamiento * 100, 0.42, 'Aporte apalancamiento Du Pont', 0.01);
assertApprox(dupont.aportes.total * 100, -7.62, 'Variación total ROE', 0.01);

console.log('\n--- Indicadores complementarios ---');
const indicators = context.calcIndicators(accounts, params);
assertExact(indicators.escudo.total, 106500, 'Escudo fiscal total');
assertExact(indicators.ventasProducto.total, 9540000, 'Ventas por producto');
assertExact(indicators.ventasProducto.diff, 0, 'Diferencia ventas producto');
assertApprox(indicators.costoCredito.ppcReal, 50.07, 'PPC real 2025', 0.01);
assertApprox(indicators.costoCredito.capitalInmovilizado, 131125, 'Capital inmovilizado', 0.5);

console.log('\n--- Validación ---');
const validation = context.validate(accounts, params);
const success = validation.alerts.some(a => a.type === 'success');
if (success) {
    console.log('✓ Validación exitosa');
} else {
    console.error('❌ Validación fallida:', validation.alerts);
    process.exitCode = 1;
}

console.log('\n--- Simulaciones del caso ---');

// Simulación de descuadre visible
const descData = JSON.parse(JSON.stringify(data));
descData.accounts.find(a => a.id === 10).debe_2025 += 100000;
const descVal = context.validate(descData.accounts, descData.params);
const descBalanza = descVal.alerts.some(a => a.type === 'danger' && a.message.includes('Balanza') && a.message.includes('100,000'));
const descBalance = descVal.alerts.some(a => a.type === 'danger' && a.message.includes('Balance') && a.message.includes('100,000'));
if (descBalanza && descBalance) {
    console.log('✓ Descuadre visible detectado');
} else {
    console.error('❌ Descuadre visible no detectado correctamente');
    process.exitCode = 1;
}

// Simulación de cobro
const cobroData = JSON.parse(JSON.stringify(data));
cobroData.accounts.find(a => a.id === 10).debe_2025 += 100000;
cobroData.accounts.find(a => a.id === 5).debe_2025 -= 100000;
const cobroRatios = context.calcRatios(cobroData.accounts, cobroData.params);
const cobroCf = context.calcCashFlow(cobroData.accounts, cobroData.params);
assertApprox(cobroRatios[2025].rotacionCxc.value, 6.67, 'Rotación CxC simulación cobro', 0.01);
assertApprox(cobroRatios[2025].ppc.value, 53.94, 'PPC simulación cobro', 0.01);
assertExact(cobroCf[2025].op.operacion, 94500, 'Flujo operación simulación cobro');
assertExact(cobroCf[2025].cajaFin, 237750, 'Caja final simulación cobro');

// Simulación de intereses
const intData = JSON.parse(JSON.stringify(data));
intData.accounts.find(a => a.id === 25).debe_2025 += 10000;
intData.accounts.find(a => a.id === 5).debe_2025 -= 7500;
intData.accounts.find(a => a.id === 28).haber_2025 -= 2500;
const intInc = context.calcIncomeStatement(intData.accounts, intData.params, 2025);
const intBal = context.calcBalance(intData.accounts, intData.params, 2025);
const intRatios = context.calcRatios(intData.accounts, intData.params);
assertExact(intInc.uaii, 518000, 'UAII simulación intereses');
assertExact(intInc.isr, 67000, 'ISR simulación intereses');
assertExact(intInc.utilidadNeta, 201000, 'Utilidad neta simulación intereses');
assertExact(intBal.caja, 330250, 'Caja simulación intereses');
assertApprox(intRatios[2025].rotacionInteresGanado.value, 2.31, 'Cobertura intereses simulación', 0.01);
assertApprox(intRatios[2025].coberturaCargosFijos.value, 1.77, 'Cobertura cargos fijos simulación', 0.01);

console.log('\nPruebas completadas.');
