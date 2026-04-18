import { Polyline } from "react-leaflet";
import type { IPathVariant, IPathVariantPointsObject } from "../../services/types/Path";
import { useSelector } from "react-redux";
import type { RootState } from "../../providers/store";
import type { LatLngTuple } from "leaflet";

interface CurrentLineProps {
  currentPathVariant: IPathVariant,
  variantState: IPathVariantPointsObject,
  positionLineMouse: LatLngTuple[],
}

const CurrentLine = (props: CurrentLineProps) => {
  const {currentPathVariant, variantState, positionLineMouse} = props;
  const currentButton = useSelector((state: RootState) => state.currentButton.currentButton)

  return <>
    <Polyline 
      pathOptions={{ 
        color: currentPathVariant?.color || 'red',
        weight: 4,
      }} 
      positions={Object.values(variantState || {}).map(x => [x.lat, x.lng]) || []} 
      // positions={createOrderedPath(variantState || {}).map(x => [x.lat, x.lng]) || []} 
      // positions={createOrderedPath(variantState || {}).map(x => [x.lat, x.lng]) || []} 
      eventHandlers={{}}
    />

    {currentButton == 'edit' && 
      <Polyline 
        pathOptions={{ 
          color: currentPathVariant?.color || 'red',
          weight: 4,
        }} 
        positions={positionLineMouse} 
      />
    }
  </>
}

export default CurrentLine;