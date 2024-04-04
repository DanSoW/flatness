/* Библиотеки */
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { ITableItemResponse, ITableResponse } from "src/models/Tables/ITableModel";

/* Локальные интерфейсы */
interface ITableSlice extends ITableResponse {
  isLoading: boolean;
}

/* Базовое состояние текущего слайса */
const initialState: ITableSlice = {
  items: [],
  isLoading: false,
};

export const userTableSlice = createSlice({
  name: "user_tables_slice",
  initialState,
  reducers: {
    loadingStart(state: ITableSlice) {
      state.isLoading = true;
    },

    loadingEnd(state: ITableSlice) {
      state.isLoading = false;
    },

    clear(state: ITableSlice) {
      state.items = [];
      state.isLoading = false;
    },

    setTable(state: ITableSlice, action: PayloadAction<ITableItemResponse[]>) {
      if (action.payload && state.items) {
        state.items = action.payload;
      }
    },
  },
});

export default userTableSlice.reducer;
