import { addPath } from "../../providers/redux-test/path-reducer";
import type { AppDispatch } from "../../providers/store";
import { getFileByName } from "../../services/api/gpxSevice";
import type { IPath, IPathVariantPointsObject, IPoint } from "../../services/types/Path";
import parseGpxToCoordinates from "./parseGpxIntoArray";

export const loadPathsFromNames = async (
  names: string[],
  dispatch: AppDispatch
) => {
  try {
    const promises = names.map(async (name) => {
      const result = await getFileByName(name);
      const parsedData = parseGpxToCoordinates(result);
      const latlngArray = parsedData;
      const id = crypto.randomUUID();
      const variantId = crypto.randomUUID();

      const path = latlngArray.map((x) => ({
        id: crypto.randomUUID(),
        nextId: '',
        prevId: '',
        pathId: id,
        pathVariantId: variantId,
        lat: x[0],
        lng: x[1],
      } as IPoint)).reduce((acc: IPathVariantPointsObject, point, index, arr) => {
        if (index > 0) {
          point.prevId = arr[index - 1].id;
        }
        if (index < arr.length - 1) {
          point.nextId = arr[index + 1].id;
        }
        return {...acc, [point.id]: point};
      }, {} as IPathVariantPointsObject);;

      const newPath: IPath = {
        id,
        name: name,
        color: '#ff0000',
        distance: 0,
        checked: true,
        main: [],
        variants: {
          [variantId]: {
            id: variantId,
            pathId: id,
            name: 'Вариант 1',
            color: '#ff0000',
            distance: 0,
            checked: true,
            path: path,
          }
        },
      };

      // Обновляем конкретный путь
      dispatch(addPath(newPath));
      return newPath;
    });

    await Promise.all(promises);
  } catch (error) {
    console.error('Error loading paths:', error);
  }
};
