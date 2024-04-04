import apiMainServer from "src/http/http";
import { ITapeContent, userTapeSlice } from "src/store/reducers/user/TapeSlice";
import messageQueueAction from "../MessageQueueAction";
import UserApi from "src/constants/user-api";
import { IContentTypeList } from "src/models/ScreenModel";

const tapesGetAll = (cb?: () => void) => async (dispatch: any) => {
  dispatch(userTapeSlice.actions.loadingStart());

  try {
    const response = await apiMainServer.post(UserApi.TAPES_GET_ALL);

    if (response.status != 200 && response.status != 201) {
      dispatch(messageQueueAction.addMessage(response.data.message, "error"));
      return;
    }

    dispatch(userTapeSlice.actions.setTapesInfo(response.data));
    cb && cb();
  } catch (e: any) {
    dispatch(messageQueueAction.errorMessage(e));
  }

  dispatch(userTapeSlice.actions.loadingEnd());
};

const tapesGetAllByScreen =
  (screens_id: number, cb?: () => void) => async (dispatch: any) => {
    dispatch(userTapeSlice.actions.loadingStart());

    try {
      const response = await apiMainServer.post(
        UserApi.TAPES_GET_ALL_BY_SCREEN,
        JSON.stringify({
          screens_id: screens_id,
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

      dispatch(userTapeSlice.actions.setScreenInfo(response.data));
      cb && cb();
    } catch (e: any) {
      dispatch(messageQueueAction.errorMessage(e));
    }

    dispatch(userTapeSlice.actions.loadingEnd());
  };

const clearItem = () => async (dispatch: any) => {
  dispatch(userTapeSlice.actions.loadingStart());

  try {
    dispatch(userTapeSlice.actions.clearCurrentItem());
  } catch (e: any) {
    dispatch(messageQueueAction.errorMessage(e));
  }

  dispatch(userTapeSlice.actions.loadingEnd());
};

const clearContent = () => async (dispatch: any) => {
  dispatch(userTapeSlice.actions.loadingStart());

  try {
    dispatch(userTapeSlice.actions.clear());
  } catch (e: any) {
    dispatch(messageQueueAction.errorMessage(e));
  }

  dispatch(userTapeSlice.actions.loadingEnd());
};

const deleteContent =
  (type: string, content_id: number, queue_num: number) =>
  async (dispatch: any) => {
    dispatch(userTapeSlice.actions.loadingStart());

    try {
      dispatch(
        userTapeSlice.actions.deleteContent({
          type: type,
          content_id: content_id,
          queue_num: queue_num,
        })
      );
    } catch (e: any) {
      dispatch(messageQueueAction.errorMessage(e));
    }

    dispatch(userTapeSlice.actions.loadingEnd());
  };

const deleteContentById =
  (type: string, content_id: number) => async (dispatch: any) => {
    dispatch(userTapeSlice.actions.loadingStart());

    try {
      dispatch(
        userTapeSlice.actions.deleteContentById({
          type: type,
          content_id: content_id,
        })
      );
    } catch (e: any) {
      dispatch(messageQueueAction.errorMessage(e));
    }

    dispatch(userTapeSlice.actions.loadingEnd());
  };

const contentMoveLeft =
  (type: string, content_id: number, queue_num: number) =>
  async (dispatch: any) => {
    dispatch(userTapeSlice.actions.loadingStart());

    try {
      dispatch(
        userTapeSlice.actions.moveLeft({
          type: type,
          content_id: content_id,
          queue_num: queue_num,
        })
      );
    } catch (e: any) {
      dispatch(messageQueueAction.errorMessage(e));
    }

    dispatch(userTapeSlice.actions.loadingEnd());
  };

const contentMoveRight =
  (type: string, content_id: number, queue_num: number) =>
  async (dispatch: any) => {
    dispatch(userTapeSlice.actions.loadingStart());

    try {
      dispatch(
        userTapeSlice.actions.moveRight({
          type: type,
          content_id: content_id,
          queue_num: queue_num,
        })
      );
    } catch (e: any) {
      dispatch(messageQueueAction.errorMessage(e));
    }

    dispatch(userTapeSlice.actions.loadingEnd());
  };

const addContent =
  (type: string, content_id: number, queue_num: number) =>
  async (dispatch: any) => {
    dispatch(userTapeSlice.actions.loadingStart());

    try {
      dispatch(
        userTapeSlice.actions.addContent({
          type: type,
          content_id: content_id,
          queue_num: queue_num,
        })
      );
    } catch (e: any) {
      dispatch(messageQueueAction.errorMessage(e));
    }

    dispatch(userTapeSlice.actions.loadingEnd());
  };

const addContentList = (data: IContentTypeList[]) => async (dispatch: any) => {
  dispatch(userTapeSlice.actions.loadingStart());

  try {
    for (let i of data) {
      dispatch(
        userTapeSlice.actions.addContent({
          type: i.type,
          content_id: i.content_id,
          queue_num: i.queue_num,
        })
      );
    }
  } catch (e: any) {
    dispatch(messageQueueAction.errorMessage(e));
  }

  dispatch(userTapeSlice.actions.loadingEnd());
};

const addTape =
  (title: string, content: ITapeContent[], cb: () => void) =>
  async (dispatch: any) => {
    dispatch(userTapeSlice.actions.loadingStart());

    try {
      const response = await apiMainServer.post(
        UserApi.TAPES_ADD,
        JSON.stringify({
          title: title,
          content: content,
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

      dispatch(tapesGetAll());
      cb();
    } catch (e: any) {
      dispatch(messageQueueAction.errorMessage(e));
    }

    dispatch(userTapeSlice.actions.loadingEnd());
  };

const editTape =
  (tapes_id: number, title: string, content: ITapeContent[], cb: () => void) =>
  async (dispatch: any) => {
    dispatch(userTapeSlice.actions.loadingStart());

    try {
      const response = await apiMainServer.post(
        UserApi.TAPES_EDIT,
        JSON.stringify({
          tapes_id: tapes_id,
          title: title,
          content: content,
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

      dispatch(tapesGetAll());
      cb();
    } catch (e: any) {
      dispatch(messageQueueAction.errorMessage(e));
    }

    dispatch(userTapeSlice.actions.loadingEnd());
  };

const setAdd = (add: boolean) => async (dispatch: any) => {
  dispatch(userTapeSlice.actions.loadingStart());

  try {
    dispatch(userTapeSlice.actions.setAdd(add));
  } catch (e: any) {
    dispatch(messageQueueAction.errorMessage(e));
  }

  dispatch(userTapeSlice.actions.loadingEnd());
};

const tapesDelete =
  (tapes_id: number, cb: () => void) => async (dispatch: any) => {
    dispatch(userTapeSlice.actions.loadingStart());

    try {
      const response = await apiMainServer.post(
        UserApi.TAPES_DELETE,
        JSON.stringify({
          tapes_id: tapes_id,
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

      dispatch(tapesGetAll());
      cb();
    } catch (e: any) {
      dispatch(messageQueueAction.errorMessage(e));
    }

    dispatch(userTapeSlice.actions.loadingEnd());
  };

const tapesDeleteFromScreen =
  (screens_id: number, tapes_id: number, cb: () => void) =>
  async (dispatch: any) => {
    dispatch(userTapeSlice.actions.loadingStart());

    try {
      const response = await apiMainServer.post(
        UserApi.TAPES_DELETE_FROM_SCREEN,
        JSON.stringify({
          screens_id: screens_id,
          tapes_id: tapes_id,
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

      dispatch(tapesGetAll());
      cb();
    } catch (e: any) {
      dispatch(messageQueueAction.errorMessage(e));
    }

    dispatch(userTapeSlice.actions.loadingEnd());
  };

const tapesGet = (link: string, cb?: () => void) => async (dispatch: any) => {
  dispatch(userTapeSlice.actions.loadingStart());

  try {
    const response = await apiMainServer.post(
      UserApi.TAPES_GET,
      JSON.stringify({
        link: link,
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

    dispatch(userTapeSlice.actions.setCurrentTape(response.data));
    cb && cb();
  } catch (e: any) {
    dispatch(messageQueueAction.errorMessage(e));
  }

  dispatch(userTapeSlice.actions.loadingEnd());
};

const tapesActive =
  (screens_id: number, tapes_id: number, active: boolean, cb: () => void) =>
  async (dispatch: any) => {
    dispatch(userTapeSlice.actions.loadingStart());

    try {
      const response = await apiMainServer.post(
        UserApi.TAPES_SET_ACTIVE,
        JSON.stringify({
          screens_id: screens_id,
          tapes_id: tapes_id,
          active: active,
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

      cb && cb();
    } catch (e: any) {
      dispatch(messageQueueAction.errorMessage(e));
    }

    dispatch(userTapeSlice.actions.loadingEnd());
  };

const UserTapeAction = {
  tapesActive,
  addTape,
  setAdd,
  clearContent,
  addContent,
  tapesDelete,
  deleteContent,
  deleteContentById,
  tapesGetAll,
  tapesGetAllByScreen,
  tapesGet,
  clearItem,
  contentMoveLeft,
  contentMoveRight,
  tapesDeleteFromScreen,
  addContentList,
  editTape
};

export default UserTapeAction;
