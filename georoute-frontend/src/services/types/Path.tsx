export interface IPathVariantsObject {[index: string]: IPathVariant}
export interface IPathVariantPointsObject {[index: string]: IPoint}
export interface IPathMarkersObject {[index: string]: IMarker}

export interface IPoint {
  id: string,
  nextId: string,
  prevId: string,
  pathId: string,
  pathVariantId: string,
  lat: number,
  lng: number,
  markerId?: string,
}

export interface IPathVariant {
  id: string,
  pathId: string,
  name: string,
  color: string,
  distance: number,
  startMarkerId?: string,
  endMarkerId?: string,
  isMain?: boolean,
  isVisible: boolean,
  path: IPathVariantPointsObject, // объект координат с ключами в виде id
}

export interface IPath {
  id: string,
  name: string,
  color: string,
  distance: number,
  checked: boolean,
  main: [number, number][], // массив координат основной, но пока не используется вообще, можно даже и убрать
  variants: IPathVariantsObject, // объект вариантов с ключами в виде id
  markers: IPathMarkersObject // объект с маркерами с ключами в виде id
}

export interface IMarker {
  id: string,
  name: string,
  pathId: string,
  points: IPoint[],
  order: number,
  lat: number,
  lng: number,
}

