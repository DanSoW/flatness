import { FC, useEffect, useState } from "react";
import styles from "./TableList.module.scss";
import TableUpload from "src/components/Upload/TableUpload";

const TextList: FC<any> = () => {

  return (
    <>
      <div className={styles.container}>
        <TableUpload title="Добавить таблицу" />
      </div>
    </>
  );
};

export default TextList;
