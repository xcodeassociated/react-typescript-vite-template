import { Action, combineReducers, configureStore, ThunkAction } from '@reduxjs/toolkit'
import counterReducer from '@/pages/counter/counterSlice'
import storage from 'redux-persist/lib/storage' // defaults to localStorage for web
import { FLUSH, PAUSE, PERSIST, persistReducer, persistStore, PURGE, REGISTER, REHYDRATE } from 'redux-persist'
import { usersApi } from '@/pages/users/api/usersApi'
import { setupListeners } from '@reduxjs/toolkit/query'

const persistConfig = {
  key: 'counter',
  storage,
}

const persistedReducer = persistReducer(persistConfig, counterReducer)

const rootReducer = combineReducers({
  counter: persistedReducer,
  // Add the generated reducer as a specific top-level slice
  [usersApi.reducerPath]: usersApi.reducer,
})

export const setupStore = (preloadedState?: Partial<RootState>) => {
  return configureStore({
    reducer: rootReducer,
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware({
        serializableCheck: {
          ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
        },
        // Adding the api middleware enables caching, invalidation, polling,
        // and other useful features of `rtk-query`.
      }).concat(usersApi.middleware),
    preloadedState,
  })
}

export const store = setupStore()
export const persistor = persistStore(store)

export type AppStore = ReturnType<typeof setupStore>
export type AppDispatch = AppStore['dispatch']
export type RootState = ReturnType<typeof rootReducer>

export type AppThunk<ReturnType = void> = ThunkAction<ReturnType, RootState, unknown, Action<string>>

// optional, but required for refetchOnFocus/refetchOnReconnect behaviors
// see `setupListeners` docs - takes an optional callback as the 2nd arg for customization
setupListeners(store.dispatch)
