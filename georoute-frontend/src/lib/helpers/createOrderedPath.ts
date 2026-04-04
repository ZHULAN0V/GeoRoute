import type { IPathVariantPointsObject, IPoint } from "../../services/types/Path";

const createOrderedPath = (pointsObject: IPathVariantPointsObject): IPoint[] => {
  const pointsArr = Object.values(pointsObject)
  if (pointsArr.length == 0) {
    return [];
  }

  const result: IPoint[] = [];
  let currentPoint = pointsArr.find(point => point.prevId == '')
  if (currentPoint == undefined) {
    throw new Error('There is no starting point in the points object');
  }

  for (let i = 0; i < pointsArr.length; i++) {
    result.push(currentPoint);
    currentPoint = pointsObject[currentPoint.nextId]
    
  }

  return result;
}

export default createOrderedPath;