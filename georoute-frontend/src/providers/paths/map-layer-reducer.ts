import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

export type TMapLayer = "osm" | "yandex" | "google";

export interface MapLayerState {
  currentLayer: TMapLayer;
}

const initialState: MapLayerState = {
  currentLayer: "osm",
};

export const mapLayerSlice = createSlice({
  name: "mapLayer",
  initialState,
  reducers: {
    selectMapLayer: (state, action: PayloadAction<TMapLayer>) => {
      state.currentLayer = action.payload;
    },
  },
});

export const { selectMapLayer } = mapLayerSlice.actions;

export default mapLayerSlice.reducer;
