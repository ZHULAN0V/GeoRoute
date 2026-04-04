import type { IPathsObject } from "../../providers/paths/path-reducer";

const getArrayOfPoints = function (pathsObject: IPathsObject): [number, number][][] {
  return Object.values(pathsObject)
    .map(path => Object.values(path.variants)
      .map(variant => Object.values(variant.path)
        .map(point => [point.lat, point.lng] as [number, number])
      )
    ).flat(1);
}

export default getArrayOfPoints;