import { FC, Fragment, useState } from "react";
import styles from "./TapeAdd.module.scss";
import { TextField } from "@mui/material";
import { v4 as uuidv4 } from 'uuid';
import Button from "src/components/UI/Button";
import { ITapeContent } from "src/store/reducers/user/TapeSlice";
import { useAppDispatch, useAppSelector } from "src/hooks/redux.hook";
import { ITextItemResponse } from "src/models/Text/ITextModel";
import { ImageItemResponse } from "src/models/Image/IImageModel";
import ViewTable from "src/components/Upload/TableUpload/ViewTable";
import { ITableItemResponse } from "src/models/Tables/ITableModel";
import VideoItem from "src/components/Upload/VideoUpload/VideoItem";
import TextItem from "src/components/Upload/TextUpload/TextItem";
import UserTapeAction from "src/store/actions/user/TapeAction";
import cross from "src/resources/images/cross.svg";
import { IVideoItemResponse } from "src/models/Video/IVideoModel";
import messageQueueAction from "src/store/actions/MessageQueueAction";
import TextItemView from "src/components/Upload/TextUpload/TextItemView";
import CrossIcon from "src/components/icons/CrossIcon";
import ArrowIcon from "src/components/icons/ArrowIcon";

export interface ITapeValues {
  title: string;
}

export interface ITapeAddProps {
  clearTape: () => void;
}

const TapeAdd: FC<ITapeAddProps> = (props) => {
  const { clearTape } = props;

  const tapeSelector = useAppSelector((s) => s.userTapeReducer);
  const textSelector = useAppSelector((s) => s.userTextReducer);
  const tableSelector = useAppSelector((s) => s.userTableReducer);
  const imageSelector = useAppSelector((s) => s.userImageReducer);
  const videoSelector = useAppSelector((s) => s.userVideoReducer);

  const dispatch = useAppDispatch();

  const [form, setForm] = useState<ITapeValues>({
    title: "",
  });

  const onChange = (data: any) => {
    setForm({
      ...form,
      [data.target.name]: data.target.value,
    });
  };

  const onClickHandler = (title: string, content: ITapeContent[]) => {
    dispatch(UserTapeAction.addTape(title, content, () => {
      if (tapeSelector.isAdd) {
        dispatch(UserTapeAction.clearContent());
      }

      dispatch(UserTapeAction.setAdd(false));

      dispatch(messageQueueAction.addMessage(null, "success", "Лента успешно добавлена!"));
    }));
  }

  /**
   * Рендеринг контента
   * @param content Добавляемый контент
   * @returns 
   */
  const renderContent = (content: ITapeContent) => {
    let element: any = null;

    if (content.type === "image") {
      element = imageSelector.items.find((item) => item.id === content.content_id);
    } else if (content.type === "table") {
      element = tableSelector.items.find((item) => item.id === content.content_id);
    } else if (content.type === "text") {
      element = textSelector.items.find((item) => item.id === content.content_id);
    } else if (content.type === "video") {
      element = videoSelector.items.find((item) => item.id === content.content_id);
    }

    return (
      <div className={styles.element}>
        {
          content.type === "image" && <div className={styles.contentItem}>
            {
              (content.queue_num > 1) &&
              <div className={styles.controls}>
                <div className={styles.arrow}>
                  <ArrowIcon
                    width={21}
                    height={21}
                    style={{
                      transform: "rotate(180deg)"
                    }}
                    clickHandler={() => {
                      dispatch(UserTapeAction.contentMoveLeft(content.type, content.content_id, content.queue_num));
                    }}
                  />
                </div>
              </div>
            }
            <div>
              <img src={(element as ImageItemResponse).filepath} className={styles.image} />
            </div>
            <div className={styles.controls}>
              <img
                src={cross}
                style={{
                  marginTop: "0.4em",
                  marginLeft: "1.5px",
                  cursor: "pointer"
                }}
                onClick={() => {
                  dispatch(UserTapeAction.deleteContent(content.type, content.content_id, content.queue_num));
                }}
                width="21em"
                height="21em"
              />
              {
                content.queue_num < tapeSelector.items.length && <div className={styles.arrow}>
                  <ArrowIcon
                    width={21}
                    height={21}
                    clickHandler={() => {
                      dispatch(UserTapeAction.contentMoveRight(content.type, content.content_id, content.queue_num));
                    }}
                  />
                </div>
              }
            </div>
          </div>
        }
        {
          content.type === "table" && <div className={styles.contentItem}>
            {
              (content.queue_num > 1) &&
              <div className={styles.controls}>
                <div className={styles.arrow}>
                  <ArrowIcon
                    width={21}
                    height={21}
                    style={{
                      transform: "rotate(180deg)"
                    }}
                    clickHandler={() => {
                      dispatch(UserTapeAction.contentMoveLeft(content.type, content.content_id, content.queue_num));
                    }}
                  />
                </div>
              </div>
            }
            <ViewTable data={(element as ITableItemResponse)} />
            <div className={styles.controls}>
              <img
                src={cross}
                style={{
                  marginTop: "1.1em",
                  marginLeft: "1.5px",
                  cursor: "pointer"
                }}
                onClick={() => {
                  dispatch(UserTapeAction.deleteContent(content.type, (element as ITableItemResponse).id, content.queue_num));
                }}
                width="21em"
                height="21em"
              />
              {
                content.queue_num < tapeSelector.items.length && <div className={styles.arrow}>
                  <ArrowIcon
                    width={21}
                    height={21}
                    clickHandler={() => {
                      dispatch(UserTapeAction.contentMoveRight(content.type, content.content_id, content.queue_num));
                    }}
                  />
                </div>
              }
            </div>
          </div>
        }
        {
          content.type === "video" && <div className={styles.contentItem}>
            {
              (content.queue_num > 1) &&
              <div className={styles.controls}>
                <div className={styles.arrow}>
                  <ArrowIcon
                    width={21}
                    height={21}
                    style={{
                      transform: "rotate(180deg)"
                    }}
                    clickHandler={() => {
                      dispatch(UserTapeAction.contentMoveLeft(content.type, content.content_id, content.queue_num));
                    }}
                  />
                </div>
              </div>
            }
            <VideoItem link={element.link} audio={element.audio} />
            <div className={styles.controls}>
              <img
                src={cross}
                style={{
                  marginTop: "0.4em",
                  marginLeft: "1.5px",
                  cursor: "pointer"
                }}
                onClick={() => {
                  dispatch(UserTapeAction.deleteContent(content.type, content.content_id, content.queue_num));
                }}
                width="21em"
                height="21em"
              />
              {
                content.queue_num < tapeSelector.items.length && <div className={styles.arrow}>
                  <ArrowIcon
                    width={21}
                    height={21}
                    clickHandler={() => {
                      dispatch(UserTapeAction.contentMoveRight(content.type, content.content_id, content.queue_num));
                    }}
                  />
                </div>
              }
            </div>
          </div>
        }
        {
          content.type === "text" && <div className={styles.contentItem}>
            {
              (content.queue_num > 1) &&
              <div className={styles.controls}>
                <div className={styles.arrow}>
                  <ArrowIcon
                    width={21}
                    height={21}
                    style={{
                      transform: "rotate(180deg)"
                    }}
                    clickHandler={() => {
                      dispatch(UserTapeAction.contentMoveLeft(content.type, content.content_id, content.queue_num));
                    }}
                  />
                </div>
              </div>
            }
            <TextItemView text={element.text} />
            <div className={styles.controls}>
              <img
                src={cross}
                style={{
                  marginTop: "0.4em",
                  marginLeft: "1.5px",
                  cursor: "pointer"
                }}
                onClick={() => {
                  dispatch(UserTapeAction.deleteContent(content.type, content.content_id, content.queue_num));
                }}
                width="21em"
                height="21em"
              />
              {
                content.queue_num < tapeSelector.items.length && <div className={styles.arrow}>
                  <ArrowIcon
                    width={21}
                    height={21}
                    clickHandler={() => {
                      dispatch(UserTapeAction.contentMoveRight(content.type, content.content_id, content.queue_num));
                    }}
                  />
                </div>
              }
            </div>
          </div>
        }
      </div>
    )
  }

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
              name="title"
              onChange={onChange}
              sx={{
                width: "464px",
              }}
            />
            <CrossIcon
              width={24}
              height={24}
              clickHandler={() => {
                clearTape();
              }}
            />
          </div>
          <div className={styles.content}>
            {
              [...tapeSelector.items].sort((a, b) => {
                const queueA = a.queue_num;
                const queueB = b.queue_num;

                if (queueA > queueB) {
                  return 1;
                } else if (queueA < queueB) {
                  return -1;
                }

                return 0;
              }).map((item, index) => {
                return (
                  <Fragment key={`${index}_${item.content_id}_${item.type}`}>
                    {
                      renderContent(item)
                    }
                  </Fragment>
                )
              })
            }
          </div>
        </div>
        <Button
          title={"Добавить"}
          clickHandler={() => {
            onClickHandler(form.title, tapeSelector.items);
          }} />
      </div>
    </>
  );
};

export default TapeAdd;
