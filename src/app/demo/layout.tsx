import type { ReactNode } from "react"
import { DemoNav } from "@/components/demo-nav"

export default function DemoLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex flex-1 flex-col">
      <DemoNav />
      <div className="mx-auto w-full max-w-6xl flex-1 px-4 py-6">{children}</div>
    </div>
  )
}
