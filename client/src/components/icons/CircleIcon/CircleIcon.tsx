import { FC } from "react";
import styles from './CircleIcon.module.scss';

export interface ICircleIconProps {
    width: number;
    height: number;
    colorCircle?: string;
    clickHandler?: () => void;
}

/**
 * Функциональный компонент для выбора элемента
 * @param props Параметры компонента
 * @returns 
 */
const CircleIcon: FC<ICircleIconProps> = (props) => {
    const { width, height, colorCircle, clickHandler } = props;

    return (
        <>
            <svg
                width={`${width}px`}
                height={`${height}px`}
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                stroke="#000000"
                strokeWidth="1"
                strokeLinecap="round"
                strokeLinejoin="miter"
                className={styles.icon}
                onClick={() => {
                    clickHandler && clickHandler();
                }}
            >
                <g id="SVGRepo_bgCarrier" strokeWidth="0" />
                <g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round" />
                <g id="SVGRepo_iconCarrier">
                    <circle cx="12" cy="12" r="10" />
                    <circle cx="12" cy="12" r="10" fill={`${colorCircle ? colorCircle : '#059cf7'}`} />
                </g>

            </svg>
        </>
    );
};

export default CircleIcon;
