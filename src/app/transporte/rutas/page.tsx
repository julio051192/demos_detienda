export default function RutasPage() {
  return (
    <main className="space-y-4">
      <h1 className="text-3xl font-bold">Rutas</h1>
      <div className="overflow-hidden rounded-xl border bg-card">
        <table className="w-full text-sm">
          <thead className="bg-muted/60">
            <tr>
              <th className="px-4 py-3 text-left">Ruta</th>
              <th className="px-4 py-3 text-left">Km</th>
              <th className="px-4 py-3 text-left">Estado</th>
              <th className="px-4 py-3 text-left">Costo estimado</th>
            </tr>
          </thead>
          <tbody>
            {[
              ["Lima - Arequipa", "1,200", "En ruta", "S/. 2,340"],
              ["Lima - Trujillo", "560", "Programada", "S/. 1,180"],
              ["Callao - Chimbote", "420", "En tránsito", "S/. 980"],
              ["Cusco - Juliaca", "760", "A tiempo", "S/. 1,540"],
            ].map(([ruta, km, estado, costo]) => (
              <tr key={ruta} className="border-t">
                <td className="px-4 py-3">{ruta}</td>
                <td className="px-4 py-3">{km}</td>
                <td className="px-4 py-3">{estado}</td>
                <td className="px-4 py-3">{costo}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </main>
  )
}
