import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

export type TMapLayer = "osm" | "yandex" | "google";

export interface MapView {
  center: [number, number];
  zoom: number;
}

export interface MapLayerState {
  currentLayer: TMapLayer;
  view: MapView;
}

const initialState: MapLayerState = {
  currentLayer: "osm",
  view: {
    center: [56.84, 60.6],
    zoom: 12,
  },
};

export const mapLayerSlice = createSlice({
  name: "mapLayer",
  initialState,
  reducers: {
    selectMapLayer: (state, action: PayloadAction<TMapLayer>) => {
      state.currentLayer = action.payload;
    },
    saveMapView: (state, action: PayloadAction<MapView>) => {
      state.view = action.payload;
    },
  },
});

export const { selectMapLayer, saveMapView } = mapLayerSlice.actions;

export default mapLayerSlice.reducer;
