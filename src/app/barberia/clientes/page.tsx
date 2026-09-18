import Link from "next/link"
import { ArrowLeft, MessageCircle, Search, UserRound } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

const clients = [
  { name: "Marco Salazar", phone: "+51 987 321 654", level: "Diamond", stamps: "10 / 10", lastVisit: "Hoy" },
  { name: "Luis Mendoza", phone: "+51 945 210 876", level: "Platinum", stamps: "4 / 5", lastVisit: "Hace 12 min" },
  { name: "Renzo Paredes", phone: "+51 912 445 870", level: "Platinum", stamps: "2 / 5", lastVisit: "Hace 46 min" },
]

export default function BarberiaClientesPage() {
  return (
    <main className="space-y-6">
      <PageHeading title="Clientes" description="Consulta niveles, sellos y última visita de cada cliente." />
      <div className="flex items-center gap-2 rounded-lg border border-stone-200 bg-white px-3 py-2 text-sm text-stone-400"><Search className="size-4" /> Buscar por nombre o teléfono</div>
      <Card className="border-stone-200 bg-white"><CardHeader><CardTitle className="text-lg text-stone-900">248 clientes registrados</CardTitle></CardHeader><CardContent className="space-y-2">{clients.map((client) => <div key={client.name} className="flex flex-wrap items-center gap-3 rounded-md border border-stone-100 p-3"><span className="grid size-9 place-items-center rounded-full bg-stone-100 text-stone-600"><UserRound className="size-4" /></span><div className="min-w-44 flex-1"><p className="font-medium text-stone-800">{client.name}</p><p className="text-xs text-stone-500">{client.phone} · Última visita: {client.lastVisit}</p></div><Badge variant="outline" className={client.level === "Diamond" ? "border-violet-200 text-violet-700" : "border-amber-200 text-amber-700"}>{client.level}</Badge><span className="text-sm font-semibold text-stone-700">{client.stamps}</span><Button variant="outline" size="sm"><MessageCircle className="mr-1.5 size-3.5" /> WhatsApp</Button></div>)}</CardContent></Card>
    </main>
  )
}

function PageHeading({ title, description }: { title: string; description: string }) {
  return <div className="flex flex-col gap-3 border-b border-stone-300 pb-5 sm:flex-row sm:items-end sm:justify-between"><div><Link href="/barberia" className="mb-2 inline-flex items-center gap-1 text-xs font-medium text-amber-700"><ArrowLeft className="size-3" /> Volver al panel</Link><h1 className="font-serif text-3xl font-bold text-stone-900">{title}</h1><p className="mt-1 text-sm text-stone-600">{description}</p></div></div>
}
