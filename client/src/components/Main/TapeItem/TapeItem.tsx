import { FC, Fragment, useState } from "react";
import styles from "./TapeItem.module.scss";
import { TextField } from "@mui/material";
import { v4 as uuidv4 } from 'uuid';
import Button from "src/components/UI/Button";
import { useAppDispatch, useAppSelector } from "src/hooks/redux.hook";
import VideoItem from "src/components/Upload/VideoUpload/VideoItem";
import UserTapeAction from "src/store/actions/user/TapeAction";
import messageQueueAction from "src/store/actions/MessageQueueAction";
import { ITapeDataItem, ITapeItem } from "src/models/Tape/ITapeModel";
import ViewDataTable from "src/components/Upload/TableUpload/ViewDataTable";
import QuestionDialog from "src/components/QuestionDialog";
import TextItemView from "src/components/Upload/TextUpload/TextItemView";
import { ScreenModel } from "src/models/ScreenModel";
export interface ITapeValues {
    data: ITapeItem;
    screen: ScreenModel | null;
    clickCopyHandler?: (tapes_id: number) => void;
    clickEditHandler?: (data: ITapeItem) => void;
    clickRemove?: () => void;
}

const TapeItem: FC<ITapeValues> = ({ data, screen, clickCopyHandler, clickEditHandler, clickRemove }) => {
    const dispatch = useAppDispatch();
    const [isDelete, setDelete] = useState(false);

    const handleDelete = () => {
        if (!screen) {
            dispatch(UserTapeAction.tapesDelete(data.id, () => {
                clickRemove && clickRemove();
                dispatch(messageQueueAction.addMessage(null, "dark", "Лента успешно удалена!"));
                setDelete(false);
            }));
        } else {
            dispatch(UserTapeAction.tapesDeleteFromScreen(screen.id, data.id, () => {
                clickRemove && clickRemove();
                dispatch(messageQueueAction.addMessage(null, "dark", "Лента успешно откреплена!"));
                setDelete(false);
            }));
        }
    }

    /**
     * Рендеринг контента
     * @param content Добавляемый контент
     * @returns 
     */
    const renderContent = (content?: ITapeDataItem) => {
        if (!content) {
            return <></>;
        }

        return (
            <div className={styles.element}>
                {
                    content.type === "image" && content.filepath && <div className={styles.contentItem}>
                        <img src={content.filepath} className={styles.image} />
                    </div>
                }
                {
                    content.type === "table" && content.rows && content.columns && <div className={styles.contentItem}>
                        <ViewDataTable columns={content.columns} rows={content.rows} />
                    </div>
                }
                {
                    content.type === "video" && content.video_link && <div className={styles.contentItem}>
                        <VideoItem link={content.video_link} audio={(content.audio) ? true : false} />
                    </div>
                }
                {
                    content.type === "text" && content.text && <div className={styles.contentItem}>
                        <TextItemView text={content.text} />
                    </div>
                }
            </div>
        )
    };

    let colorCircle = (data.is_active) ? "#0000FF" : '#93d6ff';

    return (
        <>
            <div className={styles.main}>
                <div className={styles.container}>
                    <div className={styles.header}>
                        <TextField
                            required={true}
                            id="outlined-basic"
                            label="Название ленты"
                            variant="outlined"
                            value={data.title}
                            sx={{
                                width: "464px",
                            }}
                        />
                        <div className={styles.headerControls}>

                            {
                                clickCopyHandler && <Button
                                    title={"Добавить в экран"}
                                    clickHandler={() => {
                                        clickCopyHandler && clickCopyHandler(data.id);
                                    }}
                                />
                            }

                        </div>
                    </div>
                    <div className={styles.content}>
                        {
                            data.data_tapes.map((item, index) => {
                                return (
                                    <Fragment key={`${index}_${item.data_id}_${item.type}`}>
                                        {
                                            renderContent(item)
                                        }
                                    </Fragment>
                                )
                            })
                        }
                    </div>
                    <div style={{
                        display: 'flex',
                        flexDirection: 'row',
                        alignItems: 'center',
                        gap: '16px'
                    }}>
                        <Button
                            title={(!screen) ? "Удалить" : "Открепить"}
                            clickHandler={() => {
                                setDelete(true);
                            }}
                        />

                        {
                            !screen && <Button
                                title={"Изменить"}
                                clickHandler={() => {
                                    clickEditHandler && clickEditHandler(data);
                                }}
                            />
                        }
                    </div>
                </div>
            </div>

            {
                isDelete && <QuestionDialog
                    text={(!screen) ? "Удаление ленты" : "Открепление ленты"}
                    subText={`Вы уверены что хотите ${(!screen) ? "удалить" : "открепить"} ленту \"${data.title}\" ?`}
                    open={isDelete}
                    setOpen={setDelete}
                    action={handleDelete} />
            }
        </>
    );
};

export default TapeItem;
