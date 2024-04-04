/* Библиотеки */
import ImageUploading from "react-images-uploading";
import React, { FC, useEffect, useState } from "react";

/* Изображения */
import cross from "src/resources/images/cross.svg";
import update from "src/resources/images/update.svg";

/* Стили */
import styles from "./TextUpload.module.scss";

import { ImageListType } from "react-images-uploading";
import { IVideoItemResponse, IVideoResponse } from "src/models/Video/IVideoModel";
import { useAppDispatch, useAppSelector } from "src/hooks/redux.hook";
import UserVideoAction from "src/store/actions/user/VideoAction";
import messageQueueAction from "src/store/actions/MessageQueueAction";
import QuestionDialog from "src/components/QuestionDialog";
import YouTube from "src/constants/youtube";
import { ITextItemResponse } from "src/models/Text/ITextModel";
import UserTextAction from "src/store/actions/user/TextAction";
import UserTapeAction from "src/store/actions/user/TapeAction";
import AddModal from "./AddModal";
import EditModal from "./EditModal";
import TextItem from "./TextItem";
import TextItemView from "./TextItemView";
import { getNextQueue } from "src/utils/queue";

/* Локальные интерфейсы */
interface IImageUploadProps {
  title: string;
}

/* Component for uploading images (in one quantity or in many) */
const TextUpload: FC<IImageUploadProps> = ({
  title = "Добавить изображение",
}) => {
  const textSelector = useAppSelector((s) => s.userTextReducer);
  const tapeSelector = useAppSelector((s) => s.userTapeReducer);
  const dispatch = useAppDispatch();

  const [textList, setTextList] = useState<ITextItemResponse[]>([]);
  const [isAdd, setAdd] = useState(false);
  const [isEdit, setEdit] = useState(false);
  const [isDelete, setDelete] = useState<boolean>(false);

  const [text, setText] = useState<ITextItemResponse | null>(null);

  const handleAdd = (text: string, delay: number) => {
    dispatch(UserTextAction.textsAdd(text, delay, () => {
      dispatch(messageQueueAction.addMessage(null, "success", "Текст успешно добавлен!"));
      setAdd(false);
      setText(null);
    }));
  }

  const handleEdit = (id: number, text: string, delay: number) => {
    dispatch(UserTextAction.textsEdit(id, text, delay, () => {
      dispatch(messageQueueAction.addMessage(null, "success", "Текст успешно обновлён!"));
      setEdit(false);
      setText(null);
    }));
  }

  const handleDelete = () => {
    if (!text) {
      dispatch(messageQueueAction.addMessage(null, "error", "Необходимо выбрать текст!"));
      return;
    }

    dispatch(UserTapeAction.deleteContentById("text", text.id));
    dispatch(UserTextAction.textsDelete(text.id, () => {
      dispatch(messageQueueAction.addMessage(null, "dark", `Текст \"${text.text}\" успешно удалён!`));
      setText(null);
      setDelete(false);
    }));
  }

  useEffect(() => {
    dispatch(UserTextAction.textsGetAll());
  }, []);

  useEffect(() => {
    setTextList(textSelector.items);
  }, [textSelector.items]);

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
              setAdd(true);
            }}
          >
            <span className="span__text__gray">{title}</span>
          </button>
        </div>
        {textList.map((value, index) => {
          return (
            <div key={value.id} className={styles["image-wrapper"]}>
              <TextItemView text={value.text} />
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
                    setText(value);
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
                    setText(value);
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
                    if(!tapeSelector.isAdd){
                      dispatch(messageQueueAction.addMessage(null, "error", "Необходимо активировать механизм добавления ленты"));
                      return;
                    }

                    dispatch(UserTapeAction.addContent("text", value.id, getNextQueue(tapeSelector.items)));
                    dispatch(messageQueueAction.addMessage(null, "success", "Текст добавлен на ленту!"));
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
        isAdd && <AddModal
          addHandler={handleAdd}
          open={isAdd}
          setOpen={setAdd} />
      }

      {
        text && isEdit && <EditModal
          editHandler={handleEdit}
          open={isEdit}
          setOpen={setEdit}
          data={text}
        />
      }

      {
        text && isDelete &&<QuestionDialog
          text={"Удаление текста"}
          subText={`Вы уверены что хотите удалить текст \"${text.text}\" ?`}
          open={isDelete}
          setOpen={setDelete}
          action={handleDelete} />
      }
    </>
  );
};

export default React.memo(TextUpload);

