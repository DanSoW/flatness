import { FC } from "react";
import styles from "./EditIcon.module.scss";

export interface IEditIconProps {
    width: number;
    height: number;
    clickHandler?: () => void;
}

const EditIcon: FC<IEditIconProps> = (props) => {
    const { width, height, clickHandler } = props;

    return (
        <>
            <svg
                className={styles.container}
                version="1.0" xmlns="http://www.w3.org/2000/svg"
                width={`${width}px`}
                height={`${height}px`}
                viewBox="0 0 900.000000 620.000000"
                preserveAspectRatio="xMidYMid meet"
                onClick={() => {
                    clickHandler && clickHandler();
                }}
            >
                <g
                    transform="translate(0.000000,620.000000) scale(0.100000,-0.100000)"
                    fill="#000000"
                    stroke="none"
                >
                    <path d="M6215 6176 c-28 -23 -30 -29 -35 -113 -3 -48 -5 -213 -5 -365 l0
                    -277 -1875 -4 c-1454 -2 -1892 -6 -1949 -16 -259 -44 -459 -149 -587 -309 -58
                    -72 -138 -236 -163 -334 -39 -153 -41 -202 -41 -1265 l0 -1035 34 -34 c36 -36
                    70 -43 109 -23 31 16 865 848 883 881 12 22 14 107 14 489 0 449 1 464 21 506
                    14 29 35 52 63 68 l43 25 1720 0 1721 0 7 -172 c4 -95 4 -189 1 -208 -3 -19
                    -3 -125 1 -235 l6 -200 28 -27 c22 -22 37 -28 72 -28 l45 0 644 645 c681 684
                    676 678 649 742 -6 16 -301 318 -654 671 -635 635 -643 642 -682 642 -27 0
                    -50 -8 -70 -24z"/>
                    <path d="M7285 3966 c-16 -7 -220 -206 -451 -442 -232 -236 -426 -433 -430
                    -437 -5 -5 -11 -228 -14 -496 l-5 -488 -29 -37 c-54 -71 85 -66 -1816 -66
                    l-1720 0 0 396 c0 271 -3 402 -11 417 -20 38 -51 57 -99 57 l-45 0 -637 -637
                    c-351 -351 -645 -653 -654 -671 -32 -69 -49 -50 645 -745 l646 -647 43 0 c37
                    0 50 6 78 34 l34 34 0 356 0 356 1893 3 c1715 3 1899 5 1972 20 315 65 517
                    210 640 460 61 123 93 256 106 436 6 90 9 510 7 1093 l-3 948 -30 30 c-36 35
                    -79 45 -120 26z"/>
                </g>
            </svg>

        </>
    );
};

export default EditIcon;
