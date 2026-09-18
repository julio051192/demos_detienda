export default function CostosPage() {
  return (
    <main className="space-y-4">
      <h1 className="text-3xl font-bold">Costos operativos</h1>
      <div className="grid gap-4 md:grid-cols-2">
        <div className="rounded-xl border bg-card p-4">
          <p className="text-sm text-muted-foreground">Combustible</p>
          <p className="mt-2 text-2xl font-bold">S/. 5,230</p>
        </div>
        <div className="rounded-xl border bg-card p-4">
          <p className="text-sm text-muted-foreground">Personal</p>
          <p className="mt-2 text-2xl font-bold">S/. 7,420</p>
        </div>
        <div className="rounded-xl border bg-card p-4">
          <p className="text-sm text-muted-foreground">Mantenimiento</p>
          <p className="mt-2 text-2xl font-bold">S/. 2,660</p>
        </div>
        <div className="rounded-xl border bg-card p-4">
          <p className="text-sm text-muted-foreground">Total operativo</p>
          <p className="mt-2 text-2xl font-bold text-emerald-600">S/. 18,420</p>
        </div>
      </div>
    </main>
  )
}
