import apiMainServer from "src/http/http";
import { userTextSlice } from "src/store/reducers/user/TextSlice";
import messageQueueAction from "../MessageQueueAction";
import UserApi from "src/constants/user-api";

const textsGetAll = () => async (dispatch: any) => {
  dispatch(userTextSlice.actions.loadingStart());

  try {
    const response = await apiMainServer.post(UserApi.TEXTS_GET_ALL);

    if (response.status != 200 && response.status != 201) {
      dispatch(messageQueueAction.addMessage(response.data.message, "error"));
      return;
    }

    dispatch(userTextSlice.actions.setText(response.data));
  } catch (e: any) {
    dispatch(messageQueueAction.errorMessage(e));
  }

  dispatch(userTextSlice.actions.loadingEnd());
};

const textsDelete =
  (texts_id: number, cb: () => void) => async (dispatch: any) => {
    dispatch(userTextSlice.actions.loadingStart());

    try {
      const response = await apiMainServer.post(
        UserApi.TEXTS_DELETE,
        JSON.stringify({
          texts_id,
        }),
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (response.status != 200 && response.status != 201) {
        dispatch(messageQueueAction.addMessage(response.data.message, "error"));
        return;
      }

      dispatch(textsGetAll());
      cb();
    } catch (e: any) {
      dispatch(messageQueueAction.errorMessage(e));
    }

    dispatch(userTextSlice.actions.loadingEnd());
  };

const textsEdit =
  (texts_id: number, text: string, delay: number, cb: () => void) => async (dispatch: any) => {
    dispatch(userTextSlice.actions.loadingStart());

    try {
      const response = await apiMainServer.post(
        UserApi.TEXTS_EDIT,
        JSON.stringify({
          texts_id: texts_id,
          text: text,
          delay: delay
        }),
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (response.status != 200 && response.status != 201) {
        dispatch(messageQueueAction.addMessage(response.data.message, "error"));
        return;
      }

      dispatch(textsGetAll());
      cb();
    } catch (e: any) {
      dispatch(messageQueueAction.errorMessage(e));
    }

    dispatch(userTextSlice.actions.loadingEnd());
  };

const textsAdd =
  (text: string, delay: number, cb: () => void) => async (dispatch: any) => {
    dispatch(userTextSlice.actions.loadingStart());

    try {
      const response = await apiMainServer.post(
        UserApi.TEXTS_ADD,
        JSON.stringify({
          text: text,
          delay: delay
        }),
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (response.status != 200 && response.status != 201) {
        dispatch(messageQueueAction.addMessage(response.data.message, "error"));
        return;
      }

      dispatch(textsGetAll());
      cb();
    } catch (e: any) {
      dispatch(messageQueueAction.errorMessage(e));
    }

    dispatch(userTextSlice.actions.loadingEnd());
  };

const UserTextAction = {
  textsGetAll,
  textsAdd,
  textsDelete,
  textsEdit,
};

export default UserTextAction;
