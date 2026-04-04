import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'
import type { IPath, IMarker, ISegment, ISegmentVariant, IPoint } from '../../services/types/Path'
import { initialStateRedux } from '../../lib/helpers/initialState'

export interface IPathsObject { [index: string]: IPath }

export interface PathState {
  paths: IPathsObject
}

const initialState: PathState = {
  paths: initialStateRedux,
}

export const pathSlice = createSlice({
  name: 'path',
  initialState,
  reducers: {
    addPath: (state, action: PayloadAction<IPath>) => {
      state.paths[action.payload.id] = action.payload;
    },
    deletePath: (state, action: PayloadAction<string>) => {
      delete state.paths[action.payload];
    },
    editPath: (state, action: PayloadAction<IPath>) => {
      state.paths[action.payload.id] = action.payload;
    },

    addMarker: (state, action: PayloadAction<{ pathId: string; marker: IMarker }>) => {
      const { pathId, marker } = action.payload;
      state.paths[pathId].markers[marker.id] = marker;
    },
    editMarker: (state, action: PayloadAction<{ pathId: string; marker: IMarker }>) => {
      const { pathId, marker } = action.payload;
      state.paths[pathId].markers[marker.id] = marker;
    },
    deleteMarker: (state, action: PayloadAction<{ pathId: string; markerId: string }>) => {
      const { pathId, markerId } = action.payload;
      delete state.paths[pathId].markers[markerId];
      for (const segId of Object.keys(state.paths[pathId].segments)) {
        const seg = state.paths[pathId].segments[segId];
        if (seg.fromMarkerId === markerId || seg.toMarkerId === markerId) {
          delete state.paths[pathId].segments[segId];
        }
      }
    },

    addSegment: (state, action: PayloadAction<{ pathId: string; segment: ISegment }>) => {
      const { pathId, segment } = action.payload;
      state.paths[pathId].segments[segment.id] = segment;
    },
    deleteSegment: (state, action: PayloadAction<{ pathId: string; segmentId: string }>) => {
      const { pathId, segmentId } = action.payload;
      delete state.paths[pathId].segments[segmentId];
    },

    addSegmentVariant: (
      state,
      action: PayloadAction<{ pathId: string; segmentId: string; variant: ISegmentVariant }>
    ) => {
      const { pathId, segmentId, variant } = action.payload;
      state.paths[pathId].segments[segmentId].variants[variant.id] = variant;
    },
    editSegmentVariant: (
      state,
      action: PayloadAction<{ pathId: string; segmentId: string; variant: ISegmentVariant }>
    ) => {
      const { pathId, segmentId, variant } = action.payload;
      state.paths[pathId].segments[segmentId].variants[variant.id] = variant;
    },
    setActiveSegmentVariant: (
      state,
      action: PayloadAction<{ pathId: string; segmentId: string; variantId: string }>
    ) => {
      const { pathId, segmentId, variantId } = action.payload;
      state.paths[pathId].segments[segmentId].activeVariantId = variantId;
    },
    deleteSegmentVariant: (
      state,
      action: PayloadAction<{ pathId: string; segmentId: string; variantId: string }>
    ) => {
      const { pathId, segmentId, variantId } = action.payload;
      delete state.paths[pathId].segments[segmentId].variants[variantId];
    },

    addSegmentPoint: (
      state,
      action: PayloadAction<{
        pathId: string; segmentId: string; segmentVariantId: string; point: IPoint
      }>
    ) => {
      const { pathId, segmentId, segmentVariantId, point } = action.payload;
      const variant = state.paths[pathId].segments[segmentId].variants[segmentVariantId];
      variant.points[point.id] = point;
      if (point.prevId && variant.points[point.prevId]) {
        variant.points[point.prevId].nextId = point.id;
      }
    },
    editSegmentPoint: (
      state,
      action: PayloadAction<{
        pathId: string; segmentId: string; segmentVariantId: string; point: IPoint
      }>
    ) => {
      const { pathId, segmentId, segmentVariantId, point } = action.payload;
      state.paths[pathId].segments[segmentId].variants[segmentVariantId].points[point.id] = point;
    },
    deleteSegmentPoint: (
      state,
      action: PayloadAction<{
        pathId: string; segmentId: string; segmentVariantId: string; pointId: string
      }>
    ) => {
      const { pathId, segmentId, segmentVariantId, pointId } = action.payload;
      const pts = state.paths[pathId].segments[segmentId].variants[segmentVariantId].points;
      const pt = pts[pointId];
      if (pt) {
        if (pt.prevId && pts[pt.prevId]) pts[pt.prevId].nextId = pt.nextId;
        if (pt.nextId && pts[pt.nextId]) pts[pt.nextId].prevId = pt.prevId;
        delete pts[pointId];
      }
    },
  },
})

export const {
  addPath,
  deletePath,
  editPath,
  addMarker,
  editMarker,
  deleteMarker,
  addSegment,
  deleteSegment,
  addSegmentVariant,
  editSegmentVariant,
  setActiveSegmentVariant,
  deleteSegmentVariant,
  addSegmentPoint,
  editSegmentPoint,
  deleteSegmentPoint,
} = pathSlice.actions

export default pathSlice.reducer
