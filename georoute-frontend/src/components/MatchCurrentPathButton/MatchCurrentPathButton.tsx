import { Button } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import type { RootState } from "../../providers/store";
import {
  addManyPointFromMathed,
  addManyPointsBetween,
} from "../../providers/paths/path-reducer";
import DirectionsWalkIcon from "@mui/icons-material/DirectionsWalk";
import { useMatchRouteMutation } from "../../hooks/usePostMatchMap";
import createXmlString from "../../lib/helpers/downloadGPX";
import getPathFromCurrentMarkerToNext from "../../lib/helpers/getPathFromCurrentMarkerToNext";
import getFirstAndLatPointWithMarker from "../../lib/helpers/getFirstAndLatPointWithMarker";

const MatchCurrentPathButton = () => {
  const pathObject = useSelector((state: RootState) => state.pathObject.paths);
  const pathId = useSelector(
    (state: RootState) => state.currentPathId.currentPathId,
  );
  const pathVariantId = useSelector(
    (state: RootState) => state.currentPathVariantId.currentPathVariantId,
  );
  const markerIds = useSelector((state: RootState) => state.markerIds);
  const dispatch = useDispatch();

  // сложная типизация для graphhopper
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const onSuccess = (data: any) => {
    if (markerIds.startMarkerId == "") {
      dispatch(
        addManyPointFromMathed({
          pathId,
          pathVariantId,
          poinstArray: data.paths[0].points.coordinates.map(
            (x: number[]) => [x[1], x[0]] as [number, number],
          ),
        }),
      );
    } else {
      const points = pathObject[pathId].variants[pathVariantId].path;
      const path = getFirstAndLatPointWithMarker(
        markerIds.startMarkerId,
        points,
      );
      console.log(path);
      console.log(
        data.paths[0].points.coordinates.map(
          (x: number[]) => [x[1], x[0]] as [number, number],
        ),
      );
      dispatch(
        addManyPointsBetween({
          prevPoint: path[0],
          nextPoint: path[1],
          pointsLatLng: data.paths[0].points.coordinates.map(
            (x: number[]) => [x[1], x[0]] as [number, number],
          ),
        }),
      );
    }
  };

  const { mutate: matchRoute, isPending } = useMatchRouteMutation({
    onSuccess,
  });

  const handleClick = () => {
    if (markerIds.startMarkerId == "") {
      const latlngArray = Object.values(
        pathObject[pathId].variants[pathVariantId].path,
      ).map((x) => [x.lat, x.lng] as [number, number]);
      const gpxData = createXmlString([latlngArray]);
      matchRoute({ gpxData });
    } else {
      const points = pathObject[pathId].variants[pathVariantId].path;
      const path = getPathFromCurrentMarkerToNext(
        markerIds.startMarkerId,
        points,
      );
      const latlngArray = path.map((x) => [x.lat, x.lng] as [number, number]);
      const gpxData = createXmlString([latlngArray]);
      matchRoute({ gpxData });
    }
  };

  return (
    <Button
      startIcon={<DirectionsWalkIcon />}
      variant="contained"
      onClick={handleClick}
      loading={isPending}
    >
      Притянуть к тропе
    </Button>
  );
};

export default MatchCurrentPathButton;
