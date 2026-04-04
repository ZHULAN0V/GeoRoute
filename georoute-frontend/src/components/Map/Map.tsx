import styles from './Map.module.css'
import { MapContainer, Marker, Polyline, TileLayer, useMapEvent } from 'react-leaflet'
import { Icon, type LatLngTuple, type LeafletMouseEvent } from 'leaflet'
import 'leaflet/dist/leaflet.css'
import { useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import type { RootState } from '../../providers/store';
import { selectButton } from '../../providers/redux-test/active-button-reducer';
import { addPoint, editPoint, addManyPoint, deletePoint } from '../../providers/paths/path-reducer';
// import { EditControl } from "react-leaflet-draw"
import "leaflet-draw/dist/leaflet.draw.css";
// import { chosePathId } from '../../providers/paths/current-path-id-reducer';
import { chosePointId } from '../../providers/paths/current-point-id-reducer';
import type { IPathVariantPointsObject, IPoint } from '../../services/types/Path';
import { useDebouncedCallback } from 'use-debounce';

const customIcon = new Icon({
  iconUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/72/Yandex_Maps_icon.svg/1280px-Yandex_Maps_icon.svg.png',
  iconSize: [40, 40],
  iconAnchor: [20, 40],
})

const tileLayerUrl = 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';
const tileLayerAttribution = '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors';

// const limeOptions: PathOptions  = { 
//   color: 'red',
//   weight: 4,
// };

// const blueOptions: PathOptions  = { 
//   color: 'red',
//   weight: 4,
// };

interface MyComponentProps {
  handleMapClick: (e: LeafletMouseEvent) => void;
  handleMapMouseMove: (e: LeafletMouseEvent) => void;
  handleMapContextMenu: () => void;
}

function MyComponent(props: MyComponentProps) {
  const { handleMapClick, handleMapMouseMove, handleMapContextMenu } = props;
  // const map = useMap();
  useMapEvent('click', (e) => { // ЛКМ
    handleMapClick(e);
  });
  useMapEvent('mousemove', (e) => { // движение мыши
    handleMapMouseMove(e);
  });
  useMapEvent('dblclick', () => { // двойной клик и так понятно конечно
    // handleMapMouseMove(e);
  });
  useMapEvent('contextmenu', () => { // ПКМ
    handleMapContextMenu();
  });
  return null;
}

function Map() {
  const paths = useSelector((state: RootState) => state.pathObject.paths)
  const currentButton = useSelector((state: RootState) => state.currentButton.currentButton)

  const currentPathId = useSelector((state: RootState) => state.currentPathId.currentPathId)
  const currentPathVariantId = useSelector((state: RootState) => state.currentPathVariantId.currentPathVariantId)
  const currentPointId = useSelector((state: RootState) => state.currentPointId.currentPointId)
  
  const variant = useMemo(() => paths[currentPathId]?.variants[currentPathVariantId], [currentPathId, currentPathVariantId, paths]);
  const currentPathVariant = useMemo(() => paths[currentPathId]?.variants[currentPathVariantId], [currentPathId, currentPathVariantId, paths]);
  const dispatch = useDispatch();
  
  const [variantState, setVariantState] = useState<IPathVariantPointsObject>(variant?.path || {});
  const [positionLineMouse, setPositionLineMouse] = useState<LatLngTuple[]>([[0, 0], [0, 0]]);

  const handleMapClick = (e: LeafletMouseEvent) => {
    const { lat, lng } = e.latlng;
    if (currentButton == 'edit') {
      const newPointId = crypto.randomUUID();
      const newPoint = {
        id: newPointId,
        nextId: '',
        prevId: Object.values(variantState || {}).length > 0 ? currentPointId : '',
        pathId: currentPathId,
        pathVariantId: currentPathVariantId,
        lat: lat,
        lng: lng
      }
      setVariantState({...variantState, [newPointId]: newPoint});
      // const point = paths[currentPathId]?.variants[currentPathVariantId]?.path[currentPointId];
      dispatch(addPoint(newPoint));
      dispatch(chosePointId(newPointId))
    }
  }

  const handleMapMouseMove = (e: LeafletMouseEvent) => {
    const { lat, lng } = e.latlng;
    if (Object.values(variant?.path || {}).length > 0 && currentButton == 'edit') {
      const lastPoint = Object.values(variant?.path)[Object.values(variant?.path).length - 1]
      setPositionLineMouse([[lastPoint.lat, lastPoint.lng], [lat, lng]]);
    }
  }

  const handleMapContextMenu = () => {
    // if (currentButton == 'edit') {
    //   setPositionLineMouse([positionsLine[positionsLine.length - 1], positionsLine[positionsLine.length - 1]]);
    // }
    dispatch(selectButton('edit'))
  }

  const debounced = useDebouncedCallback((point: IPoint, e: LeafletMouseEvent) => {
    dispatch(editPoint({...point, lat: e.latlng.lat, lng: e.latlng.lng}))
  }, 300 );

  const handleDragMarker = (point: IPoint) => {
    return (e: LeafletMouseEvent) => {
      debounced(point, e);
      // dispatch(editPoint({...point, lat: e.latlng.lat, lng: e.latlng.lng}))
      setVariantState({...variantState, [point.id]: {...point, lat: e.latlng.lat, lng: e.latlng.lng}})
    }
  }

  // const handleDragMarkerCurrent = (point: IPoint) => {
  //   return (e: LeafletMouseEvent) => {
  //     // dispatch(editPoint({...point, lat: e.latlng.lat, lng: e.latlng.lng}))
  //     setVariantState({...variantState, [point.id]: {...point, lat: e.latlng.lat, lng: e.latlng.lng}})
  //   }
  // }

  const handleMarkerDelete = (point: IPoint) => {
    return () => {
      dispatch(deletePoint(point))
    }
  }

  useEffect(() => {
    if (variant?.path) {
      addManyPoint({
        pathId: currentPathId,
        pathVariantId: currentPathVariantId,
        points: variant?.path
      })
    }
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setVariantState(variant?.path);
  }, [currentPathId, currentPathVariantId, variant?.path])

  // useEffect(() => {
  //   // if (currentButton != 'edit' && positionsLine.length > 0) {
  //   //   // eslint-disable-next-line react-hooks/set-state-in-effect
  //   //   setPositionLineMouse([positionsLine[positionsLine.length - 1], positionsLine[positionsLine.length - 1]]);
  //   // }
  // }, [currentButton, positionsLine])

  return (
    <div className={styles.map}>
      <MapContainer center={[56.84, 60.6]}  zoom={12} zoomControl={false} attributionControl={false}>
        <TileLayer attribution={tileLayerAttribution} url={tileLayerUrl}/>
        <MyComponent 
          handleMapClick={handleMapClick} 
          handleMapMouseMove={handleMapMouseMove}
          handleMapContextMenu={handleMapContextMenu}
        />

        {Object.values(paths).filter(x => x.checked)
          .map(x => Object.values(x.variants).filter(x => x.id != currentPathVariantId)
            .map(y => 
              <div key={y.id}>
                <Polyline 
                  pathOptions={{ 
                    color: y.color,
                    weight: 4,
                  }} 
                  positions={Object.values(y.path).map(t => [t.lat, t.lng])} 
                  eventHandlers={{}}
                />
              </div>
            )
          )
        }
        <Polyline 
          pathOptions={{ 
            color: currentPathVariant?.color || 'red',
            weight: 4,
          }} 
          positions={Object.values(variantState || {}).map(x => [x.lat, x.lng]) || []} 
          eventHandlers={{}}
        />
        {Object.values(variantState || {}).map(point => 
          <Marker 
            key={`${point.id}`} 
            position={[point.lat, point.lng]} 
            draggable
            icon={customIcon}
            eventHandlers={{
              // @ts-expect-error неправильно определен тип в библиотеке
              drag: handleDragMarker(point),
              contextmenu: handleMarkerDelete(point),
              // dragstart: handleDragMarker(m)
            }}
          />
        )}
        {currentButton == 'edit' && 
          <Polyline 
            pathOptions={{ 
              color: currentPathVariant?.color || 'red',
              weight: 4,
            }} 
            positions={positionLineMouse} 
          />
        }
      </MapContainer>
    </div>      
  )
}

export default Map
