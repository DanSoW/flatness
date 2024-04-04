import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { ScreenModel } from "src/models/ScreenModel";

export interface IScreenSlice {
  screens: ScreenModel[];
  isLoading: boolean;
}

// Базовое состояние слайса
const initialState: IScreenSlice = {
  screens: [],
  isLoading: false,
};

/**
 * Создание слайса для авторизации пользователя
 */
export const screenSlice = createSlice({
  name: "screen_sclie",
  initialState,
  reducers: {
    loadingStart(state) {
      state.isLoading = true;
    },

    loadingEnd(state) {
      state.isLoading = false;
    },

    clear(state) {
      state.screens = [];
      state.isLoading = false;
    },

    setScreens(state, action: PayloadAction<ScreenModel[]>) {
      state.screens = action.payload;
    },
  },
});

export default screenSlice.reducer;
