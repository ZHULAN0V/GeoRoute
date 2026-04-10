import { useSelector } from "react-redux";
import type { RootState } from "../../providers/store";
import { Icon, type LeafletMouseEvent } from "leaflet";
import { useMemo } from "react";
import { Marker } from "react-leaflet";
import type { IMarker } from "../../services/types/Path";

const customIcon = new Icon({
  iconUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/72/Yandex_Maps_icon.svg/1280px-Yandex_Maps_icon.svg.png',
  // iconUrl: pointMove,
  iconSize: [32, 32],
  iconAnchor: [16, 32],
})

interface INodeMarkersProps {
  handleMarkerNodeClick: (point: IMarker) => (e: LeafletMouseEvent) => void,
  handleDragMarkerNode: (marker: IMarker) => (e: LeafletMouseEvent) => void,
  handleDeleteMarkerNode: (marker: IMarker) => (e: LeafletMouseEvent) => void,
}

const NodeMarkers = (props: INodeMarkersProps) => {
  const {
    handleMarkerNodeClick, 
    handleDragMarkerNode,
    handleDeleteMarkerNode
  } = props;

  const pathObject = useSelector((state: RootState) => state.pathObject);
  const currentPathId = useSelector((state: RootState) => state.currentPathId.currentPathId);
  // const currentPathVariantId = useSelector((state: RootState) => state.currentPathVariantId.currentPathVariantId);

  const markers = useMemo(() => Object.values(pathObject.paths[currentPathId]?.markers || {}), [pathObject, currentPathId]);

  return (
    <>
      {markers.map(marker => 
        <Marker 
          key={marker.id} 
          position={[marker.lat, marker.lng]} 
          draggable
          icon={customIcon}
          eventHandlers={{
            // @ts-expect-error неправильно определен тип в библиотеке
            drag: handleDragMarkerNode(marker),
            contextmenu: handleDeleteMarkerNode(marker),
            click: handleMarkerNodeClick(marker),
          }}
        />
      )}
    </>
  );
};

export default NodeMarkers;