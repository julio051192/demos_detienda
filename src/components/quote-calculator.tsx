"use client"

import { useMemo, useState, type ReactNode } from "react"
import { Check, Copy, Printer } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Switch } from "@/components/ui/switch"
import {
  calculateQuote,
  DEADLINES,
  DEFAULT_QUOTE,
  EXPERIENCE,
  MARKETS,
  MODULES,
  SCALE,
  type DeadlineId,
  type ExperienceId,
  type MarketId,
  type ModuleId,
  type QuoteInput,
  type ScaleId,
} from "@/lib/pricing"
import { formatMoney } from "@/lib/money"
import { cn } from "@/lib/utils"

const selectClass =
  "h-9 w-full rounded-lg border border-input bg-background px-2.5 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"

export function QuoteCalculator() {
  const [input, setInput] = useState<QuoteInput>(DEFAULT_QUOTE)
  const [copied, setCopied] = useState(false)
  const quote = useMemo(() => calculateQuote(input), [input])
  const money = (n: number) =>
    formatMoney(n, quote.market.currency, quote.market.locale)

  function toggleModule(id: ModuleId) {
    if (id === "core") return
    setInput((prev) => {
      const has = prev.modules.includes(id)
      return {
        ...prev,
        modules: has
          ? prev.modules.filter((m) => m !== id)
          : [...prev.modules, id],
      }
    })
  }

  async function copyScript() {
    const text = quote.budget?.reply
      ? `${quote.budget.reply}\n\n${quote.script}`
      : quote.script
    await navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 1800)
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[1.15fr_0.85fr]">
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Tu contexto</CardTitle>
            <CardDescription>
              El precio cambia más por país, experiencia y tamaño de cartera que
              por “hacer una página web”.
            </CardDescription>
          </CardHeader>
          <CardContent className="grid gap-4 sm:grid-cols-2">
            <Field label="País / moneda">
              <select
                className={selectClass}
                value={input.marketId}
                onChange={(e) =>
                  setInput({ ...input, marketId: e.target.value as MarketId })
                }
              >
                {MARKETS.map((m) => (
                  <option key={m.id} value={m.id}>
                    {m.country} · {m.currency}
                  </option>
                ))}
              </select>
            </Field>
            <Field label="Tu nivel">
              <select
                className={selectClass}
                value={input.experience}
                onChange={(e) =>
                  setInput({
                    ...input,
                    experience: e.target.value as ExperienceId,
                  })
                }
              >
                {EXPERIENCE.map((e) => (
                  <option key={e.id} value={e.id}>
                    {e.label}
                  </option>
                ))}
              </select>
            </Field>
            <Field label="Tamaño del cliente">
              <select
                className={selectClass}
                value={input.scale}
                onChange={(e) =>
                  setInput({ ...input, scale: e.target.value as ScaleId })
                }
              >
                {SCALE.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.label}
                  </option>
                ))}
              </select>
            </Field>
            <Field label="Plazo">
              <select
                className={selectClass}
                value={input.deadline}
                onChange={(e) =>
                  setInput({
                    ...input,
                    deadline: e.target.value as DeadlineId,
                  })
                }
              >
                {DEADLINES.map((d) => (
                  <option key={d.id} value={d.id}>
                    {d.label}
                  </option>
                ))}
              </select>
            </Field>
            <div className="sm:col-span-2">
              <Field label="Lo que el cliente quiere pagar">
                <Input
                  inputMode="numeric"
                  className="h-9"
                  value={input.clientBudget ?? ""}
                  onChange={(e) => {
                    const raw = e.target.value.replace(/[^\d]/g, "")
                    setInput({
                      ...input,
                      clientBudget: raw ? Number(raw) : null,
                    })
                  }}
                  placeholder="3000"
                />
              </Field>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Qué le vas a entregar</CardTitle>
            <CardDescription>
              Un sistema de cobro diario no es un CRUD. Si el cobrador no puede
              marcar pagos en la calle, el cliente no lo usa.
            </CardDescription>
          </CardHeader>
          <CardContent className="grid gap-2">
            {MODULES.map((mod) => {
              const on = mod.required || input.modules.includes(mod.id)
              return (
                <button
                  key={mod.id}
                  type="button"
                  disabled={mod.required}
                  onClick={() => toggleModule(mod.id)}
                  className={cn(
                    "flex items-start gap-3 rounded-xl border px-3 py-3 text-left transition-colors",
                    on
                      ? "border-primary/40 bg-primary/5"
                      : "border-border hover:bg-muted/60",
                    mod.required && "cursor-default opacity-95",
                  )}
                >
                  <span
                    className={cn(
                      "mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-md border",
                      on
                        ? "border-primary bg-primary text-primary-foreground"
                        : "border-input bg-background",
                    )}
                  >
                    {on ? <Check className="size-3.5" /> : null}
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="flex flex-wrap items-baseline justify-between gap-2">
                      <span className="font-medium">{mod.name}</span>
                      <span className="text-xs text-muted-foreground">
                        {mod.hours} h
                        {mod.required ? " · incluido" : ""}
                      </span>
                    </span>
                    <span className="mt-0.5 block text-sm text-muted-foreground">
                      {mod.description}
                    </span>
                  </span>
                </button>
              )
            })}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between gap-4">
            <div>
              <CardTitle>Soporte mensual</CardTitle>
              <CardDescription>
                Este negocio no puede quedarse sin sistema un lunes. Cobra
                mantenimiento o vas a dar soporte gratis para siempre.
              </CardDescription>
            </div>
            <Switch
              checked={input.includeSupport}
              onCheckedChange={(v) =>
                setInput({ ...input, includeSupport: Boolean(v) })
              }
            />
          </CardHeader>
        </Card>
      </div>

      <div className="lg:sticky lg:top-20 h-fit space-y-4">
        <Card className="overflow-hidden print:ring-0">
          <CardHeader className="bg-primary text-primary-foreground">
            <CardDescription className="text-primary-foreground/80">
              Precio recomendado para este alcance
            </CardDescription>
            <CardTitle className="font-heading text-4xl tracking-tight sm:text-5xl">
              {money(quote.recommended)}
            </CardTitle>
            <p className="text-sm text-primary-foreground/80">
              Rango sano: {money(quote.low)} – {money(quote.high)}
            </p>
          </CardHeader>
          <CardContent className="space-y-4 pt-4">
            <dl className="grid grid-cols-2 gap-3 text-sm">
              <Stat label="Horas estimadas" value={`${quote.hours} h`} />
              <Stat
                label="Tu tarifa"
                value={`${money(quote.hourlyRate)}/h`}
              />
              <Stat label="Entrega" value={`${quote.weeks} semanas`} />
              <Stat
                label="Mantenimiento"
                value={
                  quote.monthlySupport
                    ? `${money(quote.monthlySupport)}/mes`
                    : "Sin incluir"
                }
              />
            </dl>

            {quote.budget ? (
              <div
                className={cn(
                  "rounded-xl border p-3 text-sm",
                  quote.budget.verdict === "no" &&
                    "border-destructive/40 bg-destructive/10",
                  quote.budget.verdict === "low" &&
                    "border-destructive/30 bg-destructive/5",
                  quote.budget.verdict === "tight" && "bg-muted/70",
                  quote.budget.verdict === "ok" && "border-primary/30 bg-primary/5",
                )}
              >
                <p className="font-medium">
                  {quote.budget.verdict === "no"
                    ? `No. ${money(quote.budget.amount)} no alcanza`
                    : quote.budget.verdict === "low"
                      ? `${money(quote.budget.amount)} se queda corto`
                      : quote.budget.verdict === "tight"
                        ? `${money(quote.budget.amount)} queda justo`
                        : `${money(quote.budget.amount)} cubre el trabajo`}
                </p>
                <p className="mt-1 text-muted-foreground">
                  Eso son {quote.budget.hoursCovered} h de las {quote.hours} h
                  ({quote.budget.percent}%). Te faltan{" "}
                  {money(quote.budget.gap)}.
                </p>
              </div>
            ) : null}

            <div className="rounded-xl bg-muted/70 p-3 text-sm">
              <p className="font-medium">Cómo cobrárselo</p>
              <ul className="mt-2 space-y-1 text-muted-foreground">
                <li>50% anticipo · {money(quote.advance)}</li>
                <li>30% al dejarlo usable · {money(quote.mid)}</li>
                <li>20% al salir a producción · {money(quote.close)}</li>
              </ul>
            </div>

            <div className="space-y-1 text-sm">
              <p className="font-medium">Desglose</p>
              {quote.lines.map((line) => (
                <div
                  key={line.name}
                  className="flex items-start justify-between gap-3 text-muted-foreground"
                >
                  <span className="leading-snug">{line.name}</span>
                  <span className="shrink-0 tabular-nums">
                    {money(line.amount)}
                  </span>
                </div>
              ))}
            </div>

            <div className="rounded-xl border p-3 text-sm">
              <p className="font-medium">Si no quieres proyecto cerrado</p>
              <p className="mt-1 text-muted-foreground">
                En {quote.market.country} un SaaS de cobro diario se renta entre{" "}
                {money(quote.saasLow)} y {money(quote.saasHigh)} al mes. Úsalo
                si el cliente es chico o no quiere pagar de golpe.
              </p>
            </div>

            <div className="flex flex-wrap gap-2 print:hidden">
              <Button onClick={copyScript}>
                {copied ? <Check /> : <Copy />}
                {copied ? "Copiado" : "Copiar texto para el cliente"}
              </Button>
              <Button variant="outline" onClick={() => window.print()}>
                <Printer />
                Imprimir cotización
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Qué decirle, sin rodeos</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm leading-relaxed text-muted-foreground">
              {quote.budget?.reply ?? quote.script}
            </p>
            {quote.budget?.reply ? (
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                {quote.script}
              </p>
            ) : null}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

function Field({
  label,
  children,
}: {
  label: string
  children: ReactNode
}) {
  return (
    <div className="grid gap-1.5">
      <Label>{label}</Label>
      {children}
    </div>
  )
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg bg-muted/60 px-3 py-2">
      <dt className="text-xs text-muted-foreground">{label}</dt>
      <dd className="font-medium">{value}</dd>
    </div>
  )
}
