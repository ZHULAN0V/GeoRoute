import type { IPath, IPointsObject, IPoint, ISegment, IMarker } from '../../services/types/Path'

const EARTH_RADIUS_M = 6371000

function toRad(deg: number): number {
  return (deg * Math.PI) / 180
}

export function haversineM(a: { lat: number; lng: number }, b: { lat: number; lng: number }): number {
  const dLat = toRad(b.lat - a.lat)
  const dLng = toRad(b.lng - a.lng)
  const lat1 = toRad(a.lat)
  const lat2 = toRad(b.lat)
  const h =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLng / 2) ** 2
  return 2 * EARTH_RADIUS_M * Math.asin(Math.min(1, Math.sqrt(h)))
}

export function getOrderedPoints(points: IPointsObject): IPoint[] {
  const arr = Object.values(points)
  if (arr.length === 0) return []

  const byId = new Map(arr.map((p) => [p.id, p]))
  let head = arr.find((p) => p.prevId === '')
  if (!head) head = arr[0]

  const result: IPoint[] = []
  const visited = new Set<string>()
  let cur: IPoint | undefined = head
  while (cur && !visited.has(cur.id)) {
    visited.add(cur.id)
    result.push(cur)
    cur = cur.nextId ? byId.get(cur.nextId) : undefined
  }
  for (const p of arr) {
    if (!visited.has(p.id)) result.push(p)
  }
  return result
}

export function getOrderedMarkers(path: IPath): IMarker[] {
  return Object.values(path.markers).sort((a, b) => a.order - b.order)
}

/** Full polyline for a segment variant including the bounding markers */
export function getSegmentPolyline(
  seg: ISegment,
  variantId: string,
  markers: Record<string, IMarker>,
): { lat: number; lng: number }[] {
  const from = markers[seg.fromMarkerId]
  const to = markers[seg.toMarkerId]
  if (!from || !to) return []
  const variant = seg.variants[variantId]
  if (!variant) return [from, to]
  const ordered = getOrderedPoints(variant.points)
  return [from, ...ordered, to]
}

export function getPolylineLengthKm(ordered: { lat: number; lng: number }[]): number {
  if (ordered.length < 2) return 0
  let m = 0
  for (let i = 1; i < ordered.length; i++) {
    m += haversineM(ordered[i - 1], ordered[i])
  }
  return m / 1000
}

export function getSegmentLengthKm(
  seg: ISegment,
  variantId: string,
  markers: Record<string, IMarker>,
): number {
  return getPolylineLengthKm(getSegmentPolyline(seg, variantId, markers))
}

/** Base polyline length: all ordered markers connected */
export function getBasePolylineLengthKm(route: IPath): number {
  const markers = getOrderedMarkers(route)
  return getPolylineLengthKm(markers)
}

/** Total using active segment variants where they exist, base polyline otherwise */
export function getPathTotalLengthKm(route: IPath): number {
  const markers = getOrderedMarkers(route)
  if (markers.length < 2) return 0

  const promotedPairs = getPromotedMarkerPairs(route)

  let total = 0
  for (let i = 0; i < markers.length - 1; i++) {
    const a = markers[i]
    const b = markers[i + 1]
    total += haversineM(a, b)
  }
  total /= 1000

  for (const { from, to, segment } of promotedPairs) {
    if (!segment) continue
    const baseBetween = haversineM(from, to) / 1000
    const variantLen = getSegmentLengthKm(segment, segment.activeVariantId, route.markers)
    total = total - baseBetween + variantLen
  }

  return total
}

export interface PromotedPair {
  from: IMarker
  to: IMarker
  segment: ISegment | undefined
}

export function getPromotedMarkerPairs(route: IPath): PromotedPair[] {
  const markers = getOrderedMarkers(route)
  const promoted = markers.filter((m) => m.name.trim() !== '')
  if (promoted.length < 2) return []

  const pairs: PromotedPair[] = []
  for (let i = 0; i < promoted.length - 1; i++) {
    const from = promoted[i]
    const to = promoted[i + 1]
    const segment = Object.values(route.segments).find(
      (s) => s.fromMarkerId === from.id && s.toMarkerId === to.id
    )
    pairs.push({ from, to, segment })
  }
  return pairs
}

export function formatDistanceKm(km: number): string {
  if (!Number.isFinite(km) || km <= 0) return '0 km'
  if (km < 0.05) return `${(km * 1000).toFixed(0)} м`
  return `${km.toFixed(1)} km`
}
