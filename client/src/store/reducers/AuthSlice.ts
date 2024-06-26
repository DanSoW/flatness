import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import StoreConstants from "src/constants/store";
import AuthDataDto from "src/dtos/auth.data-dto";
import { IAuthModel } from "src/models/IAuthModel";
import { IRoleModel } from "src/models/IRole";
import { IUserModel } from "src/models/IUserModel";

export interface IAuthSlice extends IAuthModel {
  isLoading: boolean;
  isAuthenticated: boolean;
  roles: IRoleModel[];
  users: IUserModel[];
}

// Базовое состояние слайса
const initialState: IAuthSlice = {
  access_token: null,
  refresh_token: null,
  isLoading: false,
  isAuthenticated: false,
  roles: [],
  users: []
};

/**
 * Создание слайса для авторизации пользователя
 */
export const authSlice = createSlice({
  name: "auth_slice",
  initialState,
  reducers: {
    loadingStart(state) {
      state.isLoading = true;
    },

    loadingEnd(state) {
      state.isLoading = false;
    },

    clear(state) {
      state.isLoading = false;
      state.access_token = null;
      state.refresh_token = null;
      state.roles = [];
      state.users = [];
    },

    getAuthData(state) {
      const mainStore = localStorage.getItem(StoreConstants.MAIN_STORE);

      state.access_token = null;
      state.refresh_token = null;

      if (mainStore) {
        state.access_token = JSON.parse(mainStore)?.access_token ?? null;
        state.refresh_token = JSON.parse(mainStore)?.refresh_token ?? null;
      }

      state.isAuthenticated = !!state.access_token;
    },

    setAuthData(state, action) {
      state.access_token = action.payload.access_token;
      state.refresh_token = action.payload.refresh_token;
      state.isAuthenticated = !!state.access_token;

      localStorage.setItem(
        StoreConstants.MAIN_STORE,
        JSON.stringify({
          ...new AuthDataDto(state),
        })
      );
    },

    // Функция авторизации пользователя
    signInSuccess(state, action) {
      state.isLoading = false;
      state.access_token = action.payload.access_token;
      state.refresh_token = action.payload.refresh_token;
      state.isAuthenticated = !!state.access_token;

      localStorage.setItem(
        StoreConstants.MAIN_STORE,
        JSON.stringify({
          ...new AuthDataDto(state),
        })
      );
    },

    // Функция регистрации нового пользователя
    signUpSuccess(state, action) {
      state.isLoading = false;
      state.access_token = action.payload.access_token;
      state.refresh_token = action.payload.refresh_token;
      state.isAuthenticated = !!state.access_token;

      localStorage.setItem(
        StoreConstants.MAIN_STORE,
        JSON.stringify({
          ...new AuthDataDto(state),
        })
      );
    },

    setRoles(state, action: PayloadAction<IRoleModel[]>) {
      state.roles = action.payload;
    },

    setUsers(state, action: PayloadAction<IUserModel[]>) {
      state.users = action.payload;
    },

    // Функция разлогирования пользователя
    logout(state) {
      state.isLoading = false;
      state.access_token = null;
      state.refresh_token = null;
      state.isAuthenticated = false;

      localStorage.removeItem(StoreConstants.MAIN_STORE);
    },
  },
});

export default authSlice.reducer;
