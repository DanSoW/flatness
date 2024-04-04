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
import { ITableItemResponse, ITableValues } from "src/models/Tables/ITableModel";

export interface IEditModalProps {
  data: ITableItemResponse;
  editHandler: (columns: string[], rows: string[][], delay: number) => void;
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

const EditModal: FC<IEditModalProps> = ({
  data,
  editHandler,
  open,
  setOpen,
}) => {
  const tableSelector = useAppSelector((s) => s.userTableReducer);
  const dispatch = useAppDispatch();
  const handleOpen = () => setOpen(true);
  const [disable, setDisable] = useState(true);

  const handleClose = () => {
    setOpen(false);
  };

  const [form, setForm] = useState<ITableValues>({
    columns: data.columns.split(';'),
    rows: data.data_tables.map((item) => item.row.split(';')),
    delay: data.delay
  });

  const onChange = (data: any) => {
    setForm({
      ...form,
      [data.target.name]: data.target.value,
    });

    setDisable(false);
  };

  const onChangeColumns = (data: any, column: number) => {
    const columns = JSON.parse(JSON.stringify(form.columns));
    columns[column] = data.target.value;

    setForm({
      ...form,
      columns: columns
    });

    setDisable(false);
  };

  const onChangeRows = (data: any, column: number, row: number) => {
    const rows = JSON.parse(JSON.stringify(form.rows));
    rows[column][row] = data.target.value;

    setForm({
      ...form,
      rows: rows
    });

    setDisable(false);
  };

  const handleEdit = () => {
    editHandler(form.columns, form.rows, form.delay || 0);
  };

  return (
    <>
      <div>
        <Dialog
          open={open}
          onClose={handleClose}
          maxWidth="lg"
        >
          {tableSelector.isLoading && <CircularIndeterminate />}
          <DialogTitle>Изменение таблицы</DialogTitle>
          <DialogContent
            style={{ overflow: "auto", padding: 15, margin: 0 }}
          >
            <TextField
              required={true}
              id="outlined-basic"
              type="number"
              label="Задержка (секунды)"
              variant="outlined"
              name="delay"
              defaultValue={form.delay || 0}
              onChange={onChange}
              sx={{
                width: "100%",
              }}
            />
            <br />
            <div className={styles.content}>
              <br />
              <div className={styles.columns}>
                {
                  form.columns && form.columns.map((item, index) => {
                    return (
                      <div key={index}>
                        <TextField
                          required={true}
                          id="outlined-basic"
                          variant="outlined"
                          color="success"
                          defaultValue={item}
                          onChange={(e) => {
                            onChangeColumns(e, index);
                          }}
                          sx={{
                            width: "150px",
                          }}
                        />
                      </div>
                    )
                  })
                }
              </div>
              <div className={styles.rows}>
                {
                  form.rows && form.rows.map((item, index) => {
                    return (
                      <div className={styles.row} key={index}>
                        {
                          item.map((subItem, subIndex) => {
                            return (
                              <div key={subIndex}>
                                <TextField
                                  required={true}
                                  id="outlined-basic"
                                  variant="outlined"
                                  onChange={(e) => {
                                    onChangeRows(e, index, subIndex);
                                  }}
                                  defaultValue={subItem}
                                  sx={{
                                    width: "150px",
                                  }}
                                />
                              </div>
                            )
                          })
                        }
                      </div>
                    )
                  })
                }
              </div>
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
