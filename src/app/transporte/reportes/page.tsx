export default function ReportesPage() {
  return (
    <main className="space-y-4">
      <h1 className="text-3xl font-bold">Reportes</h1>
      <div className="grid gap-4 md:grid-cols-3">
        <div className="rounded-xl border bg-card p-4">
          <p className="text-sm text-muted-foreground">Eficiencia</p>
          <p className="mt-2 text-2xl font-bold">92%</p>
        </div>
        <div className="rounded-xl border bg-card p-4">
          <p className="text-sm text-muted-foreground">Costo por km</p>
          <p className="mt-2 text-2xl font-bold">S/. 5.42</p>
        </div>
        <div className="rounded-xl border bg-card p-4">
          <p className="text-sm text-muted-foreground">Utilidad</p>
          <p className="mt-2 text-2xl font-bold text-emerald-600">S/. 4,900</p>
        </div>
      </div>
    </main>
  )
}
