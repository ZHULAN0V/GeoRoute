import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

export interface EditModeState {
  isEditing: boolean;
}

const initialState: EditModeState = {
  isEditing: false,
};

export const editModeSlice = createSlice({
  name: "editMode",
  initialState,
  reducers: {
    setEditing: (state, action: PayloadAction<boolean>) => {
      state.isEditing = action.payload;
    },
    toggleEditing: (state) => {
      state.isEditing = !state.isEditing;
    },
  },
});

export const { setEditing, toggleEditing } = editModeSlice.actions;

export default editModeSlice.reducer;
