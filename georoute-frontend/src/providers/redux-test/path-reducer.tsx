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
  name: 'path',
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
    // createPathVariant2: (state, action: PayloadAction<IPathVariant>) => {
    //   state.paths = [...state.paths.map(x => {
    //     if (action.payload.pathId == x.id) {
    //       return {...x, variants: [...x.variants, action.payload]}
    //     }
    //     return x;
    //   }),];
    // },
    // deletePathVariant: (state, action: PayloadAction<IPathVariant>) => {
    //   // state.value -= 1
    // },
    // editPathVariant: (state, action: PayloadAction<IPathVariant>) => {
    //   // state.value += 1
    // },
  },
})

// Action creators are generated for each case reducer function
export const { addPath, deletePath, editPath } = pathSlice.actions

export default pathSlice.reducer