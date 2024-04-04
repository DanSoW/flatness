import React, { FC, useEffect, useState } from "react";
import styles from "./EditUser.module.scss";
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
import { IUserModel } from "src/models/IUserModel";
import { editUser, getUsers } from "src/store/actions/AuthAction";

export interface ILocalModel {
    email: string;
    available_screens: number;
}

export interface IEditModalProps {
    user: IUserModel;
    open: boolean;
    setOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

const EditUser: FC<IEditModalProps> = ({
    user,
    open,
    setOpen,
}) => {
    const authSelector = useAppSelector((s) => s.authReducer);
    const dispatch = useAppDispatch();

    const handleOpen = () => setOpen(true);
    const [disable, setDisable] = useState(true);

    const handleClose = () => {
        setOpen(false);
    };

    const [form, setForm] = useState<ILocalModel>({
        email: user.email,
        available_screens: user.data_users[0].available_screens
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
        if (form.email.length === 0) {
            dispatch(
                messageQueueAction.addMessage(
                    null,
                    "error",
                    "Необходимо добавить email!"
                )
            );
            return;
        }

        dispatch(editUser({
            id: user.id,
            email: form.email,
            available_screens: form.available_screens
        }, () => {
            dispatch(messageQueueAction.addMessage(null, "success", "Пользователь успешно изменён!"));
            dispatch(getUsers());
            setOpen(false);
        }));
    };

    return (
        <>
            <div>
                <Dialog open={open} onClose={handleClose}>
                    {authSelector.isLoading && <CircularIndeterminate />}
                    <DialogTitle>Редактирование пользователя "{user.email}"</DialogTitle>
                    <DialogContent
                        style={{ overflowX: "hidden", padding: 15, margin: 0 }}
                    >
                        <div className={styles.content}>
                            <br />
                            <TextField
                                required={true}
                                id="outlined-basic"
                                type="text"
                                label="Email"
                                variant="outlined"
                                name="email"
                                onChange={onChange}
                                sx={{
                                    width: "100%",
                                }}
                                value={form.email}
                            />
                            <br />
                            <br />

                            <TextField
                                required={true}
                                id="outlined-basic"
                                type="number"
                                label="Доступно экранов"
                                variant="outlined"
                                name="available_screens"
                                onChange={onChange}
                                sx={{
                                    width: "100%",
                                }}
                                value={form.available_screens}
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

export default React.memo(EditUser);
