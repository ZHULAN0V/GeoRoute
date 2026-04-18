import { configureStore } from '@reduxjs/toolkit'
import currentButton from './paths/active-button-reducer'
import pathObject from './paths/path-reducer'
import currentPathId from './paths/current-path-id-reducer'
import currentPathVariantId from './paths/current-path-variant-id-reducer'
import currentPointId from './paths/current-point-id-reducer'
import markerIds from './paths/path-segments-ids-reducer'

export const store = configureStore({
  reducer: {
    pathObject,
    currentPathId,
    currentPathVariantId,
    currentPointId,
    currentButton,
    markerIds
  },
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch