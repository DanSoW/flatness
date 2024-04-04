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
import { IScreenValues } from "src/models/Screen/IScreenModel";

export interface IEditModalProps {
  id: number;
  title: string;
  editHandler: (id: number, title: string) => void;
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

const EditModal: FC<IEditModalProps> = ({
  id,
  title,
  editHandler,
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

  const [form, setForm] = useState<IScreenValues>({
    title: title
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
    if (form.title.length === 0) {
      dispatch(
        messageQueueAction.addMessage(
          null,
          "error",
          "Необходимо добавить название!"
        )
      );
      return;
    }

    editHandler(id, form.title);
  };

  return (
    <>
      <div>
        <Dialog open={open} onClose={handleClose}>
          {videoSelector.isLoading && <CircularIndeterminate />}
          <DialogTitle>Изменение экрана "{title}"</DialogTitle>
          <DialogContent
            style={{ overflowX: "hidden", padding: 15, margin: 0 }}
          >
            <DialogContentText></DialogContentText>
            <div className={styles.content}>
              <br />
              <TextField
                required={true}
                id="outlined-basic"
                type="text"
                label="Название экрана"
                variant="outlined"
                name="title"
                onChange={onChange}
                sx={{
                  width: "100%",
                }}
                value={form.title}
              />
              <br />
            </div>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose}>Отмена</Button>
            <Button onClick={handleAdd} disabled={disable}>
              Изменить
            </Button>
          </DialogActions>
        </Dialog>
      </div>
    </>
  );
};

export default React.memo(EditModal);
