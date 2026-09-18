export type MarketId = "mx" | "co" | "pe" | "gt" | "sv" | "us"

export type ExperienceId = "junior" | "mid" | "senior" | "studio"

export type ScaleId = "small" | "medium" | "large" | "huge"

export type DeadlineId = "relaxed" | "normal" | "tight" | "rush"

export type ModuleId =
  | "core"
  | "routes"
  | "pwa"
  | "receipts"
  | "whatsapp"
  | "reports"
  | "roles"
  | "gps"
  | "excel"
  | "branches"
  | "clientApp"

export type Market = {
  id: MarketId
  country: string
  currency: string
  locale: string
  hourly: Record<ExperienceId, number>
  saasMonthly: { low: number; high: number }
}

export const MARKETS: Market[] = [
  {
    id: "mx",
    country: "México",
    currency: "MXN",
    locale: "es-MX",
    hourly: { junior: 250, mid: 450, senior: 750, studio: 950 },
    saasMonthly: { low: 799, high: 2490 },
  },
  {
    id: "co",
    country: "Colombia",
    currency: "COP",
    locale: "es-CO",
    hourly: { junior: 40000, mid: 80000, senior: 140000, studio: 180000 },
    saasMonthly: { low: 120000, high: 450000 },
  },
  {
    id: "pe",
    country: "Perú",
    currency: "PEN",
    locale: "es-PE",
    hourly: { junior: 50, mid: 90, senior: 150, studio: 200 },
    saasMonthly: { low: 149, high: 449 },
  },
  {
    id: "gt",
    country: "Guatemala",
    currency: "GTQ",
    locale: "es-GT",
    hourly: { junior: 80, mid: 150, senior: 250, studio: 320 },
    saasMonthly: { low: 250, high: 900 },
  },
  {
    id: "sv",
    country: "El Salvador",
    currency: "USD",
    locale: "es-SV",
    hourly: { junior: 15, mid: 28, senior: 45, studio: 60 },
    saasMonthly: { low: 39, high: 129 },
  },
  {
    id: "us",
    country: "EE. UU. / remoto USD",
    currency: "USD",
    locale: "en-US",
    hourly: { junior: 35, mid: 75, senior: 125, studio: 160 },
    saasMonthly: { low: 49, high: 199 },
  },
]

export const EXPERIENCE: { id: ExperienceId; label: string; hint: string }[] = [
  {
    id: "junior",
    label: "Primera vez / junior",
    hint: "Cobra más barato, pero no regalado: el sistema es crítico todos los días.",
  },
  {
    id: "mid",
    label: "Independiente con experiencia",
    hint: "El rango más común para un freelancer que ya ha entregado web apps.",
  },
  {
    id: "senior",
    label: "Senior / especialista",
    hint: "Si respondes WhatsApp de soporte y conoces el negocio de cobro de calle.",
  },
  {
    id: "studio",
    label: "Estudio / agencia",
    hint: "Incluye PM, QA y un margen de empresa. No compitas con precio de freelancer.",
  },
]

export const SCALE: { id: ScaleId; label: string; factor: number; hint: string }[] =
  [
    {
      id: "small",
      label: "Hasta 100 clientes",
      factor: 1,
      hint: "Un cobrador, una ruta, un dueño.",
    },
    {
      id: "medium",
      label: "100 a 400 clientes",
      factor: 1.12,
      hint: "Varias rutas. Hay que pensar en cortes diarios.",
    },
    {
      id: "large",
      label: "400 a 1,500 clientes",
      factor: 1.28,
      hint: "Varios cobradores, reportes serios, backups.",
    },
    {
      id: "huge",
      label: "Más de 1,500",
      factor: 1.5,
      hint: "Volumen, permisos y rendimiento. Ya no es un MVP.",
    },
  ]

export const DEADLINES: {
  id: DeadlineId
  label: string
  factor: number
}[] = [
  { id: "relaxed", label: "Sin prisa (8+ semanas)", factor: 1 },
  { id: "normal", label: "Plazo normal (5–7 semanas)", factor: 1 },
  { id: "tight", label: "Rápido (3–4 semanas)", factor: 1.22 },
  { id: "rush", label: "Urgente (menos de 3 semanas)", factor: 1.5 },
]

export const MODULES: {
  id: ModuleId
  name: string
  hours: number
  required?: boolean
  description: string
}[] = [
  {
    id: "core",
    name: "Núcleo: clientes, préstamos y cobro del día",
    hours: 88,
    required: true,
    description:
      "Alta de clientes, préstamos con cuota diaria, lista de cobro, mora, dashboard y usuarios básicos.",
  },
  {
    id: "routes",
    name: "Rutas y cobradores",
    hours: 22,
    description:
      "Asignar cartera a cada cobrador, orden de visita y corte de caja por ruta.",
  },
  {
    id: "pwa",
    name: "Uso en celular (PWA / app de calle)",
    hours: 36,
    description:
      "Sirve sin escritorio: marcar cobros en la calle, aunque el internet falle un rato.",
  },
  {
    id: "receipts",
    name: "Recibos para imprimir o compartir",
    hours: 12,
    description: "Ticket de pago, saldo pendiente y comprobante para el cliente.",
  },
  {
    id: "whatsapp",
    name: "Recordatorios por WhatsApp",
    hours: 20,
    description:
      "Avisos de cuota, atraso y confirmación de pago. Requiere API o plantillas.",
  },
  {
    id: "reports",
    name: "Reportes y corte de caja",
    hours: 16,
    description:
      "Cobrado vs esperado, morosos, préstamos nuevos, utilidad y cierre del día.",
  },
  {
    id: "roles",
    name: "Permisos (dueño, supervisor, cobrador)",
    hours: 16,
    description:
      "El cobrador no ve lo mismo que el dueño. Evita fugas de cartera.",
  },
  {
    id: "gps",
    name: "Foto / GPS al cobrar",
    hours: 24,
    description: "Evidencia de visita. Baja discusiones de “yo sí cobré”.",
  },
  {
    id: "excel",
    name: "Exportar a Excel y respaldo",
    hours: 10,
    description: "Cartera, pagos y reportes descargables. El cliente lo pide siempre.",
  },
  {
    id: "branches",
    name: "Varias sucursales",
    hours: 30,
    description: "Más de un punto de operación, con números separados y consolidados.",
  },
  {
    id: "clientApp",
    name: "Consulta de saldo para el prestatario",
    hours: 26,
    description: "El cliente ve su deuda y pagos. Reduce llamadas al cobrador.",
  },
]

export type QuoteInput = {
  marketId: MarketId
  experience: ExperienceId
  scale: ScaleId
  deadline: DeadlineId
  modules: ModuleId[]
  includeSupport: boolean
  clientBudget: number | null
}

export type BudgetVerdict = "ok" | "tight" | "low" | "no"

export type QuoteResult = {
  market: Market
  hours: number
  hourlyRate: number
  base: number
  recommended: number
  low: number
  high: number
  monthlySupport: number
  saasLow: number
  saasHigh: number
  weeks: number
  advance: number
  mid: number
  close: number
  lines: { name: string; hours: number; amount: number }[]
  script: string
  budget: null | {
    amount: number
    hoursCovered: number
    percent: number
    gap: number
    verdict: BudgetVerdict
    reply: string
  }
}

export function getMarket(id: MarketId): Market {
  return MARKETS.find((m) => m.id === id) ?? MARKETS[0]
}

export function calculateQuote(input: QuoteInput): QuoteResult {
  const market = getMarket(input.marketId)
  const hourlyRate = market.hourly[input.experience]
  const scale = SCALE.find((s) => s.id === input.scale) ?? SCALE[0]
  const deadline = DEADLINES.find((d) => d.id === input.deadline) ?? DEADLINES[1]

  const selected = MODULES.filter(
    (m) => m.required || input.modules.includes(m.id),
  )

  const hoursRaw = selected.reduce((sum, m) => sum + m.hours, 0)
  const hours = Math.round(hoursRaw * scale.factor)
  const base = hours * hourlyRate * deadline.factor
  const recommended = Math.round(base / 100) * 100
  const low = Math.round((recommended * 0.88) / 100) * 100
  const high = Math.round((recommended * 1.18) / 100) * 100
  const monthlySupport = input.includeSupport
    ? Math.round((recommended * 0.08) / 50) * 50
    : 0

  const weeks = Math.max(3, Math.round((hours / 28) * deadline.factor))
  const advance = Math.round(recommended * 0.5)
  const mid = Math.round(recommended * 0.3)
  const close = recommended - advance - mid

  const lines = selected.map((m) => ({
    name: m.name,
    hours: Math.round(m.hours * scale.factor),
    amount: Math.round(m.hours * scale.factor * hourlyRate),
  }))

  const fmt = (n: number) =>
    new Intl.NumberFormat(market.locale, {
      style: "currency",
      currency: market.currency,
      maximumFractionDigits: 0,
    }).format(n)

  const script = `Para un sistema web de préstamos con cobro diario (${scale.label.toLowerCase()}), el trabajo son unas ${hours} horas. Mi tarifa es ${fmt(hourlyRate)}/hora. El proyecto queda en ${fmt(recommended)}, con 50% de anticipo (${fmt(advance)}), 30% al entregar la versión usable (${fmt(mid)}) y 20% al salir a producción (${fmt(close)}). Entrega estimada: ${weeks} semanas. El mantenimiento opcional es ${fmt(monthlySupport)} al mes.`

  let budget: QuoteResult["budget"] = null
  if (input.clientBudget && input.clientBudget > 0) {
    const amount = input.clientBudget
    const hoursCovered = Math.max(1, Math.round(amount / hourlyRate))
    const percent = Math.round((amount / recommended) * 100)
    const gap = Math.max(0, recommended - amount)
    let verdict: BudgetVerdict = "ok"
    if (amount < recommended * 0.4) verdict = "no"
    else if (amount < low) verdict = "low"
    else if (amount < recommended) verdict = "tight"

    const rent = fmt(market.saasMonthly.low)
    const reply =
      verdict === "no"
        ? `Con ${fmt(amount)} alcanzan unas ${hoursCovered} horas de trabajo. Este sistema necesita ~${hours} horas. Por ese monto no sale el web: te puedo armar control en Excel + WhatsApp, o rentártelo a ${rent} al mes. El sistema completo parte en ${fmt(low)}.`
        : verdict === "low"
          ? `Con ${fmt(amount)} no cubre el alcance. O recortamos a un mínimo (solo cobro del día, un usuario) cerca de ${fmt(low)}, o lo rentamos mes a mes. El precio del trabajo completo es ${fmt(recommended)}.`
          : verdict === "tight"
            ? `${fmt(amount)} queda justo. Lo acepto si recortamos módulos y firmamos que lo demás es extra. El precio del alcance actual es ${fmt(recommended)}.`
            : `${fmt(amount)} cubre este alcance. Cierra con 50% de anticipo.`

    budget = { amount, hoursCovered, percent, gap, verdict, reply }
  }

  return {
    market,
    hours,
    hourlyRate,
    base,
    recommended,
    low,
    high,
    monthlySupport,
    saasLow: market.saasMonthly.low,
    saasHigh: market.saasMonthly.high,
    weeks,
    advance,
    mid,
    close,
    lines,
    script,
    budget,
  }
}

export const DEFAULT_QUOTE: QuoteInput = {
  marketId: "pe",
  experience: "mid",
  scale: "medium",
  deadline: "normal",
  modules: ["core", "routes", "receipts", "reports", "excel"],
  includeSupport: true,
  clientBudget: 3000,
}
