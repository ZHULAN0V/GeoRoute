import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'

export interface SegmentVariantState {
  currentSegmentVariantId: string
}

const initialState: SegmentVariantState = {
  currentSegmentVariantId: '',
}

export const currentSegmentVariantIdSlice = createSlice({
  name: 'currentSegmentVariantId',
  initialState,
  reducers: {
    setSegmentVariantId: (state, action: PayloadAction<string>) => {
      state.currentSegmentVariantId = action.payload;
    },
    clearSegmentVariantId: (state) => {
      state.currentSegmentVariantId = '';
    },
  },
})

export const { setSegmentVariantId, clearSegmentVariantId } = currentSegmentVariantIdSlice.actions

export default currentSegmentVariantIdSlice.reducer
