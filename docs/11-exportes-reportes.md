# Subplan: Exportes y Reportes

## Objetivo
Permitir exportar los estados financieros, razones y análisis a Excel y PDF.

## Exportación a Excel

Usar **ExcelJS** en el servidor.

### Hojas del reporte
1. Portada
2. Estado de resultados
3. Balance general
4. Flujo de efectivo
5. Razones financieras
6. Análisis vertical
7. Análisis horizontal
8. Análisis Du Pont
9. Pronósticos

## Exportación a PDF

Opciones:
- Generar HTML y convertir con Puppeteer/Playwright.
- Usar librería como `pdfmake` o `react-pdf`.

## API / Server functions

- `exportarExcel(periodoId)` — Retorna archivo .xlsx.
- `exportarPDF(periodoId)` — Retorna archivo .pdf.

## Componentes UI

- `ExportButtons` — Botones de descarga.
- `ReportPreview` — Vista previa del reporte.

## Relación con otras funcionalidades

- Consume todos los cálculos previos.
