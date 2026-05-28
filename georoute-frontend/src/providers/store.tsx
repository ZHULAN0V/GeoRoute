import { configureStore, createListenerMiddleware } from "@reduxjs/toolkit";
import undoable, {
  includeAction,
  groupByActionTypes,
  ActionCreators,
} from "redux-undo";
import pathObject from "./paths/path-reducer";
import currentPathId, {
  chosePathId,
  unchosePathId,
} from "./paths/current-path-id-reducer";
import currentPathVariantId from "./paths/current-path-variant-id-reducer";
import currentPointId from "./paths/current-point-id-reducer";
import markerIds from "./paths/path-segments-ids-reducer";
import mapLayer from "./paths/map-layer-reducer";
import editMode from "./paths/edit-mode-reducer";
import checkpointModal from "./paths/checkpoint-modal-reducer";

const undoablePathObject = undoable(pathObject, {
  limit: 50,
  filter: includeAction([
    "path/addPath",
    "path/deletePath",
    "path/editPath",
    "path/addPathFromImport",
    "path/addPathsFromNames",
    "path/createPathVariant",
    "path/deletePathVariant",
    "path/editPathVariant",
    "path/margeVariantToMain",
    "path/addPoint",
    "path/addPointBetween",
    "path/addManyPointsBetween",
    "path/addManyPoint",
    "path/addManyPointFromMathed",
    "path/editPoint",
    "path/deletePoint",
    "path/addMarker",
    "path/editMarker",
    "path/deleteMarker",
  ]),
  groupBy: groupByActionTypes(["path/editPoint", "path/editMarker"]),
});

const clearHistoryListener = createListenerMiddleware();
clearHistoryListener.startListening({
  predicate: (action, currentState, previousState) => {
    if (action.type !== chosePathId.type && action.type !== unchosePathId.type)
      return false;
    const prev = (previousState as RootState).currentPathId.currentPathId;
    const curr = (currentState as RootState).currentPathId.currentPathId;
    return prev !== curr;
  },
  effect: (_action, api) => {
    api.dispatch(ActionCreators.clearHistory());
  },
});

export const store = configureStore({
  reducer: {
    pathObject: undoablePathObject,
    currentPathId,
    currentPathVariantId,
    currentPointId,
    markerIds,
    mapLayer,
    editMode,
    checkpointModal,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().prepend(clearHistoryListener.middleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
