import styles from './Map.module.css'
import { MapContainer, TileLayer } from 'react-leaflet'
import { type LatLngTuple, type LeafletMouseEvent } from 'leaflet'
import 'leaflet/dist/leaflet.css'
import "leaflet-draw/dist/leaflet.draw.css";
import { useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import type { RootState } from '../../providers/store';
import { selectButton } from '../../providers/redux-test/active-button-reducer';
import { addPoint, editPoint, addManyPoint, deletePoint, addPointBetween } from '../../providers/paths/path-reducer';

import { chosePointId } from '../../providers/paths/current-point-id-reducer';
import type { IPathVariantPointsObject, IPoint } from '../../services/types/Path';
import { useDebouncedCallback } from 'use-debounce';

import MapHandlerComponent from '../MapHandlerComponent/MapHandlerComponent';
import CurrentLine from '../CurrentLine/CurrentLine';
import Markers from '../Markers/Markers';
import Lines from '../Lines/Lines';

const tileLayerUrl = 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';
const tileLayerAttribution = '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors';


function Map() {
  const paths = useSelector((state: RootState) => state.pathObject.paths)
  const currentButton = useSelector((state: RootState) => state.currentButton.currentButton)

  const currentPathId = useSelector((state: RootState) => state.currentPathId.currentPathId)
  const currentPathVariantId = useSelector((state: RootState) => state.currentPathVariantId.currentPathVariantId)
  const currentPointId = useSelector((state: RootState) => state.currentPointId.currentPointId)

  const dispatch = useDispatch();
  
  const variant = useMemo(() => paths[currentPathId]?.variants[currentPathVariantId], [currentPathId, currentPathVariantId, paths]);
  const currentPathVariant = useMemo(() => paths[currentPathId]?.variants[currentPathVariantId], [currentPathId, currentPathVariantId, paths]);
  
  const [variantState, setVariantState] = useState<IPathVariantPointsObject>(variant?.path || {});
  const [positionLineMouse, setPositionLineMouse] = useState<LatLngTuple[]>([[0, 0], [0, 0]]);

  const debounced = useDebouncedCallback((point: IPoint, e: LeafletMouseEvent) => {
    dispatch(editPoint({...point, lat: e.latlng.lat, lng: e.latlng.lng}))
  }, 300 );

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
        lat,
        lng,
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

  const handleDragMarker = (point: IPoint) => {
    return (e: LeafletMouseEvent) => {
      debounced(point, e);
      // dispatch(editPoint({...point, lat: e.latlng.lat, lng: e.latlng.lng}))
      setVariantState({...variantState, [point.id]: {...point, lat: e.latlng.lat, lng: e.latlng.lng}})
    }
  }

  // добавляет маркер в середину между двумя точками при клике на промежуточный маркер
  const handleClickMiddleMarker = (prevPoint: IPoint, nextPoint: IPoint) => {
    return (e: LeafletMouseEvent) => {
      dispatch(addPointBetween({
        prevPoint: {...prevPoint, lat: e.target._latlng.lat, lng: e.target._latlng.lng}, 
        nextPoint: {...nextPoint, lat: e.target._latlng.lat, lng: e.target._latlng.lng}
      }));
    }
  }

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

  return (
    <div className={styles.map}>
      <MapContainer center={[56.84, 60.6]}  zoom={12} zoomControl={false} attributionControl={false}>
        <TileLayer attribution={tileLayerAttribution} url={tileLayerUrl}/>
        <MapHandlerComponent 
          handleMapClick={handleMapClick} 
          handleMapMouseMove={handleMapMouseMove}
          handleMapContextMenu={handleMapContextMenu}
        />

        {/* Все варианты маршрутов */}
        <Lines/>

        {/* Линия текущего варианта */}
        <CurrentLine 
          currentPathVariant={currentPathVariant} 
          variantState={variantState} 
          positionLineMouse={positionLineMouse}
        />

        {/* Маркеры текущей линии */}
        <Markers 
          handleDragMarker={handleDragMarker}
          handleMarkerDelete={handleMarkerDelete}
          handleClickMiddleMarker={handleClickMiddleMarker} 
          variantState={variantState} 
        />
      </MapContainer>
    </div>      
  )
}

export default Map
