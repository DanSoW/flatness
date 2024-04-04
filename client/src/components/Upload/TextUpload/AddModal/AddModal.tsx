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
import TextEditor from "src/components/Editor/TextEditor";

export interface IAddModalProps {
  addHandler: (text: string, delay: number) => void;
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

const AddModal: FC<IAddModalProps> = ({
  addHandler,
  open,
  setOpen,
}) => {
  const videoSelector = useAppSelector((s) => s.userVideoReducer);
  const dispatch = useAppDispatch();
  const handleOpen = () => setOpen(true);
  const [disable, setDisable] = useState(true);

  const handleClose = () => {
    setOpen(false);
  };

  const [form, setForm] = useState<ITextValues>({
    text: "",
    delay: 0
  });

  const onChange = (data: any) => {
    setForm({
      ...form,
      [data.target.name]: data.target.value,
    });

    setDisable(false);
  };

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleAdd = () => {
    if (form.text.length === 0) {
      dispatch(
        messageQueueAction.addMessage(
          null,
          "error",
          "Необходимо добавить текст!"
        )
      );
      return;
    } else if (form.text.trim().length <= 0) {
      dispatch(
        messageQueueAction.addMessage(
          null,
          "error",
          "Нельзя добавить пустой текст!"
        )
      );
    }

    addHandler(form.text, form.delay);
  };

  return (
    <>
      <div>
        <Dialog open={open} onClose={handleClose}>
          {videoSelector.isLoading && <CircularIndeterminate />}
          <DialogTitle>Добавление нового текста</DialogTitle>
          <DialogContent
            style={{ overflowX: "hidden", padding: 15, margin: 0 }}
          >
            <DialogContentText></DialogContentText>
            <div className={styles.content}>
              <br />
              <TextEditor
                text={form.text}
                setText={(text: string) => {
                  setForm({
                    ...form,
                    text: text
                  });
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
              Добавить
            </Button>
          </DialogActions>
        </Dialog>
      </div>
    </>
  );
};

export default React.memo(AddModal);
