import apiMainServer from "src/http/http";
import { screenSlice } from "../reducers/ScreenSlice";
import messageQueueAction from "./MessageQueueAction";
import UserApi from "src/constants/user-api";

const screensGetAll = () => async (dispatch: any) => {
  dispatch(screenSlice.actions.loadingStart());

  try {
    const response = await apiMainServer.post(UserApi.SCREENS_GET_ALL);

    if (response.status != 200 && response.status != 201) {
      dispatch(messageQueueAction.addMessage(response.data.message, "error"));
      return;
    }

    dispatch(screenSlice.actions.setScreens(response.data));
  } catch (e: any) {
    dispatch(messageQueueAction.errorMessage(e));
  }

  dispatch(screenSlice.actions.loadingEnd());
};

const screensAdd =
  (title: string, cb?: () => void) => async (dispatch: any) => {
    dispatch(screenSlice.actions.loadingStart());

    try {
      const response = await apiMainServer.post(UserApi.SCREENS_ADD, {
        title: title,
      });

      if (response.status != 200 && response.status != 201) {
        dispatch(messageQueueAction.addMessage(response.data.message, "error"));
        return;
      }

      cb && cb();
    } catch (e: any) {
      dispatch(messageQueueAction.errorMessage(e));
    }

    dispatch(screenSlice.actions.loadingEnd());
  };

const screensDelete =
  (id: number, cb?: () => void) => async (dispatch: any) => {
    dispatch(screenSlice.actions.loadingStart());

    try {
      const response = await apiMainServer.post(UserApi.SCREENS_DELETE, {
        screens_id: id,
      });

      if (response.status != 200 && response.status != 201) {
        dispatch(messageQueueAction.addMessage(response.data.message, "error"));
        return;
      }

      cb && cb();
    } catch (e: any) {
      dispatch(messageQueueAction.errorMessage(e));
    }

    dispatch(screenSlice.actions.loadingEnd());
  };

const screensEdit =
  (id: number, title: string, cb?: () => void) => async (dispatch: any) => {
    dispatch(screenSlice.actions.loadingStart());

    try {
      const response = await apiMainServer.post(UserApi.SCREENS_EDIT, {
        screens_id: id,
        title: title,
      });

      if (response.status != 200 && response.status != 201) {
        dispatch(messageQueueAction.addMessage(response.data.message, "error"));
        return;
      }

      cb && cb();
    } catch (e: any) {
      dispatch(messageQueueAction.errorMessage(e));
    }

    dispatch(screenSlice.actions.loadingEnd());
  };

const ScreenAction = {
  screensGetAll,
  screensAdd,
  screensDelete,
  screensEdit
};

export default ScreenAction;
