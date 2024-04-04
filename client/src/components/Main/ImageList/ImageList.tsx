import { FC, useEffect, useState } from "react";
import styles from "./ImageList.module.scss";
import Button from "src/components/UI/Button";

import { ImageListType } from "react-images-uploading";
import { useAppDispatch, useAppSelector } from "src/hooks/redux.hook";
import UserImageAction from "src/store/actions/user/ImageAction";
import messageQueueAction from "src/store/actions/MessageQueueAction";
import CircularIndeterminate from "src/components/CircularIndeterminate";
import UserTapeAction from "src/store/actions/user/TapeAction";
import ImageUpload from "src/components/Upload/ImageUpload";

const ImageList: FC<any> = () => {
  const tapeSelector = useAppSelector((s) => s.userTapeReducer);
  const imageSelector = useAppSelector((s) => s.userImageReducer);
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(UserImageAction.imagesGetAll());
  }, []);

  const [image, setImage] = useState<
    Array<{ data_url: string; file?: File, delay?: number, id?: number }>
  >([]);

  useEffect(() => {
    setImage(imageSelector.items.map((item) => {
      return {
        data_url: item.filepath,
        delay: item.delay,
        id: item.id
      };
    }))
  }, [imageSelector.items]);

  // @ts-ignore
  const onChangeImage = async (imageList, addUpdateIndex, delay) => {
    if (imageList.length > image.length) {
      // Определяем элементы, которые будут добавлены
      dispatch(UserImageAction.imagesAdd(imageList.filter((item: { file: File; }) => item.file), delay, () => {
        dispatch(messageQueueAction.addMessage(null, "success", "Изображение успешно добавлено!"));
        dispatch(UserImageAction.imagesGetAll());
      }));

    } else if (imageList.length < image.length) {
      // Определяем элемент, который будет удалён
      const findItem = image.filter((item) => {
        const index = imageList.find((subItem: { data_url: string; }) => subItem.data_url === item.data_url);
        return !index;
      });

      const item = findItem.length > 0 && findItem[0] || null;
      if (item) {
        const element = imageSelector.items.find((value) => value.filepath === item.data_url);

        element && dispatch(UserTapeAction.deleteContentById("image", element.id));

        element && dispatch(UserImageAction.imagesDelete(element.id, () => {
          dispatch(messageQueueAction.addMessage(null, "dark", "Изображение удалено!"));
        }));
      }
    } else {
      // Определяем элемент, который будет изменён
      const indexItem = addUpdateIndex.length > 0 && addUpdateIndex[0];

      if (typeof (indexItem) === "number" && indexItem >= 0) {
        const elementImage = image.find((value, index) => !value.file && index === indexItem);
        const element = imageSelector.items.find((value) => value.filepath === elementImage?.data_url);

        element && dispatch(UserImageAction.imagesEdit(element.id, imageList[indexItem], delay, () => {
          dispatch(messageQueueAction.addMessage(null, "success", "Изображение успешно обновлено!"));
        }));
      }
    }
  };

  return (
    <>
      <div className={styles.container}>
        <ImageUpload
          title={""}
          subtitle={"Добавить изображение"}
          value={image}
          onChange={onChangeImage}
          multiple={true} />
      </div>
      {
        imageSelector.isLoading && <CircularIndeterminate />
      }
    </>
  );
};

export default ImageList;
