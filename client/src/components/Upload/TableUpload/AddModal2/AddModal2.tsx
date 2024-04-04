import React, { FC, useEffect, useState } from "react";
import styles from "./AddModal2.module.scss";
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
import { ITableInfoValues, ITableValues } from "src/models/Tables/ITableModel";

export interface IAddModalProps {
  addHandler: (columns: string[], rows: string[][], delay: number) => void;
  open: number;
  setOpen: React.Dispatch<React.SetStateAction<number>>;
  tableInfo: ITableInfoValues
}

const AddModal2: FC<IAddModalProps> = ({
  addHandler,
  open,
  setOpen,
  tableInfo
}) => {
  const dispatch = useAppDispatch();
  const [disable, setDisable] = useState(true);

  const handleClose = () => {
    setOpen(0);
  };

  const [form, setForm] = useState<ITableValues>({
    columns: Array.from({ length: tableInfo.count_columns }, () => ''),
    rows: Array.from({ length: tableInfo.count_rows }, () => Array.from({ length: tableInfo.count_columns }, () => ''))
  });

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

  const handleAdd = () => {
    addHandler(form.columns, form.rows, tableInfo.delay);
  };

  return (
    <>
      <div>
        <Dialog
          open={open === 2}
          onClose={handleClose}
          maxWidth="lg"
        >
          <DialogTitle>Добавление новой таблицы</DialogTitle>
          <DialogContent
            style={{ overflow: "auto", padding: 15, margin: 0 }}
          >
            <DialogContentText></DialogContentText>
            <div className={styles.content}>
              <div className={styles.columns}>
                {
                  form.columns && form.columns.map((item, index) => {
                    return (
                      <div>
                        <TextField
                          required={true}
                          id="outlined-basic"
                          variant="outlined"
                          color="success"
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
                      <div className={styles.row}>
                        {
                          item.map((subItem, subIndex) => {
                            return (
                              <div>
                                <TextField
                                  required={true}
                                  id="outlined-basic"
                                  variant="outlined"
                                  onChange={(e) => {
                                    onChangeRows(e, index, subIndex);
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
                    )
                  })
                }
              </div>
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

export default React.memo(AddModal2);
