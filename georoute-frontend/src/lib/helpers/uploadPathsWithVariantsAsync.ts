// import { addPath } from "../../providers/redux-test/path-reducer";
import { addPath } from "../../providers/paths/path-reducer";
import type { AppDispatch } from "../../providers/store";
import { getFileByName } from "../../services/api/gpxSevice";
import type { IPath, IPoint, IMarker, IPathVariant } from "../../services/types/Path";
import parseGPXIntoMarkers from "./parseGpxIntoMarkers";
import parseGpxIntoPaths from "./parseGPXIntoPaths";

export const loadPathsFromNamesWithVariantsAndMarkers = async (
  names: string[],
  dispatch: AppDispatch
) => {
  try {
    const promises = names.map(async (name) => {
      const file = await getFileByName(name);

      // Парсим маршруты (trkpt) и маркеры (wpt) из GPX
      const routePoints = parseGpxIntoPaths(file); // [number, number][][]
      const markers = parseGPXIntoMarkers(file);     // [number, number][]

      const pathId = crypto.randomUUID();
      // const variantId = crypto.randomUUID();

      const markerObjects: {[index: string]: IMarker} = markers.reduce((acc, marker, index) => {
        const markerId = crypto.randomUUID();
        acc[markerId] = {
          id: markerId,
          pathId: pathId,
          lat: marker[0],
          lng: marker[1],
          name: `Маркер ${index + 1}`,
          points: []
        };
        return acc;
      }, {} as {[index: string]: IMarker});

      const variantsObject: {[index: string]: IPathVariant} = routePoints.reduce((acc, routes, index) => {
        const variantId = crypto.randomUUID();

        // todo нет next и prev
        const pointsObject: {[index: string]: IPoint} = routes.reduce((acc, point) => {
          const pointId = crypto.randomUUID();
          acc[pointId] = {
            id: pointId,
            nextId: '',
            prevId: '',
            pathId: pathId,
            pathVariantId: variantId,
            lat: point[0],
            lng: point[1],
          }
          return acc;
        }, {} as {[index: string]: IPoint})

        acc[variantId] = {
          id: variantId,
          pathId: pathId,
          name: `Вариант ${index}` ,
          color: '#ff0000',
          distance: 0,
          checked: false,
          path: pointsObject
        }
        return acc
      }, {} as {[index: string]: IPathVariant})

      const newPath: IPath = {
        id: pathId,
        name: name,
        color: '#ff0000',
        distance: 0,
        checked: true,
        main: [],
        markers: markerObjects,
        variants: variantsObject,
      };

      dispatch(addPath(newPath));
      return newPath;
    });

    await Promise.all(promises);
  } catch (error) {
    console.error('Error loading paths:', error);
  }
};
