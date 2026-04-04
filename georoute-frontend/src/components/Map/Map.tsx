import styles from './Map.module.css'
import { MapContainer, Marker, Polyline, TileLayer, useMapEvent } from 'react-leaflet'
import type { LatLngTuple, LeafletMouseEvent } from 'leaflet'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import type { RootState } from '../../providers/store'
import { selectButton } from '../../providers/redux-test/active-button-reducer'
import {
  addMarker,
  editMarker,
  deleteMarker,
  addSegment,
  addSegmentVariant,
  addSegmentPoint,
  editSegmentPoint,
  deleteSegmentPoint,
  setActiveSegmentVariant,
} from '../../providers/paths/path-reducer'
import "leaflet-draw/dist/leaflet.draw.css"
import { chosePointId } from '../../providers/paths/current-point-id-reducer'
import type { IMarker as IMarkerType, IPath, IPoint, ISegment } from '../../services/types/Path'
import { useDebouncedCallback } from 'use-debounce'
import {
  getOrderedPoints,
  getOrderedMarkers,
  getSegmentPolyline,
  getPromotedMarkerPairs,
} from '../../lib/helpers/pathGeometry'
import { resolveRouteLineColor } from '../../lib/helpers/routeColors'
import { createPlaceIcon, createNodeIcon, createPlusIcon } from './pointIcons'
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField } from '@mui/material'
import { setSegmentId, clearSegmentId } from '../../providers/paths/current-segment-id-reducer'
import { setSegmentVariantId, clearSegmentVariantId } from '../../providers/paths/current-segment-variant-id-reducer'
import { randomRouteHexColor } from '../../lib/helpers/routeColors'

const MARKER_PIN_COLOR = '#e53935'

const tileLayerUrl = 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'
const tileLayerAttribution = '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'

const DialogLockContext = createContext<React.RefObject<boolean>>({ current: false })

interface MyComponentProps {
  handleMapClick: (e: LeafletMouseEvent) => void
  handleMapMouseMove: (e: LeafletMouseEvent) => void
  handleMapContextMenu: () => void
}

function MyComponent(props: MyComponentProps) {
  const { handleMapClick, handleMapMouseMove, handleMapContextMenu } = props
  useMapEvent('click', (e) => handleMapClick(e))
  useMapEvent('mousemove', (e) => handleMapMouseMove(e))
  useMapEvent('dblclick', () => {})
  useMapEvent('contextmenu', () => handleMapContextMenu())
  return null
}

function isPromoted(m: IMarkerType): boolean {
  return m.name.trim() !== ''
}

interface MarkerOnMapProps {
  marker: IMarkerType
  routeColor: string
  onMarkerClick: (marker: IMarkerType) => void
  onDrag: (marker: IMarkerType) => (e: LeafletMouseEvent) => void
  onContextMenu: (marker: IMarkerType) => () => void
}

function MarkerOnMap({ marker, routeColor, onMarkerClick, onDrag, onContextMenu }: MarkerOnMapProps) {
  const dialogLocked = useContext(DialogLockContext)
  const icon = useMemo(
    () => isPromoted(marker)
      ? createPlaceIcon(MARKER_PIN_COLOR, marker.name)
      : createNodeIcon(routeColor),
    [marker.name, routeColor]
  )
  const handleClick = useCallback(
    (e: LeafletMouseEvent) => {
      if (e.originalEvent) L.DomEvent.stopPropagation(e.originalEvent)
      if (dialogLocked.current) return
      onMarkerClick(marker)
    },
    [onMarkerClick, marker, dialogLocked]
  )
  return (
    <Marker
      position={[marker.lat, marker.lng]}
      draggable
      icon={icon}
      eventHandlers={{
        click: handleClick,
        // @ts-expect-error leaflet drag typing
        drag: onDrag(marker),
        contextmenu: onContextMenu(marker),
      }}
    />
  )
}

interface NodeOnMapProps {
  point: IPoint
  lineColor: string
  onDrag: (point: IPoint) => (e: LeafletMouseEvent) => void
  onContextMenu: (point: IPoint) => () => void
}

function NodeOnMap({ point, lineColor, onDrag, onContextMenu }: NodeOnMapProps) {
  const icon = useMemo(() => createNodeIcon(lineColor), [lineColor])
  return (
    <Marker
      position={[point.lat, point.lng]}
      draggable
      icon={icon}
      eventHandlers={{
        // @ts-expect-error leaflet drag typing
        drag: onDrag(point),
        contextmenu: onContextMenu(point),
      }}
    />
  )
}

interface PlusButtonProps {
  fromMarker: IMarkerType
  toMarker: IMarkerType
  existingSegment: ISegment | undefined
  onClick: (fromId: string, toId: string, existingSeg: ISegment | undefined) => void
}

function PlusButton({ fromMarker, toMarker, existingSegment, onClick }: PlusButtonProps) {
  const icon = useMemo(() => createPlusIcon(), [])
  const pos: LatLngTuple = [
    (fromMarker.lat + toMarker.lat) / 2,
    (fromMarker.lng + toMarker.lng) / 2,
  ]
  const handleClick = useCallback(
    (e: LeafletMouseEvent) => {
      if (e.originalEvent) L.DomEvent.stopPropagation(e.originalEvent)
      onClick(fromMarker.id, toMarker.id, existingSegment)
    },
    [fromMarker.id, toMarker.id, existingSegment, onClick]
  )
  return (
    <Marker
      position={pos}
      icon={icon}
      eventHandlers={{ click: handleClick }}
    />
  )
}

function Map() {
  const paths = useSelector((state: RootState) => state.pathObject.paths)
  const currentButton = useSelector((state: RootState) => state.currentButton.currentButton)
  const currentPathId = useSelector((state: RootState) => state.currentPathId.currentPathId)
  const currentSegId = useSelector((state: RootState) => state.currentSegmentId.currentSegmentId)
  const currentSegVarId = useSelector((state: RootState) => state.currentSegmentVariantId.currentSegmentVariantId)
  const currentPointId = useSelector((state: RootState) => state.currentPointId.currentPointId)

  const dispatch = useDispatch()

  const currentPath: IPath | undefined = paths[currentPathId]
  const routeColor = useMemo(
    () => resolveRouteLineColor(undefined, currentPath?.color),
    [currentPath?.color]
  )

  const orderedMarkers = useMemo(
    () => currentPath ? getOrderedMarkers(currentPath) : [],
    [currentPath]
  )

  const promotedPairs = useMemo(
    () => currentPath ? getPromotedMarkerPairs(currentPath) : [],
    [currentPath]
  )

  const [positionLineMouse, setPositionLineMouse] = useState<LatLngTuple[]>([[0, 0], [0, 0]])
  const [markerDialog, setMarkerDialog] = useState<IMarkerType | null>(null)
  const [markerNameDraft, setMarkerNameDraft] = useState('')

  const dialogLockedRef = useRef(false)
  const unlockTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const openMarkerDialog = useCallback((marker: IMarkerType) => {
    if (dialogLockedRef.current) return
    dialogLockedRef.current = true
    const fresh = currentPath?.markers[marker.id] ?? marker
    setMarkerDialog(fresh)
    setMarkerNameDraft(fresh.name)
  }, [currentPath])

  const closeMarkerDialog = useCallback(() => {
    setMarkerDialog(null)
    setMarkerNameDraft('')
    if (unlockTimerRef.current) clearTimeout(unlockTimerRef.current)
    unlockTimerRef.current = setTimeout(() => {
      dialogLockedRef.current = false
      unlockTimerRef.current = null
    }, 700)
  }, [])

  useEffect(() => () => {
    if (unlockTimerRef.current) clearTimeout(unlockTimerRef.current)
  }, [])

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key !== 'Escape') return
      if (markerDialog) {
        closeMarkerDialog()
        return
      }
      if (currentSegId) {
        dispatch(clearSegmentId())
        dispatch(clearSegmentVariantId())
        return
      }
      if (currentButton === 'edit') {
        dispatch(selectButton(''))
      }
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [markerDialog, closeMarkerDialog, currentSegId, currentButton, dispatch])

  const handlePromoteToMarker = useCallback(() => {
    if (!markerDialog) return
    const name = markerNameDraft.trim() || 'Без названия'
    dispatch(editMarker({
      pathId: currentPathId,
      marker: { ...markerDialog, name },
    }))
    closeMarkerDialog()
  }, [markerDialog, markerNameDraft, currentPathId, dispatch, closeMarkerDialog])

  const handleSaveMarkerName = useCallback(() => {
    if (!markerDialog) return
    const name = markerNameDraft.trim() || 'Без названия'
    dispatch(editMarker({
      pathId: currentPathId,
      marker: { ...markerDialog, name },
    }))
    closeMarkerDialog()
  }, [markerDialog, markerNameDraft, currentPathId, dispatch, closeMarkerDialog])

  const handleDemoteToNode = useCallback(() => {
    if (!markerDialog) return
    dispatch(editMarker({
      pathId: currentPathId,
      marker: { ...markerDialog, name: '' },
    }))
    closeMarkerDialog()
  }, [markerDialog, currentPathId, dispatch, closeMarkerDialog])

  const handleDeleteMarkerFromDialog = useCallback(() => {
    if (!markerDialog) return
    dispatch(deleteMarker({ pathId: currentPathId, markerId: markerDialog.id }))
    closeMarkerDialog()
  }, [markerDialog, currentPathId, dispatch, closeMarkerDialog])

  const handleMapClick = (e: LeafletMouseEvent) => {
    if (dialogLockedRef.current) return
    const { lat, lng } = e.latlng
    if (currentButton !== 'edit' || !currentPath) return

    if (currentSegId && currentSegVarId) {
      const seg = currentPath.segments[currentSegId]
      if (!seg) return
      const variant = seg.variants[currentSegVarId]
      if (!variant) return

      const newPointId = crypto.randomUUID()
      const existingPts = Object.values(variant.points)
      const prevId = existingPts.length > 0 ? currentPointId : ''

      const newPoint: IPoint = {
        id: newPointId,
        nextId: '',
        prevId,
        lat,
        lng,
      }
      dispatch(addSegmentPoint({
        pathId: currentPathId,
        segmentId: currentSegId,
        segmentVariantId: currentSegVarId,
        point: newPoint,
      }))
      dispatch(chosePointId(newPointId))
    } else {
      const markers = orderedMarkers
      const newMarkerId = crypto.randomUUID()
      const newOrder = markers.length > 0 ? markers[markers.length - 1].order + 1 : 0
      const newMarker: IMarkerType = {
        id: newMarkerId,
        pathId: currentPathId,
        name: '',
        lat,
        lng,
        order: newOrder,
      }
      dispatch(addMarker({ pathId: currentPathId, marker: newMarker }))
    }
  }

  const handleMapMouseMove = (e: LeafletMouseEvent) => {
    if (currentButton !== 'edit' || !currentPath) return
    const { lat, lng } = e.latlng

    if (currentSegId && currentSegVarId) {
      const seg = currentPath.segments[currentSegId]
      if (!seg) return
      const variant = seg.variants[currentSegVarId]
      if (!variant) return
      const ordPts = getOrderedPoints(variant.points)
      if (ordPts.length > 0) {
        const last = ordPts[ordPts.length - 1]
        setPositionLineMouse([[last.lat, last.lng], [lat, lng]])
      } else {
        const fromM = currentPath.markers[seg.fromMarkerId]
        if (fromM) setPositionLineMouse([[fromM.lat, fromM.lng], [lat, lng]])
      }
    } else if (orderedMarkers.length > 0) {
      const last = orderedMarkers[orderedMarkers.length - 1]
      setPositionLineMouse([[last.lat, last.lng], [lat, lng]])
    }
  }

  const handleMapContextMenu = () => {
    dispatch(selectButton('edit'))
  }

  const handlePlusClick = useCallback(
    (fromId: string, toId: string, existingSeg: ISegment | undefined) => {
      if (!currentPath) return
      const varId = crypto.randomUUID()
      const variantColor = randomRouteHexColor()

      if (existingSeg) {
        dispatch(addSegmentVariant({
          pathId: currentPathId,
          segmentId: existingSeg.id,
          variant: {
            id: varId,
            segmentId: existingSeg.id,
            color: variantColor,
            points: {},
          },
        }))
        dispatch(setActiveSegmentVariant({
          pathId: currentPathId,
          segmentId: existingSeg.id,
          variantId: varId,
        }))
        dispatch(setSegmentId(existingSeg.id))
      } else {
        const segId = crypto.randomUUID()
        const firstVarId = crypto.randomUUID()
        const newSeg: ISegment = {
          id: segId,
          pathId: currentPathId,
          fromMarkerId: fromId,
          toMarkerId: toId,
          activeVariantId: firstVarId,
          variants: {
            [firstVarId]: {
              id: firstVarId,
              segmentId: segId,
              color: variantColor,
              points: {},
            },
          },
        }
        dispatch(addSegment({ pathId: currentPathId, segment: newSeg }))
        dispatch(setSegmentId(segId))
        dispatch(setSegmentVariantId(firstVarId))
        dispatch(selectButton('edit'))
        return
      }
      dispatch(setSegmentVariantId(varId))
      dispatch(selectButton('edit'))
    },
    [currentPath, currentPathId, dispatch]
  )

  const handleSegmentLineClick = useCallback((segmentId: string) => {
    if (!currentPath) return
    const seg = currentPath.segments[segmentId]
    if (!seg) return
    dispatch(setSegmentId(segmentId))
    dispatch(setSegmentVariantId(seg.activeVariantId))
  }, [currentPath, dispatch])

  const handleDeselectSegment = useCallback(() => {
    dispatch(clearSegmentId())
    dispatch(clearSegmentVariantId())
  }, [dispatch])

  const debouncedMarkerDrag = useDebouncedCallback(
    (marker: IMarkerType, e: LeafletMouseEvent) => {
      dispatch(editMarker({
        pathId: currentPathId,
        marker: { ...marker, lat: e.latlng.lat, lng: e.latlng.lng },
      }))
    },
    300
  )

  const handleMarkerDrag = useCallback(
    (marker: IMarkerType) => (e: LeafletMouseEvent) => {
      debouncedMarkerDrag(marker, e)
    },
    [debouncedMarkerDrag]
  )

  const handleMarkerDelete = useCallback(
    (marker: IMarkerType) => () => {
      dispatch(deleteMarker({ pathId: currentPathId, markerId: marker.id }))
    },
    [currentPathId, dispatch]
  )

  const debouncedNodeDrag = useDebouncedCallback(
    (point: IPoint, e: LeafletMouseEvent) => {
      if (!currentSegId || !currentSegVarId) return
      dispatch(editSegmentPoint({
        pathId: currentPathId,
        segmentId: currentSegId,
        segmentVariantId: currentSegVarId,
        point: { ...point, lat: e.latlng.lat, lng: e.latlng.lng },
      }))
    },
    300
  )

  const handleNodeDrag = useCallback(
    (point: IPoint) => (e: LeafletMouseEvent) => {
      debouncedNodeDrag(point, e)
    },
    [debouncedNodeDrag]
  )

  const handleNodeDelete = useCallback(
    (point: IPoint) => () => {
      if (!currentSegId || !currentSegVarId) return
      dispatch(deleteSegmentPoint({
        pathId: currentPathId,
        segmentId: currentSegId,
        segmentVariantId: currentSegVarId,
        pointId: point.id,
      }))
    },
    [currentPathId, currentSegId, currentSegVarId, dispatch]
  )

  const renderBasePolyline = (route: IPath, color: string) => {
    const markers = getOrderedMarkers(route)
    if (markers.length < 2) return null
    return (
      <Polyline
        pathOptions={{ color, weight: 4 }}
        positions={markers.map((m) => [m.lat, m.lng] as LatLngTuple)}
      />
    )
  }

  const renderSegmentVariants = (route: IPath, isCurrentPath: boolean) => {
    return Object.values(route.segments).flatMap((seg) =>
      Object.values(seg.variants).map((v) => {
        const polyline = getSegmentPolyline(seg, v.id, route.markers)
        if (polyline.length < 2) return null
        const isActive = isCurrentPath && seg.id === currentSegId && v.id === currentSegVarId
        return (
          <Polyline
            key={`${seg.id}-${v.id}`}
            pathOptions={{
              color: v.color || route.color,
              weight: isActive ? 5 : 3,
              opacity: isActive ? 0.9 : 0.6,
              dashArray: '10 6',
            }}
            positions={polyline.map((p) => [p.lat, p.lng] as LatLngTuple)}
            eventHandlers={isCurrentPath ? {
              click: () => {
                dispatch(setActiveSegmentVariant({
                  pathId: route.id,
                  segmentId: seg.id,
                  variantId: v.id,
                }))
                dispatch(setSegmentId(seg.id))
                dispatch(setSegmentVariantId(v.id))
              },
            } : {}}
          />
        )
      })
    )
  }

  const activeSegment = currentPath && currentSegId
    ? currentPath.segments[currentSegId] : null
  const activeVariant = activeSegment && currentSegVarId
    ? activeSegment.variants[currentSegVarId] : null
  const activeVariantNodes = activeVariant
    ? getOrderedPoints(activeVariant.points) : []

  const dialogIsPromoted = markerDialog ? isPromoted(markerDialog) : false

  return (
    <DialogLockContext value={dialogLockedRef}>
      <div className={styles.map}>
        <MapContainer center={[56.84, 60.6]} zoom={12} zoomControl={false} attributionControl={false}>
          <TileLayer attribution={tileLayerAttribution} url={tileLayerUrl} />
          <MyComponent
            handleMapClick={handleMapClick}
            handleMapMouseMove={handleMapMouseMove}
            handleMapContextMenu={handleMapContextMenu}
          />

          {/* Other routes */}
          {Object.values(paths)
            .filter((p) => p.checked && p.id !== currentPathId)
            .map((route) => (
              <div key={route.id}>
                {renderBasePolyline(route, route.color)}
                {renderSegmentVariants(route, false)}
                {Object.values(route.markers).map((m) => (
                  <Marker
                    key={m.id}
                    position={[m.lat, m.lng]}
                    icon={isPromoted(m)
                      ? createPlaceIcon(MARKER_PIN_COLOR, m.name)
                      : createNodeIcon(route.color)}
                  />
                ))}
              </div>
            ))}

          {/* Current route */}
          {currentPath && (
            <>
              {renderBasePolyline(currentPath, routeColor)}
              {renderSegmentVariants(currentPath, true)}

              {orderedMarkers.map((m) => (
                <MarkerOnMap
                  key={m.id}
                  marker={m}
                  routeColor={routeColor}
                  onMarkerClick={openMarkerDialog}
                  onDrag={handleMarkerDrag}
                  onContextMenu={handleMarkerDelete}
                />
              ))}

              {/* "+" buttons between consecutive promoted markers */}
              {promotedPairs.map(({ from, to, segment }) => (
                <PlusButton
                  key={`plus-${from.id}-${to.id}`}
                  fromMarker={from}
                  toMarker={to}
                  existingSegment={segment}
                  onClick={handlePlusClick}
                />
              ))}

              {/* Intermediate nodes of the active segment variant */}
              {activeVariantNodes.map((pt) => (
                <NodeOnMap
                  key={pt.id}
                  point={pt}
                  lineColor={activeVariant?.color || routeColor}
                  onDrag={handleNodeDrag}
                  onContextMenu={handleNodeDelete}
                />
              ))}

              {currentButton === 'edit' && (
                <Polyline
                  pathOptions={{ color: routeColor, weight: 4, dashArray: '6 4' }}
                  positions={positionLineMouse}
                />
              )}
            </>
          )}
        </MapContainer>

        {currentSegId && (
          <div style={{
            position: 'absolute', top: 10, left: '50%', transform: 'translateX(-50%)',
            zIndex: 1000, background: '#fff', borderRadius: 8, padding: '6px 16px',
            boxShadow: '0 2px 8px rgba(0,0,0,.15)', display: 'flex', alignItems: 'center', gap: 8,
            fontSize: 13,
          }}>
            <span>Редактирование сегмента</span>
            <Button size="small" onClick={handleDeselectSegment}>Закрыть</Button>
          </div>
        )}

        <Dialog
          open={Boolean(markerDialog)}
          onClose={closeMarkerDialog}
          maxWidth="xs"
          fullWidth
          disableRestoreFocus
          disableScrollLock
        >
          <DialogTitle>{dialogIsPromoted ? 'Маркер' : 'Узел маршрута'}</DialogTitle>
          <DialogContent>
            {dialogIsPromoted ? (
              <TextField
                label="Название маркера"
                value={markerNameDraft}
                onChange={(e) => setMarkerNameDraft(e.target.value)}
                fullWidth
                margin="dense"
                autoFocus
              />
            ) : (
              <>
                <p style={{ margin: '0 0 12px', fontSize: 14, color: '#444' }}>
                  Узлы — это точки линии. Задайте название и нажмите «Сделать маркером»,
                  чтобы точка стала именованной меткой на карте.
                  Между маркерами можно создавать варианты маршрута.
                </p>
                <TextField
                  label="Название маркера"
                  value={markerNameDraft}
                  onChange={(e) => setMarkerNameDraft(e.target.value)}
                  fullWidth
                  margin="dense"
                  placeholder="Например: вход в парк"
                />
              </>
            )}
          </DialogContent>
          <DialogActions sx={{ px: 3, pb: 2 }}>
            <Button onClick={closeMarkerDialog}>Закрыть</Button>
            {dialogIsPromoted ? (
              <>
                <Button onClick={handleDemoteToNode} color="warning">Сделать узлом</Button>
                <Button onClick={handleDeleteMarkerFromDialog} color="error">Удалить</Button>
                <Button onClick={handleSaveMarkerName} variant="contained">Сохранить</Button>
              </>
            ) : (
              <>
                <Button onClick={handleDeleteMarkerFromDialog} color="error">Удалить</Button>
                <Button onClick={handlePromoteToMarker} variant="contained">Сделать маркером</Button>
              </>
            )}
          </DialogActions>
        </Dialog>
      </div>
    </DialogLockContext>
  )
}

export default Map
