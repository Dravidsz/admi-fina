const DEFAULT_ACCOUNTS = [
    { id: 1, cuenta: "Activos intangibles (software y licencias)", grupo: "otros_activos", naturaleza: "D", saldo_2023: 320000, saldo_2024: 350000, debe_2025: 410000, haber_2025: 0 },
    { id: 2, cuenta: "Amortización acumulada de intangibles", grupo: "amort_acumulada", naturaleza: "H", saldo_2023: 110000, saldo_2024: 150000, debe_2025: 0, haber_2025: 194000 },
    { id: 3, cuenta: "Arrendamientos", grupo: "gasto_operativo", naturaleza: "D", saldo_2023: null, saldo_2024: 144000, debe_2025: 156000, haber_2025: 0 },
    { id: 4, cuenta: "Bonos por pagar", grupo: "pasivo_largo", naturaleza: "H", saldo_2023: 800000, saldo_2024: 800000, debe_2025: 0, haber_2025: 800000 },
    { id: 5, cuenta: "Caja y bancos", grupo: "activo_corriente", naturaleza: "D", saldo_2023: 310000, saldo_2024: 437250, debe_2025: 337750, haber_2025: 0 },
    { id: 6, cuenta: "Capital común", grupo: "capital", naturaleza: "H", saldo_2023: 1000000, saldo_2024: 1000000, debe_2025: 0, haber_2025: 1000000 },
    { id: 7, cuenta: "Capital pagado en exceso del valor nominal", grupo: "capital", naturaleza: "H", saldo_2023: 400000, saldo_2024: 400000, debe_2025: 0, haber_2025: 400000 },
    { id: 8, cuenta: "Costo de materiales", grupo: "costo_ventas", naturaleza: "D", saldo_2023: null, saldo_2024: 3430000, debe_2025: 3910000, haber_2025: 0 },
    { id: 9, cuenta: "Costos indirectos de fabricación", grupo: "costo_ventas", naturaleza: "D", saldo_2023: null, saldo_2024: 857000, debe_2025: 946000, haber_2025: 0 },
    { id: 10, cuenta: "Cuentas por cobrar comerciales", grupo: "activo_corriente", naturaleza: "D", saldo_2023: 980000, saldo_2024: 1060000, debe_2025: 1335000, haber_2025: 0 },
    { id: 11, cuenta: "Cuentas por pagar a proveedores", grupo: "pasivo_corriente", naturaleza: "H", saldo_2023: 610000, saldo_2024: 655000, debe_2025: 0, haber_2025: 780000 },
    { id: 12, cuenta: "Depreciación acumulada", grupo: "deprec_acumulada", naturaleza: "H", saldo_2023: 1950000, saldo_2024: 2280000, debe_2025: 0, haber_2025: 2662000 },
    { id: 13, cuenta: "Devoluciones y descuentos sobre ventas", grupo: "devoluciones", naturaleza: "D", saldo_2023: null, saldo_2024: 175000, debe_2025: 229000, haber_2025: 0 },
    { id: 14, cuenta: "Dividendos decretados", grupo: "dividendo", naturaleza: "D", saldo_2023: null, saldo_2024: 183000, debe_2025: 83000, haber_2025: 0 },
    { id: 15, cuenta: "Dividendos por pagar", grupo: "pasivo_corriente", naturaleza: "H", saldo_2023: 40000, saldo_2024: 46000, debe_2025: 0, haber_2025: 40000 },
    { id: 16, cuenta: "Documentos por pagar (préstamo bancario a corto plazo)", grupo: "pasivo_corriente", naturaleza: "H", saldo_2023: 300000, saldo_2024: 350000, debe_2025: 0, haber_2025: 520000 },
    { id: 17, cuenta: "Edificios", grupo: "activo_fijo", naturaleza: "D", saldo_2023: 1800000, saldo_2024: 1800000, debe_2025: 1800000, haber_2025: 0 },
    { id: 18, cuenta: "Equipo de transporte", grupo: "activo_fijo", naturaleza: "D", saldo_2023: 420000, saldo_2024: 480000, debe_2025: 600000, haber_2025: 0 },
    { id: 19, cuenta: "Estimación para cuentas incobrables", grupo: "correctora_cxc", naturaleza: "H", saldo_2023: 29000, saldo_2024: 32000, debe_2025: 0, haber_2025: 40000 },
    { id: 20, cuenta: "Fletes y distribución", grupo: "gasto_operativo", naturaleza: "D", saldo_2023: null, saldo_2024: 215000, debe_2025: 248000, haber_2025: 0 },
    { id: 21, cuenta: "Gasto por amortización de intangibles", grupo: "gasto_operativo", naturaleza: "D", saldo_2023: null, saldo_2024: 40000, debe_2025: 44000, haber_2025: 0 },
    { id: 22, cuenta: "Gasto por depreciación", grupo: "gasto_operativo", naturaleza: "D", saldo_2023: null, saldo_2024: 330000, debe_2025: 382000, haber_2025: 0 },
    { id: 23, cuenta: "Gastos acumulados por pagar", grupo: "pasivo_corriente", naturaleza: "H", saldo_2023: 185000, saldo_2024: 198000, debe_2025: 0, haber_2025: 214000 },
    { id: 24, cuenta: "Gastos pagados por anticipado", grupo: "activo_corriente", naturaleza: "D", saldo_2023: 60000, saldo_2024: 65000, debe_2025: 72000, haber_2025: 0 },
    { id: 25, cuenta: "Gastos por intereses", grupo: "intereses", naturaleza: "D", saldo_2023: null, saldo_2024: 165000, debe_2025: 214000, haber_2025: 0 },
    { id: 26, cuenta: "Honorarios profesionales", grupo: "gasto_operativo", naturaleza: "D", saldo_2023: null, saldo_2024: 52000, debe_2025: 61000, haber_2025: 0 },
    { id: 27, cuenta: "Impuesto sobre la renta del periodo", grupo: "isr_periodo", naturaleza: "D", saldo_2023: null, saldo_2024: 152750, debe_2025: 69500, haber_2025: 0 },
    { id: 28, cuenta: "Impuesto sobre la renta por pagar", grupo: "pasivo_corriente", naturaleza: "H", saldo_2023: 95000, saldo_2024: 110000, debe_2025: 0, haber_2025: 88000 },
    { id: 29, cuenta: "Ingresos financieros", grupo: "ingreso_financiero", naturaleza: "H", saldo_2023: null, saldo_2024: 18000, debe_2025: 0, haber_2025: 12000 },
    { id: 30, cuenta: "Inventario de materia prima", grupo: "activo_corriente", naturaleza: "D", saldo_2023: 410000, saldo_2024: 445000, debe_2025: 540000, haber_2025: 0 },
    { id: 31, cuenta: "Inventario de productos en proceso", grupo: "activo_corriente", naturaleza: "D", saldo_2023: 140000, saldo_2024: 150000, debe_2025: 165000, haber_2025: 0 },
    { id: 32, cuenta: "Inventario de productos terminados", grupo: "activo_corriente", naturaleza: "D", saldo_2023: 520000, saldo_2024: 560000, debe_2025: 735000, haber_2025: 0 },
    { id: 33, cuenta: "Inversiones a largo plazo", grupo: "otros_activos", naturaleza: "D", saldo_2023: 250000, saldo_2024: 250000, debe_2025: 250000, haber_2025: 0 },
    { id: 34, cuenta: "Mano de obra directa", grupo: "costo_ventas", naturaleza: "D", saldo_2023: null, saldo_2024: 1286000, debe_2025: 1415000, haber_2025: 0 },
    { id: 35, cuenta: "Mantenimiento", grupo: "gasto_operativo", naturaleza: "D", saldo_2023: null, saldo_2024: 86000, debe_2025: 104000, haber_2025: 0 },
    { id: 36, cuenta: "Maquinaria y equipo", grupo: "activo_fijo", naturaleza: "D", saldo_2023: 2600000, saldo_2024: 2850000, debe_2025: 3480000, haber_2025: 0 },
    { id: 37, cuenta: "Mobiliario y equipo de oficina", grupo: "activo_fijo", naturaleza: "D", saldo_2023: 210000, saldo_2024: 230000, debe_2025: 255000, haber_2025: 0 },
    { id: 38, cuenta: "Otros gastos generales", grupo: "gasto_operativo", naturaleza: "D", saldo_2023: null, saldo_2024: 48000, debe_2025: 57000, haber_2025: 0 },
    { id: 39, cuenta: "Pérdidas extraordinarias", grupo: "perdida_extra", naturaleza: "D", saldo_2023: null, saldo_2024: 25000, debe_2025: 38000, haber_2025: 0 },
    { id: 40, cuenta: "Porción corriente de la deuda a largo plazo", grupo: "pasivo_corriente", naturaleza: "H", saldo_2023: 200000, saldo_2024: 200000, debe_2025: 0, haber_2025: 250000 },
    { id: 41, cuenta: "Préstamo bancario a largo plazo", grupo: "pasivo_largo", naturaleza: "H", saldo_2023: 1400000, saldo_2024: 1250000, debe_2025: 0, haber_2025: 1600000 },
    { id: 42, cuenta: "Publicidad y mercadeo", grupo: "gasto_operativo", naturaleza: "D", saldo_2023: null, saldo_2024: 172000, debe_2025: 215000, haber_2025: 0 },
    { id: 43, cuenta: "Seguros", grupo: "gasto_operativo", naturaleza: "D", saldo_2023: null, saldo_2024: 64000, debe_2025: 70000, haber_2025: 0 },
    { id: 44, cuenta: "Servicios públicos", grupo: "gasto_operativo", naturaleza: "D", saldo_2023: null, saldo_2024: 118000, debe_2025: 131000, haber_2025: 0 },
    { id: 45, cuenta: "Sueldos administrativos", grupo: "gasto_operativo", naturaleza: "D", saldo_2023: null, saldo_2024: 520000, debe_2025: 566000, haber_2025: 0 },
    { id: 46, cuenta: "Sueldos y comisiones de ventas", grupo: "gasto_operativo", naturaleza: "D", saldo_2023: null, saldo_2024: 430000, debe_2025: 488000, haber_2025: 0 },
    { id: 47, cuenta: "Terrenos", grupo: "activo_fijo", naturaleza: "D", saldo_2023: 650000, saldo_2024: 650000, debe_2025: 650000, haber_2025: 0 },
    { id: 48, cuenta: "Utilidades retenidas", grupo: "retenidas", naturaleza: "H", saldo_2023: 1701000, saldo_2024: 1976250, debe_2025: 0, haber_2025: 1976250 },
    { id: 49, cuenta: "Valores negociables", grupo: "activo_corriente", naturaleza: "D", saldo_2023: 150000, saldo_2024: 120000, debe_2025: 60000, haber_2025: 0 },
    { id: 50, cuenta: "Ventas brutas", grupo: "ventas", naturaleza: "H", saldo_2023: null, saldo_2024: 8750000, debe_2025: 0, haber_2025: 9540000 }
];

const DEFAULT_PARAMS = {
    moneda: "USD",
    acciones: 200000,
    valor_nominal: 5.00,
    isr: 0.25,
    dias_comerciales: 360,
    ventas_credito_pct: 100,
    productos: {
        garrafones: { unidades: 1160000, precio: 4.50 },
        cubetas: { unidades: 480000, precio: 9.00 }
    },
    precio_mercado_2024: "",
    precio_mercado_2025: "",
    referencias: {
        margen_utilidad: 0.045,
        roa: 0.055,
        roe: 0.115,
        rotacion_cxc: 8.00,
        ppc: 45,
        rotacion_inventario: 7.00,
        rotacion_activos_fijos: 2.40,
        rotacion_activos_totales: 1.25,
        razon_circulante: 1.90,
        razon_rapida: 1.10,
        deudas_a_activos: 0.50,
        rotacion_interes_ganado: 4.50,
        cobertura_cargos_fijos: 3.00
    }
};

const GASTOS_OPERATIVOS_IDS = [3, 20, 21, 22, 26, 35, 38, 42, 43, 44, 45, 46];

const ASSET_GROUPS = ['activo_corriente', 'activo_fijo', 'otros_activos'];
const LIABILITY_GROUPS = ['pasivo_corriente', 'pasivo_largo'];
const EQUITY_GROUPS = ['capital', 'retenidas'];

function loadData() {
    const saved = localStorage.getItem('altamira_data');
    if (saved) {
        return JSON.parse(saved);
    }
    return {
        accounts: JSON.parse(JSON.stringify(DEFAULT_ACCOUNTS)),
        params: JSON.parse(JSON.stringify(DEFAULT_PARAMS))
    };
}

function saveData(data) {
    localStorage.setItem('altamira_data', JSON.stringify(data));
}

function resetData() {
    localStorage.removeItem('altamira_data');
    return loadData();
}
