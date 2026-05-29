import { Polyline } from "react-leaflet";
import type {
  IPathVariant,
  IPathVariantPointsObject,
} from "../../services/types/Path";
import { useSelector } from "react-redux";
import type { RootState } from "../../providers/store";
import type { LatLngTuple } from "leaflet";

interface CurrentLineProps {
  currentPathVariant: IPathVariant;
  variantState: IPathVariantPointsObject;
  positionLineMouse: LatLngTuple[];
}

const CurrentLine = (props: CurrentLineProps) => {
  const { currentPathVariant, variantState, positionLineMouse } = props;
  const isEditing = useSelector(
    (state: RootState) => state.editMode.isEditing,
  );

  const weight = currentPathVariant?.isMain ? 6 : 4;

  return (
    <>
      <Polyline
        pathOptions={{
          color: currentPathVariant?.color || "red",
          weight,
        }}
        positions={
          Object.values(variantState || {}).map((x) => [x.lat, x.lng]) || []
        }
        eventHandlers={{}}
      />

      {isEditing && (
        <Polyline
          pathOptions={{
            color: currentPathVariant?.color || "red",
            weight,
          }}
          positions={positionLineMouse}
        />
      )}
    </>
  );
};

export default CurrentLine;
