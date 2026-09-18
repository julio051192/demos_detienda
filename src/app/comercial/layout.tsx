import type { ReactNode } from "react"
import { ErpNav } from "@/components/erp-nav"

export default function ComercialLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex flex-1 flex-col">
      <ErpNav />
      <div className="mx-auto w-full max-w-6xl flex-1 px-4 py-6">{children}</div>
    </div>
  )
}
