import { FC, useEffect, useState } from "react";
import styles from "./VideoList.module.scss";
import Button from "src/components/UI/Button";

import { useAppDispatch, useAppSelector } from "src/hooks/redux.hook";
import UserImageAction from "src/store/actions/user/ImageAction";
import messageQueueAction from "src/store/actions/MessageQueueAction";
import CircularIndeterminate from "src/components/CircularIndeterminate";
import VideoUpload from "src/components/Upload/VideoUpload";
import { IVideoItemResponse } from "src/models/Video/IVideoModel";

const VideoList: FC<any> = () => {
  return (
    <>
      <div className={styles.container}>
        <VideoUpload
          title={"Добавить видео"}
        />
      </div>
    </>
  );
};

export default VideoList;
