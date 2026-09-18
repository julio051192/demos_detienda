'use client'

import { Suspense } from 'react'
import { useSearchParams } from 'next/navigation'

function CheckinForm() {
  const searchParams = useSearchParams()
  const habitacion = searchParams.get('habitacion') || 'No especificada'

  return (
    <div className="p-6 max-w-lg mx-auto bg-white rounded-lg shadow-md mt-6">
      <h1 className="text-2xl font-bold mb-4">Registro de Check-in</h1>
      <p className="mb-4 text-gray-600">Habitación seleccionada: <strong className="text-black">{habitacion}</strong></p>
      
      <form onSubmit={(e) => e.preventDefault()} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Nombre del Huésped</label>
          <input type="text" placeholder="Ingrese el nombre" className="mt-1 block w-full border border-gray-300 rounded-md p-2" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Documento de Identidad (DNI/Pasaporte)</label>
          <input type="text" placeholder="Número de documento" className="mt-1 block w-full border border-gray-300 rounded-md p-2" />
        </div>
        <button type="submit" className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition">
          Confirmar Check-in
        </button>
      </form>
    </div>
  )
}

export default function CheckinPage() {
  return (
    <Suspense fallback={<p className="p-4 text-center">Cargando check-in...</p>}>
      <CheckinForm />
    </Suspense>
  )
}