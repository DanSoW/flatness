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
import { IVideoValues } from "src/models/Video/IVideoModel";
import Checkbox from "src/components/UI/Checkbox";
import YouTube from "src/constants/youtube";
import { ITextValues } from "src/models/Text/ITextModel";
import { ITableInfoValues } from "src/models/Tables/ITableModel";

export interface IAddModalProps {
  editHandler: (delay: number) => void;
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  delay: number;
}

const EditModal: FC<IAddModalProps> = ({
  editHandler,
  open,
  setOpen,
  delay
}) => {

  const dispatch = useAppDispatch();
  const [disable, setDisable] = useState(false);

  const handleClose = () => {
    setOpen(false);
  };

  const [form, setForm] = useState<{ delay: number }>({
    delay: delay
  });

  const onChange = (data: any) => {
    setForm({
      ...form,
      [data.target.name]: data.target.value,
    });

    setDisable(false);
  };

  const handleAdd = () => {
    if(String(form.delay).length === 0){
      dispatch(messageQueueAction.addMessage(null, "error", "Необходимо добавить задержку в секундах!"));
      return;
    }
    
    editHandler(form.delay);
  };

  return (
    <>
      <div>
        <Dialog open={open} onClose={handleClose}>
          <DialogTitle>Изменение изображения</DialogTitle>
          <DialogContent
            style={{ overflowX: "hidden", padding: 15, margin: 0 }}
          >
            <DialogContentText></DialogContentText>
            <div className={styles.content}>
              <TextField
                required={true}
                id="outlined-basic"
                type="number"
                label="Задержка (секунды)"
                variant="outlined"
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
            <Button onClick={handleAdd} disabled={disable}>
              Далее
            </Button>
          </DialogActions>
        </Dialog>
      </div>
    </>
  );
};

export default React.memo(EditModal);
