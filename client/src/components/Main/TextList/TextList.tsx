import { FC, useEffect, useState } from "react";
import styles from "./TextList.module.scss";
import TextUpload from "src/components/Upload/TextUpload";

const TextList: FC<any> = () => {

  return (
    <>
      <div className={styles.container}>
        <TextUpload title="Добавить текст" />
      </div>
    </>
  );
};

export default TextList;
