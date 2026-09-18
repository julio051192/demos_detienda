export default function FlotaPage() {
  return (
    <main className="space-y-4">
      <h1 className="text-3xl font-bold">Flota</h1>
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        <div className="rounded-xl border bg-card p-4">
          <p className="text-sm text-muted-foreground">Camión Hino</p>
          <p className="mt-2 text-2xl font-bold">S/. 12,300</p>
          <p className="mt-1 text-xs text-emerald-600">Operativo</p>
        </div>
        <div className="rounded-xl border bg-card p-4">
          <p className="text-sm text-muted-foreground">Cisterna</p>
          <p className="mt-2 text-2xl font-bold">S/. 9,400</p>
          <p className="mt-1 text-xs text-amber-600">En servicio</p>
        </div>
        <div className="rounded-xl border bg-card p-4">
          <p className="text-sm text-muted-foreground">Pickup</p>
          <p className="mt-2 text-2xl font-bold">S/. 6,800</p>
          <p className="mt-1 text-xs text-blue-600">Activo</p>
        </div>
      </div>
    </main>
  )
}
