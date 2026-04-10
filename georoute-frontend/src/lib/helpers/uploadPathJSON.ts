// import { addPath } from "../../providers/redux-test/path-reducer";
import { addPath } from "../../providers/paths/path-reducer";
import type { AppDispatch } from "../../providers/store";
import { getFileByName } from "../../services/api/gpxSevice";
import type { IMarker, IPathVariant } from "../../services/types/Path";
import parseGpxIntoVariantsJSON from "./parseGPXIntoVariantsJSON";
import parseGPXIntoMarkersJSON from "./parseGPXIntoMarkersJSON";
import parseGpxIntoPathJSON from "./parseGPXIntoPathJSON";


export const loadPathJSON = async (
  names: string[],
  dispatch: AppDispatch
) => {
  try {
    const promises = names.map(async (name) => {
      const file = await getFileByName(name);

      const variants = parseGpxIntoVariantsJSON(file);
      const markers = parseGPXIntoMarkersJSON(file);
      const path = parseGpxIntoPathJSON(file);

      path.markers = markers.reduce((acc, marker) => 
        {acc[marker.id] = marker; return acc}, {} as {[index: string]: IMarker});
      path.variants = variants.reduce((acc, variant) => 
        {acc[variant.id] = variant; return acc}, {} as {[index: string]: IPathVariant});

      dispatch(addPath(path));
      return path;
    });

    await Promise.all(promises);
  } catch (error) {
    console.error('Error loading paths:', error);
  }
};
