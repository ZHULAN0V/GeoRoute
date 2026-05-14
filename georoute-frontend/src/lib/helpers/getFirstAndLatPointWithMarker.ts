import type { IPoint } from "../../services/types/Path";
import createOrderedPath from "./createOrderedPath";

interface IGetPoints {
  points: [IPoint, IPoint];
  markers: [string, string];
}

const getFirstAndLatPointWithMarker = (
  markerId: string,
  points: { [index: string]: IPoint },
): IGetPoints => {
  let currentPoint = Object.values(points).find(
    (point) => point.markerId == markerId,
  );

  if (currentPoint == undefined) {
    return {
      points: [{} as IPoint, {} as IPoint], // не очень хорошо так делать может вылезти ошибка
      markers: ["", ""],
    };
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

  return {
    points: [ordered[0], ordered[ordered.length - 1]],
    markers: [
      ordered[0].markerId || "",
      ordered[ordered.length - 1].markerId || "",
    ],
  };
};

export default getFirstAndLatPointWithMarker;
