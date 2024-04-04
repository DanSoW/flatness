import { FC } from "react";
import styles from "./CommobBlock.module.scss";
import CircleIcon from "src/components/icons/CircleIcon";
import { linkFormatted } from "src/utils/link";
import { Link } from "react-router-dom";
import CrossIcon from "src/components/icons/CrossIcon";
import EditIcon from "src/components/icons/EditIcon";
import PasteIcon from "src/components/icons/PasteIcon";
import { useAppSelector } from "src/hooks/redux.hook";

export interface ICommonBlockProps {
    id: number;
    title: string;
    colorCircle?: string;
    clickHandler?: (id: number) => void;
}

const CommonBlock: FC<ICommonBlockProps> = (props) => {
    const {
        id, title, colorCircle, 
        clickHandler
    } = props;

    return (
        <>
            <div className={styles.container}>
                <div className={styles.header}>
                    <p>{title}</p>
                    <div className={styles.controls}>
                        <CircleIcon
                            width={24}
                            height={24}
                            colorCircle={colorCircle}
                            clickHandler={() => {
                                clickHandler && clickHandler(id);
                            }}
                        />
                    </div>
                </div>
            </div>
        </>
    );
};

export default CommonBlock;
