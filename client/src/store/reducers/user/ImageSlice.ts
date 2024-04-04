/* Библиотеки */
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import {
  ImageItemResponse,
  ImagesResponse,
} from "src/models/Image/IImageModel";

/* Локальные интерфейсы */
interface IImageSlice extends ImagesResponse {
  isLoading: boolean;
}

/* Базовое состояние текущего слайса */
const initialState: IImageSlice = {
  items: [],
  isLoading: false,
};

export const userImageSlice = createSlice({
  name: "user_images_slice",
  initialState,
  reducers: {
    loadingStart(state: IImageSlice) {
      state.isLoading = true;
    },

    loadingEnd(state: IImageSlice) {
      state.isLoading = false;
    },

    clear(state: IImageSlice) {
      state.items = [];
      state.isLoading = false;
    },

    setImages(state: IImageSlice, action: PayloadAction<ImageItemResponse[]>) {
      if (action.payload && state.items) {
        state.items = action.payload;
      }
    },
  },
});

export default userImageSlice.reducer;
