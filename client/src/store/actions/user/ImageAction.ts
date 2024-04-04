import apiMainServer from "src/http/http";
import { userImageSlice } from "src/store/reducers/user/ImageSlice";
import messageQueueAction from "../MessageQueueAction";
import UserApi from "src/constants/user-api";

const imagesGetAll = () => async (dispatch: any) => {
  dispatch(userImageSlice.actions.loadingStart());

  try {
    const response = await apiMainServer.post(UserApi.IMAGES_GET_ALL);

    if (response.status != 200 && response.status != 201) {
      dispatch(messageQueueAction.addMessage(response.data.message, "error"));
      return;
    }

    dispatch(userImageSlice.actions.setImages(response.data));
  } catch (e: any) {
    dispatch(messageQueueAction.errorMessage(e));
  }

  dispatch(userImageSlice.actions.loadingEnd());
};

const imagesDelete =
  (images_id: number, cb: () => void) => async (dispatch: any) => {
    dispatch(userImageSlice.actions.loadingStart());

    try {
      const response = await apiMainServer.post(
        UserApi.IMAGES_DELETE,
        JSON.stringify({
          images_id,
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

      dispatch(imagesGetAll());
      cb();
    } catch (e: any) {
      dispatch(messageQueueAction.errorMessage(e));
    }

    dispatch(userImageSlice.actions.loadingEnd());
  };

const imagesEdit =
  (images_id: number, image: { file: File }, delay: number, cb: () => void) =>
  async (dispatch: any) => {
    dispatch(userImageSlice.actions.loadingStart());

    try {
      const formData = new FormData();
      formData.append("image", image.file);
      // @ts-ignore
      formData.append("images_id", images_id);
      // @ts-ignore
      formData.append("delay", delay);

      const response = await apiMainServer.post(UserApi.IMAGES_EDIT, formData);

      if (response.status != 200 && response.status != 201) {
        dispatch(messageQueueAction.addMessage(response.data.message, "error"));
        return;
      }

      dispatch(imagesGetAll());
      cb();
    } catch (e: any) {
      dispatch(messageQueueAction.errorMessage(e));
    }

    dispatch(userImageSlice.actions.loadingEnd());
  };

const imagesAdd =
  (images: Array<{ file: File }>, delay: number, cb: () => void) => async (dispatch: any) => {
    dispatch(userImageSlice.actions.loadingStart());

    try {
      for (let i = 0; i < images.length; i++) {
        const formData = new FormData();
        formData.append("image", images[i].file);
        // @ts-ignore
        formData.append("delay", delay);

        const response = await apiMainServer.post(UserApi.IMAGES_ADD, formData);

        if (response.status != 200 && response.status != 201) {
          dispatch(
            messageQueueAction.addMessage(response.data.message, "error")
          );
          return;
        }
      }

      dispatch(imagesGetAll());
      cb();
    } catch (e: any) {
      dispatch(messageQueueAction.errorMessage(e));
    }

    dispatch(userImageSlice.actions.loadingEnd());
  };

const UserImageAction = {
  imagesGetAll,
  imagesAdd,
  imagesDelete,
  imagesEdit,
};

export default UserImageAction;
