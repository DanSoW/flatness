/* Библиотеки */
import ImageUploading from "react-images-uploading";
import React, { FC, useRef, useState } from "react";

/* Изображения */
import cross from "src/resources/images/cross.svg";
import update from "src/resources/images/update.svg";

/* Стили */
import styles from "./ImageUpload.module.scss";

import { ImageListType } from "react-images-uploading";
import AddModal from "./AddModal";
import EditModal from "./EditModal";
import { useAppDispatch, useAppSelector } from "src/hooks/redux.hook";
import messageQueueAction from "src/store/actions/MessageQueueAction";
import UserTapeAction from "src/store/actions/user/TapeAction";
import { getNextQueue } from "src/utils/queue";

/* Локальные интерфейсы */
interface IImageUploadProps {
  title: string;
  subtitle: string;
  value: Array<{ data_url: string; file?: File, delay?: number, id?: number }>;
  onChange: (value: ImageListType, addUpdatedIndex?: number[] | undefined, delay?: number) => void;
  multiple: boolean;
}

/* Component for uploading images (in one quantity or in many) */
const ImageUpload: FC<IImageUploadProps> = ({
  title = "Изображение *",
  subtitle = "Загрузить изображение",
  value = [],
  onChange = () => { },
  multiple = false,
}) => {
  const tapeSelector = useAppSelector((s) => s.userTapeReducer);
  const dispatch = useAppDispatch();
  const [form, setForm] = useState<number | null>(null);
  const [isAdd, setAdd] = useState<boolean>(false);
  const [isEdit, setEdit] = useState<boolean>(false);
  const [fnDelay, setFnDelay] = useState<(() => void) | null>(null);

  const addHandler = (delay: number) => {
    // Установка задержки
    setForm(delay);
    fnDelay && fnDelay();
  };

  const editHandler = (delay: number) => {
    setForm(delay);
    fnDelay && fnDelay();
  };

  return (
    <div>
      <span className="span__text__gray">{title}</span>
      <div>
        <ImageUploading
          multiple={multiple}
          value={value}
          onChange={(newValue, addUpdatedIndex) => {
            onChange(newValue, addUpdatedIndex, form || 0);
          }}
          dataURLKey="data_url"
        >
          {({
            imageList,
            onImageUpload,
            onImageRemoveAll,
            onImageUpdate,
            onImageRemove,
            isDragging,
            dragProps,
          }) => (
            <div className={styles["div-upload_image_wrapper"]}>
              <button
                type="button"
                style={{
                  display: "block"
                }}
                className={styles["upload_image_wrapper"]}
                onClick={() => {
                  setAdd(true);
                  setFnDelay(() => {
                    return () => {
                      setAdd(false);
                      onImageUpload();
                    };
                  });
                }}
                {...dragProps}
              >
                <span className="span__text__gray">{subtitle}</span>
              </button>
              {imageList.map((image, index) => {
                return (
                  <div key={index} className={styles["image-wrapper"]}>
                    <img
                      src={image.data_url}
                      alt=""
                      className={styles["upload_image"]}
                    />
                    <div
                      style={{
                        display: "grid",
                        gridAutoFlow: "row",
                        gap: "0",
                        height: "min-content"
                      }}
                    >
                      <img
                        style={{
                          cursor: "pointer"
                        }}
                        src={cross}
                        onClick={() => {
                          setForm(imageList[index].delay);
                          onImageRemove(index);
                        }}
                        width="22em"
                        height="22em"
                      />
                      <img
                        style={{
                          marginTop: "0.4em",
                          cursor: "pointer"
                        }}
                        src={update}
                        onClick={() => {
                          setEdit(true);
                          setForm(imageList[index].delay);

                          setFnDelay(() => {
                            return () => {
                              setEdit(false);
                              onImageUpdate(index);
                            };
                          });
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

                          dispatch(UserTapeAction.addContent("image", imageList[index].id, getNextQueue(tapeSelector.items)));
                          dispatch(messageQueueAction.addMessage(null, "success", "Изображение добавлено на ленту!"));
                        }}
                        width="21em"
                        height="21em"
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </ImageUploading>
      </div>

      {
        isAdd && <AddModal
          addHandler={addHandler}
          open={isAdd}
          setOpen={setAdd} />
      }

      {
        isEdit && form && <EditModal
          editHandler={editHandler}
          open={isEdit}
          setOpen={setEdit}
          delay={form}
        />
      }
    </div>
  );
};

export default React.memo(ImageUpload);
