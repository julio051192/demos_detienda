"use client"

import Link from "next/link"
import { ArrowLeft, CircleCheck, ClipboardList } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export function ModulePlaceholder({
  business,
  title,
  description,
  items,
  accent = "rose",
}: {
  business: string
  title: string
  description: string
  items: string[]
  accent?: "rose" | "sky"
}) {
  const color = accent === "sky" ? "text-sky-600" : "text-rose-600"
  return <div className="space-y-6"><div className="flex items-center gap-3"><Button variant="outline" size="sm" render={<Link href={accent === "sky" ? "/textil" : "/floreria"} />}><ArrowLeft className="mr-1.5 size-4" />Resumen</Button><span className="text-sm text-muted-foreground">{business}</span></div><div><p className={`text-sm font-medium ${color}`}>Módulo operativo</p><h1 className="mt-1 text-2xl font-bold tracking-tight">{title}</h1><p className="mt-1 text-sm text-muted-foreground">{description}</p></div><div className="grid gap-4 lg:grid-cols-[1.1fr_.9fr]"><Card><CardHeader><CardTitle className="flex items-center gap-2"><ClipboardList className={color} />Panel de trabajo</CardTitle></CardHeader><CardContent className="space-y-3">{items.map((item) => <div key={item} className="flex items-center gap-2 rounded-lg border p-3 text-sm"><CircleCheck className={`size-4 ${color}`} />{item}</div>)}<Button>Registrar nuevo</Button></CardContent></Card><Card><CardHeader><CardTitle>Resumen del módulo</CardTitle></CardHeader><CardContent className="space-y-3"><div className="rounded-lg bg-muted p-4"><p className="text-xs text-muted-foreground">Estado</p><p className="text-xl font-semibold">Listo para operar</p></div><p className="text-sm text-muted-foreground">Los registros de este módulo se integrarán con clientes, inventario, caja y despacho.</p></CardContent></Card></div></div>
}
