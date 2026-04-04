import { configureStore } from '@reduxjs/toolkit'
import counterReducer from './redux-test/redux-toolkit'
import pathReducer from './redux-test/path-reducer'
import currentPath from './redux-test/current-path-reducer'
import currentButton from './redux-test/active-button-reducer'
import currentPathVariant from './redux-test/current-path-variant-reducer'
import pathObject from './paths/path-reducer'
import currentPathId from './paths/current-path-id-reducer'
import currentPathVariantId from './paths/current-path-variant-id-reducer'
import currentPointId from './paths/current-point-id-reducer'
import currentSegmentId from './paths/current-segment-id-reducer'
import currentSegmentVariantId from './paths/current-segment-variant-id-reducer'

export const store = configureStore({
  reducer: {
    counter: counterReducer,
    path: pathReducer,
    currentPath: currentPath,
    currentPathVariant: currentPathVariant,
    currentButton: currentButton,

    pathObject,
    currentPathId,
    currentPathVariantId,
    currentPointId,
    currentSegmentId,
    currentSegmentVariantId,
  },
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch