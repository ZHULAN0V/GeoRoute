import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'

export interface PointState {
  currentPointId: string
}

const initialState: PointState = {
  currentPointId: '',
}

export const currentPointIdSlice = createSlice({
  name: 'currentPointId',
  initialState,
  reducers: {
    chosePointId: (state, action: PayloadAction<string>) => {
      if (state.currentPointId == action.payload) {
        state.currentPointId = '';
      } else {
        state.currentPointId = action.payload;
      }
    },
    unchosePointId: (state) => {
      state.currentPointId = '';
    },
  },
})

// Action creators are generated for each case reducer function
export const { chosePointId, unchosePointId } = currentPointIdSlice.actions

export default currentPointIdSlice.reducer