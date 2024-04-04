/* Библиотеки */
import ImageUploading from "react-images-uploading";
import React, { FC, useEffect, useState } from "react";

/* Изображения */
import cross from "src/resources/images/cross.svg";
import update from "src/resources/images/update.svg";

/* Стили */
import styles from "./TableUpload.module.scss";

import { ImageListType } from "react-images-uploading";
import AddModal from "./AddModal";
import TextItem from "./TableItem";
import { IVideoItemResponse, IVideoResponse } from "src/models/Video/IVideoModel";
import { useAppDispatch, useAppSelector } from "src/hooks/redux.hook";
import UserVideoAction from "src/store/actions/user/VideoAction";
import messageQueueAction from "src/store/actions/MessageQueueAction";
import QuestionDialog from "src/components/QuestionDialog";
import YouTube from "src/constants/youtube";
import EditModal from "./EditModal";
import { ITextItemResponse } from "src/models/Text/ITextModel";
import UserTextAction from "src/store/actions/user/TextAction";
import { ITableInfoValues, ITableItemResponse } from "src/models/Tables/ITableModel";
import AddModal2 from "./AddModal2";
import UserTableAction from "src/store/actions/user/TableAction";
import TableItem from "./TableItem";
import UserTapeAction from "src/store/actions/user/TapeAction";
import { getNextQueue } from "src/utils/queue";
import CircularIndeterminate from "src/components/CircularIndeterminate";

/* Локальные интерфейсы */
interface IImageUploadProps {
  title: string;
}

/* Component for uploading images (in one quantity or in many) */
const TextUpload: FC<IImageUploadProps> = ({
  title = "Загрузить видео",
}) => {
  const tableSelector = useAppSelector((s) => s.userTableReducer);
  const tapeSelector = useAppSelector((s) => s.userTapeReducer);
  const dispatch = useAppDispatch();

  const [tableList, setTableList] = useState<ITableItemResponse[]>([]);
  const [isAdd, setAdd] = useState<number>(0);
  const [tableInfo, setTableInfo] = useState<ITableInfoValues | null>(null);
  const [isEdit, setEdit] = useState<boolean>(false);
  const [isDelete, setDelete] = useState<boolean>(false);

  const [table, setTable] = useState<ITableItemResponse | null>(null);

  const handleAdd = (count_columns: number, count_rows: number, delay: number) => {
    setTableInfo({
      count_columns: count_columns,
      count_rows: count_rows,
      delay: delay
    });

    setAdd(2);
  }

  const handleAdd2 = (columns: string[], rows: string[][], delay: number) => {
    dispatch(UserTableAction.tablesAdd(columns, rows, delay, () => {
      dispatch(messageQueueAction.addMessage(null, "success", "Таблица успешно добавлена!"));
      setAdd(0);
    }));
  }

  const handleEdit = (columns: string[], rows: string[][], delay: number) => {
    if (!table) {
      dispatch(messageQueueAction.addMessage(null, "error", "Необходимо выбрать таблицу!"));
      return;
    }

    dispatch(UserTableAction.tablesEdit(table.id, columns, rows, delay, () => {
      setEdit(false);
      setTable(null);
      dispatch(messageQueueAction.addMessage(null, "success", "Таблица успешно изменена!"));
    }));
  }

  const handleDelete = () => {
    if (!table) {
      dispatch(messageQueueAction.addMessage(null, "error", "Необходимо выбрать таблицу!"));
      return;
    }
    dispatch(UserTableAction.tablesDelete(table.id, () => {
      dispatch(UserTapeAction.deleteContentById("table", table.id));
      dispatch(messageQueueAction.addMessage(null, "dark", "Таблица успешно удалена!"));
      setTable(null);
      setDelete(false);
    }));
  }

  useEffect(() => {
    dispatch(UserTableAction.tablesGetAll());
  }, []);

  useEffect(() => {
    setTableList(tableSelector.items);
  }, [tableSelector.items]);

  return (
    <>
      <div className={styles.container}>
        <div className={styles["div-upload_image_wrapper"]}>
          <button
            type="button"
            style={{
              display: "block",
            }}
            className={styles["upload_image_wrapper"]}
            onClick={() => {
              setAdd(1);
            }}
          >
            <span className="span__text__gray">{title}</span>
          </button>
        </div>
        {tableList.map((value, index) => {
          return (
            <div key={value.id} className={styles["image-wrapper"]}>
              <TableItem columns={value.columns.split(';')} rows={value.data_tables.map((item) => item.row.split(';'))} />
              <div
                style={{
                  display: "grid",
                  gridAutoFlow: "row",
                  gap: "0",
                  height: "min-content",
                  marginTop: "0.4em",
                }}
              >
                <img
                  src={cross}
                  onClick={() => {
                    setTable(value);
                    setDelete(true);
                  }}
                  width="22em"
                  height="22em"
                  style={{
                    cursor: "pointer"
                  }}
                />
                <img
                  style={{
                    marginTop: "0.4em",
                    cursor: "pointer"
                  }}
                  src={update}
                  onClick={() => {
                    setTable(value);
                    setEdit(true);
                  }}
                  width="25em"
                  height="25em"
                />
                <img
                  src={cross}
                  style={{
                    transform: "rotate(45deg)",
                    marginTop: "0.4em",
                    marginLeft: "1.5px",
                    cursor: "pointer"
                  }}
                  onClick={() => {
                    if (!tapeSelector.isAdd) {
                      dispatch(messageQueueAction.addMessage(null, "error", "Необходимо активировать механизм добавления ленты"));
                      return;
                    }

                    dispatch(UserTapeAction.addContent("table", value.id, getNextQueue(tapeSelector.items)));
                    dispatch(messageQueueAction.addMessage(null, "success", "Таблица добавлена на ленту!"));
                  }}
                  width="21em"
                  height="21em"
                />
              </div>
            </div>
          )
        })}
      </div>

      {
        isAdd === 1 && <AddModal
          addHandler={handleAdd}
          open={isAdd}
          setOpen={setAdd} />
      }

      {
        isAdd === 2 && tableInfo && <AddModal2
          addHandler={handleAdd2}
          open={isAdd}
          setOpen={setAdd}
          tableInfo={tableInfo}
        />
      }

      {
        table && isEdit && <EditModal
          editHandler={handleEdit}
          open={isEdit}
          setOpen={setEdit}
          data={table}
        />
      }

      {
        table && isDelete && <QuestionDialog
          text={"Удаление таблицы"}
          subText={`Вы уверены что хотите удалить таблицу?`}
          open={isDelete}
          setOpen={setDelete}
          action={handleDelete} />
      }
    </>
  );
};

export default React.memo(TextUpload);
