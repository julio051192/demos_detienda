'use client'

import { Suspense } from 'react'

function CheckinForm() {
  return (
    <div>
      {/* Componente de check-in */}
    </div>
  )
}

export default function CheckinPage() {
  return (
    <Suspense fallback={<p className="p-4">Cargando check-in...</p>}>
      <CheckinForm />
    </Suspense>
  )
}
