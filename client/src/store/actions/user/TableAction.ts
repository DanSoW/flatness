import apiMainServer from "src/http/http";
import { userTableSlice } from "src/store/reducers/user/TableSlice";
import messageQueueAction from "../MessageQueueAction";
import UserApi from "src/constants/user-api";

const tablesGetAll = () => async (dispatch: any) => {
  dispatch(userTableSlice.actions.loadingStart());

  try {
    const response = await apiMainServer.post(UserApi.TABLES_GET_ALL);

    if (response.status != 200 && response.status != 201) {
      dispatch(messageQueueAction.addMessage(response.data.message, "error"));
      return;
    }

    dispatch(userTableSlice.actions.setTable(response.data));
  } catch (e: any) {
    dispatch(messageQueueAction.errorMessage(e));
  }

  dispatch(userTableSlice.actions.loadingEnd());
};

const tablesDelete =
  (tables_id: number, cb: () => void) => async (dispatch: any) => {
    dispatch(userTableSlice.actions.loadingStart());

    try {
      const response = await apiMainServer.post(
        UserApi.TABLES_DELETE,
        JSON.stringify({
          tables_id,
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

      dispatch(tablesGetAll());
      cb();
    } catch (e: any) {
      dispatch(messageQueueAction.errorMessage(e));
    }

    dispatch(userTableSlice.actions.loadingEnd());
  };

const tablesEdit =
  (
    tables_id: number,
    columns: string[],
    rows: string[][],
    delay: number,
    cb: () => void
  ) =>
  async (dispatch: any) => {
    dispatch(userTableSlice.actions.loadingStart());

    try {
      const response = await apiMainServer.post(
        UserApi.TABLES_EDIT,
        JSON.stringify({
          tables_id: tables_id,
          columns: columns.join(";"),
          delay: delay,
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

      const lResponse = await apiMainServer.post(
        UserApi.TABLES_DATA_CLEAR_ALL,
        JSON.stringify({
          tables_id: tables_id,
        }),
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (lResponse.status != 200 && lResponse.status != 201) {
        dispatch(messageQueueAction.addMessage(lResponse.data.message, "error"));
        return;
      }

      for (let i = 0; i < rows.length; i++) {
        const localResponse = await apiMainServer.post(
          UserApi.TABLES_DATA_ADD,
          JSON.stringify({
            row: rows[i].join(";"),
            tables_id: tables_id,
          }),
          {
            headers: {
              "Content-Type": "application/json",
            },
          }
        );

        if (localResponse.status != 200 && localResponse.status != 201) {
          dispatch(
            messageQueueAction.addMessage(localResponse.data.message, "error")
          );
          return;
        }
      }

      dispatch(tablesGetAll());
      cb();
    } catch (e: any) {
      dispatch(messageQueueAction.errorMessage(e));
    }

    dispatch(userTableSlice.actions.loadingEnd());
  };

const tablesAdd =
  (columns: string[], rows: string[][], delay: number, cb: () => void) =>
  async (dispatch: any) => {
    dispatch(userTableSlice.actions.loadingStart());

    try {
      const response = await apiMainServer.post(
        UserApi.TABLES_ADD,
        JSON.stringify({
          columns: columns.join(";"),
          delay: delay,
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

      const id = response.data.id;
      for (let i = 0; i < rows.length; i++) {
        const localResponse = await apiMainServer.post(
          UserApi.TABLES_DATA_ADD,
          JSON.stringify({
            row: rows[i].join(";"),
            tables_id: id,
          }),
          {
            headers: {
              "Content-Type": "application/json",
            },
          }
        );

        if (localResponse.status != 200 && localResponse.status != 201) {
          dispatch(
            messageQueueAction.addMessage(localResponse.data.message, "error")
          );
          return;
        }
      }

      dispatch(tablesGetAll());
      cb();
    } catch (e: any) {
      dispatch(messageQueueAction.errorMessage(e));
    }

    dispatch(userTableSlice.actions.loadingEnd());
  };

const UserTableAction = {
  tablesGetAll,
  tablesAdd,
  tablesDelete,
  tablesEdit,
};

export default UserTableAction;
