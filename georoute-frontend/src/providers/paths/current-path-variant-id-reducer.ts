import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'

export interface PathState {
  currentPathVariantId: string
}

const initialState: PathState = {
  currentPathVariantId: '',
}

export const currentPathVariantIdSlice = createSlice({
  name: 'currentPathVariantId',
  initialState,
  reducers: {
    setPathVariantId: (state, action: PayloadAction<string>) => {
      if (state.currentPathVariantId == action.payload) {
        state.currentPathVariantId = '';
      } else {
        state.currentPathVariantId = action.payload;
      }
    },
    unsetPathVariantId: (state) => {
      state.currentPathVariantId = '';
    },
  },
})

// Action creators are generated for each case reducer function
export const { setPathVariantId, unsetPathVariantId } = currentPathVariantIdSlice.actions

export default currentPathVariantIdSlice.reducer