import { configureStore } from "@reduxjs/toolkit";
import pathObject from "./paths/path-reducer";
import currentPathId from "./paths/current-path-id-reducer";
import currentPathVariantId from "./paths/current-path-variant-id-reducer";
import currentPointId from "./paths/current-point-id-reducer";
import markerIds from "./paths/path-segments-ids-reducer";
import mapLayer from "./paths/map-layer-reducer";
import editMode from "./paths/edit-mode-reducer";
import checkpointModal from "./paths/checkpoint-modal-reducer";

export const store = configureStore({
  reducer: {
    pathObject,
    currentPathId,
    currentPathVariantId,
    currentPointId,
    markerIds,
    mapLayer,
    editMode,
    checkpointModal,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
