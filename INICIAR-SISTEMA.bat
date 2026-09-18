@echo off
title Sistema Demos - Servidor Local
echo ====================================================
echo        INICIANDO SISTEMAS DEMO MULTI-NEGOCIO
echo ====================================================
echo.
echo Modulos disponibles:
echo  1. Sistema Lalo (Comercial ERP: Ventas, Compras, Stock, 3 Puestos)
echo  2. Licoreria (POS, Codigo de Barras, Control de Stock, Ventas)
echo  3. Hotel y Hospedaje (Rack en vivo, Check-in DNI, Frigobar, Check-out)
echo  4. Car Wash (Pista y Bahias, Recepcion por Placa, Comisiones)
echo  5. Lavanderia (Recepcion por Kilos/Prendas, Tickets, Entregas)
echo  6. Prestamos y Cobranzas (Clientes, Creditos, Cuotas)
echo.
echo Abriendo navegador en http://127.0.0.1:43147 ...
start http://127.0.0.1:43147
echo.
call npm run dev
pause
