import React, { FC, useEffect, useState } from "react";
import styles from "./AddModal.module.scss";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Modal from "@mui/material/Modal";
import FormHelperText from "@mui/material/FormHelperText";
import TextField from "@mui/material/TextField";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import { useAppDispatch, useAppSelector } from "src/hooks/redux.hook";
import CircularIndeterminate from "src/components/CircularIndeterminate/CircularIndeterminate";
import messageQueueAction from "src/store/actions/MessageQueueAction";
import { ISizeModel } from "src/models/ISize";
import { IVideoValues } from "src/models/Video/IVideoModel";
import Checkbox from "src/components/UI/Checkbox";
import YouTube from "src/constants/youtube";
import { ITextValues } from "src/models/Text/ITextModel";
import { ITableInfoValues } from "src/models/Tables/ITableModel";

export interface IAddModalProps {
  addHandler: (count_columns: number, count_rows: number, delay: number) => void;
  open: number;
  setOpen: React.Dispatch<React.SetStateAction<number>>;
}

const AddModal: FC<IAddModalProps> = ({
  addHandler,
  open,
  setOpen,
}) => {

  const dispatch = useAppDispatch();
  const [disable, setDisable] = useState(true);

  const handleClose = () => {
    setOpen(0);
  };

  const [form, setForm] = useState<ITableInfoValues>({
    count_columns: 0,
    count_rows: 0,
    delay: 0
  });

  const onChange = (data: any) => {
    setForm({
      ...form,
      [data.target.name]: data.target.value,
    });

    setDisable(false);
  };

  const handleAdd = () => {
    if ((form.count_columns <= 0) || (form.count_columns > 5)) {
      dispatch(
        messageQueueAction.addMessage(
          null,
          "error",
          "Укажите количество столбцов от 1 до 5"
        )
      );
      return;
    } else if ((form.count_rows <= 0) || (form.count_rows > 20)) {
      dispatch(
        messageQueueAction.addMessage(
          null,
          "error",
          "Укажите количество строк от 1 до 20"
        )
      );
      return;
    }

    addHandler(form.count_columns, (form.count_rows - 1), form.delay);
  };

  return (
    <>
      <div>
        <Dialog open={open === 1} onClose={handleClose}>
          <DialogTitle>Добавление новой таблицы</DialogTitle>
          <DialogContent
            style={{ overflowX: "hidden", padding: 15, margin: 0 }}
          >
            <DialogContentText></DialogContentText>
            <div className={styles.content}>
              <br />
              <TextField
                required={true}
                id="outlined-basic"
                type="number"
                label="Количество столбцов в таблице (не более 5)"
                variant="outlined"
                name="count_columns"
                onChange={onChange}
                sx={{
                  width: "100%",
                }}
              />
              <br />
              <TextField
                required={true}
                id="outlined-basic"
                type="number"
                label="Количество строк в таблице (не более 20)"
                variant="outlined"
                name="count_rows"
                onChange={onChange}
                sx={{
                  width: "100%",
                }}
              />
              <br />
              <TextField
                required={true}
                id="outlined-basic"
                type="number"
                label="Задержка (секунды)"
                variant="outlined"
                name="delay"
                onChange={onChange}
                sx={{
                  width: "100%",
                }}
              />
              <br />
            </div>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose}>Отмена</Button>
            <Button onClick={handleAdd} disabled={disable}>
              Далее
            </Button>
          </DialogActions>
        </Dialog>
      </div>
    </>
  );
};

export default React.memo(AddModal);
