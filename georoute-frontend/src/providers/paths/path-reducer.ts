import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'
import type { IPath, IPathVariant, IPathVariantPointsObject, IPoint } from '../../services/types/Path'
import { initialStateRedux } from '../../lib/helpers/initialState'

export interface IPathsObject { [index: string]: IPath; }

interface IAddManyPointsProps {
  pathId: string,
  pathVariantId: string,
  points: IPathVariantPointsObject
}

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
    createPathVariant: (state, action: PayloadAction<IPathVariant>) => {
      // ебла вобла ну и хуйня конечно
      state.paths[action.payload.pathId]
        .variants[action.payload.id] = action.payload;
    },
    deletePathVariant: (state, action: PayloadAction<IPathVariant>) => {
      delete state.paths[action.payload.pathId]
        .variants[action.payload.id];
    },
    editPathVariant: (state, action: PayloadAction<IPathVariant>) => {
      state.paths[action.payload.pathId]
        .variants[action.payload.id] = action.payload;
    },
    // addMainPathArray: (state, action: PayloadAction<IPath>) => {
    //   // state.paths[action.payload.id] = action.payload;
    // },
    addPoint: (state, action: PayloadAction<IPoint>) => {
      // ебла вобла ну и хуйня конечно
      state.paths[action.payload.pathId].variants[action.payload.pathVariantId].path[action.payload.id] = action.payload;
      
      if (state.paths[action.payload.pathId].variants[action.payload.pathVariantId].path[action.payload.prevId] != undefined) {
        state.paths[action.payload.pathId].variants[action.payload.pathVariantId].path[action.payload.prevId].nextId = action.payload.id
      }
    },
    addManyPoint: (state, action: PayloadAction<IAddManyPointsProps>) => {
      state.paths[action.payload.pathId].variants[action.payload.pathVariantId].path = action.payload.points;
    },
    editPoint: (state, action: PayloadAction<IPoint>) => {
     state.paths[action.payload.pathId].variants[action.payload.pathVariantId].path[action.payload.id] = action.payload;
    },
    deletePoint: (state, action: PayloadAction<IPoint>) => {
      delete state.paths[action.payload.pathId].variants[action.payload.pathVariantId].path[action.payload.id];
    },
  },
})

export const { 
  addPath, 
  deletePath, 
  editPath, 
  createPathVariant, 
  deletePathVariant, 
  editPathVariant, 
  addPoint, 
  addManyPoint,
  editPoint, 
  deletePoint 
} = pathSlice.actions

export default pathSlice.reducer