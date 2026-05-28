import { Button } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import type { RootState } from "../../providers/store";
import {
  addManyPointFromMathed,
  addManyPointsBetween,
  deleteMarker,
} from "../../providers/paths/path-reducer";
import DirectionsWalkIcon from "@mui/icons-material/DirectionsWalk";
import { useMatchRouteMutation } from "../../hooks/usePostMatchMap";
import createXmlString from "../../lib/helpers/downloadGPX";
import getPathFromCurrentMarkerToNext from "../../lib/helpers/getPathFromCurrentMarkerToNext";
import getFirstAndLatPointWithMarker from "../../lib/helpers/getFirstAndLatPointWithMarker";
import parseGpxToCoordinates from "../../lib/helpers/parseGpxIntoArray";

const MatchCurrentPathButton = () => {
  const pathObject = useSelector(
    (state: RootState) => state.pathObject.present.paths,
  );
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
    const latLngArray = parseGpxToCoordinates(data);
    if (markerIds.startMarkerId == "") {
      dispatch(
        addManyPointFromMathed({
          pathId,
          pathVariantId,
          poinstArray: latLngArray,
        }),
      );
    } else {
      const points = pathObject[pathId].variants[pathVariantId].path;
      const path = getFirstAndLatPointWithMarker(
        markerIds.startMarkerId,
        points,
      );
      dispatch(
        addManyPointsBetween({
          prevPoint: path.points[0],
          nextPoint: path.points[1],
          pointsLatLng: latLngArray,
        }),
      );
      dispatch(
        deleteMarker({
          id: path.markers[0],
          name: "",
          pathId: path.points[0].pathId,
          points: [],
          order: 0,
          lat: 0,
          lng: 0,
        }),
      );
      dispatch(
        deleteMarker({
          id: path.markers[1],
          name: "",
          pathId: path.points[1].pathId,
          points: [],
          order: 0,
          lat: 0,
          lng: 0,
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
