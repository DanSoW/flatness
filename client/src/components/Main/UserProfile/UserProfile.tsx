import { FC, memo } from "react";
import styles from "./UserProfile.module.scss";
import Button from "src/components/UI/Button";
import { useAppDispatch } from "src/hooks/redux.hook";
import { authLogout } from "src/store/actions/AuthAction";
import messageQueueAction from "src/store/actions/MessageQueueAction";
import { useNavigate } from "react-router-dom";

const UserProfile: FC<any> = () => {
    const navigate = useNavigate();
    const dispatch = useAppDispatch();

    const onLogout = () => {
        dispatch(authLogout(() => {
            navigate("/auth/sign-in");
            dispatch(messageQueueAction.addMessage(null, "dark", "Вы вышли из аккаунта"));
        }));
    }

    return (
        <>
            <div className={styles.container}>
                <Button
                    title={"Выйти из аккаунта"}
                    clickHandler={onLogout} />
            </div>
        </>
    );
};

export default memo(UserProfile);
