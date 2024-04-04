import React, { Fragment, useEffect, useState } from 'react';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import UserProfile from 'src/components/Main/UserProfile';
import ImageList from 'src/components/Main/ImageList';
import VideoList from 'src/components/Main/VideoList';
import TextList from 'src/components/Main/TextList';
import TableList from 'src/components/Main/TableList';
import styles from './Main.module.scss';
import Button from 'src/components/UI/Button';
import TapeAdd from 'src/components/Main/TapeAdd';
import UserTapeAction from 'src/store/actions/user/TapeAction';
import { useAppDispatch, useAppSelector } from 'src/hooks/redux.hook';
import TapeItem from 'src/components/Main/TapeItem';
import { screenBlockGen } from './generators/screen-block-gen';
import ScreenBlock from 'src/components/Screen/ScreenBlock';
import ScreenAction from 'src/store/actions/ScreenAction';
import { IContentTypeList, ScreenModel } from 'src/models/ScreenModel';
import QuestionDialog from 'src/components/QuestionDialog';
import AddModal from 'src/components/Upload/ScreenUpload/AddModal';
import messageQueueAction from 'src/store/actions/MessageQueueAction';
import EditModal from 'src/components/Upload/ScreenUpload/EditModal';
import CopyAction from 'src/store/actions/CopyAction';
import CircularIndeterminate from 'src/components/CircularIndeterminate';
import Admin from 'src/components/Admin';
import CommonBlock from 'src/components/Screen/CommonBlock';
import TapeEdit from 'src/components/Main/TapeEdit';
import { ITapeDataItem, ITapeItem } from 'src/models/Tape/ITapeModel';

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`vertical-tabpanel-${index}`}
      aria-labelledby={`vertical-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
}

function a11yProps(index: number) {
  return {
    id: `vertical-tab-${index}`,
    'aria-controls': `vertical-tabpanel-${index}`,
  };
}

const Main = () => {
  const authSelector = useAppSelector((s) => s.authReducer);
  const copySelector = useAppSelector((s) => s.copyReducer);
  const tapeSelector = useAppSelector((s) => s.userTapeReducer);
  const screenSelector = useAppSelector((s) => s.screenReducer);
  const dispatch = useAppDispatch();
  const [value, setValue] = React.useState(0);
  const [screens, setScreens] = React.useState<ScreenModel[]>([]);
  const [selectedScreen, setSelectedScreen] = React.useState(-1);
  const [screenDelete, setScreenDelete] = React.useState(false);
  const [isAdd, setAdd] = React.useState(false);
  const [isEdit, setEdit] = React.useState(false);

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  useEffect(() => {
    dispatch(ScreenAction.screensGetAll());
    dispatch(UserTapeAction.tapesGetAll());
  }, []);

  useEffect(() => {
    setScreens(screenSelector.screens);
  }, [screenSelector.screens]);

  useEffect(() => {
    if (selectedScreen >= 0 && screens.length > 0) {
      dispatch(UserTapeAction.tapesGetAllByScreen(screens[selectedScreen].id));
    }
  }, [selectedScreen]);

  const screenClickHandler = (id: number) => {
    if (id < 0) {
      setSelectedScreen(id);
    }

    const index = screens.findIndex((item) => item.id === id);

    if ((index >= 0) && (index !== selectedScreen)) {
      setSelectedScreen(index);
    } else {
      setSelectedScreen(-1);
    }
  };

  const deleteScreenClickHandler = (id: number) => {
    const index = screens.findIndex((item) => item.id === id);

    if ((index >= 0) && (index !== selectedScreen)) {
      setSelectedScreen(index);
    }

    setScreenDelete(true);
  };

  const editScreenClickHandler = (id: number) => {
    const index = screens.findIndex((item) => item.id === id);

    if ((index >= 0) && (index !== selectedScreen)) {
      setSelectedScreen(index);
    }

    setEdit(true);
  };

  const screenDeleteHandler = () => {
    if (selectedScreen >= 0) {
      dispatch(ScreenAction.screensDelete(screens[selectedScreen].id, () => {
        dispatch(ScreenAction.screensGetAll());

        dispatch(messageQueueAction.addMessage(
          null,
          "dark",
          "Экран удалён"
        ));

        setScreenDelete(false);
        setSelectedScreen(-1);
      }));
    }
  };

  const handleAdd = (title: string) => {
    dispatch(ScreenAction.screensAdd(title, () => {
      dispatch(ScreenAction.screensGetAll());

      setSelectedScreen(-1);
      setAdd(false);
      dispatch(messageQueueAction.addMessage(
        null,
        "success",
        "Новый экран успешно добавлен"
      ));
    }))
  };

  const handleEdit = (id: number, title: string) => {
    dispatch(ScreenAction.screensEdit(id, title, () => {
      dispatch(ScreenAction.screensGetAll());

      setEdit(false);
      dispatch(messageQueueAction.addMessage(
        null,
        "success",
        "Экран успешно изменён"
      ));
    }))
  };

  const isAdmin = () => {
    if (authSelector.roles.length > 0) {
      const index = authSelector.roles.findIndex((item) => {
        return item.priority >= 2;
      });

      if (index >= 0) {
        return true;
      }
    }

    return false;
  };

  useEffect(() => {
    if (tapeSelector.isAdd && selectedScreen !== -1) {
      dispatch(UserTapeAction.setAdd(false));
    }
  }, [tapeSelector.isAdd, selectedScreen]);

  useEffect(() => {
    if (selectedScreen >= 0) {
      dispatch(messageQueueAction.addMessage(null, "success", `Экран "${screens[selectedScreen].title}" выбран!`));
    }
  }, [selectedScreen]);

  const [isEditTape, setIsEditTape] = useState<ITapeItem | null>(null);

  return (
    <div className={styles.container}>
      <div>
        <Box
          sx={{
            flexGrow: 1,
            bgcolor: 'rgb(224, 240, 240)',
            display: 'flex',
            height: 'max-content',
            borderRadius: '2px',
            marginTop: '8px'
          }}
        >
          <Tabs
            orientation="vertical"
            variant="scrollable"
            value={value}
            onChange={handleChange}
            aria-label="Vertical tabs example"
          >
            <Tab
              label="Профиль пользователя"
              {...a11yProps(0)}
            />
            <Tab
              label="Видео"
              {...a11yProps(1)}
            />
            <Tab
              label="Изображения"
              {...a11yProps(2)}
            />
            <Tab
              label="Таблицы"
              {...a11yProps(3)}
            />
            <Tab
              label="Текст"
              {...a11yProps(4)}
            />
            {
              isAdmin() && <Tab
                label="Админ-панель"
                {...a11yProps(4)}
              />
            }
          </Tabs>
          <TabPanel value={value} index={0}>
            <UserProfile />
          </TabPanel>
          <TabPanel value={value} index={1}>
            <VideoList />
          </TabPanel>
          <TabPanel value={value} index={2}>
            <ImageList />
          </TabPanel>
          <TabPanel value={value} index={3}>
            <TableList />
          </TabPanel>
          <TabPanel value={value} index={4}>
            <TextList />
          </TabPanel>
          {
            isAdmin() && <>
              <TabPanel value={value} index={5}>
                <Admin />
              </TabPanel>
            </>
          }
        </Box>
      </div>
      <div className={styles.screens}>
        <div className={styles.controls}>
          <Button
            title={'Добавить ленту'}
            clickHandler={() => {
              if (selectedScreen !== -1) {
                setSelectedScreen(-1);
              }

              if (tapeSelector.isAdd) {
                dispatch(UserTapeAction.clearContent());
              }

              dispatch(UserTapeAction.setAdd(!tapeSelector.isAdd));
            }}
            disabled={tapeSelector.isAdd}
          />
          <Button
            title={'Добавить экран'}
            clickHandler={() => {
              setAdd(true);
            }} />

        </div>
        <div className={styles.screensList}>
          {
            screens.map((item, key) => {
              let colorCircle = (key === selectedScreen) ? "#0000FF" : '#93d6ff';

              return (
                <div className={styles.element} key={key}>
                  <ScreenBlock
                    {...item}
                    colorCircle={colorCircle}
                    clickHandler={screenClickHandler}
                    deleteHandler={deleteScreenClickHandler}
                    editHandler={editScreenClickHandler}
                  />
                </div>
              )
            })
          }
        </div>
      </div>
      {
        isEditTape
        && selectedScreen == -1
        && <div className={styles.tapes}>
          <h3 style={{ marginBottom: 0 }}>Изменение ленты: </h3>
          <TapeEdit
            dataTape={isEditTape}
            clearTape={() => {
              if (tapeSelector.isAdd) {
                dispatch(UserTapeAction.clearContent());
              }

              dispatch(UserTapeAction.setAdd(false));

              setIsEditTape(null);
            }}
            clickEdit={() => {
              if (tapeSelector.isAdd) {
                dispatch(UserTapeAction.clearContent());
              }

              dispatch(UserTapeAction.setAdd(false));

              setIsEditTape(null);
            }}
          />
        </div>
      }
      {
        tapeSelector.isAdd
        && !isEditTape
        && selectedScreen == -1
        && <div className={styles.tapes}>
          <h3 style={{ marginBottom: 0 }}>Добавление ленты: </h3>
          <TapeAdd
            clearTape={() => {
              if (tapeSelector.isAdd) {
                dispatch(UserTapeAction.clearContent());
              }

              dispatch(UserTapeAction.setAdd(false));
            }}
          />
        </div>
      }
      {
        !tapeSelector.isAdd && !isEditTape && tapeSelector.tapesInfo?.tapes && <div className={styles.tapesList}>
          <h3>Все ленты: </h3>
          {
            tapeSelector.tapesInfo.tapes.map((item, index) => {
              return (
                <Fragment key={`${index}_${item.id}_${item.title}`}>
                  <TapeItem
                    data={item}
                    screen={null}
                    clickCopyHandler={(tapes_id) => {
                      if (selectedScreen < 0) {
                        dispatch(messageQueueAction.addMessage(null, "error", "Выберите экран чтобы закрепить ленту!"));
                      } else {
                        dispatch(CopyAction.tapeCopy(screens[selectedScreen].id, tapes_id, () => {
                          dispatch(ScreenAction.screensGetAll());
                          dispatch(messageQueueAction.addMessage(null, "success", "Лента успешно закреплена!"));
                        }));
                      }
                    }}
                    clickEditHandler={(data) => {
                      setIsEditTape(data);
                      dispatch(UserTapeAction.addContentList(data.data_tapes.map((item) => {
                        return {
                          content_id: item.data_id,
                          type: item.type,
                          queue_num: item.queue_num
                        } as IContentTypeList;
                      })));
                      dispatch(UserTapeAction.setAdd(true));
                      dispatch(messageQueueAction.addMessage(null, "success", "Лента готова к изменению!"));
                    }}
                  />
                </Fragment>
              );
            })
          }
        </div>
      }

      {
        screenDelete && selectedScreen >= 0 && <QuestionDialog
          text={"Удаление экрана"}
          subText={`Вы уверены что хотите удалить экран \"${screens[selectedScreen].title}\" ?`}
          open={screenDelete}
          setOpen={setScreenDelete}
          action={screenDeleteHandler} />
      }
      {
        isAdd && <AddModal
          addHandler={handleAdd}
          open={isAdd}
          setOpen={setAdd} />
      }
      {
        isEdit && selectedScreen >= 0 && <EditModal
          id={screens[selectedScreen].id}
          title={screens[selectedScreen].title}
          editHandler={handleEdit}
          open={isEdit}
          setOpen={setEdit} />
      }
      {
        copySelector.isLoading && <CircularIndeterminate />
      }
    </div>
  );
}

export default Main;
