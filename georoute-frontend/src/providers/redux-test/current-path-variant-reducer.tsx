import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'
import type { IPathVariant } from '../../services/types/Path'

export interface PathVariantState {
  currentPathVariant: IPathVariant | null
}

const initialState: PathVariantState = {
  currentPathVariant: null,
}

export const currentPathVariantSlice = createSlice({
  name: 'currentPathVariant',
  initialState,
  reducers: {
    chosePathVariant: (state, action: PayloadAction<IPathVariant>) => {
      state.currentPathVariant = action.payload;
    },
    unchosePathVariant: (state) => {
      state.currentPathVariant = null;
    },
  },
})

// Action creators are generated for each case reducer function
export const { chosePathVariant, unchosePathVariant } = currentPathVariantSlice.actions

export default currentPathVariantSlice.reducer