import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'
import type { IPath } from '../../services/types/Path'

export interface PathState {
  paths: IPath[]
}

const initialState: PathState = {
  paths: [],
}

export const pathSlice = createSlice({
  name: 'pathLegacy',
  initialState,
  reducers: {
    addPath: (state, action: PayloadAction<IPath>) => {
      state.paths.push(action.payload);
    },
    deletePath: (state, action: PayloadAction<string>) => {
      state.paths = state.paths.filter((path) => path.id !== action.payload);
    },
    editPath: (state, action: PayloadAction<IPath>) => {
      for (let i = 0; i < state.paths.length; i++) {
        if (state.paths[i].id === action.payload.id) {
          state.paths[i] = action.payload;
          break;
        }
      }
    },
  },
})

export const { addPath, deletePath, editPath } = pathSlice.actions

export default pathSlice.reducer
