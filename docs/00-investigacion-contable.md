# Investigación Contable para el Desarrollo del Software de Análisis Financiero

> Documento de investigación previa al desarrollo del Sistema de Análisis Financiero basado en *Fundamentos de Administración Financiera* (14ª ed.) de Block, Hirt y Danielsen.

---

## 1. Resumen ejecutivo

Este documento recopila los fundamentos contables, los estándares normativos y las buenas prácticas de ingeniería de software aplicables a sistemas contables y financieros. Su propósito es sentar las bases técnicas y conceptuales antes de continuar con el desarrollo del sistema, asegurando que:

- Los cálculos contables sean correctos, auditables y consistentes.
- La arquitectura del software sea escalable, segura y mantenible.
- El sistema cumpla con los principios de contabilidad generalmente aceptados y, en la medida de lo posible, con las normas internacionales de información financiera (NIIF/IFRS).
- Se diferencie claramente entre un **software de análisis financiero** (alcance actual) y un **software contable completo** (alcance mayor).

---

## 2. ¿Qué es la contabilidad?

La contabilidad es una disciplina de las ciencias económicas que estudia, mide, registra y analiza el **patrimonio** y la situación económica y financiera de una entidad. Su objetivo es proporcionar información estructurada, fiable y relevante para la toma de decisiones internas y el control externo.

### 2.1 Ramas principales

| Rama | Propósito | Usuarios principales |
|------|-----------|----------------------|
| **Contabilidad financiera** | Elaborar estados financieros (resultados, balance, flujo de efectivo). | Accionistas, acreedores, reguladores, inversionistas. |
| **Contabilidad administrativa / de gestión** | Información para planificación, control y decisiones internas. | Directivos, mandos intermedios. |
| **Contabilidad fiscal** | Cumplimiento de obligaciones tributarias. | Administraciones tributarias, contadores. |
| **Contabilidad de costos** | Cálculo de costos de productos y servicios. | Producción, operaciones, dirección. |

> **Nota para este proyecto:** el sistema actual se enfoca en **contabilidad financiera** (estados financieros y análisis de razones), no en contabilidad de gestión ni fiscal.

### 2.2 Conceptos fundamentales

- **Activo:** recursos controlados por la empresa de los que se esperan beneficios económicos futuros.
- **Pasivo:** obligaciones actuales surgidas de eventos pasados.
- **Patrimonio neto / Capital contable:** parte residual de los activos una vez deducidos los pasivos.
- **Ingresos:** incrementos de beneficios económicos.
- **Gastos:** decrementos de beneficios económicos.
- **Ecuación contable:** `ACTIVO = PASIVO + PATRIMONIO NETO`.

### 2.3 Sistema de partida doble

Cada transacción contable afecta al menos a dos cuentas: un **debe** y un **haber**. La suma de los débitos siempre debe ser igual a la suma de los créditos. Este principio garantiza que el balance cuadre.

| Tipo de cuenta | Aumenta con | Disminuye con |
|----------------|-------------|---------------|
| Activo | Débito | Crédito |
| Pasivo | Crédito | Débito |
| Patrimonio neto | Crédito | Débito |
| Ingresos | Crédito | Débito |
| Gastos | Débito | Crédito |

> **Implicación para el software:** cualquier sistema contable real debe registrar asientos con partida doble. El sistema actual no lo hace: recibe estados financieros ya elaborados y los analiza.

### 2.4 Libros contables principales

| Libro | Función |
|-------|---------|
| **Libro diario** | Registro cronológico de todas las operaciones mediante asientos contables. |
| **Libro mayor** | Registro por cuentas; resume los movimientos de cada cuenta. |
| **Libro de balances** | Estados financieros oficiales al cierre de cada ejercicio. |

---

## 3. Estados financieros básicos

Según las NIIF y la mayoría de marcos contables, los estados financieros completos incluyen:

1. **Estado de situación patrimonial** (Balance general).
2. **Estado de resultados** (Cuenta de pérdidas y ganancias).
3. **Estado de evolución del patrimonio neto**.
4. **Estado de flujos de efectivo**.
5. **Notas a los estados financieros** (políticas contables, criterios de medición, desagregaciones).

### 3.1 Estado de resultados

Presenta los ingresos, costos y gastos de un periodo para determinar la utilidad o pérdida neta.

Estructura típica:

```
Ventas
− Costo de ventas
= Utilidad bruta
− Gastos de venta y administración
− Depreciación
= Utilidad operativa (EBIT)
− Gastos por intereses
− Pérdidas extraordinarias
= Utilidad antes de impuestos (EBT)
− Impuestos
= Utilidad neta
− Dividendos preferentes
= Utilidad disponible para accionistas comunes
/ Acciones en circulación
= Utilidad por acción (EPS)
```

### 3.2 Balance general

Muestra la situación financiera de la empresa en una fecha determinada.

```
ACTIVO
  Activo corriente
  Activo no corriente / fijo
PASIVO
  Pasivo corriente
  Pasivo no corriente
PATRIMONIO NETO
  Capital
  Utilidades retenidas

ACTIVO TOTAL = PASIVO TOTAL + PATRIMONIO NETO TOTAL
```

### 3.3 Estado de flujo de efectivo

Muestra los movimientos de efectivo clasificados en:

- **Actividades de operación:** utilidad neta ajustada por elementos no monetarios y cambios en capital de trabajo.
- **Actividades de inversión:** compra/venta de activos fijos e inversiones.
- **Actividades de financiamiento:** emisión de deuda, acciones, pago de dividendos.

Métodos:

- **Directo:** se clasifican los cobros y pagos de efectivo.
- **Indirecto:** parte de la utilidad neta y se ajusta.

> El libro de Block, Hirt y Danielsen utiliza el **método indirecto**, que es el que implementa el sistema.

---

## 4. ¿Qué es un software contable?

Un software contable es un programa informático destinado a sistematizar y simplificar las tareas de contabilidad de una organización. Registra y procesa transacciones históricas: compras, ventas, cuentas por cobrar/pagar, inventarios, nóminas, balances, etc.

### 4.1 Tipos de software contable según mercado

| Segmento | Características | Ejemplos representativos |
|----------|-----------------|--------------------------|
| **Gama baja** | Monousuario, procesos simples, adaptado a un país. | Aplicaciones de facturación + contabilidad básica. |
| **Mercado medio** | Multiusuario, integración de módulos, soporte multimoneda. | ERPs ligeros, soluciones SaaS. |
| **Alta gama / ERP** | Integración total financiera-operativa, multinacional, cumplimiento normativo avanzado. | SAP, Oracle, Microsoft Dynamics. |

### 4.2 Módulos centrales de un software contable

| Módulo | Función |
|--------|---------|
| **Catálogo de cuentas / Plan contable** | Define el listado oficial de cuentas con códigos. |
| **Libro diario y asientos contables** | Registro de transacciones por partida doble. |
| **Libro mayor** | Consolidación de movimientos por cuenta. |
| **Cuentas por cobrar** | Facturas pendientes de clientes. |
| **Cuentas por pagar** | Facturas pendientes de proveedores. |
| **Facturación** | Emisión de facturas. |
| **Inventarios** | Control de existencias y costos. |
| **Nómina** | Cálculo de salarios e impuestos laborales. |
| **Bancos y conciliaciones** | Reconciliación de estados de cuenta. |
| **Cierre contable** | Ajustes, depreciaciones, regularización y cierre de ejercicio. |
| **Reportes financieros** | Estados financieros, razones, análisis. |

> **El sistema actual NO es un software contable completo.** Es una herramienta de **análisis financiero** que recibe estados financieros ya elaborados y genera reportes, razones y proyecciones.

---

## 5. Normativa contable aplicable

### 5.1 Principios de contabilidad generalmente aceptados (PCGA / GAAP)

Aunque varían por país, los principios fundamentales incluyen:

| Principio | Descripción |
|-----------|-------------|
| **Entidad** | La empresa es independiente de sus dueños. |
| **Continuidad** | Se presume que la empresa operará indefinidamente. |
| **Devengo** | Ingresos y gastos se reconocen cuando ocurren, no cuando se cobra/paga. |
| **Consistencia** | Métodos contables deben mantenerse entre periodos. |
| **Prudencia / Conservadurismo** | Ante duda, se prefiere no sobreestimar ingresos ni subestimar gastos. |
| **Importancia relativa** | No se requiere exactitud en partidas insignificantes. |
| **Divulgación plena** | Se debe revelar toda información relevante. |
| **Periodo contable** | La vida de la empresa se divide en periodos. |

### 5.2 Normas Internacionales de Información Financiera (NIIF / IFRS)

Las NIIF son estándares contables emitidos por el IASB. Son obligatorias o adoptadas en más de 140 jurisdicciones, incluyendo la Unión Europea, Chile, Colombia, Perú, México (en convergencia) y otros países latinoamericanos.

Normas relevantes para este sistema:

| Norma | Tema |
|-------|------|
| NIC 1 | Presentación de estados financieros. |
| NIC 2 | Inventarios. |
| NIC 7 | Estado de flujos de efectivo. |
| NIC 8 | Políticas contables, cambios en estimaciones y errores. |
| NIC 16 | Propiedades, planta y equipo. |
| NIC 36 | Deterioro del valor de activos. |
| NIIF 15 | Ingresos de contratos con clientes. |
| NIIF 16 | Arrendamientos. |

### 5.3 US GAAP

Estándares contables de Estados Unidos emitidos por el FASB. Se usan principalmente en empresas estadounidenses. Las diferencias clave con NIIF incluyen:

- Inventarios: US GAAP permite LIFO; NIIF no.
- Revaluación de activos fijos: permitida bajo NIIF, generalmente no bajo US GAAP.
- Presentación de estados financieros: hay diferencias en clasificación de partidas.

> **Recomendación para el sistema:** declarar explícitamente que los cálculos se basan en el libro de Block, Hirt y Danielsen (enfoque académico-estadounidense) y, cuando sea posible, ofrecer configuración de normativa (NIIF / GAAP) para futuras versiones.

---

## 6. Buenas prácticas para el desarrollo de software contable/financiero

### 6.1 Precisión numérica

- Usar tipos de datos decimales (`BigDecimal`, `decimal`, `Number` con cuidado) para evitar errores de redondeo.
- En JavaScript/TypeScript, usar `Math.round(valor * 100) / 100` o librerías como `decimal.js` / `dinero.js` para cálculos monetarios exactos.
- Definir una tolerancia de cuadre (ej. `0.01`) para comparaciones de igualdad.

### 6.2 Trazabilidad y auditoría

- Registrar quién creó/modificó cada dato y cuándo.
- No permitir borrado físico de registros contables; usar borrado lógico.
- Mantener historial de cambios en estados financieros.
- Numerar y fechar todos los asientos y reportes.

### 6.3 Seguridad

- Autenticación y autorización por roles (admin, contador, analista, solo lectura).
- Encriptación de datos sensibles en reposo y en tránsito.
- Control de acceso a datos por empresa y periodo.
- Backups periódicos y recuperación ante desastres.

### 6.4 Validaciones de negocio

- El balance debe cuadrar: `Activos = Pasivos + Capital`.
- Las provisiones no pueden superar el monto de la cuenta origen.
- La depreciación acumulada no puede superar el costo del activo.
- Evitar divisiones por cero en razones financieras.
- Validar coherencia temporal (periodos consecutivos para flujo de efectivo).

### 6.5 Separación de responsabilidades

- Separar la capa de presentación, lógica de negocio y persistencia.
- Compartir fórmulas entre cliente y servidor para evitar inconsistencias.
- Mantener los cálculos puros (sin efectos secundarios) y fácilmente testeables.

### 6.6 Escalabilidad

- Soportar múltiples empresas y periodos desde el diseño inicial.
- Permitir la configuración de monedas, tasas de cambio y normativas contables.
- Prever importación/exportación de datos en formatos estándar (Excel, CSV, JSON).

---

## 7. Análisis del proyecto actual

### 7.1 Alcance actual

El proyecto es un **sistema de análisis financiero**, no un software contable completo. Su objetivo es:

1. Gestionar empresas y periodos contables.
2. Recibir estados financieros de entrada.
3. Calcular estados, razones, flujo de efectivo, análisis vertical/horizontal, Du Pont y pronósticos.
4. Exportar reportes a Excel.

### 7.2 Fortalezas identificadas

- Stack moderno: Vite, React, TypeScript, TanStack, Express, MongoDB.
- Fórmulas compartidas entre cliente y servidor (`shared/formulas.ts`).
- Tipado fuerte con TypeScript.
- Separación clara entre modelos, rutas y servicios en el backend.
- Validaciones básicas de cuadre y coherencia.

### 7.3 Brechas respecto a un software contable real

| Aspecto | Estado actual | Recomendación |
|---------|---------------|---------------|
| **Partida doble** | No implementada. | Documentar que el sistema no registra asientos contables. Evaluar si se desea agregar en futuro. |
| **Libro diario / mayor** | No existe. | No requerido para el alcance actual. |
| **Catálogo de cuentas** | No existe. | No requerido para el alcance actual; los estados se ingresan agregados. |
| **Cierre contable** | No existe. | No requerido para el alcance actual. |
| **Auditoría de cambios** | No implementada. | Agregar `createdBy`, `updatedBy`, `history` a periodos y empresas. |
| **Borrado lógico** | No implementado. | Implementar `isDeleted` y `deletedAt` en modelos. |
| **Precisión decimal** | Usa `number` de JS con `safeDiv`. | Evaluar `decimal.js` para producción si se manejan montos grandes. |
| **Roles y permisos** | Pendiente. | Definir roles mínimos: admin, editor, lector. |
| **Normativa explícita** | No se declara. | Agregar campo `normativa` (GAAP/NIIF) a la empresa/periodo. |
| **Notas a los estados** | No existen. | Permitir adjuntar notas explicativas a cada periodo. |
| **Conciliación bancaria** | No aplica. | Fuera de alcance. |
| **Nómina / facturación** | No aplica. | Fuera de alcance. |

---

## 8. Recomendaciones específicas para el desarrollo

### 8.1 Definir claramente el alcance

Mantener el sistema como **herramienta de análisis financiero** y no intentar convertirlo en un ERP contable. Esto evita:

- Complejidad innecesaria.
- Riesgos legales/fiscales derivados de cálculos tributarios incorrectos.
- Desviarse del objetivo académico basado en el libro.

### 8.2 Documentar supuestos contables

Agregar en la interfaz y documentación:

- Fórmulas utilizadas.
- Supuestos (ej. año de 360 días, método indirecto para flujo de efectivo).
- Limitaciones (no es un sistema contable completo, no reemplaza asesoría fiscal).

### 8.3 Mejorar la trazabilidad

En los modelos de MongoDB agregar:

```typescript
{
  createdBy: string;
  updatedBy: string;
  createdAt: Date;
  updatedAt: Date;
  isDeleted: boolean;
  deletedAt?: Date;
  history?: Array<{ campo: string; valorAnterior: any; valorNuevo: any; fecha: Date; usuario: string }>;
}
```

### 8.4 Agregar configuración de normativa

Permitir al usuario seleccionar el marco contable de referencia:

```typescript
type NormativaContable = 'GAAP' | 'NIIF' | 'OTRA';
```

Esto facilitará comparaciones y futuras extensiones.

### 8.5 Validaciones adicionales recomendadas

- El costo de ventas no puede ser mayor que las ventas (salvo casos excepcionales).
- La depreciación acumulada no puede exceder el costo de planta y equipo.
- La provisión para cuentas malas no puede exceder las cuentas por cobrar.
- Si se usa `tasaImpuestos`, debe estar entre 0 y 1 (o 0% y 100%).
- El periodo contable debe ser único por empresa y año.

### 8.6 Manejo de moneda y redondeo

- Almacenar montos como números con precisión controlada.
- Mostrar siempre 2 decimales en la interfaz.
- En cálculos intermedios, evitar acumulación de errores de redondeo.

### 8.7 Exportación y reportes

- Incluir fórmulas en las exportaciones a Excel para que sean auditables.
- Agregar metadatos en el reporte: empresa, periodo, fecha de generación, usuario.
- Permitir exportar notas explicativas junto con los estados.

---

## 9. Plan de acción recomendado

### Fase 1: Consolidación del alcance (antes de seguir codificando)

1. Aprobar este documento como línea base contable.
2. Actualizar `README_SISTEMA.md` y `PLAN_SISTEMA.md` para aclarar que el sistema es de análisis financiero, no contabilidad completa.
3. Definir roles de usuario y política de auditoría.

### Fase 2: Mejoras en modelos y validaciones

1. Agregar campos de auditoría a `Empresa` y `Periodo`.
2. Implementar borrado lógico.
3. Reforzar validaciones de negocio en Zod y en servicios.
4. Agregar campo `normativa` a empresa/periodo.

### Fase 3: Completar funcionalidades planificadas

1. Finalizar modelos y rutas de MongoDB.
2. Construir UI de empresas, periodos, estados y reportes.
3. Implementar exportación a Excel con metadatos.
4. Implementar autenticación (Clerk o JWT).

### Fase 4: Pruebas y calidad

1. Escribir pruebas unitarias para todas las fórmulas.
2. Escribir pruebas de integración para API.
3. Realizar pruebas con datos de ejemplo del libro.
4. Revisar seguridad básica (CORS, validación de entrada, autenticación).

### Fase 5: Documentación y despliegue

1. Documentar API con ejemplos.
2. Preparar guía de usuario.
3. Desplegar en entorno de pruebas.
4. Recopilar retroalimentación antes de producción.

---

## 10. Riesgos y consideraciones legales

| Riesgo | Mitigación |
|--------|------------|
| Cálculos contables incorrectos | Pruebas exhaustivas, comparación con ejercicios del libro, revisión por contador. |
| Uso del sistema para fines fiscales sin validación | Incluir descargo de responsabilidad; no promocionar como software fiscal. |
| Pérdida de datos | Backups automáticos, validaciones antes de borrado, borrado lógico. |
| Acceso no autorizado | Autenticación, autorización por empresa, HTTPS en producción. |
| Inconsistencias entre cliente y servidor | Centralizar fórmulas en `shared/`, ejecutar validaciones en servidor. |

---

## 11. Fuentes consultadas

- Block, S., Hirt, G. y Danielsen, B. (2014). *Fundamentos de Administración Financiera* (14ª ed.). McGraw-Hill.
- Wikipedia — Contabilidad, Software contable, Asiento contable, Normas Internacionales de Información Financiera.
- IASB — International Financial Reporting Standards (IFRS).
- Principios de Contabilidad Generalmente Aceptados (PCGA / GAAP).

---

## 12. Conclusión

El proyecto tiene una base técnica sólida y un alcance bien definido como **sistema de análisis financiero**. No debe confundirse con un software contable ERP. Antes de continuar el desarrollo, es recomendable:

1. Reforzar la trazabilidad y auditoría.
2. Documentar los supuestos contables y limitaciones del sistema.
3. Implementar validaciones de negocio robustas.
4. Mantener la arquitectura modular para permitir extensiones futuras.

Este documento debe revisarse periódicamente a medida que el sistema evolucione.
