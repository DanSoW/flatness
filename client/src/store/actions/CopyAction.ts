import apiMainServer from "src/http/http";
import { copySlice } from "../reducers/CopySlice";
import messageQueueAction from "./MessageQueueAction";
import UserApi from "src/constants/user-api";

const setTapeSource =
  (tapes_id: number, cb?: () => void) => async (dispatch: any) => {
    try {
      dispatch(copySlice.actions.setTapeSource(tapes_id));
      cb && cb();
    } catch (e: any) {
      dispatch(messageQueueAction.errorMessage(e));
    }
  };

const tapeCopy =
  (screen_id: number, tapes_id_source: number, cb?: () => void) => async (dispatch: any) => {
    dispatch(copySlice.actions.loadingStart());

    try {
      const response = await apiMainServer.post(UserApi.TAPES_COPY, {
        screens_id: screen_id,
        tapes_id_source: tapes_id_source,
      });

      if (response.status != 200 && response.status != 201) {
        dispatch(messageQueueAction.addMessage(response.data.message, "error"));
        return;
      }

      dispatch(copySlice.actions.clear());
      cb && cb();
    } catch (e: any) {
      dispatch(messageQueueAction.errorMessage(e));
    }

    dispatch(copySlice.actions.loadingEnd());
  };

const CopyAction = {
  setTapeSource,
  tapeCopy
};

export default CopyAction;
