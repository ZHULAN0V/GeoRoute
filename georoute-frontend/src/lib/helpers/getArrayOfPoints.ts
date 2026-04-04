import type { IPathsObject } from "../../providers/paths/path-reducer";
import { getOrderedPoints, getOrderedMarkers } from "./pathGeometry";

const getArrayOfPoints = function (pathsObject: IPathsObject): [number, number][][] {
  return Object.values(pathsObject).map((path) => {
    const markers = getOrderedMarkers(path);
    const allPoints: [number, number][] = [];

    for (let i = 0; i < markers.length; i++) {
      const m = markers[i];
      if (i === 0) {
        allPoints.push([m.lat, m.lng]);
      }

      if (i < markers.length - 1) {
        const nextM = markers[i + 1];
        const seg = Object.values(path.segments).find(
          (s) => s.fromMarkerId === m.id && s.toMarkerId === nextM.id
        );
        if (seg) {
          const variant = seg.variants[seg.activeVariantId];
          if (variant) {
            const ordered = getOrderedPoints(variant.points);
            for (const pt of ordered) {
              allPoints.push([pt.lat, pt.lng]);
            }
          }
        }
        allPoints.push([nextM.lat, nextM.lng]);
      }
    }

    return allPoints;
  }).filter((pts) => pts.length > 0);
};

export default getArrayOfPoints;
