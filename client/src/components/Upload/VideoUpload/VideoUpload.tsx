/* Библиотеки */
import ImageUploading from "react-images-uploading";
import React, { FC, useEffect, useState } from "react";

/* Изображения */
import cross from "src/resources/images/cross.svg";
import update from "src/resources/images/update.svg";

/* Стили */
import styles from "./VideoUpload.module.scss";

import { ImageListType } from "react-images-uploading";
import AddModal from "./AddModal";
import VideoItem from "./VideoItem";
import { IVideoItemResponse, IVideoResponse } from "src/models/Video/IVideoModel";
import { useAppDispatch, useAppSelector } from "src/hooks/redux.hook";
import UserVideoAction from "src/store/actions/user/VideoAction";
import messageQueueAction from "src/store/actions/MessageQueueAction";
import QuestionDialog from "src/components/QuestionDialog";
import YouTube from "src/constants/youtube";
import EditModal from "./EditModal";
import UserTapeAction from "src/store/actions/user/TapeAction";
import { getNextQueue } from "src/utils/queue";

/* Локальные интерфейсы */
interface IImageUploadProps {
  title: string;
}

/* Component for uploading images (in one quantity or in many) */
const VideoUpload: FC<IImageUploadProps> = ({
  title = "Загрузить видео",
}) => {
  const videoSelector = useAppSelector((s) => s.userVideoReducer);
  const tapeSelector = useAppSelector((s) => s.userTapeReducer);
  const dispatch = useAppDispatch();

  const [videoList, setVideoList] = useState<IVideoItemResponse[]>([]);
  const [isAdd, setAdd] = useState(false);
  const [isEdit, setEdit] = useState(false);
  const [isDelete, setDelete] = useState<boolean>(false);

  const [video, setVideo] = useState<IVideoItemResponse | null>(null);

  const handleAdd = (link: string, audio: boolean) => {
    dispatch(UserVideoAction.videosAdd(link, audio, () => {
      dispatch(messageQueueAction.addMessage(null, "success", "Видео успешно добавлено!"));
      setAdd(false);
      setVideo(null);
    }));
  }

  const handleEdit = (id: number, link: string, audio: boolean) => {
    dispatch(UserVideoAction.videosEdit(id, link, audio, () => {
      dispatch(messageQueueAction.addMessage(null, "success", "Видео успешно обновлено!"));
      setEdit(false);
      setVideo(null);
    }));
  }

  const handleDelete = () => {
    if (!video) {
      dispatch(messageQueueAction.addMessage(null, "error", "Необходимо выбрать видео!"));
      return;
    }
    dispatch(UserTapeAction.deleteContentById("video", video.id));
    dispatch(UserVideoAction.videosDelete(video.id, () => {
      dispatch(messageQueueAction.addMessage(null, "dark", `Видео с ссылкой ${video.link} успешно удалено!`));
      setVideo(null);
      setDelete(false);
    }));
  }

  useEffect(() => {
    dispatch(UserVideoAction.videosGetAll());
  }, []);

  useEffect(() => {
    setVideoList(videoSelector.items);
  }, [videoSelector.items]);

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
        {videoList.map((video, index) => {
          return (
            <div key={video.id} className={styles["image-wrapper"]}>
              <VideoItem
                link={video.link}
                audio={video.audio}
              />
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
                    setVideo(video);
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
                    const data = {
                      ...video,
                      link: `${YouTube.short}${video.link.split(YouTube.embed)[1]}`
                    };

                    setVideo(data);
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

                    dispatch(UserTapeAction.addContent("video", video.id, getNextQueue(tapeSelector.items)));
                    dispatch(messageQueueAction.addMessage(null, "success", "Видео добавлено на ленту!"));
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
        video && isEdit && <EditModal
          editHandler={handleEdit}
          open={isEdit}
          setOpen={setEdit}
          data={video}
        />
      }

      {
        video && isDelete && <QuestionDialog
          text={"Удаление видео"}
          subText={`Вы уверены что хотите удалить видео с ссылкой ${YouTube.short + video.link.split(YouTube.embed)[1]} ?`}
          open={isDelete}
          setOpen={setDelete}
          action={handleDelete} />
      }
    </>
  );
};

export default React.memo(VideoUpload);
