import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'
import type { ISegmentVariant } from '../../services/types/Path'

export interface PathVariantState {
  currentPathVariant: ISegmentVariant | null
}

const initialState: PathVariantState = {
  currentPathVariant: null,
}

export const currentPathVariantSlice = createSlice({
  name: 'currentPathVariant',
  initialState,
  reducers: {
    chosePathVariant: (state, action: PayloadAction<ISegmentVariant>) => {
      state.currentPathVariant = action.payload;
    },
    unchosePathVariant: (state) => {
      state.currentPathVariant = null;
    },
  },
})

export const { chosePathVariant, unchosePathVariant } = currentPathVariantSlice.actions

export default currentPathVariantSlice.reducer
