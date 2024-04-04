import apiMainServer from "src/http/http";
import { userVideoSlice } from "src/store/reducers/user/VideoSlice";
import messageQueueAction from "../MessageQueueAction";
import UserApi from "src/constants/user-api";

const videosGetAll = () => async (dispatch: any) => {
  dispatch(userVideoSlice.actions.loadingStart());

  try {
    const response = await apiMainServer.post(UserApi.VIDEOS_GET_ALL);

    if (response.status != 200 && response.status != 201) {
      dispatch(messageQueueAction.addMessage(response.data.message, "error"));
      return;
    }

    dispatch(userVideoSlice.actions.setVideos(response.data));
  } catch (e: any) {
    dispatch(messageQueueAction.errorMessage(e));
  }

  dispatch(userVideoSlice.actions.loadingEnd());
};

const videosDelete =
  (videos_id: number, cb: () => void) => async (dispatch: any) => {
    dispatch(userVideoSlice.actions.loadingStart());

    try {
      const response = await apiMainServer.post(
        UserApi.VIDEOS_DELETE,
        JSON.stringify({
          videos_id,
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

      dispatch(videosGetAll());
      cb();
    } catch (e: any) {
      dispatch(messageQueueAction.errorMessage(e));
    }

    dispatch(userVideoSlice.actions.loadingEnd());
  };

const videosEdit =
  (videos_id: number, link: string, audio: boolean, cb: () => void) =>
  async (dispatch: any) => {
    dispatch(userVideoSlice.actions.loadingStart());

    try {
      const response = await apiMainServer.post(
        UserApi.VIDEOS_EDIT,
        JSON.stringify({
          videos_id: videos_id,
          link: link,
          audio: audio
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

      dispatch(videosGetAll());
      cb();
    } catch (e: any) {
      dispatch(messageQueueAction.errorMessage(e));
    }

    dispatch(userVideoSlice.actions.loadingEnd());
  };

const videosAdd =
  (link: string, audio: boolean, cb: () => void) => async (dispatch: any) => {
    dispatch(userVideoSlice.actions.loadingStart());

    try {
      const response = await apiMainServer.post(
        UserApi.VIDEOS_ADD,
        JSON.stringify({
          link: link,
          audio: audio
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

      dispatch(videosGetAll());
      cb();
    } catch (e: any) {
      dispatch(messageQueueAction.errorMessage(e));
    }

    dispatch(userVideoSlice.actions.loadingEnd());
  };

const UserVideoAction = {
  videosGetAll,
  videosAdd,
  videosDelete,
  videosEdit,
};

export default UserVideoAction;
