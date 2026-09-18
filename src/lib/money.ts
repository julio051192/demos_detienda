export function formatMoney(
  amount: number,
  currency = "PEN",
  locale = "es-PE",
) {
  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency,
    maximumFractionDigits: 0,
  }).format(amount)
}

export function formatNumber(n: number, locale = "es-PE") {
  return new Intl.NumberFormat(locale).format(n)
}

export function todayISO() {
  return new Date().toISOString().slice(0, 10)
}

export function addDays(iso: string, days: number) {
  const d = new Date(`${iso}T12:00:00`)
  d.setDate(d.getDate() + days)
  return d.toISOString().slice(0, 10)
}

export function daysBetween(from: string, to: string) {
  const a = new Date(`${from}T12:00:00`).getTime()
  const b = new Date(`${to}T12:00:00`).getTime()
  return Math.round((b - a) / 86_400_000)
}

export function formatShortDate(iso: string) {
  const d = new Date(`${iso}T12:00:00`)
  return d.toLocaleDateString("es-PE", {
    weekday: "short",
    day: "numeric",
    month: "short",
  })
}
