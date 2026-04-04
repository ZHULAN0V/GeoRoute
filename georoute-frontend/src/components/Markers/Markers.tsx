import { Icon, type LeafletMouseEvent } from "leaflet";
import { Marker } from "react-leaflet";
import type { IPathVariantPointsObject, IPoint } from "../../services/types/Path";

const customIcon = new Icon({
  iconUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/72/Yandex_Maps_icon.svg/1280px-Yandex_Maps_icon.svg.png',
  iconSize: [40, 40],
  iconAnchor: [20, 40],
})
const customIconAnother = new Icon({
  iconUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/72/Yandex_Maps_icon.svg/1280px-Yandex_Maps_icon.svg.png',
  iconSize: [24, 24],
  iconAnchor: [12, 24],
})

interface IMarkersProps {
  variantState: IPathVariantPointsObject,
  handleDragMarker: (point: IPoint) => (e: LeafletMouseEvent) => void,
  handleMarkerDelete: (point: IPoint) => (e: LeafletMouseEvent) => void,
  handleClickMiddleMarker: (prevPoint: IPoint, nextPoint: IPoint) => (e: LeafletMouseEvent) => void,
}

const Markers = (props: IMarkersProps) => {
  const {
    variantState,
    handleDragMarker,
    handleMarkerDelete,
    handleClickMiddleMarker,
  } = props;

  return <>
    {/* Маркеры точек выбранного варианта */}
    {Object.values(variantState || {}).map(point => 
      <Marker 
        key={`${point.id}`} 
        position={[point.lat, point.lng]} 
        draggable
        icon={customIcon}
        eventHandlers={{
          // @ts-expect-error неправильно определен тип в библиотеке
          drag: handleDragMarker(point),
          // dragend: handleDragMarker(point),
          contextmenu: handleMarkerDelete(point),
          // dragstart: handleDragMarker(m)
        }}
      />
    )}
  
    {/* Маркеры промежуточных точек выбранного варианта */}
    {Object.values(variantState || {}).map((point, index, points) => {
      if (index == points.length - 1) {
        return <div key={`intermediate ${point.id}`}></div>
      }
      const lat = (points[index].lat + points[index + 1].lat) / 2;
      const lng = (points[index].lng + points[index + 1].lng) / 2;
      return (
        <Marker 
          key={`intemediate ${point.id}`} 
          position={[lat, lng]} 
          draggable
          icon={customIconAnother}
          eventHandlers={{
            click: handleClickMiddleMarker(points[index], points[index + 1]),
            // @ts-expect-error неправильно указан тип
            dragend: handleClickMiddleMarker(points[index], points[index + 1]),
          }}
        />
      )
    })}
  </>
}

export default Markers