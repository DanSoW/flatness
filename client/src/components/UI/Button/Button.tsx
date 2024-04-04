import { FC, memo } from "react";
import styles from "./Button.module.css";
import btnIcon from "src/resources/images/btnIcon.svg";

export interface IButtonProps {
  title: string;
  clickHandler: () => void;
  disabled?: boolean;
}

const Button: FC<IButtonProps> = (props) => {
  const { title, clickHandler, disabled = false } = props;

  return (
    <>
      <button
        className={styles.btn}
        onClick={clickHandler}
        disabled={disabled}
      >
        {title}
      </button>
    </>
  );
};

export default memo(Button);
