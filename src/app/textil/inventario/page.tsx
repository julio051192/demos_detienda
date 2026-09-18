import { ModulePlaceholder } from "@/components/module-placeholder"

export default function TextilInventarioPage() {
  return <ModulePlaceholder business="Textil & Confecciones" title="Inventario de Telas" description="Controla metros por tipo y color, con alertas de reposición." items={["Gabardina azul marino · 42 m", "Drill beige · 8 m · Reponer", "Jean índigo · 26 m", "Pima blanca · 15 m"]} accent="sky" />
}
