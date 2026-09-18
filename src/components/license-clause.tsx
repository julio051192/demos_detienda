"use client"

import { useState } from "react"
import { Check, Copy } from "lucide-react"
import { Button } from "@/components/ui/button"

export const LICENSE_CLAUSE = `Licencia de uso (no cesión de software)

El Cliente paga S/ 4,500 por la implementación y una licencia de uso no exclusiva e intransferible del sistema (ventas, compras e inventarios) para su negocio, hasta 3 usuarios.

El código, la marca interna del producto y el derecho de venderlo a otros clientes siguen siendo del Prestador. El Cliente no adquiere el código fuente ni puede revenderlo, copiarlo a otro local sin licencia, ni encargar a un tercero que lo clone.

Los datos del Cliente (productos, ventas, compras, usuarios) son del Cliente y se entregan si termina el servicio.

Nube y soporte: S/ 190 al mes. Sin esa cuota no hay hosting ni actualizaciones.

Si el Cliente quiere exclusividad o el código fuente, el precio es otro (cesión): partir de S/ 25,000, y en ese caso el Prestador no puede revender el mismo producto a terceros.`

export function LicenseClause() {
  const [copied, setCopied] = useState(false)

  async function copy() {
    await navigator.clipboard.writeText(LICENSE_CLAUSE)
    setCopied(true)
    setTimeout(() => setCopied(false), 1800)
  }

  return (
    <div className="rounded-xl border bg-card p-4">
      <p className="text-sm font-medium">Cláusula para el contrato (pégala tal cual)</p>
      <pre className="mt-3 overflow-x-auto whitespace-pre-wrap font-sans text-sm leading-relaxed text-muted-foreground">
        {LICENSE_CLAUSE}
      </pre>
      <Button className="mt-3" variant="outline" onClick={copy}>
        {copied ? <Check /> : <Copy />}
        {copied ? "Copiado" : "Copiar cláusula"}
      </Button>
    </div>
  )
}
