export type TableStatus = "free" | "busy" | "bill" | "clean"

export const tableStatuses: Record<TableStatus, { label: string; color: string; dot: string }> = {
  free: { label: "Libre", color: "border-emerald-300 bg-emerald-50 text-emerald-800", dot: "bg-emerald-500" },
  busy: { label: "Ocupada / Servida", color: "border-red-300 bg-red-50 text-red-800", dot: "bg-red-500" },
  bill: { label: "Pidiendo cuenta", color: "border-amber-300 bg-amber-50 text-amber-800", dot: "bg-amber-500" },
  clean: { label: "Por limpiar", color: "border-sky-300 bg-sky-50 text-sky-800", dot: "bg-sky-500" },
}

export const zones = ["Salón Principal", "Terraza", "Barra", "Delivery"] as const

export const dishes = [
  { id: 1, name: "Ceviche clásico", category: "Ceviches & Mariscos", price: 34, image: "https://images.unsplash.com/photo-1535399831218-d5bd36d1a6b3?auto=format&fit=crop&w=700&q=85", description: "Pesca del día, leche de tigre, camote y cancha.", tags: ["Más vendido", "Picante"], station: "cocina" },
  { id: 2, name: "Pollo a la brasa", category: "Pollo a la Brasa", price: 42, image: "https://images.unsplash.com/photo-1598103442097-8b74394b95c6?auto=format&fit=crop&w=700&q=85", description: "Cuarto de pollo, papas crocantes y ensalada fresca.", tags: ["Con guarnición"], station: "cocina" },
  { id: 3, name: "Lomo saltado", category: "Fondos", price: 39, image: "https://images.unsplash.com/photo-1626804475297-41608ea09aeb?auto=format&fit=crop&w=700&q=85", description: "Lomo en tiras, cebolla, tomate, papas y arroz.", tags: ["Favorito"], station: "cocina" },
  { id: 4, name: "Anticuchos de corazón", category: "Entradas", price: 28, image: "https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=700&q=85", description: "Tres brochetas al carbón con papa dorada.", tags: ["A la brasa"], station: "cocina" },
  { id: 5, name: "Chicha morada", category: "Bebidas & Cocteles", price: 10, image: "https://images.unsplash.com/photo-1544145945-f90425340c7e?auto=format&fit=crop&w=700&q=85", description: "Receta de la casa, canela y fruta fresca.", tags: ["Sin alcohol"], station: "bar" },
  { id: 6, name: "Pisco sour clásico", category: "Bebidas & Cocteles", price: 24, image: "https://images.unsplash.com/photo-1551538827-9c037cb4f32a?auto=format&fit=crop&w=700&q=85", description: "Pisco quebranta, limón, clara y amargo.", tags: ["Bar"], station: "bar" },
  { id: 7, name: "Suspiro limeño", category: "Postres", price: 16, image: "https://images.unsplash.com/photo-1551024506-0bccd828d307?auto=format&fit=crop&w=700&q=85", description: "Manjar blanco, merengue y canela.", tags: ["Dulce"], station: "cocina" },
  { id: 8, name: "Tequeños de queso", category: "Entradas", price: 18, image: "https://images.unsplash.com/photo-1601050690597-df0568f70950?auto=format&fit=crop&w=700&q=85", description: "Seis tequeños dorados con salsa de ají amarillo.", tags: ["Para compartir"], station: "cocina" },
]

export const categories = ["Todos", "Entradas", "Ceviches & Mariscos", "Pollo a la Brasa", "Fondos", "Bebidas & Cocteles", "Postres"]
