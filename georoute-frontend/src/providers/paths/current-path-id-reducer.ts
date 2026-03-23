import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'

export interface PathState {
  currentPathId: string
}

const initialState: PathState = {
  currentPathId: '',
}

export const currentPathIdSlice = createSlice({
  name: 'currentPathId',
  initialState,
  reducers: {
    chosePathId: (state, action: PayloadAction<string>) => {
      if (state.currentPathId == action.payload) {
        state.currentPathId = '';
      } else {
        state.currentPathId = action.payload;
      }
    },
    unchosePathId: (state) => {
      state.currentPathId = '';
    },
  },
})

// Action creators are generated for each case reducer function
export const { chosePathId, unchosePathId } = currentPathIdSlice.actions

export default currentPathIdSlice.reducer