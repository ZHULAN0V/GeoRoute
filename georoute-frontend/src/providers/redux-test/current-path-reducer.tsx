import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'
import type { IPath } from '../../services/types/Path'

export interface PathState {
  currentPath: IPath | null
}

const initialState: PathState = {
  currentPath: null,
}

export const currentPathSlice = createSlice({
  name: 'currentPath',
  initialState,
  reducers: {
    chosePath: (state, action: PayloadAction<IPath>) => {
      state.currentPath = action.payload;
    },
    unchosePath: (state) => {
      state.currentPath = null;
    },
    // createPathVariant: (state, action: PayloadAction<IPathVariant>) => {
    //   state.currentPath?.variants.push(action.payload)
    // },
  },
})

// Action creators are generated for each case reducer function
export const { chosePath, unchosePath } = currentPathSlice.actions

export default currentPathSlice.reducer