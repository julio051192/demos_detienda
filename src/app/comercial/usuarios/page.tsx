"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { roleLabel, useErpStore } from "@/lib/erp-store"

export default function UsuariosPage() {
  const { state, ready } = useErpStore()

  if (!ready) {
    return <p className="text-sm text-muted-foreground">Cargando puestos…</p>
  }

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Tres usuarios en red</h1>
        <p className="mt-1 max-w-2xl text-sm text-muted-foreground">
          Mínimo pedido por Julio: tres puestos simultáneos, local (caja /
          almacén) y remoto (oficina o casa) por navegador. Cambia de usuario
          arriba para simular cada puesto.
        </p>
      </div>
      <div className="grid gap-3 sm:grid-cols-3">
        {state.users.map((u) => (
          <Card key={u.id}>
            <CardHeader>
              <Badge variant="secondary">{roleLabel(u.role)}</Badge>
              <CardTitle>{u.name}</CardTitle>
              <CardDescription>{u.seat}</CardDescription>
            </CardHeader>
            <CardContent className="text-sm text-muted-foreground">
              {u.role === "admin"
                ? "Ve ventas, compras, stock y puede operar todo."
                : u.role === "sales"
                  ? "Caja: registra ventas y consulta precios/stock."
                  : "Almacén: ingresos por compra y control de mínimos."}
            </CardContent>
          </Card>
        ))}
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Cómo se instala en la nube</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 text-sm text-muted-foreground">
          <p>
            Es un sistema web. En la red local todos entran a la misma dirección
            (Wi‑Fi de la tienda). En remoto, al mismo sistema publicado en
            internet. No hay que instalar un programa en cada PC: solo el
            navegador.
          </p>
          <p>
            Puesta en operación inmediata: esta demo ya corre. Producción con
            dominio, 3 cuentas con contraseña y respaldo diario: 3 a 7 días
            después del adelanto. Facturación electrónica SUNAT no está incluida.
          </p>
          <p>
            A S/ 4,500 el cliente compra una licencia de uso, no el código. El
            producto se puede instalar a otros negocios. Si piden exclusividad,
            el precio es cesión (desde S/ 25,000).
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
