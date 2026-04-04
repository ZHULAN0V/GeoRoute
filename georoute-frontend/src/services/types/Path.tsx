export interface IPathVariantsObject {[index: string]: IPathVariant}
export interface IPathVariantPointsObject {[index: string]: IPoint}

export interface IPoint {
  id: string,
  nextId: string,
  prevId: string,
  pathId: string,
  pathVariantId: string,
  lat: number,
  lng: number,
}

export interface IPathVariant {
  id: string,
  pathId: string,
  name: string,
  color: string,
  distance: number,
  checked: boolean,
  path: IPathVariantPointsObject, // объект координат с ключами в виде id
}

export interface IPath {
  id: string,
  name: string,
  color: string,
  distance: number,
  checked: boolean,
  main: [number, number][], // массив координат
  // mainPathId: string
  variants: IPathVariantsObject, // объект координат с ключами в виде id
}


