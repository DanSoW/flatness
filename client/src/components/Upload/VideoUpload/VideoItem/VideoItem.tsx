import { FC, memo, useRef, useState } from "react";
import styles from "./VideoItem.module.scss";
import ReactPlayer from "react-player";

export interface IVideoItemProps {
    link: string;
    audio: boolean;
    width?: string;
    height?: string;
    autoplay?: boolean;
    fullScreen?: boolean;
    isIframe?: boolean;
    onEnded?: () => void;
}

const VideoItem: FC<IVideoItemProps> = ({ onEnded = () => {}, isIframe = true, link, audio, width = 224, height = 168, fullScreen = false, autoplay = false }) => {
    return (
        <>
            <div className={styles.container} style={
                (fullScreen) ? {
                    width: "100vw",
                    height: "100vh"
                } : {}
            }>
                {
                    !isIframe && <ReactPlayer
                        width={width}
                        height={height}
                        url={link}
                        playing={autoplay}
                        onEnded={() => {
                            onEnded();
                        }}
                        muted={audio ? false : true}
                    />
                }
                {
                    isIframe && <iframe
                        width={width}
                        height={height}
                        src={`${link}?rel=0&autoplay=${autoplay ? 1 : 0}&showinfo=0&loop=1&modestbranding=1&mute=${audio ? 0 : 1}`}
                        title="Video"
                        frameBorder="0"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                        allowFullScreen></iframe>
                }
            </div>
        </>
    );
};

export default memo(VideoItem);
