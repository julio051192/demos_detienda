"use client"

import { useState } from "react"
import { Check, Copy } from "lucide-react"
import { Button } from "@/components/ui/button"

export const JULIO_REPLY = `Julio, buenas tardes.

Le confirmo el requerimiento:

• Sistema instalable en la nube, operable en red.
• Mínimo 3 usuarios simultáneos, en local (tienda / oficina) y en remoto, por navegador (protocolo web). No se instala un programa en cada PC.
• Módulos: Ventas, Compras e Inventarios, conectados (la venta descuenta stock y la compra lo ingresa).

¿Está disponible para puesta en operación inmediata?
La demo ya se puede recorrer ahora. La puesta en producción (nube, 3 usuarios, respaldos) queda en 3 a 7 días después del adelanto. No es un desarrollo de meses.

Propuesta económica
Implementación y licencia de uso para su negocio (hasta 3 usuarios): S/ 4,500
Nube y soporte: S/ 190 al mes

Forma de pago: 50% para publicar (S/ 2,250) y 50% al dejarlos operando.

Aclaración importante: S/ 4,500 es licencia de uso, no venta del código. El sistema queda instalado para ustedes; el software sigue siendo del prestador y se puede licenciar a otros clientes. Sus datos (productos, ventas, compras) son de ustedes. Si requirieran exclusividad o el código fuente, eso es otro alcance y otro precio.

No incluye facturación electrónica SUNAT ni contabilidad; iría como módulo aparte.

Quedo atento para coordinar la demo y la fecha de arranque.

Saludos.`

export function JulioReply() {
  const [copied, setCopied] = useState(false)

  async function copy() {
    await navigator.clipboard.writeText(JULIO_REPLY)
    setCopied(true)
    setTimeout(() => setCopied(false), 1800)
  }

  return (
    <div className="rounded-xl border bg-card p-4">
      <p className="text-sm font-medium">Texto para responderle a Julio</p>
      <pre className="mt-3 overflow-x-auto whitespace-pre-wrap font-sans text-sm leading-relaxed text-muted-foreground">
        {JULIO_REPLY}
      </pre>
      <Button className="mt-3" onClick={copy}>
        {copied ? <Check /> : <Copy />}
        {copied ? "Copiado" : "Copiar respuesta"}
      </Button>
    </div>
  )
}
