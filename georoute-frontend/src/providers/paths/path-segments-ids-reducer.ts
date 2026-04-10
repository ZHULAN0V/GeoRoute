import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'

export interface PathState {
  startMarkerId: string,
  endMarkerId: string,
}

const initialState: PathState = {
  startMarkerId: '',
  endMarkerId: '',
}

export const markerIdsSlice = createSlice({
  name: 'markerIds',
  initialState,
  reducers: {
    chooseStartMarkerId: (state, action: PayloadAction<string>) => {
      state.startMarkerId = action.payload;
    },
    chooseEndMarkerId: (state, action: PayloadAction<string>) => {
      state.endMarkerId = action.payload;
    },
  },
})

export const { 
  chooseStartMarkerId, 
  chooseEndMarkerId 
} = markerIdsSlice.actions

export default markerIdsSlice.reducer