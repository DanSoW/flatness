import { FC } from "react";
import styles from "./ArrowIcon.module.scss";

export interface IArrowIconProps {
    width: number;
    height: number;
    colorCircle?: string;
    clickHandler?: () => void;
    title?: string;
    style?: React.CSSProperties
}

const ArrowIcon: FC<IArrowIconProps> = (props) => {
    const {
        width, height, colorCircle,
        clickHandler, title, style
    } = props;

    return (
        <>
            <svg
                width={`${width}px`}
                height={`${height}px`}
                viewBox="0 0 64 64"
                xmlns="http://www.w3.org/2000/svg"
                aria-hidden="true"
                role="img"
                preserveAspectRatio="xMidYMid meet"
                className={styles.icon}
                onClick={() => {
                    clickHandler && clickHandler();
                }}
                style={style}
            >
                <path
                    d="M32 2C15.432 2 2 15.432 2 32c0 16.568 13.432 30 30 30s30-13.432 30-30C62 15.432 48.568 2 32 2zm1.693 46V37.428H15V27.143h18.693V16L49 32L33.693 48z"
                    fill="#000000"></path>
            </svg>
        </>
    );
};

export default ArrowIcon;
