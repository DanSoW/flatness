import { FC, Fragment, memo, useEffect, useRef, useState } from "react";
import styles from "./TapeView.module.scss";
import { useParams } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "src/hooks/redux.hook";
import UserTapeAction from "src/store/actions/user/TapeAction";
import { TextField } from "@mui/material";
import Button from "src/components/UI/Button";
import VideoItem from "src/components/Upload/VideoUpload/VideoItem";
import TextItem from "src/components/Upload/TextUpload/TextItem";
import messageQueueAction from "src/store/actions/MessageQueueAction";
import { ITapeDataItem, ITapeItem } from "src/models/Tape/ITapeModel";
import ViewDataTable from "src/components/Upload/TableUpload/ViewDataTable";
import QuestionDialog from "src/components/QuestionDialog";
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, EffectFade } from "swiper";

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/navigation';
import "swiper/css/effect-fade";
import { log } from "console";

const TapeView: FC<any> = () => {
    const { id } = useParams();
    const tapeSelector = useAppSelector((s) => s.userTapeReducer);
    const dispatch = useAppDispatch();
    const [activeIndex, setActiveIndex] = useState<number>(-1);
    const swiperRef = useRef(null);
    let timerRef = useRef<NodeJS.Timeout | null>(null);

    useEffect(() => {
        id && dispatch(UserTapeAction.tapesGet(id));

        return () => {
            dispatch(UserTapeAction.clearItem());
            timerRef.current && clearTimeout(timerRef.current);
        }
    }, []);

    const timerStart = () => {
        if (tapeSelector.currentItem && activeIndex >= 0) {
            const element = tapeSelector.currentItem.data_tapes[activeIndex];

            if (element.delay) {
                timerRef.current && clearTimeout(timerRef.current);

                timerRef.current = setTimeout(() => {
                    nextSlideTo(activeIndex + 1);
                    timerRef.current && clearTimeout(timerRef.current);
                }, 1000 * element.delay);
            }
        }
    }

    useEffect(() => {
        if (tapeSelector.currentItem) {
            setActiveIndex(0);
        }
    }, [tapeSelector.currentItem]);

    /**
     * При изменении текущего активного индекса начинаем отсчёт до следующего изменения слайда
     */
    useEffect(() => {
        timerStart();
    }, [activeIndex]);

    const nextSlideTo = (slide: number) => {
        if (!swiperRef.current) {
            return;
        }

        // @ts-ignore
        if (swiperRef.current.swiper && swiperRef.current.swiper.slides.length === slide) {
            // Повторная загрузка инфы о ленте
            id && dispatch(UserTapeAction.tapesGet(id, () => {
                // Перемещение к первому слайду
                // @ts-ignore
                swiperRef.current.swiper.slideTo(0);
                setActiveIndex(0);
            }));
        } else {
            // @ts-ignore
            swiperRef.current.swiper.slideNext();
            setActiveIndex(slide);
        }

    }

    const nextSlide = () => {
        if (!swiperRef.current) {
            return;
        }

        // @ts-ignore
        if (swiperRef.current.swiper && swiperRef.current.swiper.slides.length === (activeIndex + 1)) {
            // Повторная загрузка инфы о ленте
            id && dispatch(UserTapeAction.tapesGet(id, () => {
                // Перемещение к первому слайду
                // @ts-ignore
                swiperRef.current.swiper.slideTo(0);
                setActiveIndex(0);
            }));
        } else {
            // @ts-ignore
            swiperRef.current.swiper.slideNext();
            setActiveIndex(activeIndex + 1);
        }
    }


    /**
     * Рендеринг контента
     * @param content Добавляемый контент
     * @returns 
     */
    const renderContent = (content: ITapeDataItem, index: number) => {
        return (
            <div className={styles.element}>
                {
                    content.type === "image" && content.filepath && <div className={styles.contentItem}>
                        <img src={content.filepath} className={styles.image} />
                    </div>
                }
                {
                    content.type === "table" && content.rows && content.columns && <div className={styles.contentItem}>
                        <ViewDataTable columns={content.columns} rows={content.rows} norm={true} fullScreen={true} />
                    </div>
                }
                {
                    content.type === "video" && content.video_link && <div className={styles.contentItem}>
                        <VideoItem
                            isIframe={false}
                            height={"100%"}
                            width={"100%"}
                            fullScreen={true}
                            autoplay={(activeIndex === index)}
                            link={content.video_link}
                            audio={(content.audio) ? true : false}
                            onEnded={() => {
                                nextSlide();
                            }}
                        />
                    </div>
                }
                {
                    content.type === "text" && content.text && <div className={styles.contentItem}>
                        <TextItem border={false} width={"100%"} heigth={"100%"} text={content.text} fullscreen={true} />
                    </div>
                }
            </div>
        )
    }

    return (
        <>
            {
                tapeSelector.currentItem &&
                <div className={styles.main}>
                    <div className={styles.container}>
                        <div className={styles.content}>
                            <Swiper
                                ref={swiperRef}
                                className={styles.swiperContainer}
                                slidesPerView={1}
                                loop={false}
                                centeredSlides={true}
                                effect={"fade"}
                                modules={[EffectFade]}
                                allowTouchMove={false}
                            >
                                {
                                    tapeSelector.currentItem.data_tapes.map((item, index) => {
                                        return (
                                            <Fragment
                                                key={`${item.id}_${item.data_id}_${item.type}`}
                                            >
                                                <SwiperSlide
                                                    style={{
                                                        width: '100%',
                                                        height: '100%',
                                                        background: "white",
                                                    }}
                                                >
                                                    {
                                                        activeIndex === index && renderContent(item, index)
                                                    }
                                                </SwiperSlide>
                                            </Fragment>
                                        );
                                    })
                                }
                            </Swiper>
                        </div>
                    </div>
                </div>
            }
        </>
    );
};

export default memo(TapeView);
