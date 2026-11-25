# Manual de uso — Industrias Plásticas Altamira, S.A.

## 1. Inicio rápido

1. Instale las dependencias:
   ```bash
   npm install
   ```
2. Inicie el servidor de desarrollo:
   ```bash
   npm run dev
   ```
3. Abra http://localhost:8000 en su navegador.
4. El menú superior muestra los siete módulos del aplicativo.
5. El caso base del parcial ya está cargado. Cualquier cambio se guarda al presionar **Guardar cambios**.

También puede usar `npm start` para ejecutar sin recarga automática, o `python3 -m http.server 8000` como alternativa.

## 2. Captura y validación

En este módulo se editan:

- Los saldos históricos 2023 y 2024 (columnas de saldo).
- Los movimientos de 2025 en las columnas **Debe** y **Haber**.
- Los parámetros: acciones, ISR, días comerciales, unidades y precios de productos, precio de mercado por acción.

El sistema informa si la balanza 2025 no cuadra, si el balance no cuadra, si el ISR calculado difiere de la cuenta 27 o si las ventas por producto no concilian con la cuenta 50.

### Importar y exportar CSV

- **Exportar CSV** descarga la balanza actual para respaldo o edición externa.
- **Importar CSV** carga un archivo con las columnas `id, cuenta, grupo, naturaleza, saldo_2023, saldo_2024, debe_2025, haber_2025`.

## 3. Estados financieros

Los módulos 2, 3 y 4 muestran:

- **Estado de resultados** 2024 y 2025, con ventas netas, costos, gastos, UAII, UAI, ISR y utilidad neta.
- **Balance general** comparativo, activos, pasivos, capital contable y conciliación de utilidades retenidas.
- **Flujo de efectivo** por el método indirecto: operación, inversión, financiamiento, variación de caja y flujo libre.

## 4. Razones financieras

El módulo 5 calcula las 13 razones del caso, las compara con el promedio de la industria y usa semáforos:

- 🟢 Favorable
- 🟡 Igual a referencia
- 🔴 Desfavorable

También descompone el ROE con el sistema Du Pont y muestra el aporte de margen, rotación y apalancamiento.

## 5. Análisis horizontal y vertical

El módulo 6 presenta:

- Cambios absolutos y porcentuales del estado de resultados y el balance.
- Participación de cada partida sobre ventas netas o activo total.
- Dos gráficos de barras: cambio porcentual clave y estructura de financiamiento.

## 6. Indicadores complementarios

El módulo 7 resuelve los literales a–g:

- Escudo fiscal de depreciación y amortización.
- Costo de intereses y arrendamientos después de ISR.
- Valor en libros, UPA, dividendo por acción y relación P/U.
- Conciliación de ventas por producto.
- Utilidad neta frente a flujo de operación.
- Descomposición Du Pont.
- Costo de la política de crédito.

## 7. Restaurar caso base

Para volver a los datos originales del parcial, use el botón **Restaurar caso base** en el módulo de captura. Esta acción elimina los cambios guardados en el navegador.

## 8. Sustentación

Durante la sustentación puede:

1. Mostrar el caso base en cualquier módulo.
2. Modificar una cuenta en Captura y explicar el efecto esperado.
3. Verificar inmediatamente el cambio en estados, razones e indicadores.
4. Restaurar el caso base para la siguiente demostración.

## 9. Solución de problemas

| Síntoma | Causa probable | Solución |
| --- | --- | --- |
| Alerta de balanza descuadrada | Debe ≠ Haber en 2025 | Revisar el lado contable de la cuenta editada y su contrapartida. |
| Alerta de balance descuadrado | Activos ≠ Pasivos + Capital | Verificar cuentas de activo, pasivo, capital y retenidas. |
| ISR difiere de cuenta 27 | Cambio en UAI no reflejado en la cuenta 27 | Ajustar la cuenta 27 al 25 % de la UAI. |
| Ventas por producto difieren | Unidades o precios incorrectos | Revisar parámetros de productos. |
