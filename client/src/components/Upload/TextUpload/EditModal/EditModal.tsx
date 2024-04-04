import React, { FC, useEffect, useState } from "react";
import styles from "./EditModal.module.scss";
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
import { ITextItemResponse, ITextValues } from "src/models/Text/ITextModel";
import Checkbox from "src/components/UI/Checkbox";
import YouTube from "src/constants/youtube";
import TextEditor from "src/components/Editor/TextEditor";

export interface IEditModalProps {
  data: ITextItemResponse;
  editHandler: (id: number, text: string, delay: number) => void;
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

const EditModal: FC<IEditModalProps> = ({
  data,
  editHandler,
  open,
  setOpen,
}) => {
  const textSelector = useAppSelector((s) => s.userTextReducer);
  const dispatch = useAppDispatch();
  const handleOpen = () => setOpen(true);
  const [disable, setDisable] = useState(true);

  const handleClose = () => {
    setOpen(false);
  };

  const [form, setForm] = useState<ITextValues>({
    text: data.text,
    delay: data.delay
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

  const handleEdit = () => {
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

    editHandler(data.id, form.text, form.delay);
  };

  return (
    <>
      <div>
        <Dialog open={open} onClose={handleClose}>
          {textSelector.isLoading && <CircularIndeterminate />}
          <DialogTitle>Изменение текста</DialogTitle>
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

                  setDisable(false);
                }}
              />
              <br />
              <TextField
                required={true}
                id="outlined-basic"
                label="Задержка (секунды)"
                variant="outlined"
                type="number"
                name="delay"
                onChange={onChange}
                defaultValue={form.delay}
                sx={{
                  width: "100%",
                }}
              />
              <br />
            </div>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose}>Отмена</Button>
            <Button onClick={handleEdit} disabled={disable}>
              Изменить
            </Button>
          </DialogActions>
        </Dialog>
      </div>
    </>
  );
};

export default React.memo(EditModal);
