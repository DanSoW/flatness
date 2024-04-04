/* Библиотеки */
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import {
  ITableItemResponse,
  ITableResponse,
} from "src/models/Tables/ITableModel";
import {
  ITapeItem,
  ITapeResponseGetAll,
  ITapeResponseGetAllByScreen,
} from "src/models/Tape/ITapeModel";
import { arrayMove } from "src/utils/array";

/* Элемент данных на ленте */
export interface ITapeContent {
  type: string;
  content_id: number;
  queue_num: number;
}

export interface ITapeContentSlice {
  type: string;
  content_id: number;
}

/* Локальные интерфейсы */
interface ITapeSlice {
  items: ITapeContent[];
  screenInfo: ITapeResponseGetAllByScreen | null;
  tapesInfo: ITapeResponseGetAll | null;
  currentItem: ITapeItem | null;
  isLoading: boolean;
  isAdd: boolean;
}

/* Базовое состояние текущего слайса */
const initialState: ITapeSlice = {
  items: [],
  screenInfo: null,
  tapesInfo: null,
  currentItem: null,
  isLoading: false,
  isAdd: false,
};

export const userTapeSlice = createSlice({
  name: "user_tape_slice",
  initialState,
  reducers: {
    loadingStart(state: ITapeSlice) {
      state.isLoading = true;
    },

    loadingEnd(state: ITapeSlice) {
      state.isLoading = false;
    },

    setAdd(state: ITapeSlice, action: PayloadAction<boolean>) {
      state.isAdd = action.payload;
    },

    clearCurrentItem(state: ITapeSlice) {
      state.currentItem = null;
    },

    clear(state: ITapeSlice) {
      state.items = [];
      state.isLoading = false;
      // state.tapesInfo = null;
      // state.screenInfo = null;
    },

    setCurrentTape(state: ITapeSlice, action: PayloadAction<ITapeItem>) {
      if (action.payload && state.items) {
        state.currentItem = action.payload;
      }
    },

    setScreenInfo(
      state: ITapeSlice,
      action: PayloadAction<ITapeResponseGetAllByScreen>
    ) {
      if (action.payload && state.items) {
        state.screenInfo = action.payload;
      }
    },

    setTapesInfo(
      state: ITapeSlice,
      action: PayloadAction<ITapeResponseGetAll>
    ) {
      if (action.payload && state.items) {
        state.tapesInfo = action.payload;
      }
    },

    addContent(state: ITapeSlice, action: PayloadAction<ITapeContent>) {
      if (action.payload && state.items) {
        state.items.push(action.payload);
      }
    },

    moveLeft(state: ITapeSlice, action: PayloadAction<ITapeContent>) {
      if (action.payload && state.items) {
        const index = state.items.findIndex((item) => {
          return (
            item.content_id === action.payload.content_id &&
            item.type === action.payload.type &&
            item.queue_num === action.payload.queue_num
          );
        });

        if (index >= 0 && index - 1 >= 0) {
          const item = Object.assign({}, state.items[index - 1]);

          state.items[index - 1].queue_num = state.items[index].queue_num;
          state.items[index].queue_num = item.queue_num;

          state.items = arrayMove(state.items, index, index - 1);
        }
      }
    },

    moveRight(state: ITapeSlice, action: PayloadAction<ITapeContent>) {
      if (action.payload && state.items) {
        const index = state.items.findIndex((item) => {
          return (
            item.content_id === action.payload.content_id &&
            item.type === action.payload.type &&
            item.queue_num === action.payload.queue_num
          );
        });

        if (index >= 0 && index + 1 < state.items.length) {
          const item = Object.assign({}, state.items[index + 1]);

          state.items[index + 1].queue_num = state.items[index].queue_num;
          state.items[index].queue_num = item.queue_num;

          state.items = arrayMove(state.items, index, index + 1);
        }
      }
    },

    deleteContent(state: ITapeSlice, action: PayloadAction<ITapeContent>) {
      if (action.payload && state.items) {
        const index = state.items.findIndex((item) => {
          return (
            item.content_id === action.payload.content_id &&
            item.type === action.payload.type &&
            item.queue_num === action.payload.queue_num
          );
        });

        if (index >= 0) {
          for (let i = index + 1; i < state.items.length; i++) {
            state.items[i].queue_num = state.items[i].queue_num - 1;
          }

          state.items.splice(index, 1);
        }
      }
    },

    deleteContentById(
      state: ITapeSlice,
      action: PayloadAction<ITapeContentSlice>
    ) {
      if (action.payload && state.items) {
        const index = state.items.findIndex((item) => {
          return (
            item.content_id === action.payload.content_id &&
            item.type === action.payload.type
          );
        });

        if (index >= 0) {
          for (let i = index + 1; i < state.items.length; i++) {
            state.items[i].queue_num = state.items[i].queue_num - 1;
          }

          state.items.splice(index, 1);
        }
      }
    },
  },
});

export default userTapeSlice.reducer;
