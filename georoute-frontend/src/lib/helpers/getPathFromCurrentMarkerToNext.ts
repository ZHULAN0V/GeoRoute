import type { IPoint } from "../../services/types/Path";
import createOrderedPath from "./createOrderedPath";

const getPathFromCurrentMarkerToNext = (
  markerId: string,
  points: { [index: string]: IPoint },
): IPoint[] => {
  let currentPoint = Object.values(points).find(
    (point) => point.markerId == markerId,
  );

  if (currentPoint == undefined) {
    return [];
  }

  const resultPath = { [currentPoint.id]: { ...currentPoint } };

  while (currentPoint.nextId && points[currentPoint.nextId]) {
    currentPoint = { ...points[currentPoint.nextId] };
    resultPath[currentPoint.id] = { ...currentPoint };
    if (currentPoint.markerId != undefined) {
      break;
    }
  }

  const ordered = createOrderedPath(resultPath);

  return ordered;
};

export default getPathFromCurrentMarkerToNext;
