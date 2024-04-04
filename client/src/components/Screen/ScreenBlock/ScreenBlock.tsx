import { FC } from "react";
import styles from "./ScreenBlock.module.scss";
import CircleIcon from "src/components/icons/CircleIcon";
import { linkFormatted } from "src/utils/link";
import { Link } from "react-router-dom";
import CrossIcon from "src/components/icons/CrossIcon";
import EditIcon from "src/components/icons/EditIcon";
import PasteIcon from "src/components/icons/PasteIcon";
import { useAppDispatch, useAppSelector } from "src/hooks/redux.hook";
import UserTapeAction from "src/store/actions/user/TapeAction";
import messageQueueAction from "src/store/actions/MessageQueueAction";
import ScreenAction from "src/store/actions/ScreenAction";

export interface IScreenBlockProps {
    id: number;
    title: string;
    link: string;
    tape_exist: boolean;
    colorCircle?: string;
    clickHandler?: (id: number) => void;
    deleteHandler?: (id: number) => void;
    editHandler?: (id: number) => void;
    clickCopyHandler?: (screens_id: number, tapes_id_source: number) => void;
}

const ScreenBlock: FC<IScreenBlockProps> = (props) => {
    const {
        id, title, link, tape_exist,
        colorCircle, clickHandler, deleteHandler,
        editHandler, clickCopyHandler
    } = props;

    const dispatch = useAppDispatch();
    const copySlice = useAppSelector((s) => s.copyReducer);

    return (
        <>
            <div className={styles.container}>
                <div className={styles.header}>
                    <p>{title}</p>
                    <div className={styles.controls}>
                        <CircleIcon
                            width={24}
                            height={24}
                            colorCircle={colorCircle}
                            clickHandler={() => {
                                clickHandler && clickHandler(id);
                            }}
                        />
                        <EditIcon
                            width={24}
                            height={24}
                            clickHandler={() => {
                                editHandler && editHandler(id);
                            }}
                        />
                        <CrossIcon
                            width={24}
                            height={24}
                            clickHandler={() => {
                                deleteHandler && deleteHandler(id);
                            }}
                        />
                    </div>
                </div>
                {
                    tape_exist && <button
                        onClick={() => {
                            dispatch(UserTapeAction.tapesDeleteFromScreen(id, 0, () => {
                                dispatch(ScreenAction.screensGetAll());
                                dispatch(messageQueueAction.addMessage(null, "dark", "Лента успешно откреплена!"));
                            }));
                        }}
                    >
                        Открепить ленту
                    </button>
                }
                <div className={styles.content}>
                    <p>Ссылка: </p>
                    <Link to={`/s/${link}`} onClick={(e) => {
                        if (!tape_exist) {
                            e.preventDefault();
                        }
                    }}>{link}</Link>
                </div>
            </div>
        </>
    );
};

export default ScreenBlock;
