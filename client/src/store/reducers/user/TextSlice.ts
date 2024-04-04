/* Библиотеки */
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { ITextItemResponse, ITextResponse } from "src/models/Text/ITextModel";
import { IVideoItemResponse } from "src/models/Video/IVideoModel";

/* Локальные интерфейсы */
interface ITextSlice extends ITextResponse {
  isLoading: boolean;
}

/* Базовое состояние текущего слайса */
const initialState: ITextSlice = {
  items: [],
  isLoading: false,
};

export const userTextSlice = createSlice({
  name: "user_texts_slice",
  initialState,
  reducers: {
    loadingStart(state: ITextSlice) {
      state.isLoading = true;
    },

    loadingEnd(state: ITextSlice) {
      state.isLoading = false;
    },

    clear(state: ITextSlice) {
      state.items = [];
      state.isLoading = false;
    },

    setText(state: ITextSlice, action: PayloadAction<ITextItemResponse[]>) {
      if (action.payload && state.items) {
        state.items = action.payload;
      }
    },
  },
});

export default userTextSlice.reducer;
