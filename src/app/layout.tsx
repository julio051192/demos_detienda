import type { Metadata } from "next"
import { Geist } from "next/font/google"
import { SiteHeader } from "@/components/site-header"
import "./globals.css"

const geist = Geist({
  subsets: ["latin"],
  variable: "--font-geist-sans",
})

export const metadata: Metadata = {
  title: "Sistema Lalo — Ventas, Compras e Inventarios en la Nube",
  description:
    "Sistema comercial web para operar en red local y remoto con 3 usuarios simultáneos: Ventas, Compras, Inventarios y Almacén.",
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es" className={`${geist.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col bg-background text-foreground">
        <SiteHeader />
        {children}
      </body>
    </html>
  )
}
