import { DivIcon } from 'leaflet'
import { DEFAULT_ROUTE_COLOR } from '../../lib/helpers/routeColors'

function safeHex(c: string): string {
  const t = c.trim()
  return /^#([0-9A-Fa-f]{3}|[0-9A-Fa-f]{6})$/i.test(t) ? t : DEFAULT_ROUTE_COLOR
}

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
}

export function createNodeIcon(lineColor: string): DivIcon {
  const hex = safeHex(lineColor)
  return new DivIcon({
    className: 'georoute-marker-wrap',
    html: `<div class="georoute-node" style="--node-stroke:${hex}"></div>`,
    iconSize: [11, 11],
    iconAnchor: [5, 5],
  })
}

export function createPlaceIcon(lineColor: string, placeName: string): DivIcon {
  const hex = safeHex(lineColor)
  const label = escapeHtml(placeName.trim() || 'Без названия')
  const w = 120
  const pinH = 28
  const html = `<div class="georoute-place" style="width:${w}px;height:auto;min-height:${pinH + 18}px;">
    <svg class="georoute-place-pin" style="display:block;margin:0 auto" xmlns="http://www.w3.org/2000/svg" width="22" height="${pinH}" viewBox="0 0 22 28" aria-hidden="true">
      <path fill="${hex}" stroke="#fff" stroke-width="1.25" d="M11 0C5.5 0 1 4.2 1 9.4c0 6.2 10 18.6 10 18.6S21 15.6 21 9.4C21 4.2 16.5 0 11 0z"/>
      <circle fill="#fff" cx="11" cy="9" r="2.8"/>
    </svg>
    <span class="georoute-place-label">${label}</span>
  </div>`
  return new DivIcon({
    className: 'georoute-marker-wrap',
    html,
    iconSize: [w, pinH + 18],
    iconAnchor: [w / 2, pinH],
  })
}

export function createPlusIcon(): DivIcon {
  return new DivIcon({
    className: 'georoute-marker-wrap',
    html: `<div class="georoute-plus-btn">+</div>`,
    iconSize: [24, 24],
    iconAnchor: [12, 12],
  })
}
