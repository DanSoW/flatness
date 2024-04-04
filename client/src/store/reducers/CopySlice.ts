import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { ICopyModel } from "src/models/ICopyModel";

export interface ICopySlice extends ICopyModel {
  isLoading: boolean;
}

// Базовое состояние слайса
const initialState: ICopySlice = {
  isLoading: false,
};

/**
 * Создание слайса для авторизации пользователя
 */
export const copySlice = createSlice({
  name: "copy_slice",
  initialState,
  reducers: {
    loadingStart(state) {
      state.isLoading = true;
    },

    loadingEnd(state) {
      state.isLoading = false;
    },

    clear(state) {
      state.tapes_id_source = null;
      state.isLoading = false;
    },

    setTapeSource(state, action: PayloadAction<number>) {
      state.tapes_id_source = action.payload;
    },
  },
});

export default copySlice.reducer;
