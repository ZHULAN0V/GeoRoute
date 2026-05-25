import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

export interface CheckpointModalState {
  isOpen: boolean;
  pointId: string;
}

const initialState: CheckpointModalState = {
  isOpen: false,
  pointId: "",
};

export const checkpointModalSlice = createSlice({
  name: "checkpointModal",
  initialState,
  reducers: {
    openCheckpointModal: (state, action: PayloadAction<string>) => {
      state.isOpen = true;
      state.pointId = action.payload;
    },
    closeCheckpointModal: (state) => {
      state.isOpen = false;
      state.pointId = "";
    },
  },
});

export const { openCheckpointModal, closeCheckpointModal } =
  checkpointModalSlice.actions;

export default checkpointModalSlice.reducer;
