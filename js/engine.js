function fmtMoney(value) {
    if (value === null || value === undefined || isNaN(value)) return "—";
    return value.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 2 });
}

function fmtPct(value, decimals = 2) {
    if (value === null || value === undefined || isNaN(value)) return "N/D";
    return value.toFixed(decimals) + "%";
}

function fmtRatio(value, decimals = 2) {
    if (value === null || value === undefined || isNaN(value)) return "N/D";
    return value.toFixed(decimals) + "×";
}

function fmtDays(value, decimals = 2) {
    if (value === null || value === undefined || isNaN(value)) return "N/D";
    return value.toFixed(decimals) + " días";
}

function getAccountValue(accounts, id, year) {
    const acc = accounts.find(a => a.id === id);
    if (!acc) return 0;
    if (year === 2023) return acc.saldo_2023 || 0;
    if (year === 2024) return acc.saldo_2024 || 0;
    if (year === 2025) {
        if (acc.naturaleza === 'D') return acc.debe_2025 || 0;
        return acc.haber_2025 || 0;
    }
    return 0;
}

function setAccountValue(accounts, id, year, field, value) {
    const acc = accounts.find(a => a.id === id);
    if (!acc) return;
    if (year === 2025) {
        acc[field] = value;
    }
}

function calcIncomeStatement(accounts, params, year) {
    let ventasBrutas, devoluciones, ventasNetas;
    let costoMateriales, manoObra, cif, costoVentas;
    let gastosOperativos = 0;
    let uaii, ingresosFinancieros, intereses, perdidasExtra;
    let uai, isr, utilidadNeta;

    if (year === 2024) {
        ventasBrutas = getAccountValue(accounts, 50, 2024);
        devoluciones = getAccountValue(accounts, 13, 2024);
        costoMateriales = getAccountValue(accounts, 8, 2024);
        manoObra = getAccountValue(accounts, 34, 2024);
        cif = getAccountValue(accounts, 9, 2024);
        ingresosFinancieros = getAccountValue(accounts, 29, 2024);
        intereses = getAccountValue(accounts, 25, 2024);
        perdidasExtra = getAccountValue(accounts, 39, 2024);
    } else {
        ventasBrutas = getAccountValue(accounts, 50, 2025);
        devoluciones = getAccountValue(accounts, 13, 2025);
        costoMateriales = getAccountValue(accounts, 8, 2025);
        manoObra = getAccountValue(accounts, 34, 2025);
        cif = getAccountValue(accounts, 9, 2025);
        ingresosFinancieros = getAccountValue(accounts, 29, 2025);
        intereses = getAccountValue(accounts, 25, 2025);
        perdidasExtra = getAccountValue(accounts, 39, 2025);
    }

    ventasNetas = ventasBrutas - devoluciones;
    costoVentas = costoMateriales + manoObra + cif;

    GASTOS_OPERATIVOS_IDS.forEach(id => {
        gastosOperativos += getAccountValue(accounts, id, year);
    });

    const utilidadBruta = ventasNetas - costoVentas;
    uaii = utilidadBruta - gastosOperativos;
    uai = uaii + ingresosFinancieros - intereses - perdidasExtra;
    isr = Math.max(0, uai * params.isr);
    utilidadNeta = uai - isr;

    return {
        ventasBrutas,
        devoluciones,
        ventasNetas,
        costoMateriales,
        manoObra,
        cif,
        costoVentas,
        utilidadBruta,
        gastosOperativos,
        detalleGastos: GASTOS_OPERATIVOS_IDS.map(id => ({
            id,
            nombre: accounts.find(a => a.id === id).cuenta,
            valor: getAccountValue(accounts, id, year)
        })),
        uaii,
        ingresosFinancieros,
        intereses,
        perdidasExtra,
        uai,
        isr,
        utilidadNeta,
        upa: params.acciones > 0 ? utilidadNeta / params.acciones : 0
    };
}

function calcBalance(accounts, params, year) {
    const income = calcIncomeStatement(accounts, params, year);

    const caja = getAccountValue(accounts, 5, year);
    const valoresNegociables = getAccountValue(accounts, 49, year);
    const cxcBrutas = getAccountValue(accounts, 10, year);
    const estimacionCxc = getAccountValue(accounts, 19, year);
    const cxcNetas = cxcBrutas - estimacionCxc;
    const inventarioTotal = getAccountValue(accounts, 30, year) + getAccountValue(accounts, 31, year) + getAccountValue(accounts, 32, year);
    const pagosAnticipados = getAccountValue(accounts, 24, year);
    const activoCirculante = caja + valoresNegociables + cxcNetas + inventarioTotal + pagosAnticipados;

    const terrenos = getAccountValue(accounts, 47, year);
    const edificios = getAccountValue(accounts, 17, year);
    const maquinaria = getAccountValue(accounts, 36, year);
    const equipoTransporte = getAccountValue(accounts, 18, year);
    const mobiliario = getAccountValue(accounts, 37, year);
    const activoFijoBruto = terrenos + edificios + maquinaria + equipoTransporte + mobiliario;
    const depreciacionAcumulada = getAccountValue(accounts, 12, year);
    const activoFijoNeto = activoFijoBruto - depreciacionAcumulada;

    const intangiblesBruto = getAccountValue(accounts, 1, year);
    const amortAcumulada = getAccountValue(accounts, 2, year);
    const inversionesLargoPlazo = getAccountValue(accounts, 33, year);
    const otrosActivosNetos = intangiblesBruto - amortAcumulada + inversionesLargoPlazo;

    const totalActivos = activoCirculante + activoFijoNeto + otrosActivosNetos;

    const proveedores = getAccountValue(accounts, 11, year);
    const documentosPagar = getAccountValue(accounts, 16, year);
    const gastosAcumulados = getAccountValue(accounts, 23, year);
    const isrPorPagar = getAccountValue(accounts, 28, year);
    const porcionCorrienteDeuda = getAccountValue(accounts, 40, year);
    const dividendosPorPagar = getAccountValue(accounts, 15, year);
    const pasivoCirculante = proveedores + documentosPagar + gastosAcumulados + isrPorPagar + porcionCorrienteDeuda + dividendosPorPagar;

    const prestamoLargo = getAccountValue(accounts, 41, year);
    const bonos = getAccountValue(accounts, 4, year);
    const pasivoLargoPlazo = prestamoLargo + bonos;
    const totalPasivos = pasivoCirculante + pasivoLargoPlazo;

    const capitalComun = getAccountValue(accounts, 6, year);
    const capitalPagadoExceso = getAccountValue(accounts, 7, year);

    let retenidasInicio, dividendosDeclarados, retenidasCierre;
    if (year === 2024) {
        retenidasInicio = getAccountValue(accounts, 48, 2023);
        dividendosDeclarados = getAccountValue(accounts, 14, 2024);
        retenidasCierre = retenidasInicio + income.utilidadNeta - dividendosDeclarados;
    } else {
        const income2024 = calcIncomeStatement(accounts, params, 2024);
        retenidasInicio = getAccountValue(accounts, 48, 2024);
        dividendosDeclarados = getAccountValue(accounts, 14, 2025);
        retenidasCierre = retenidasInicio + income.utilidadNeta - dividendosDeclarados;
    }

    const capitalContable = capitalComun + capitalPagadoExceso + retenidasCierre;
    const totalPasivosCapital = totalPasivos + capitalContable;

    return {
        activoCirculante, caja, valoresNegociables, cxcNetas, cxcBrutas, estimacionCxc, inventarioTotal, pagosAnticipados,
        activoFijoNeto, activoFijoBruto, terrenos, edificios, maquinaria, equipoTransporte, mobiliario, depreciacionAcumulada,
        otrosActivosNetos, intangiblesBruto, amortAcumulada, inversionesLargoPlazo,
        totalActivos,
        pasivoCirculante, proveedores, documentosPagar, gastosAcumulados, isrPorPagar, porcionCorrienteDeuda, dividendosPorPagar,
        pasivoLargoPlazo, prestamoLargo, bonos,
        totalPasivos,
        capitalContable, capitalComun, capitalPagadoExceso, retenidasCierre, retenidasInicio, dividendosDeclarados,
        totalPasivosCapital,
        diferencia: totalActivos - totalPasivosCapital,
        incomeStatement: income
    };
}

function calcCashFlow(accounts, params) {
    const income2024 = calcIncomeStatement(accounts, params, 2024);
    const income2025 = calcIncomeStatement(accounts, params, 2025);
    const balance2024 = calcBalance(accounts, params, 2024);
    const balance2025 = calcBalance(accounts, params, 2025);

    function opFlow(year, income, balPrev, balCurr) {
        const dep = getAccountValue(accounts, 22, year);
        const amort = getAccountValue(accounts, 21, year);
        const deltaCartera = balCurr.cxcNetas - balPrev.cxcNetas;
        const deltaInventario = balCurr.inventarioTotal - balPrev.inventarioTotal;
        const deltaAnticipados = balCurr.pagosAnticipados - balPrev.pagosAnticipados;
        const deltaProveedores = balCurr.proveedores - balPrev.proveedores;
        const deltaGastosAcum = balCurr.gastosAcumulados - balPrev.gastosAcumulados;
        const deltaIsrPorPagar = balCurr.isrPorPagar - balPrev.isrPorPagar;

        const operacion = income.utilidadNeta + dep + amort - deltaCartera - deltaInventario - deltaAnticipados + deltaProveedores + deltaGastosAcum + deltaIsrPorPagar;

        return {
            utilidadNeta: income.utilidadNeta,
            depreciacion: dep,
            amortizacion: amort,
            deltaCartera,
            deltaInventario,
            deltaAnticipados,
            deltaProveedores,
            deltaGastosAcum,
            deltaIsrPorPagar,
            operacion
        };
    }

    function invFlow(year, balPrev, balCurr) {
        const fijoBrutoCurr = balCurr.activoFijoBruto;
        const fijoBrutoPrev = balPrev.activoFijoBruto;
        const compraFijos = fijoBrutoCurr - fijoBrutoPrev;

        const intangBrutoCurr = balCurr.intangiblesBruto;
        const intangBrutoPrev = balPrev.intangiblesBruto;
        const compraIntangibles = intangBrutoCurr - intangBrutoPrev;

        const deltaValoresNeg = balPrev.valoresNegociables - balCurr.valoresNegociables;
        const deltaInvLargo = balPrev.inversionesLargoPlazo - balCurr.inversionesLargoPlazo;

        const inversion = -compraFijos - compraIntangibles + deltaValoresNeg + deltaInvLargo;

        return {
            compraFijos,
            compraIntangibles,
            deltaValoresNeg,
            deltaInvLargo,
            inversion
        };
    }

    function finFlow(year, accounts, balPrev, balCurr) {
        const deltaDoc = balCurr.documentosPagar - balPrev.documentosPagar;
        const deltaPorcion = balCurr.porcionCorrienteDeuda - balPrev.porcionCorrienteDeuda;
        const deltaPrestamoLargo = balCurr.prestamoLargo - balPrev.prestamoLargo;
        const deltaBonos = balCurr.bonos - balPrev.bonos;
        const dividendosDeclarados = getAccountValue(accounts, 14, year);
        const divPorPagarInicio = balPrev.dividendosPorPagar;
        const divPorPagarFin = balCurr.dividendosPorPagar;
        const dividendosPagados = dividendosDeclarados + divPorPagarInicio - divPorPagarFin;

        const financiamiento = deltaDoc + deltaPorcion + deltaPrestamoLargo + deltaBonos - dividendosPagados;

        return {
            deltaDoc,
            deltaPorcion,
            deltaPrestamoLargo,
            deltaBonos,
            dividendosPagados,
            financiamiento
        };
    }

    const base2023 = {
        cxcNetas: getAccountValue(accounts, 10, 2023) - getAccountValue(accounts, 19, 2023),
        inventarioTotal: getAccountValue(accounts, 30, 2023) + getAccountValue(accounts, 31, 2023) + getAccountValue(accounts, 32, 2023),
        pagosAnticipados: getAccountValue(accounts, 24, 2023),
        proveedores: getAccountValue(accounts, 11, 2023),
        gastosAcumulados: getAccountValue(accounts, 23, 2023),
        isrPorPagar: getAccountValue(accounts, 28, 2023),
        activoFijoBruto: getAccountValue(accounts, 47, 2023) + getAccountValue(accounts, 17, 2023) + getAccountValue(accounts, 36, 2023) + getAccountValue(accounts, 18, 2023) + getAccountValue(accounts, 37, 2023),
        intangiblesBruto: getAccountValue(accounts, 1, 2023),
        valoresNegociables: getAccountValue(accounts, 49, 2023),
        inversionesLargoPlazo: getAccountValue(accounts, 33, 2023),
        documentosPagar: getAccountValue(accounts, 16, 2023),
        porcionCorrienteDeuda: getAccountValue(accounts, 40, 2023),
        prestamoLargo: getAccountValue(accounts, 41, 2023),
        bonos: getAccountValue(accounts, 4, 2023),
        dividendosPorPagar: getAccountValue(accounts, 15, 2023),
        caja: getAccountValue(accounts, 5, 2023)
    };

    const op2024 = opFlow(2024, income2024, base2023, balance2024);
    const inv2024 = invFlow(2024, base2023, balance2024);
    const fin2024 = finFlow(2024, accounts, base2023, balance2024);
    const variacion2024 = op2024.operacion + inv2024.inversion + fin2024.financiamiento;
    const cajaInicio2024 = base2023.caja;
    const cajaFin2024 = balance2024.caja;
    const flujoLibre2024 = op2024.operacion - inv2024.compraFijos - fin2024.dividendosPagados;

    const op2025 = opFlow(2025, income2025, balance2024, balance2025);
    const inv2025 = invFlow(2025, balance2024, balance2025);
    const fin2025 = finFlow(2025, accounts, balance2024, balance2025);
    const variacion2025 = op2025.operacion + inv2025.inversion + fin2025.financiamiento;
    const cajaInicio2025 = balance2024.caja;
    const cajaFin2025 = balance2025.caja;
    const flujoLibre2025 = op2025.operacion - inv2025.compraFijos - fin2025.dividendosPagados;

    return {
        2024: { op: op2024, inv: inv2024, fin: fin2024, variacion: variacion2024, cajaInicio: cajaInicio2024, cajaFin: cajaFin2024, flujoLibre: flujoLibre2024 },
        2025: { op: op2025, inv: inv2025, fin: fin2025, variacion: variacion2025, cajaInicio: cajaInicio2025, cajaFin: cajaFin2025, flujoLibre: flujoLibre2025 }
    };
}

function calcRatios(accounts, params) {
    const income2024 = calcIncomeStatement(accounts, params, 2024);
    const income2025 = calcIncomeStatement(accounts, params, 2025);
    const balance2024 = calcBalance(accounts, params, 2024);
    const balance2025 = calcBalance(accounts, params, 2025);
    const ref = params.referencias;

    function yearRatios(inc, bal) {
        const vnDiaria = inc.ventasNetas / params.dias_comerciales;
        const ppc = vnDiaria > 0 ? bal.cxcNetas / vnDiaria : 0;
        const intereses = inc.intereses;
        const arrendamientos = getAccountValue(accounts, 3, inc.ventasBrutas === income2024.ventasBrutas ? 2024 : 2025);

        return {
            margenUtilidad: { value: inc.utilidadNeta / inc.ventasNetas, ref: ref.margen_utilidad, favorable: 'mayor' },
            roa: { value: inc.utilidadNeta / bal.totalActivos, ref: ref.roa, favorable: 'mayor' },
            roe: { value: inc.utilidadNeta / bal.capitalContable, ref: ref.roe, favorable: 'mayor' },
            rotacionCxc: { value: inc.ventasNetas / bal.cxcNetas, ref: ref.rotacion_cxc, favorable: 'mayor' },
            ppc: { value: ppc, ref: ref.ppc, favorable: 'menor' },
            rotacionInventario: { value: inc.ventasNetas / bal.inventarioTotal, ref: ref.rotacion_inventario, favorable: 'mayor' },
            rotacionActivosFijos: { value: inc.ventasNetas / bal.activoFijoNeto, ref: ref.rotacion_activos_fijos, favorable: 'mayor' },
            rotacionActivosTotales: { value: inc.ventasNetas / bal.totalActivos, ref: ref.rotacion_activos_totales, favorable: 'mayor' },
            razonCirculante: { value: bal.activoCirculante / bal.pasivoCirculante, ref: ref.razon_circulante, favorable: 'mayor' },
            razonRapida: { value: (bal.activoCirculante - bal.inventarioTotal) / bal.pasivoCirculante, ref: ref.razon_rapida, favorable: 'mayor' },
            deudasActivos: { value: bal.totalPasivos / bal.totalActivos, ref: ref.deudas_a_activos, favorable: 'menor' },
            rotacionInteresGanado: { value: inc.uaii / intereses, ref: ref.rotacion_interes_ganado, favorable: 'mayor' },
            coberturaCargosFijos: { value: (inc.uaii + arrendamientos) / (intereses + arrendamientos), ref: ref.cobertura_cargos_fijos, favorable: 'mayor' }
        };
    }

    return {
        2024: yearRatios(income2024, balance2024),
        2025: yearRatios(income2025, balance2025)
    };
}

function getStatus(value, ref, favorable) {
    if (value === null || value === undefined || isNaN(value) || ref === null || ref === undefined || isNaN(ref)) return { class: 'status-nodata', text: 'Sin datos' };
    if (Math.abs(value - ref) < 1e-9) return { class: 'status-neutral', text: 'Igual a referencia' };
    if (favorable === 'mayor') {
        return value > ref ? { class: 'status-favorable', text: 'Favorable' } : { class: 'status-unfavorable', text: 'Desfavorable' };
    }
    return value < ref ? { class: 'status-favorable', text: 'Favorable' } : { class: 'status-unfavorable', text: 'Desfavorable' };
}

function calcDuPont(accounts, params) {
    const income2024 = calcIncomeStatement(accounts, params, 2024);
    const income2025 = calcIncomeStatement(accounts, params, 2025);
    const balance2024 = calcBalance(accounts, params, 2024);
    const balance2025 = calcBalance(accounts, params, 2025);

    const m24 = income2024.utilidadNeta / income2024.ventasNetas;
    const t24 = income2024.ventasNetas / balance2024.totalActivos;
    const d24 = balance2024.totalPasivos / balance2024.totalActivos;
    const L24 = 1 / (1 - d24);

    const m25 = income2025.utilidadNeta / income2025.ventasNetas;
    const t25 = income2025.ventasNetas / balance2025.totalActivos;
    const d25 = balance2025.totalPasivos / balance2025.totalActivos;
    const L25 = 1 / (1 - d25);

    const roa24 = m24 * t24;
    const roe24 = roa24 * L24;
    const roa25 = m25 * t25;
    const roe25 = roa25 * L25;

    const aporteMargen = (m25 - m24) * t24 * L24;
    const aporteRotacion = m25 * (t25 - t24) * L24;
    const aporteApalancamiento = m25 * t25 * (L25 - L24);
    const variacionTotal = roe25 - roe24;

    return {
        2024: { m: m24, t: t24, d: d24, L: L24, roa: roa24, roe: roe24 },
        2025: { m: m25, t: t25, d: d25, L: L25, roa: roa25, roe: roe25 },
        aportes: { margen: aporteMargen, rotacion: aporteRotacion, apalancamiento: aporteApalancamiento, total: variacionTotal }
    };
}

function calcIndicators(accounts, params) {
    const income2024 = calcIncomeStatement(accounts, params, 2024);
    const income2025 = calcIncomeStatement(accounts, params, 2025);
    const balance2024 = calcBalance(accounts, params, 2024);
    const balance2025 = calcBalance(accounts, params, 2025);
    const cashflow = calcCashFlow(accounts, params);

    // a. Escudo fiscal
    const dep2025 = getAccountValue(accounts, 22, 2025);
    const amort2025 = getAccountValue(accounts, 21, 2025);
    const escudoDep = dep2025 * params.isr;
    const escudoAmort = amort2025 * params.isr;
    const escudoTotal = escudoDep + escudoAmort;

    // b. Costo después de ISR
    const intereses2025 = income2025.intereses;
    const arrendamientos2025 = getAccountValue(accounts, 3, 2025);
    const interesesAfter = intereses2025 * (1 - params.isr);
    const arrendamientosAfter = arrendamientos2025 * (1 - params.isr);

    // c. Valor en libros, UPA, dividendo, P/U
    const valorLibro2024 = balance2024.capitalContable / params.acciones;
    const valorLibro2025 = balance2025.capitalContable / params.acciones;
    const upa2024 = income2024.utilidadNeta / params.acciones;
    const upa2025 = income2025.utilidadNeta / params.acciones;
    const divPorAccion2024 = getAccountValue(accounts, 14, 2024) / params.acciones;
    const divPorAccion2025 = getAccountValue(accounts, 14, 2025) / params.acciones;
    const pu2024 = params.precio_mercado_2024 ? params.precio_mercado_2024 / upa2024 : null;
    const pu2025 = params.precio_mercado_2025 ? params.precio_mercado_2025 / upa2025 : null;

    // d. Conciliación ventas por producto
    const garrafonesTotal = params.productos.garrafones.unidades * params.productos.garrafones.precio;
    const cubetasTotal = params.productos.cubetas.unidades * params.productos.cubetas.precio;
    const ventaBrutaProductos = garrafonesTotal + cubetasTotal;
    const diffVentas = ventaBrutaProductos - income2025.ventasBrutas;

    // e. Utilidad neta vs flujo de operación
    const flujoOp2024 = cashflow[2024].op.operacion;
    const flujoOp2025 = cashflow[2025].op.operacion;

    // g. Costo política de crédito
    const vnDiaria = income2025.ventasNetas / params.dias_comerciales;
    const ppcReal = balance2025.cxcNetas / vnDiaria;
    const carteraA45 = income2025.ventasNetas * params.referencias.ppc / params.dias_comerciales;
    const capitalInmovilizado = balance2025.cxcNetas - carteraA45;

    return {
        escudo: { dep: escudoDep, amort: escudoAmort, total: escudoTotal },
        costoAfterIsr: { intereses: interesesAfter, arrendamientos: arrendamientosAfter },
        valoresAccion: {
            2024: { valorLibro: valorLibro2024, upa: upa2024, divPorAccion: divPorAccion2024, pu: pu2024 },
            2025: { valorLibro: valorLibro2025, upa: upa2025, divPorAccion: divPorAccion2025, pu: pu2025 }
        },
        ventasProducto: { garrafones: garrafonesTotal, cubetas: cubetasTotal, total: ventaBrutaProductos, diff: diffVentas },
        utilidadVsFlujo: {
            2024: { utilidad: income2024.utilidadNeta, flujo: flujoOp2024, diferencia: flujoOp2024 - income2024.utilidadNeta },
            2025: { utilidad: income2025.utilidadNeta, flujo: flujoOp2025, diferencia: flujoOp2025 - income2025.utilidadNeta }
        },
        costoCredito: { ppcReal, carteraA45, capitalInmovilizado }
    };
}

function validate(accounts, params) {
    const debe2025 = accounts.reduce((sum, a) => sum + (a.debe_2025 || 0), 0);
    const haber2025 = accounts.reduce((sum, a) => sum + (a.haber_2025 || 0), 0);
    const balanzaDiff = Math.abs(debe2025 - haber2025);

    const balance2025 = calcBalance(accounts, params, 2025);
    const balanceDiff = Math.abs(balance2025.diferencia);

    const income2025 = calcIncomeStatement(accounts, params, 2025);
    const isrDiff = Math.abs(income2025.isr - getAccountValue(accounts, 27, 2025));

    const indicators = calcIndicators(accounts, params);
    const ventasDiff = Math.abs(indicators.ventasProducto.diff);

    const cashflow = calcCashFlow(accounts, params);
    const cajaDiff = Math.abs(cashflow[2025].cajaFin - balance2025.caja);

    const alerts = [];
    if (balanzaDiff > 0.005) alerts.push({ type: 'danger', message: `Balanza 2025 descuadrada: Debe ${fmtMoney(debe2025)} ≠ Haber ${fmtMoney(haber2025)}. Diferencia: ${fmtMoney(balanzaDiff)}` });
    if (balanceDiff > 0.005) alerts.push({ type: 'danger', message: `Balance 2025 descuadrado: Activos ≠ Pasivos + Capital. Diferencia: ${fmtMoney(balanceDiff)}` });
    if (isrDiff > 0.005) alerts.push({ type: 'warning', message: `ISR calculado (${fmtMoney(income2025.isr)}) difiere de cuenta 27 (${fmtMoney(getAccountValue(accounts, 27, 2025))}). Diferencia: ${fmtMoney(isrDiff)}` });
    if (ventasDiff > 0.005) alerts.push({ type: 'warning', message: `Ventas por producto (${fmtMoney(indicators.ventasProducto.total)}) difieren de ventas brutas (${fmtMoney(income2025.ventasBrutas)}). Diferencia: ${fmtMoney(ventasDiff)}` });
    if (cajaDiff > 0.005) alerts.push({ type: 'danger', message: `Caja del flujo (${fmtMoney(cashflow[2025].cajaFin)}) no coincide con balance (${fmtMoney(balance2025.caja)}). Diferencia: ${fmtMoney(cajaDiff)}` });

    if (alerts.length === 0) alerts.push({ type: 'success', message: 'Todos los controles de validación coinciden con el caso base.' });

    return {
        debe2025, haber2025, balanzaDiff,
        balanceDiff, isrDiff, ventasDiff, cajaDiff,
        alerts
    };
}
