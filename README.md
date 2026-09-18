# CalleDiario y TresNube

Dos demos en el mismo proyecto:

1. **CalleDiario** — préstamos y cobro diario (cotizador + operación).
2. **TresNube** — ventas, compras e inventarios en la nube, 3 usuarios, local y remoto por web.

Los datos viven en el navegador (`localStorage`). No hay base de datos ni login real.

## Julio (ventas / compras / inventarios)

Paquete listo, no desarrollo a medida de meses:

- Demo operable hoy.
- Producción (nube, 3 cuentas, respaldos): 3–7 días.
- Precio Perú: **S/ 4,500** (licencia de uso, el sistema sigue siendo tuyo) + **S/ 190/mes**.
- Cesión de código / exclusividad: desde **S/ 25,000**.
- No incluye facturación electrónica SUNAT.

Rutas: `/` (cotizador y respuesta a Julio), `/demo` (cobro), `/comercial` (TresNube).

## Precio cobro diario (Perú)

Un independiente con experiencia, para un cliente que ya cobra en la calle:

| Alcance | Cobrar |
| --- | --- |
| Mínimo (clientes, préstamo, cobro del día) | S/ 6,000 – S/ 10,000 |
| Operación real (rutas, recibos, reportes) | S/ 12,000 – S/ 22,000 |
| Calle completa (celular, WhatsApp, GPS, sucursales) | S/ 25,000 – S/ 42,000 |
| Renta mensual si no pagan de golpe | S/ 150 – S/ 450 / mes |

Cobra **50% de anticipo**, 30% cuando ya operan en el sistema y 20% al salir a producción. El mantenimiento mensual no es un extra decorativo: si el sistema se cae un día de cobro, el cliente pierde dinero.

Si el cliente ofrece **S/ 3,000**, no aceptes el sistema completo. A S/ 90/hora son ~33 horas; el núcleo pide cerca de 90. O sube el precio, o entrega solo un Excel / renta mensual.

Ajusta el número en el cotizador.

## Cómo correrlo

```bash
npm install
npm run dev
```

Abre [http://127.0.0.1:43147](http://127.0.0.1:43147).

```bash
npm run build
npm start
```

## Stack

Next.js, TypeScript, Tailwind CSS y shadcn/ui.
