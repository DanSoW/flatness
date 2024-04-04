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
import { IVideoItemResponse, IVideoValues } from "src/models/Video/IVideoModel";
import Checkbox from "src/components/UI/Checkbox";
import YouTube from "src/constants/youtube";

export interface IEditModalProps {
  data: IVideoItemResponse;
  editHandler: (id: number, link: string, audio: boolean) => void;
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

const EditModal: FC<IEditModalProps> = ({
  data,
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

  const [form, setForm] = useState<IVideoValues>({
    link: data.link,
    audio: data.audio
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
    if ((form.link.length === 0) || (form.link.split(YouTube.short).length === 0)) {
      dispatch(
        messageQueueAction.addMessage(
          null,
          "error",
          "Необходимо добавить ссылку на видео!"
        )
      );
      return;
    }

    editHandler(data.id, form.link.split(YouTube.short)[1], form.audio);
  };

  return (
    <>
      <div>
        <Dialog open={open} onClose={handleClose}>
          {videoSelector.isLoading && <CircularIndeterminate />}
          <DialogTitle>Изменение данных видео</DialogTitle>
          <DialogContent
            style={{ overflowX: "hidden", padding: 15, margin: 0 }}
          >
            <DialogContentText></DialogContentText>
            <div className={styles.content}>
              <br />
              <TextField
                required={true}
                id="outlined-basic"
                label="Ссылка на видео в YouTube (*поделиться):"
                variant="outlined"
                name="link"
                onChange={onChange}
                defaultValue={form.link}
                sx={{
                  width: "100%",
                }}
              />
              <br />
              <Checkbox
                title="Звук в видео"
                value={form.audio}
                setValue={(value) => {
                  setForm({
                    ...form,
                    audio: value
                  });

                  setDisable(false);
                }}
              />
              <br />
              <br />
              <span>*Поделиться - кнопка у видеоролика на YouTube, в которой нужно скопировать ссылку на видео.</span>
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
