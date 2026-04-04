export interface IPointsObject { [id: string]: IPoint }
export interface ISegmentVariantsObject { [id: string]: ISegmentVariant }
export interface ISegmentsObject { [id: string]: ISegment }
export interface IMarkersObject { [id: string]: IMarker }

export interface IPoint {
  id: string,
  nextId: string,
  prevId: string,
  lat: number,
  lng: number,
}

export interface IMarker {
  id: string,
  pathId: string,
  name: string,
  lat: number,
  lng: number,
  order: number,
}

export interface ISegmentVariant {
  id: string,
  segmentId: string,
  color: string,
  points: IPointsObject,
}

export interface ISegment {
  id: string,
  pathId: string,
  fromMarkerId: string,
  toMarkerId: string,
  activeVariantId: string,
  variants: ISegmentVariantsObject,
}

export interface IPath {
  id: string,
  name: string,
  color: string,
  checked: boolean,
  markers: IMarkersObject,
  segments: ISegmentsObject,
}
