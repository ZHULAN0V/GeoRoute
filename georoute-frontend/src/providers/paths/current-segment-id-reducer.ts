import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'

export interface SegmentState {
  currentSegmentId: string
}

const initialState: SegmentState = {
  currentSegmentId: '',
}

export const currentSegmentIdSlice = createSlice({
  name: 'currentSegmentId',
  initialState,
  reducers: {
    setSegmentId: (state, action: PayloadAction<string>) => {
      state.currentSegmentId = action.payload;
    },
    clearSegmentId: (state) => {
      state.currentSegmentId = '';
    },
  },
})

export const { setSegmentId, clearSegmentId } = currentSegmentIdSlice.actions

export default currentSegmentIdSlice.reducer
