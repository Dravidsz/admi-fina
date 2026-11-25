let appData = loadData();
let currentModule = 'capture';

function init() {
    renderMenu();
    loadModule('capture');
}

function renderMenu() {
    document.querySelectorAll('#main-menu button').forEach(btn => {
        btn.addEventListener('click', () => {
            loadModule(btn.dataset.module);
        });
    });
}

function loadModule(moduleName) {
    currentModule = moduleName;
    document.querySelectorAll('#main-menu button').forEach(btn => {
        btn.classList.toggle('active', btn.dataset.module === moduleName);
    });

    const app = document.getElementById('app');
    app.innerHTML = '';

    switch (moduleName) {
        case 'capture': renderCapture(app); break;
        case 'income': renderIncomeStatement(app); break;
        case 'balance': renderBalance(app); break;
        case 'cashflow': renderCashFlow(app); break;
        case 'ratios': renderRatios(app); break;
        case 'analysis': renderAnalysis(app); break;
        case 'indicators': renderIndicators(app); break;
    }
}

function createModuleHeader(title) {
    const div = document.createElement('div');
    div.className = 'module';
    div.innerHTML = `<h2>${title}</h2>`;
    return div;
}

function renderAlerts(container, validation) {
    validation.alerts.forEach(alert => {
        const div = document.createElement('div');
        div.className = `alert alert-${alert.type}`;
        div.innerHTML = `<span>${alert.type === 'success' ? '✓' : alert.type === 'danger' ? '✕' : '⚠'}</span><span>${alert.message}</span>`;
        container.appendChild(div);
    });
}

function renderCapture(container) {
    const validation = validate(appData.accounts, appData.params);
    const div = createModuleHeader('1. Captura y validación de datos');
    container.appendChild(div);

    renderAlerts(div, validation);

    const summary = document.createElement('div');
    summary.className = 'grid-2';
    summary.innerHTML = `
        <div class="card">
            <h3>Resumen balanza 2025</h3>
            <p><strong>Total Debe:</strong> ${fmtMoney(validation.debe2025)}</p>
            <p><strong>Total Haber:</strong> ${fmtMoney(validation.haber2025)}</p>
            <p><strong>Diferencia:</strong> ${fmtMoney(validation.balanzaDiff)}</p>
        </div>
        <div class="card">
            <h3>Resumen balance 2025</h3>
            <p><strong>Total activos:</strong> ${fmtMoney(calcBalance(appData.accounts, appData.params, 2025).totalActivos)}</p>
            <p><strong>Pasivos + capital:</strong> ${fmtMoney(calcBalance(appData.accounts, appData.params, 2025).totalPasivosCapital)}</p>
            <p><strong>Diferencia:</strong> ${fmtMoney(validation.balanceDiff)}</p>
        </div>
    `;
    div.appendChild(summary);

    const actions = document.createElement('div');
    actions.style.marginBottom = '1rem';
    actions.innerHTML = `
        <button class="btn btn-primary" id="save-capture">Guardar cambios</button>
        <button class="btn btn-secondary" id="reset-capture">Restaurar caso base</button>
        <button class="btn btn-secondary" id="export-capture">Exportar CSV</button>
        <input type="file" id="import-capture" accept=".csv" style="display:none">
        <button class="btn btn-secondary" id="import-capture-btn">Importar CSV</button>
    `;
    div.appendChild(actions);

    const tableWrapper = document.createElement('div');
    tableWrapper.className = 'table-responsive';
    tableWrapper.innerHTML = `
        <table>
            <thead>
                <tr>
                    <th>ID</th>
                    <th>Cuenta</th>
                    <th>Grupo</th>
                    <th>Saldo 2023</th>
                    <th>Saldo 2024</th>
                    <th>Debe 2025</th>
                    <th>Haber 2025</th>
                </tr>
            </thead>
            <tbody id="accounts-body"></tbody>
        </table>
    `;
    div.appendChild(tableWrapper);

    const tbody = tableWrapper.querySelector('#accounts-body');
    appData.accounts.forEach(acc => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td>${acc.id}</td>
            <td>${acc.cuenta}</td>
            <td>${acc.grupo}</td>
            <td><input type="number" data-id="${acc.id}" data-year="2023" value="${acc.saldo_2023 !== null && acc.saldo_2023 !== undefined ? acc.saldo_2023 : ''}"></td>
            <td><input type="number" data-id="${acc.id}" data-year="2024" value="${acc.saldo_2024 !== null && acc.saldo_2024 !== undefined ? acc.saldo_2024 : ''}"></td>
            <td><input type="number" data-id="${acc.id}" data-year="2025" data-side="debe" value="${acc.debe_2025 || ''}"></td>
            <td><input type="number" data-id="${acc.id}" data-year="2025" data-side="haber" value="${acc.haber_2025 || ''}"></td>
        `;
        tbody.appendChild(tr);
    });

    const paramsDiv = document.createElement('div');
    paramsDiv.className = 'module';
    paramsDiv.innerHTML = `<h2>Parámetros del caso</h2>`;
    paramsDiv.innerHTML += `
        <div class="form-row">
            <div class="form-group"><label>Acciones comunes</label><input type="number" id="param-acciones" value="${appData.params.acciones}"></div>
            <div class="form-group"><label>Valor nominal</label><input type="number" id="param-valor-nominal" value="${appData.params.valor_nominal}"></div>
            <div class="form-group"><label>ISR (%)</label><input type="number" id="param-isr" value="${(appData.params.isr * 100).toFixed(2)}"></div>
            <div class="form-group"><label>Días comerciales</label><input type="number" id="param-dias" value="${appData.params.dias_comerciales}"></div>
        </div>
        <h3>Productos 2025</h3>
        <div class="form-row">
            <div class="form-group"><label>Unidades garrafones</label><input type="number" id="param-garrafones-u" value="${appData.params.productos.garrafones.unidades}"></div>
            <div class="form-group"><label>Precio garrafón</label><input type="number" id="param-garrafones-p" value="${appData.params.productos.garrafones.precio}"></div>
            <div class="form-group"><label>Unidades cubetas</label><input type="number" id="param-cubetas-u" value="${appData.params.productos.cubetas.unidades}"></div>
            <div class="form-group"><label>Precio cubeta</label><input type="number" id="param-cubetas-p" value="${appData.params.productos.cubetas.precio}"></div>
        </div>
        <h3>Precio de mercado por acción</h3>
        <div class="form-row">
            <div class="form-group"><label>Precio 2024</label><input type="number" id="param-precio-2024" value="${appData.params.precio_mercado_2024 || ''}"></div>
            <div class="form-group"><label>Precio 2025</label><input type="number" id="param-precio-2025" value="${appData.params.precio_mercado_2025 || ''}"></div>
        </div>
    `;
    container.appendChild(paramsDiv);

    document.getElementById('save-capture').addEventListener('click', () => {
        saveCaptureData();
        loadModule('capture');
    });
    document.getElementById('reset-capture').addEventListener('click', () => {
        if (confirm('¿Restaurar el caso base? Se perderán los cambios.')) {
            appData = resetData();
            loadModule('capture');
        }
    });
    document.getElementById('export-capture').addEventListener('click', exportCSV);
    document.getElementById('import-capture-btn').addEventListener('click', () => {
        document.getElementById('import-capture').click();
    });
    document.getElementById('import-capture').addEventListener('change', importCSV);
}

function saveCaptureData() {
    document.querySelectorAll('#accounts-body input').forEach(input => {
        const id = parseInt(input.dataset.id);
        const year = parseInt(input.dataset.year);
        const side = input.dataset.side;
        const val = input.value === '' ? 0 : parseFloat(input.value);
        const acc = appData.accounts.find(a => a.id === id);
        if (year === 2023) acc.saldo_2023 = val || null;
        else if (year === 2024) acc.saldo_2024 = val || null;
        else if (year === 2025) {
            if (side === 'debe') acc.debe_2025 = val;
            else acc.haber_2025 = val;
        }
    });

    appData.params.acciones = parseFloat(document.getElementById('param-acciones').value) || 0;
    appData.params.valor_nominal = parseFloat(document.getElementById('param-valor-nominal').value) || 0;
    appData.params.isr = (parseFloat(document.getElementById('param-isr').value) || 0) / 100;
    appData.params.dias_comerciales = parseFloat(document.getElementById('param-dias').value) || 360;
    appData.params.productos.garrafones.unidades = parseFloat(document.getElementById('param-garrafones-u').value) || 0;
    appData.params.productos.garrafones.precio = parseFloat(document.getElementById('param-garrafones-p').value) || 0;
    appData.params.productos.cubetas.unidades = parseFloat(document.getElementById('param-cubetas-u').value) || 0;
    appData.params.productos.cubetas.precio = parseFloat(document.getElementById('param-cubetas-p').value) || 0;
    appData.params.precio_mercado_2024 = document.getElementById('param-precio-2024').value || '';
    appData.params.precio_mercado_2025 = document.getElementById('param-precio-2025').value || '';

    saveData(appData);
}

function exportCSV() {
    let csv = 'id,cuenta,grupo,naturaleza,saldo_2023,saldo_2024,debe_2025,haber_2025\n';
    appData.accounts.forEach(a => {
        csv += `${a.id},"${a.cuenta}",${a.grupo},${a.naturaleza},${a.saldo_2023 !== null && a.saldo_2023 !== undefined ? a.saldo_2023 : ''},${a.saldo_2024 !== null && a.saldo_2024 !== undefined ? a.saldo_2024 : ''},${a.debe_2025 || 0},${a.haber_2025 || 0}\n`;
    });
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'altamira_cuentas.csv';
    a.click();
    URL.revokeObjectURL(url);
}

function importCSV(event) {
    const file = event.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (e) => {
        const text = e.target.result;
        const lines = text.split('\n').filter(line => line.trim());
        const headers = lines[0].split(',').map(h => h.trim());
        const idIdx = headers.indexOf('id');
        const s23Idx = headers.indexOf('saldo_2023');
        const s24Idx = headers.indexOf('saldo_2024');
        const debeIdx = headers.indexOf('debe_2025');
        const haberIdx = headers.indexOf('haber_2025');

        if (idIdx < 0 || debeIdx < 0 || haberIdx < 0) {
            alert('CSV no tiene las columnas requeridas: id, debe_2025, haber_2025');
            return;
        }

        for (let i = 1; i < lines.length; i++) {
            const cols = lines[i].split(',');
            const id = parseInt(cols[idIdx]);
            const acc = appData.accounts.find(a => a.id === id);
            if (acc) {
                if (s23Idx >= 0) acc.saldo_2023 = cols[s23Idx] ? parseFloat(cols[s23Idx]) : null;
                if (s24Idx >= 0) acc.saldo_2024 = cols[s24Idx] ? parseFloat(cols[s24Idx]) : null;
                acc.debe_2025 = parseFloat(cols[debeIdx]) || 0;
                acc.haber_2025 = parseFloat(cols[haberIdx]) || 0;
            }
        }
        saveData(appData);
        loadModule('capture');
        alert('CSV importado correctamente');
    };
    reader.readAsText(file);
}

function renderIncomeStatement(container) {
    const inc24 = calcIncomeStatement(appData.accounts, appData.params, 2024);
    const inc25 = calcIncomeStatement(appData.accounts, appData.params, 2025);
    const div = createModuleHeader('2. Estado de resultados comparativo');
    container.appendChild(div);

    const table = document.createElement('div');
    table.className = 'table-responsive';
    table.innerHTML = `
        <table>
            <thead>
                <tr><th>Partida</th><th>2024</th><th>2025</th></tr>
            </thead>
            <tbody>
                <tr><td>Ventas brutas</td><td>${fmtMoney(inc24.ventasBrutas)}</td><td>${fmtMoney(inc25.ventasBrutas)}</td></tr>
                <tr><td>Devoluciones y descuentos</td><td>${fmtMoney(inc24.devoluciones)}</td><td>${fmtMoney(inc25.devoluciones)}</td></tr>
                <tr class="subtotal"><td>Ventas netas</td><td>${fmtMoney(inc24.ventasNetas)}</td><td>${fmtMoney(inc25.ventasNetas)}</td></tr>
                <tr><td>Costo de materiales</td><td>${fmtMoney(inc24.costoMateriales)}</td><td>${fmtMoney(inc25.costoMateriales)}</td></tr>
                <tr><td>Mano de obra directa</td><td>${fmtMoney(inc24.manoObra)}</td><td>${fmtMoney(inc25.manoObra)}</td></tr>
                <tr><td>Costos indirectos</td><td>${fmtMoney(inc24.cif)}</td><td>${fmtMoney(inc25.cif)}</td></tr>
                <tr class="subtotal"><td>Costo de ventas</td><td>${fmtMoney(inc24.costoVentas)}</td><td>${fmtMoney(inc25.costoVentas)}</td></tr>
                <tr class="subtotal"><td>Utilidad bruta</td><td>${fmtMoney(inc24.utilidadBruta)}</td><td>${fmtMoney(inc25.utilidadBruta)}</td></tr>
                <tr><td>Gastos de operación</td><td>${fmtMoney(inc24.gastosOperativos)}</td><td>${fmtMoney(inc25.gastosOperativos)}</td></tr>
                <tr class="subtotal"><td>Utilidad de operación (UAII)</td><td>${fmtMoney(inc24.uaii)}</td><td>${fmtMoney(inc25.uaii)}</td></tr>
                <tr><td>Ingresos financieros</td><td>${fmtMoney(inc24.ingresosFinancieros)}</td><td>${fmtMoney(inc25.ingresosFinancieros)}</td></tr>
                <tr><td>Gastos por intereses</td><td>${fmtMoney(-inc24.intereses)}</td><td>${fmtMoney(-inc25.intereses)}</td></tr>
                <tr><td>Pérdidas extraordinarias</td><td>${fmtMoney(-inc24.perdidasExtra)}</td><td>${fmtMoney(-inc25.perdidasExtra)}</td></tr>
                <tr class="subtotal"><td>Utilidad antes de impuestos</td><td>${fmtMoney(inc24.uai)}</td><td>${fmtMoney(inc25.uai)}</td></tr>
                <tr><td>ISR del periodo</td><td>${fmtMoney(-inc24.isr)}</td><td>${fmtMoney(-inc25.isr)}</td></tr>
                <tr class="total"><td>Utilidad neta</td><td>${fmtMoney(inc24.utilidadNeta)}</td><td>${fmtMoney(inc25.utilidadNeta)}</td></tr>
                <tr><td>Utilidad por acción</td><td>${fmtMoney(inc24.upa)}</td><td>${fmtMoney(inc25.upa)}</td></tr>
            </tbody>
        </table>
    `;
    div.appendChild(table);
}

function renderBalance(container) {
    const bal24 = calcBalance(appData.accounts, appData.params, 2024);
    const bal25 = calcBalance(appData.accounts, appData.params, 2025);
    const div = createModuleHeader('3. Balance general comparativo');
    container.appendChild(div);

    const table = document.createElement('div');
    table.className = 'table-responsive';
    table.innerHTML = `
        <table>
            <thead><tr><th>Partida</th><th>2024</th><th>2025</th></tr></thead>
            <tbody>
                <tr class="subtotal"><td colspan="3"><strong>Activos</strong></td></tr>
                <tr><td>Caja y bancos</td><td>${fmtMoney(bal24.caja)}</td><td>${fmtMoney(bal25.caja)}</td></tr>
                <tr><td>Valores negociables</td><td>${fmtMoney(bal24.valoresNegociables)}</td><td>${fmtMoney(bal25.valoresNegociables)}</td></tr>
                <tr><td>Cuentas por cobrar netas</td><td>${fmtMoney(bal24.cxcNetas)}</td><td>${fmtMoney(bal25.cxcNetas)}</td></tr>
                <tr><td>Inventario total</td><td>${fmtMoney(bal24.inventarioTotal)}</td><td>${fmtMoney(bal25.inventarioTotal)}</td></tr>
                <tr><td>Gastos pagados por anticipado</td><td>${fmtMoney(bal24.pagosAnticipados)}</td><td>${fmtMoney(bal25.pagosAnticipados)}</td></tr>
                <tr class="subtotal"><td>Activos circulantes</td><td>${fmtMoney(bal24.activoCirculante)}</td><td>${fmtMoney(bal25.activoCirculante)}</td></tr>
                <tr><td>Activos fijos netos</td><td>${fmtMoney(bal24.activoFijoNeto)}</td><td>${fmtMoney(bal25.activoFijoNeto)}</td></tr>
                <tr><td>Otros activos netos</td><td>${fmtMoney(bal24.otrosActivosNetos)}</td><td>${fmtMoney(bal25.otrosActivosNetos)}</td></tr>
                <tr class="total"><td>Total activos</td><td>${fmtMoney(bal24.totalActivos)}</td><td>${fmtMoney(bal25.totalActivos)}</td></tr>
                <tr class="subtotal"><td colspan="3"><strong>Pasivos y capital</strong></td></tr>
                <tr><td>Pasivos circulantes</td><td>${fmtMoney(bal24.pasivoCirculante)}</td><td>${fmtMoney(bal25.pasivoCirculante)}</td></tr>
                <tr><td>Pasivos a largo plazo</td><td>${fmtMoney(bal24.pasivoLargoPlazo)}</td><td>${fmtMoney(bal25.pasivoLargoPlazo)}</td></tr>
                <tr class="subtotal"><td>Total pasivos</td><td>${fmtMoney(bal24.totalPasivos)}</td><td>${fmtMoney(bal25.totalPasivos)}</td></tr>
                <tr><td>Capital contable</td><td>${fmtMoney(bal24.capitalContable)}</td><td>${fmtMoney(bal25.capitalContable)}</td></tr>
                <tr class="total"><td>Total pasivos y capital</td><td>${fmtMoney(bal24.totalPasivosCapital)}</td><td>${fmtMoney(bal25.totalPasivosCapital)}</td></tr>
                <tr class="subtotal"><td colspan="3"><strong>Conciliación utilidades retenidas</strong></td></tr>
                <tr><td>Retenidas al inicio</td><td>${fmtMoney(bal24.retenidasInicio)}</td><td>${fmtMoney(bal25.retenidasInicio)}</td></tr>
                <tr><td>Utilidad neta</td><td>${fmtMoney(bal24.incomeStatement.utilidadNeta)}</td><td>${fmtMoney(bal25.incomeStatement.utilidadNeta)}</td></tr>
                <tr><td>Dividendos declarados</td><td>${fmtMoney(bal24.dividendosDeclarados)}</td><td>${fmtMoney(bal25.dividendosDeclarados)}</td></tr>
                <tr class="total"><td>Retenidas al cierre</td><td>${fmtMoney(bal24.retenidasCierre)}</td><td>${fmtMoney(bal25.retenidasCierre)}</td></tr>
            </tbody>
        </table>
    `;
    div.appendChild(table);
}

function renderCashFlow(container) {
    const cf = calcCashFlow(appData.accounts, appData.params);
    const div = createModuleHeader('4. Estado de flujo de efectivo (método indirecto)');
    container.appendChild(div);

    [2024, 2025].forEach(year => {
        const ycf = cf[year];
        const section = document.createElement('div');
        section.className = 'module';
        section.innerHTML = `<h3>Año ${year}</h3>`;
        section.innerHTML += `
            <div class="table-responsive">
                <table>
                    <thead><tr><th>Concepto</th><th>USD</th></tr></thead>
                    <tbody>
                        <tr class="subtotal"><td colspan="2"><strong>Actividades de operación</strong></td></tr>
                        <tr><td>Utilidad neta</td><td>${fmtMoney(ycf.op.utilidadNeta)}</td></tr>
                        <tr><td>Depreciación</td><td>${fmtMoney(ycf.op.depreciacion)}</td></tr>
                        <tr><td>Amortización de intangibles</td><td>${fmtMoney(ycf.op.amortizacion)}</td></tr>
                        <tr><td>Variación cuentas por cobrar netas</td><td>${fmtMoney(ycf.op.deltaCartera)}</td></tr>
                        <tr><td>Variación de inventarios</td><td>${fmtMoney(ycf.op.deltaInventario)}</td></tr>
                        <tr><td>Variación de pagos anticipados</td><td>${fmtMoney(ycf.op.deltaAnticipados)}</td></tr>
                        <tr><td>Variación de proveedores</td><td>${fmtMoney(ycf.op.deltaProveedores)}</td></tr>
                        <tr><td>Variación gastos acumulados</td><td>${fmtMoney(ycf.op.deltaGastosAcum)}</td></tr>
                        <tr><td>Variación ISR por pagar</td><td>${fmtMoney(ycf.op.deltaIsrPorPagar)}</td></tr>
                        <tr class="total"><td>Flujo neto de operación</td><td>${fmtMoney(ycf.op.operacion)}</td></tr>
                        <tr class="subtotal"><td colspan="2"><strong>Actividades de inversión</strong></td></tr>
                        <tr><td>Compra de activos fijos</td><td>${fmtMoney(ycf.inv.compraFijos)}</td></tr>
                        <tr><td>Compra de intangibles</td><td>${fmtMoney(ycf.inv.compraIntangibles)}</td></tr>
                        <tr><td>Venta neta de valores negociables</td><td>${fmtMoney(ycf.inv.deltaValoresNeg)}</td></tr>
                        <tr><td>Movimiento neto inversiones a largo plazo</td><td>${fmtMoney(ycf.inv.deltaInvLargo)}</td></tr>
                        <tr class="total"><td>Flujo neto de inversión</td><td>${fmtMoney(ycf.inv.inversion)}</td></tr>
                        <tr class="subtotal"><td colspan="2"><strong>Actividades de financiamiento</strong></td></tr>
                        <tr><td>Aumento documentos por pagar</td><td>${fmtMoney(ycf.fin.deltaDoc)}</td></tr>
                        <tr><td>Préstamo largo plazo (movimiento neto)</td><td>${fmtMoney(ycf.fin.deltaPorcion + ycf.fin.deltaPrestamoLargo)}</td></tr>
                        <tr><td>Movimiento de bonos</td><td>${fmtMoney(ycf.fin.deltaBonos)}</td></tr>
                        <tr><td>Dividendos pagados</td><td>${fmtMoney(ycf.fin.dividendosPagados)}</td></tr>
                        <tr class="total"><td>Flujo neto de financiamiento</td><td>${fmtMoney(ycf.fin.financiamiento)}</td></tr>
                        <tr class="total"><td>Variación neta de caja</td><td>${fmtMoney(ycf.variacion)}</td></tr>
                        <tr><td>Caja inicial</td><td>${fmtMoney(ycf.cajaInicio)}</td></tr>
                        <tr class="total"><td>Caja final</td><td>${fmtMoney(ycf.cajaFin)}</td></tr>
                        <tr class="total"><td>Flujo de efectivo libre</td><td>${fmtMoney(ycf.flujoLibre)}</td></tr>
                    </tbody>
                </table>
            </div>
        `;
        div.appendChild(section);
    });
}

function renderRatios(container) {
    const ratios = calcRatios(appData.accounts, appData.params);
    const dupont = calcDuPont(appData.accounts, appData.params);
    const div = createModuleHeader('5. Razones financieras y sistema Du Pont');
    container.appendChild(div);

    const ratioDefs = [
        { key: 'margenUtilidad', name: 'Margen de utilidad', fmt: v => fmtPct(v * 100), unit: '%' },
        { key: 'roa', name: 'ROA', fmt: v => fmtPct(v * 100), unit: '%' },
        { key: 'roe', name: 'ROE', fmt: v => fmtPct(v * 100), unit: '%' },
        { key: 'rotacionCxc', name: 'Rotación de CxC', fmt: v => fmtRatio(v), unit: '×' },
        { key: 'ppc', name: 'Periodo promedio de cobranza', fmt: v => fmtDays(v), unit: 'días' },
        { key: 'rotacionInventario', name: 'Rotación de inventario', fmt: v => fmtRatio(v), unit: '×' },
        { key: 'rotacionActivosFijos', name: 'Rotación de activos fijos', fmt: v => fmtRatio(v), unit: '×' },
        { key: 'rotacionActivosTotales', name: 'Rotación de activos totales', fmt: v => fmtRatio(v), unit: '×' },
        { key: 'razonCirculante', name: 'Razón circulante', fmt: v => fmtRatio(v), unit: '×' },
        { key: 'razonRapida', name: 'Razón rápida', fmt: v => fmtRatio(v), unit: '×' },
        { key: 'deudasActivos', name: 'Deudas a activos totales', fmt: v => fmtPct(v * 100), unit: '%' },
        { key: 'rotacionInteresGanado', name: 'Rotación del interés ganado', fmt: v => fmtRatio(v), unit: '×' },
        { key: 'coberturaCargosFijos', name: 'Cobertura de cargos fijos', fmt: v => fmtRatio(v), unit: '×' }
    ];

    const table = document.createElement('div');
    table.className = 'table-responsive';
    let html = `<table><thead><tr><th>Razón</th><th>2024</th><th>Estado</th><th>2025</th><th>Estado</th><th>Industria</th><th>Favorable</th></tr></thead><tbody>`;
    ratioDefs.forEach(def => {
        const r24 = ratios[2024][def.key];
        const r25 = ratios[2025][def.key];
        const refVal = r24.ref;
        const s24 = getStatus(r24.value, refVal, r24.favorable);
        const s25 = getStatus(r25.value, refVal, r25.favorable);
        html += `<tr>
            <td>${def.name}</td>
            <td>${def.fmt(r24.value)}</td>
            <td><span class="status-dot ${s24.class}"></span>${s24.text}</td>
            <td>${def.fmt(r25.value)}</td>
            <td><span class="status-dot ${s25.class}"></span>${s25.text}</td>
            <td>${def.fmt(refVal)}</td>
            <td>${r24.favorable === 'mayor' ? 'Mayor' : 'Menor'}</td>
        </tr>`;
    });
    html += `</tbody></table>`;
    table.innerHTML = html;
    div.appendChild(table);

    const dupontDiv = document.createElement('div');
    dupontDiv.className = 'module';
    dupontDiv.innerHTML = `<h3>Sistema Du Pont</h3>`;
    dupontDiv.innerHTML += `
        <div class="table-responsive">
            <table>
                <thead><tr><th>Factor</th><th>2024</th><th>2025</th></tr></thead>
                <tbody>
                    <tr><td>Margen neto</td><td>${fmtPct(dupont[2024].m * 100)}</td><td>${fmtPct(dupont[2025].m * 100)}</td></tr>
                    <tr><td>Rotación de activos totales</td><td>${dupont[2024].t.toFixed(4)}</td><td>${dupont[2025].t.toFixed(4)}</td></tr>
                    <tr><td>Deudas / activos</td><td>${fmtPct(dupont[2024].d * 100)}</td><td>${fmtPct(dupont[2025].d * 100)}</td></tr>
                    <tr><td>Multiplicador del capital</td><td>${dupont[2024].L.toFixed(4)}</td><td>${dupont[2025].L.toFixed(4)}</td></tr>
                    <tr class="subtotal"><td>ROA</td><td>${fmtPct(dupont[2024].roa * 100)}</td><td>${fmtPct(dupont[2025].roa * 100)}</td></tr>
                    <tr class="total"><td>ROE</td><td>${fmtPct(dupont[2024].roe * 100)}</td><td>${fmtPct(dupont[2025].roe * 100)}</td></tr>
                </tbody>
            </table>
        </div>
        <h4>Aportes a la variación del ROE</h4>
        <div class="table-responsive">
            <table>
                <thead><tr><th>Factor</th><th>Aporte (p.p.)</th></tr></thead>
                <tbody>
                    <tr><td>Margen</td><td>${dupont.aportes.margen.toFixed(2)}</td></tr>
                    <tr><td>Rotación</td><td>${dupont.aportes.rotacion.toFixed(2)}</td></tr>
                    <tr><td>Apalancamiento</td><td>${dupont.aportes.apalancamiento.toFixed(2)}</td></tr>
                    <tr class="total"><td>Variación total</td><td>${dupont.aportes.total.toFixed(2)}</td></tr>
                </tbody>
            </table>
        </div>
    `;
    div.appendChild(dupontDiv);
}

function renderAnalysis(container) {
    const inc24 = calcIncomeStatement(appData.accounts, appData.params, 2024);
    const inc25 = calcIncomeStatement(appData.accounts, appData.params, 2025);
    const bal24 = calcBalance(appData.accounts, appData.params, 2024);
    const bal25 = calcBalance(appData.accounts, appData.params, 2025);
    const div = createModuleHeader('6. Análisis horizontal y vertical');
    container.appendChild(div);

    function pctChange(curr, prev) {
        if (!prev) return null;
        return ((curr - prev) / prev) * 100;
    }

    const incomeRows = [
        { name: 'Ventas brutas', v24: inc24.ventasBrutas, v25: inc25.ventasBrutas },
        { name: 'Devoluciones y descuentos', v24: -inc24.devoluciones, v25: -inc25.devoluciones },
        { name: 'Ventas netas', v24: inc24.ventasNetas, v25: inc25.ventasNetas, bold: true },
        { name: 'Costo de materiales', v24: inc24.costoMateriales, v25: inc25.costoMateriales },
        { name: 'Mano de obra directa', v24: inc24.manoObra, v25: inc25.manoObra },
        { name: 'Costos indirectos', v24: inc24.cif, v25: inc25.cif },
        { name: 'Costo de ventas', v24: inc24.costoVentas, v25: inc25.costoVentas, bold: true },
        { name: 'Utilidad bruta', v24: inc24.utilidadBruta, v25: inc25.utilidadBruta, bold: true },
        { name: 'Gastos de operación', v24: inc24.gastosOperativos, v25: inc25.gastosOperativos },
        { name: 'UAII', v24: inc24.uaii, v25: inc25.uaii, bold: true },
        { name: 'Ingresos financieros', v24: inc24.ingresosFinancieros, v25: inc25.ingresosFinancieros },
        { name: 'Intereses', v24: -inc24.intereses, v25: -inc25.intereses },
        { name: 'Pérdidas extraordinarias', v24: -inc24.perdidasExtra, v25: -inc25.perdidasExtra },
        { name: 'UAI', v24: inc24.uai, v25: inc25.uai, bold: true },
        { name: 'ISR', v24: -inc24.isr, v25: -inc25.isr },
        { name: 'Utilidad neta', v24: inc24.utilidadNeta, v25: inc25.utilidadNeta, bold: true }
    ];

    let html = `<div class="table-responsive"><table><thead><tr><th>Partida</th><th>2024</th><th>2025</th><th>Δ USD</th><th>Δ %</th><th>% VN 2024</th><th>% VN 2025</th></tr></thead><tbody>`;
    incomeRows.forEach(r => {
        const delta = r.v25 - r.v24;
        const pct = pctChange(r.v25, r.v24);
        const rowClass = r.bold ? 'subtotal' : '';
        html += `<tr class="${rowClass}">
            <td>${r.name}</td>
            <td>${fmtMoney(r.v24)}</td>
            <td>${fmtMoney(r.v25)}</td>
            <td>${fmtMoney(delta)}</td>
            <td>${pct !== null ? pct.toFixed(2) + '%' : 'N/D'}</td>
            <td>${inc24.ventasNetas ? ((r.v24 / inc24.ventasNetas) * 100).toFixed(2) + '%' : 'N/D'}</td>
            <td>${inc25.ventasNetas ? ((r.v25 / inc25.ventasNetas) * 100).toFixed(2) + '%' : 'N/D'}</td>
        </tr>`;
    });
    html += `</tbody></table></div>`;

    div.innerHTML += html;

    const chartsDiv = document.createElement('div');
    chartsDiv.className = 'grid-2';
    chartsDiv.innerHTML = `
        <div class="card"><h3>Cambio de 2024 a 2025 (%)</h3><div id="chart-horizontal" class="canvas-container"></div></div>
        <div class="card"><h3>Cómo se financian los activos (%)</h3><div id="chart-vertical" class="canvas-container"></div></div>
    `;
    div.appendChild(chartsDiv);

    setTimeout(() => {
        createBarChart('chart-horizontal', 
            ['Ventas netas', 'Costo de ventas', 'UAII', 'Utilidad neta'], 
            [pctChange(inc25.ventasNetas, inc24.ventasNetas), pctChange(inc25.costoVentas, inc24.costoVentas), pctChange(inc25.uaii, inc24.uaii), pctChange(inc25.utilidadNeta, inc24.utilidadNeta)], 
            { title: 'Cambio de 2024 a 2025', yLabel: 'Variación (%)', minY: -60, maxY: 20, suffix: '%', valueDecimals: 2, yDecimals: 0 }
        );
        createBarChart('chart-vertical',
            ['Pasivo 2024', 'Pasivo 2025', 'Capital 2024', 'Capital 2025'],
            [(bal24.totalPasivos / bal24.totalActivos) * 100, (bal25.totalPasivos / bal25.totalActivos) * 100, (bal24.capitalContable / bal24.totalActivos) * 100, (bal25.capitalContable / bal25.totalActivos) * 100],
            { title: 'Estructura financiera', yLabel: '% del activo total', minY: 0, maxY: 60, suffix: '%', valueDecimals: 2 }
        );
    }, 0);
}

function renderIndicators(container) {
    const indicators = calcIndicators(appData.accounts, appData.params);
    const div = createModuleHeader('7. Indicadores complementarios');
    container.appendChild(div);

    div.innerHTML += `
        <h3>a. Escudo fiscal</h3>
        <div class="table-responsive">
            <table><thead><tr><th>Concepto</th><th>USD</th></tr></thead>
            <tbody>
                <tr><td>Ahorro fiscal por depreciación</td><td>${fmtMoney(indicators.escudo.dep)}</td></tr>
                <tr><td>Ahorro fiscal por amortización</td><td>${fmtMoney(indicators.escudo.amort)}</td></tr>
                <tr class="total"><td>Escudo fiscal total</td><td>${fmtMoney(indicators.escudo.total)}</td></tr>
            </tbody></table>
        </div>

        <h3>b. Costo de intereses y arrendamientos después de ISR</h3>
        <div class="table-responsive">
            <table><thead><tr><th>Gasto</th><th>Antes de ISR</th><th>Después de ISR</th></tr></thead>
            <tbody>
                <tr><td>Intereses</td><td>${fmtMoney(calcIncomeStatement(appData.accounts, appData.params, 2025).intereses)}</td><td>${fmtMoney(indicators.costoAfterIsr.intereses)}</td></tr>
                <tr><td>Arrendamientos</td><td>${fmtMoney(getAccountValue(appData.accounts, 3, 2025))}</td><td>${fmtMoney(indicators.costoAfterIsr.arrendamientos)}</td></tr>
            </tbody></table>
        </div>

        <h3>c. Valor en libros, UPA, dividendo y P/U</h3>
        <div class="table-responsive">
            <table><thead><tr><th>Medida</th><th>2024</th><th>2025</th></tr></thead>
            <tbody>
                <tr><td>Valor en libros por acción</td><td>${fmtMoney(indicators.valoresAccion[2024].valorLibro)}</td><td>${fmtMoney(indicators.valoresAccion[2025].valorLibro)}</td></tr>
                <tr><td>Utilidad por acción</td><td>${fmtMoney(indicators.valoresAccion[2024].upa)}</td><td>${fmtMoney(indicators.valoresAccion[2025].upa)}</td></tr>
                <tr><td>Dividendo por acción</td><td>${fmtMoney(indicators.valoresAccion[2024].divPorAccion)}</td><td>${fmtMoney(indicators.valoresAccion[2025].divPorAccion)}</td></tr>
                <tr><td>Relación P/U</td><td>${indicators.valoresAccion[2024].pu ? indicators.valoresAccion[2024].pu.toFixed(2) + '×' : 'N/D · falta precio de mercado'}</td><td>${indicators.valoresAccion[2025].pu ? indicators.valoresAccion[2025].pu.toFixed(2) + '×' : 'N/D · falta precio de mercado'}</td></tr>
            </tbody></table>
        </div>

        <h3>d. Conciliación de ventas por producto</h3>
        <div class="table-responsive">
            <table><thead><tr><th>Producto</th><th>Unidades</th><th>Precio</th><th>Venta bruta</th></tr></thead>
            <tbody>
                <tr><td>Garrafones</td><td>${fmtMoney(appData.params.productos.garrafones.unidades)}</td><td>${fmtMoney(appData.params.productos.garrafones.precio)}</td><td>${fmtMoney(indicators.ventasProducto.garrafones)}</td></tr>
                <tr><td>Cubetas</td><td>${fmtMoney(appData.params.productos.cubetas.unidades)}</td><td>${fmtMoney(appData.params.productos.cubetas.precio)}</td><td>${fmtMoney(indicators.ventasProducto.cubetas)}</td></tr>
                <tr class="total"><td>Total</td><td colspan="2"></td><td>${fmtMoney(indicators.ventasProducto.total)}</td></tr>
                <tr class="${Math.abs(indicators.ventasProducto.diff) > 0.005 ? 'alert-danger' : 'alert-success'}"><td colspan="3">Diferencia con ventas brutas</td><td>${fmtMoney(indicators.ventasProducto.diff)}</td></tr>
            </tbody></table>
        </div>

        <h3>e. Utilidad neta frente a flujo de operación</h3>
        <div class="table-responsive">
            <table><thead><tr><th>Año</th><th>Utilidad neta</th><th>Flujo de operación</th><th>Flujo − utilidad</th></tr></thead>
            <tbody>
                <tr><td>2024</td><td>${fmtMoney(indicators.utilidadVsFlujo[2024].utilidad)}</td><td>${fmtMoney(indicators.utilidadVsFlujo[2024].flujo)}</td><td>${fmtMoney(indicators.utilidadVsFlujo[2024].diferencia)}</td></tr>
                <tr><td>2025</td><td>${fmtMoney(indicators.utilidadVsFlujo[2025].utilidad)}</td><td>${fmtMoney(indicators.utilidadVsFlujo[2025].flujo)}</td><td>${fmtMoney(indicators.utilidadVsFlujo[2025].diferencia)}</td></tr>
            </tbody></table>
        </div>

        <h3>g. Costo de la política de crédito</h3>
        <div class="table-responsive">
            <table><thead><tr><th>Concepto</th><th>Valor</th></tr></thead>
            <tbody>
                <tr><td>PPC real</td><td>${fmtDays(indicators.costoCredito.ppcReal)}</td></tr>
                <tr><td>Cartera a 45 días</td><td>${fmtMoney(indicators.costoCredito.carteraA45)}</td></tr>
                <tr class="total"><td>Capital adicional inmovilizado</td><td>${fmtMoney(indicators.costoCredito.capitalInmovilizado)}</td></tr>
            </tbody></table>
        </div>
    `;
}

document.addEventListener('DOMContentLoaded', init);
