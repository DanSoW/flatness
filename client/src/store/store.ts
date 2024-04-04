/* Библиотеки */
import { combineReducers, configureStore } from "@reduxjs/toolkit";
import {
  persistStore,
  persistReducer,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
} from "redux-persist";
import storage from "redux-persist/lib/storage";

/* Контекст */
import messageQueueReducer from "./reducers/MessageQueueSlice";
import authReducer from "./reducers/AuthSlice";
import userImageReducer from "./reducers/user/ImageSlice";
import userVideoReducer from "./reducers/user/VideoSlice";
import userTextReducer from "./reducers/user/TextSlice";
import userTableReducer from "./reducers/user/TableSlice";
import userTapeReducer from "./reducers/user/TapeSlice";
import StoreConstants from "src/constants/store";
import screenReducer from "./reducers/ScreenSlice";
import copyReducer from "./reducers/CopySlice";

/* Главный Reducer */
const rootReducer = combineReducers({
  messageQueueReducer,
  authReducer,
  userImageReducer,
  userVideoReducer,
  userTextReducer,
  userTableReducer,
  userTapeReducer,
  screenReducer,
  copyReducer
});

// Конфигурация Persist
const persistConfig = {
  key: StoreConstants.MAIN_STORE,
  storage,
  blacklist: [
    "messageQueueReducer",
    "userImageReducer",
    "userVideoReducer",
    "userTextReducer",
    "userTableReducer",
    "userTapeReducer",
    "screenReducer",
    "copyReducer"
  ],
};

// Создание Persist Reducer
const persistedReducer = persistReducer(persistConfig, rootReducer);

// Конфигурирование общего хранилища
const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
});

const setupStore = () => {
  return store;
};

export const persistor = persistStore(store);
export default store;

export type RootState = ReturnType<typeof rootReducer>;
export type AppStore = ReturnType<typeof setupStore>;
export type AppDispatch = AppStore["dispatch"];
