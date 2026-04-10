import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'

export type TButtonType = 'edit' | 'delete' | 'double' | 'undo' | 'redo' | '';

export interface PathState {
  currentButton: TButtonType
}

const initialState: PathState = {
  currentButton: '',
}

export const currentButtonSlice = createSlice({
  name: 'currentButton',
  initialState,
  reducers: {
    selectButton: (state, action: PayloadAction<TButtonType>) => {
      if (action.payload == state.currentButton) {
        state.currentButton = '';
      } else {
        state.currentButton = action.payload;
      }
      
    },
  },
})

// Action creators are generated for each case reducer function
export const { selectButton } = currentButtonSlice.actions

export default currentButtonSlice.reducer