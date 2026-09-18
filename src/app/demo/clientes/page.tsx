"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { useDemoStore } from "@/lib/demo-store"

export default function ClientesPage() {
  const { state, ready, addClient } = useDemoStore()
  const [open, setOpen] = useState(false)
  const [name, setName] = useState("")
  const [phone, setPhone] = useState("")
  const [address, setAddress] = useState("")
  const [neighborhood, setNeighborhood] = useState("")

  if (!ready) {
    return <p className="text-sm text-muted-foreground">Cargando clientes…</p>
  }

  function submit(e: React.FormEvent) {
    e.preventDefault()
    if (!name.trim()) return
    addClient({
      name: name.trim(),
      phone: phone.trim() || "Sin teléfono",
      address: address.trim() || "Sin dirección",
      neighborhood: neighborhood.trim() || "Sin colonia",
    })
    setName("")
    setPhone("")
    setAddress("")
    setNeighborhood("")
    setOpen(false)
  }

  return (
    <div className="space-y-5">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Clientes</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            {state.clients.length === 0
              ? "Aún no hay nadie en cartera."
              : `${state.clients.length} personas en la ruta.`}
          </p>
        </div>
        <Button onClick={() => setOpen(true)}>Alta de cliente</Button>
      </div>

      {state.clients.length === 0 ? (
        <div className="rounded-xl border border-dashed p-8 text-center">
          <p className="font-medium">Cartera vacía</p>
          <p className="mt-1 text-sm text-muted-foreground">
            Agrega al primer cliente para empezar a prestar.
          </p>
        </div>
      ) : (
        <div className="rounded-xl border bg-card">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nombre</TableHead>
                <TableHead>Colonia</TableHead>
                <TableHead>Dirección</TableHead>
                <TableHead>Teléfono</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {state.clients.map((c) => (
                <TableRow key={c.id}>
                  <TableCell className="font-medium">{c.name}</TableCell>
                  <TableCell>{c.neighborhood}</TableCell>
                  <TableCell>{c.address}</TableCell>
                  <TableCell>{c.phone}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-md">
          <form onSubmit={submit} className="grid gap-4">
            <DialogHeader>
              <DialogTitle>Nuevo cliente</DialogTitle>
              <DialogDescription>
                Datos para encontrarlo en la ruta. El teléfono sirve para
                cobrar o avisar.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-3">
              <div className="grid gap-1.5">
                <Label htmlFor="name">Nombre</Label>
                <Input
                  id="name"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Nombre completo"
                />
              </div>
              <div className="grid gap-1.5">
                <Label htmlFor="neighborhood">Colonia / zona</Label>
                <Input
                  id="neighborhood"
                  value={neighborhood}
                  onChange={(e) => setNeighborhood(e.target.value)}
                  placeholder="Los Olivos"
                />
              </div>
              <div className="grid gap-1.5">
                <Label htmlFor="address">Dirección</Label>
                <Input
                  id="address"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="Calle y número"
                />
              </div>
              <div className="grid gap-1.5">
                <Label htmlFor="phone">Teléfono</Label>
                <Input
                  id="phone"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="987 000 000"
                />
              </div>
            </div>
            <DialogFooter>
              <Button type="submit">Guardar</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  )
}
