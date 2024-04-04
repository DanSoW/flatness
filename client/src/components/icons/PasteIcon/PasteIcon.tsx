import { FC } from "react";
import styles from "./PasteIcon.module.css";

export interface IPasteIconProps {
    width?: number;
    height?: number;
    clickHandler?: () => void;
}

const PasteIcon: FC<IPasteIconProps> = (props) => {
    const { width, height, clickHandler } = props;

    return (
        <>
            <svg
                fill="#000000"
                width={`${width}px`}
                height={`${height}px`}
                viewBox="0 0 32 32"
                id="icon"
                xmlns="http://www.w3.org/2000/svg"
                className={styles.container}
                onClick={() => {
                    clickHandler && clickHandler();
                }}
            >
                <title>Вставить</title>
                <path d="M26,20H17.83l2.58-2.59L19,16l-5,5,5,5,1.41-1.41L17.83,22H26v8h2V22A2,2,0,0,0,26,20Z" />
                <path
                    d="M23.71,9.29l-7-7A1,1,0,0,0,16,2H6A2,2,0,0,0,4,4V28a2,2,0,0,0,2,2h8V28H6V4h8v6a2,2,0,0,0,2,2h6v2h2V10A1,1,0,0,0,23.71,9.29ZM16,4.41,21.59,10H16Z" />
                <rect id="_Transparent_Rectangle_" data-name="&lt;Transparent Rectangle&gt;" fill="none"
                    width="32" height="32" />
            </svg>
        </>
    );
};

export default PasteIcon;
