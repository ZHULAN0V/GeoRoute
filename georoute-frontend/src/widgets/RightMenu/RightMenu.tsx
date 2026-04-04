import { useDispatch, useSelector } from "react-redux";
import styles from "./rightMenu.module.css"
import { TextField, Button } from "@mui/material";
import type { RootState } from "../../providers/store";
import { useEffect, useMemo, useState } from "react";
import { editPath, editSegmentVariant, addSegmentVariant, setActiveSegmentVariant, deleteSegmentVariant } from "../../providers/paths/path-reducer";
import { useDebouncedCallback } from "use-debounce";
import AddIcon from '@mui/icons-material/Add';
import { formatDistanceKm, getSegmentLengthKm, getPathTotalLengthKm, getOrderedMarkers } from '../../lib/helpers/pathGeometry';
import { setSegmentId } from "../../providers/paths/current-segment-id-reducer";
import { setSegmentVariantId } from "../../providers/paths/current-segment-variant-id-reducer";
import { randomRouteHexColor } from "../../lib/helpers/routeColors";

function RightMenu() {
  const currentPathId = useSelector((state: RootState) => state.currentPathId.currentPathId);
  const currentSegId = useSelector((state: RootState) => state.currentSegmentId.currentSegmentId);
  const currentSegVarId = useSelector((state: RootState) => state.currentSegmentVariantId.currentSegmentVariantId);
  const pathObject = useSelector((state: RootState) => state.pathObject.paths);
  const path = useMemo(() => pathObject[currentPathId], [pathObject, currentPathId]);

  const dispatch = useDispatch();

  const [name, setName] = useState(path?.name || '');
  const [color, setColor] = useState(path?.color || '');
  const [variantColor, setVariantColor] = useState('');

  const multiVariantSegments = useMemo(
    () => path
      ? Object.values(path.segments).filter((s) => Object.keys(s.variants).length > 1)
      : [],
    [path]
  );
  const orderedMarkers = useMemo(() => path ? getOrderedMarkers(path) : [], [path]);
  const promotedCount = useMemo(() => orderedMarkers.filter((m) => m.name.trim() !== '').length, [orderedMarkers]);

  const activeSegment = currentSegId ? path?.segments[currentSegId] : null;
  const activeVariant = activeSegment && currentSegVarId
    ? activeSegment.variants[currentSegVarId] : null;

  const totalLength = useMemo(() => path ? getPathTotalLengthKm(path) : 0, [path]);

  const activeSegLength = useMemo(() => {
    if (!activeSegment || !currentSegVarId || !path) return 0;
    return getSegmentLengthKm(activeSegment, currentSegVarId, path.markers);
  }, [activeSegment, currentSegVarId, path]);

  useEffect(() => {
    setName(path?.name || '');
    setColor(path?.color || '');
  }, [path?.id, path?.name, path?.color]);

  useEffect(() => {
    setVariantColor(activeVariant?.color || '');
  }, [activeVariant?.color, currentSegVarId]);

  const debouncedSave = useDebouncedCallback(() => {
    if (!path) return;
    dispatch(editPath({ ...path, name, color }));
  }, 300);

  const debouncedVariantSave = useDebouncedCallback(() => {
    if (!activeVariant || !activeSegment) return;
    dispatch(editSegmentVariant({
      pathId: currentPathId,
      segmentId: activeSegment.id,
      variant: { ...activeVariant, color: variantColor },
    }));
  }, 300);

  const handleAddVariant = () => {
    if (!activeSegment) return;
    const varId = crypto.randomUUID();
    dispatch(addSegmentVariant({
      pathId: currentPathId,
      segmentId: activeSegment.id,
      variant: {
        id: varId,
        segmentId: activeSegment.id,
        color: randomRouteHexColor(),
        points: {},
      },
    }));
    dispatch(setActiveSegmentVariant({
      pathId: currentPathId,
      segmentId: activeSegment.id,
      variantId: varId,
    }));
    dispatch(setSegmentVariantId(varId));
  };

  const handleSelectSegment = (segId: string) => {
    const seg = path?.segments[segId];
    if (!seg) return;
    dispatch(setSegmentId(segId));
    dispatch(setSegmentVariantId(seg.activeVariantId));
  };

  const handleSelectVariant = (varId: string) => {
    if (!activeSegment) return;
    dispatch(setActiveSegmentVariant({
      pathId: currentPathId,
      segmentId: activeSegment.id,
      variantId: varId,
    }));
    dispatch(setSegmentVariantId(varId));
  };

  const handleDeleteVariant = (varId: string) => {
    if (!activeSegment) return;
    const remaining = Object.keys(activeSegment.variants).filter((k) => k !== varId);
    if (remaining.length === 0) return;
    dispatch(deleteSegmentVariant({
      pathId: currentPathId,
      segmentId: activeSegment.id,
      variantId: varId,
    }));
    if (currentSegVarId === varId) {
      const next = remaining[0];
      dispatch(setActiveSegmentVariant({
        pathId: currentPathId,
        segmentId: activeSegment.id,
        variantId: next,
      }));
      dispatch(setSegmentVariantId(next));
    }
  };

  const getSegmentLabel = (segId: string) => {
    const seg = path?.segments[segId];
    if (!seg || !path) return segId;
    const fromM = path.markers[seg.fromMarkerId];
    const toM = path.markers[seg.toMarkerId];
    const fromName = fromM?.name?.trim() || 'узел';
    const toName = toM?.name?.trim() || 'узел';
    return `${fromName} → ${toName}`;
  };

  if (!currentPathId || !path) {
    return null;
  }

  return (
    <div className={styles['right-menu']}>
      <p>Меню маршрута</p>
      <TextField
        label="Название маршрута"
        variant='outlined'
        size='small'
        sx={{ backgroundColor: '#ffffff', borderRadius: '4px' }}
        value={name}
        onChange={(e) => { setName(e.target.value); debouncedSave(); }}
      />
      <div className={styles['color-row']}>
        <TextField
          label="Цвет маршрута (HEX)"
          variant='outlined'
          size='small'
          sx={{ backgroundColor: '#ffffff', borderRadius: '4px', flex: 1, minWidth: 0 }}
          value={color}
          onChange={(e) => { setColor(e.target.value); debouncedSave(); }}
        />
        <input
          type="color"
          className={styles['color-picker']}
          value={/^#[0-9A-Fa-f]{6}$/i.test(color) ? color : '#ff0000'}
          onChange={(e) => { setColor(e.target.value); debouncedSave(); }}
        />
      </div>

      <div className={styles['path-data']}>
        <div className={styles['path-data__text']}>
          <p>Общая длина:</p> <p>{formatDistanceKm(totalLength)}</p>
        </div>
        <div className={styles['path-data__text']}>
          <p>Точек:</p> <p>{orderedMarkers.length}</p>
        </div>
        <div className={styles['path-data__text']}>
          <p>Маркеров:</p> <p>{promotedCount}</p>
        </div>
      </div>

      {multiVariantSegments.length > 0 && (
        <>
          <p>Сегменты с вариантами</p>
          <div className={styles['list']}>
            {multiVariantSegments.map((seg) => (
              <div
                key={seg.id}
                className={`${styles['segment-item']} ${seg.id === currentSegId ? styles['active'] : ''}`}
                onClick={() => handleSelectSegment(seg.id)}
              >
                <span className={styles['segment-label']}>{getSegmentLabel(seg.id)}</span>
                <span className={styles['segment-vars']}>
                  {Object.keys(seg.variants).length} вар.
                </span>
              </div>
            ))}
          </div>
        </>
      )}

      {activeSegment && (
        <>
          <p>Варианты сегмента</p>
          <div className={styles['list']}>
            {Object.values(activeSegment.variants).map((v) => (
              <div
                key={v.id}
                className={`${styles['segment-item']} ${v.id === currentSegVarId ? styles['active'] : ''}`}
                onClick={() => handleSelectVariant(v.id)}
              >
                <div
                  style={{ backgroundColor: v.color || path?.color, width: 14, height: 14, borderRadius: 3, marginRight: 6, flexShrink: 0, border: '1px solid rgba(0,0,0,.12)' }}
                />
                <span className={styles['segment-label']}>
                  {v.id === currentSegVarId ? '● ' : ''}
                  {formatDistanceKm(getSegmentLengthKm(activeSegment, v.id, path!.markers))}
                </span>
                {Object.keys(activeSegment.variants).length > 1 && (
                  <Button
                    size="small"
                    color="error"
                    sx={{ minWidth: 0, p: '2px 4px', ml: 'auto' }}
                    onClick={(e) => { e.stopPropagation(); handleDeleteVariant(v.id); }}
                  >
                    ✕
                  </Button>
                )}
              </div>
            ))}
          </div>
          <Button startIcon={<AddIcon />} onClick={handleAddVariant}>
            Добавить вариант
          </Button>

          {activeVariant && (
            <div className={styles['color-row']}>
              <TextField
                label="Цвет варианта"
                variant='outlined'
                size='small'
                sx={{ backgroundColor: '#ffffff', borderRadius: '4px', flex: 1, minWidth: 0 }}
                value={variantColor}
                onChange={(e) => { setVariantColor(e.target.value); debouncedVariantSave(); }}
              />
              <input
                type="color"
                className={styles['color-picker']}
                value={/^#[0-9A-Fa-f]{6}$/i.test(variantColor) ? variantColor : '#ff0000'}
                onChange={(e) => { setVariantColor(e.target.value); debouncedVariantSave(); }}
              />
            </div>
          )}

          <div className={styles['path-data']}>
            <div className={styles['path-data__text']}>
              <p>Длина сегмента:</p> <p>{formatDistanceKm(activeSegLength)}</p>
            </div>
          </div>
        </>
      )}
    </div>
  )
}

export default RightMenu;
