import styles from "./map.module.css";
import { MapContainer, TileLayer } from "react-leaflet";
import { type LatLngTuple, type LeafletMouseEvent } from "leaflet";
import "leaflet/dist/leaflet.css";
import "leaflet-draw/dist/leaflet.draw.css";
import { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import type { RootState } from "../../providers/store";
import {
  addPoint,
  editPoint,
  addManyPoint,
  deletePoint,
  addPointBetween,
  addMarker,
  editMarker,
  deleteMarker,
  editPathVariant,
} from "../../providers/paths/path-reducer";

import { chosePointId } from "../../providers/paths/current-point-id-reducer";
import type {
  IMarker,
  IPathVariantPointsObject,
  IPoint,
} from "../../services/types/Path";
import { useDebouncedCallback } from "use-debounce";

import MapHandlerComponent from "../MapHandlerComponent/MapHandlerComponent";
import CurrentLine from "../CurrentLine/CurrentLine";
import Markers from "../Markers/Markers";
import Lines from "../Lines/Lines";
import NodeMarkers from "../NodeMarkers/NodeMarkers";
import MiddleButtonPan from "../MiddleButtonPan/MiddleButtonPan";
import { chooseStartMarkerId } from "../../providers/paths/path-segments-ids-reducer";
import { MAP_LAYERS } from "../../lib/helpers/mapLayers";

function Map() {
  const paths = useSelector((state: RootState) => state.pathObject.paths);
  const isEditing = useSelector(
    (state: RootState) => state.editMode.isEditing,
  );
  const currentPathId = useSelector(
    (state: RootState) => state.currentPathId.currentPathId,
  );
  const currentPathVariantId = useSelector(
    (state: RootState) => state.currentPathVariantId.currentPathVariantId,
  );
  const currentPointId = useSelector(
    (state: RootState) => state.currentPointId.currentPointId,
  );
  const currentLayer = useSelector(
    (state: RootState) => state.mapLayer.currentLayer,
  );
  const savedView = useSelector((state: RootState) => state.mapLayer.view);

  const layerConfig = MAP_LAYERS[currentLayer];
  // CRS нельзя менять у живого MapContainer; ремаунтим его только при смене CRS,
  // чтобы переключение OSM↔Google (одинаковая CRS) не моргало.
  const crsKey =
    layerConfig.crs === MAP_LAYERS.yandex.crs ? "epsg3395" : "epsg3857";

  const dispatch = useDispatch();

  const variant = useMemo(
    () => paths[currentPathId]?.variants[currentPathVariantId],
    [currentPathId, currentPathVariantId, paths],
  );
  const currentPathVariant = useMemo(
    () => paths[currentPathId]?.variants[currentPathVariantId],
    [currentPathId, currentPathVariantId, paths],
  );

  const [variantState, setVariantState] = useState<IPathVariantPointsObject>(
    variant?.path || {},
  );
  const [positionLineMouse, setPositionLineMouse] = useState<LatLngTuple[]>([
    [0, 0],
    [0, 0],
  ]);

  const debounced = useDebouncedCallback(
    (point: IPoint, e: LeafletMouseEvent) => {
      dispatch(editPoint({ ...point, lat: e.latlng.lat, lng: e.latlng.lng }));
    },
    300,
  );

  const debouncedDragMarkerNode = useDebouncedCallback(
    (marker: IMarker, e: LeafletMouseEvent) => {
      dispatch(editMarker({ ...marker, lat: e.latlng.lat, lng: e.latlng.lng }));
    },
    300,
  );

  // todo обернуть все handlers в useCallback для оптимизации
  // перерезаписывает все при любых обновлениях

  // handlers для карты
  const handleMapClick = (e: LeafletMouseEvent) => {
    const { lat, lng } = e.latlng;
    if (
      !isEditing ||
      !currentPathId ||
      !currentPathVariantId
    ) {
      return;
    }
    const newPointId = crypto.randomUUID();
    const newPoint = {
      id: newPointId,
      nextId: "",
      prevId:
        Object.values(variantState || {}).length > 0 ? currentPointId : "",
      pathId: currentPathId,
      pathVariantId: currentPathVariantId,
      lat,
      lng,
    };
    setVariantState({ ...variantState, [newPointId]: newPoint });
    dispatch(addPoint(newPoint));
    dispatch(chosePointId(newPointId));
  };

  const handleMapMouseMove = (e: LeafletMouseEvent) => {
    const { lat, lng } = e.latlng;
    if (Object.values(variant?.path || {}).length > 0 && isEditing) {
      const lastPoint = Object.values(variant?.path)[
        Object.values(variant?.path).length - 1
      ];
      setPositionLineMouse([
        [lastPoint.lat, lastPoint.lng],
        [lat, lng],
      ]);
    }
  };

  const handleMapContextMenu = () => {
    // ПКМ по пустой карте/линии — ничего (ТЗ 6).
    // Удаление вершин и КП происходит на самих маркерах через contextmenu.
  };

  // handlers для маркера
  const handleDragMarker = (point: IPoint) => {
    return (e: LeafletMouseEvent) => {
      debounced(point, e);
      // dispatch(editPoint({...point, lat: e.latlng.lat, lng: e.latlng.lng}))
      setVariantState({
        ...variantState,
        [point.id]: { ...point, lat: e.latlng.lat, lng: e.latlng.lng },
      });
    };
  };

  // добавляет маркер в середину между двумя точками при клике на промежуточный маркер
  const handleClickMiddleMarker = (prevPoint: IPoint, nextPoint: IPoint) => {
    return (e: LeafletMouseEvent) => {
      dispatch(
        addPointBetween({
          prevPoint: {
            ...prevPoint,
            lat: e.target._latlng.lat,
            lng: e.target._latlng.lng,
          },
          nextPoint: {
            ...nextPoint,
            lat: e.target._latlng.lat,
            lng: e.target._latlng.lng,
          },
        }),
      );
    };
  };

  const handleMarkerDelete = (point: IPoint) => {
    return () => {
      // нужно изменить current point если была удалена последняя точка
      // может быть баг при изменении данных точки
      if (!point.nextId) {
        dispatch(chosePointId(point.prevId));
      }
      dispatch(deletePoint(point));
    };
  };

  const handleMarkerClick = (inputPoint: IPoint) => {
    const markerId = crypto.randomUUID();
    const point = { ...inputPoint, markerId };
    const newMarker: IMarker = {
      id: markerId,
      pathId: point.pathId,
      name: `КП ${point.id.slice(0, 2)}`,
      points: [point],
      order: 0,
      lat: point.lat,
      lng: point.lng,
    };
    return () => {
      if (!isEditing) return;
      dispatch(addMarker(newMarker));
      dispatch(editPoint(point));
    };
  };

  // handlers для маркеров узловых точек
  const handleMarkerNodeClick = (marker: IMarker) => {
    return () => {
      if (isEditing) {
        const newPointId = crypto.randomUUID();
        const newPoint = {
          id: newPointId,
          nextId: "",
          prevId:
            Object.values(variantState || {}).length > 0 ? currentPointId : "",
          pathId: currentPathId,
          markerId: marker.id,
          pathVariantId: currentPathVariantId,
          lat: marker.lat,
          lng: marker.lng,
        };

        const newCurrentVariant =
          paths[currentPathId].variants[currentPathVariantId];
        if (Object.values(newCurrentVariant.path).length == 0) {
          dispatch(
            editPathVariant({ ...newCurrentVariant, startMarkerId: marker.id }),
          );
        } else if (Object.values(newCurrentVariant.path).length > 0) {
          dispatch(
            editPathVariant({ ...newCurrentVariant, endMarkerId: marker.id }),
          );
        }

        setVariantState({ ...variantState, [newPointId]: newPoint });
        dispatch(addPoint(newPoint));
        dispatch(chosePointId(newPointId));
        dispatch(
          editMarker({ ...marker, points: [...marker.points, newPoint] }),
        );
      } else {
        dispatch(chooseStartMarkerId(marker.id));
      }
    };
  };

  const handleDragMarkerNode = (marker: IMarker) => {
    return (e: LeafletMouseEvent) => {
      debouncedDragMarkerNode(marker, e);
    };
  };

  const handleMarkerNodeDelete = (marker: IMarker) => {
    return () => {
      dispatch(deleteMarker(marker));
    };
  };

  useEffect(() => {
    if (variant?.path) {
      addManyPoint({
        pathId: currentPathId,
        pathVariantId: currentPathVariantId,
        points: variant?.path,
      });
    }
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setVariantState(variant?.path);
  }, [currentPathId, currentPathVariantId, variant?.path]);

  return (
    <div className={styles.map}>
      <MapContainer
        key={crsKey}
        center={savedView.center}
        zoom={savedView.zoom}
        crs={layerConfig.crs}
        zoomControl={false}
        attributionControl={false}
      >
        <TileLayer
          key={currentLayer}
          url={layerConfig.url}
          attribution={layerConfig.attribution}
          subdomains={layerConfig.subdomains}
          maxZoom={layerConfig.maxZoom}
        />
        <MapHandlerComponent
          handleMapClick={handleMapClick}
          handleMapMouseMove={handleMapMouseMove}
          handleMapContextMenu={handleMapContextMenu}
        />
        <MiddleButtonPan />

        {/* Все варианты маршрутов */}
        <Lines />

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
          handleMarkerClick={handleMarkerClick}
          variantState={variantState}
        />

        <NodeMarkers
          handleMarkerNodeClick={handleMarkerNodeClick}
          handleDragMarkerNode={handleDragMarkerNode}
          handleDeleteMarkerNode={handleMarkerNodeDelete}
        />
      </MapContainer>
    </div>
  );
}

export default Map;
