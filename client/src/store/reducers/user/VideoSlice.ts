/* Библиотеки */
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import {
  ImageItemResponse,
} from "src/models/Image/IImageModel";
import { IVideoItemResponse, IVideoResponse } from "src/models/Video/IVideoModel";

/* Локальные интерфейсы */
interface IVideoSlice extends IVideoResponse {
  isLoading: boolean;
}

/* Базовое состояние текущего слайса */
const initialState: IVideoSlice = {
  items: [],
  isLoading: false,
};

export const userVideoSlice = createSlice({
  name: "user_videos_slice",
  initialState,
  reducers: {
    loadingStart(state: IVideoSlice) {
      state.isLoading = true;
    },

    loadingEnd(state: IVideoSlice) {
      state.isLoading = false;
    },

    clear(state: IVideoSlice) {
      state.items = [];
      state.isLoading = false;
    },

    setVideos(state: IVideoSlice, action: PayloadAction<IVideoItemResponse[]>) {
      if (action.payload && state.items) {
        state.items = action.payload;
      }
    },
  },
});

export default userVideoSlice.reducer;
