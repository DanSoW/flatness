import { FC, memo } from "react";
import styles from "./TextItemView.module.scss";
import ReactQuill from "react-quill";

import "react-quill/dist/quill.bubble.css";

export interface ITextItemProps {
    text: string;
    width?: string;
    heigth?: string;
    border?: boolean;
}

const TextItemView: FC<ITextItemProps> = ({ text, width = 224, heigth = 168, border = true }) => {
    const getWidth = () => {
        return Number(width) + text.length / 7 + 80;
    };

    const getHeight = () => {
        return Number(heigth) + text.length + 680;
    };

    const scale = () => {
        return Math.min(1468 / getWidth(), 740 / getHeight());
    };

    return (
        <>
            <div className={styles.container} style={{
                width: width,
                height: heigth,
                border: (border) ? "1px solid black" : "none"
            }}>
                <div
                    className={styles.textWrapper}
                    style={{
                        width: `${getWidth()}px`,
                        height: `${getHeight()}px`,
                        transform: `scale(${scale()})`,
                        pointerEvents: 'none'
                    }}
                >
                    <ReactQuill
                        value={text}
                        theme={"bubble"}
                        readOnly={true}
                        style={{ pointerEvents: 'none' }}
                    />
                </div>
            </div>
        </>
    );
};

export default memo(TextItemView);
