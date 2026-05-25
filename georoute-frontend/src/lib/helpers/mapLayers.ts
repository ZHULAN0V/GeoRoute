import type { TMapLayer } from "../../providers/paths/map-layer-reducer";

export interface MapLayerConfig {
  url: string;
  attribution: string;
  subdomains: string | string[];
  maxZoom: number;
}

export const MAP_LAYERS: Record<TMapLayer, MapLayerConfig> = {
  osm: {
    url: "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
    attribution:
      '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    subdomains: "abc",
    maxZoom: 19,
  },
  yandex: {
    url: "https://core-renderer-tiles.maps.yandex.net/tiles?l=map&x={x}&y={y}&z={z}&scale=1&lang=ru_RU",
    attribution: "&copy; Яндекс",
    subdomains: "abc",
    maxZoom: 19,
  },
  google: {
    url: "https://mt{s}.google.com/vt/lyrs=m&x={x}&y={y}&z={z}",
    attribution: "&copy; Google",
    subdomains: ["0", "1", "2", "3"],
    maxZoom: 20,
  },
};
