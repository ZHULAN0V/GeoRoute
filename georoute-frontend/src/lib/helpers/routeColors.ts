/** Цвет линии на карте: сначала вариант, иначе маршрут, иначе запасной */
export const DEFAULT_ROUTE_COLOR = '#2563eb'

/** Случайный насыщенный HEX для нового маршрута */
export function randomRouteHexColor(): string {
  const n = Math.floor(Math.random() * 0xffffff)
  return `#${n.toString(16).padStart(6, '0')}`
}

export function resolveRouteLineColor(
  variantColor: string | undefined,
  pathColor: string | undefined,
  fallback: string = DEFAULT_ROUTE_COLOR
): string {
  const v = variantColor?.trim()
  if (v) return v
  const p = pathColor?.trim()
  if (p) return p
  return fallback
}
