import { FC, memo } from "react";
import styles from "./CrossIcon.module.scss";

export interface ICrossIconProps {
    width: number;
    height: number;
    clickHandler?: () => void;
}

const CrossIcon: FC<ICrossIconProps> = (props) => {
    const { width, height, clickHandler } = props;

    return (
        <>
            <svg
                className={styles.container}
                version="1.0"
                xmlns="http://www.w3.org/2000/svg"
                width={`${width}px`}
                height={`${height}px`}
                viewBox="0 0 900.000000 900.000000"
                preserveAspectRatio="xMidYMid meet"
                onClick={() => {
                    clickHandler && clickHandler();
                }}
            >

                <g transform="translate(0.000000,900.000000) scale(0.100000,-0.100000)"
                    fill="#000000" stroke="none">
                    <path
                        d="M2184 7626 c-28 -7 -71 -24 -95 -39 -24 -14 -182 -164 -351 -334
                        -350 -351 -359 -363 -366 -499 -5 -86 11 -160 50 -239 13 -26 350 -370 971
                        -992 l952 -953 -946 -947 c-593 -594 -956 -965 -972 -993 -42 -75 -60 -153
                        -55 -245 7 -142 17 -155 363 -501 265 -265 310 -305 367 -333 121 -57 262 -59
                        372 -5 40 21 247 221 1006 980 l955 954 949 -949 c891 -891 954 -952 1016
                        -980 119 -55 254 -59 359 -10 33 16 129 105 353 328 274 273 310 313 337 371
                        56 119 58 259 7 363 -20 42 -213 239 -981 1007 l-955 955 949 950 c886 887
                        951 954 980 1016 58 125 60 263 4 372 -18 36 -110 135 -323 348 -282 283 -302
                        301 -377 337 -75 35 -82 37 -183 37 -181 0 -81 86 -1178 -1009 l-962 -961
                        -953 952 c-1029 1028 -986 989 -1126 1019 -78 16 -100 16 -167 0z"
                    />
                </g>
            </svg>
        </>
    );
};

export default memo(CrossIcon);
