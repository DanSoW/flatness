import { FC, memo, useCallback, useEffect, useRef, useState } from "react";
import styles from "./TableItem.module.scss";
import { TextField } from "@mui/material";

export interface ITableItemProps {
    columns: string[];
    rows: string[][];
}

const TableItem: FC<ITableItemProps> = ({ columns, rows }) => {
    
    const getWidth = () => {
        return columns.length * 715;
    };

    const getHeight = () => {
        return (rows.length + 1) * 515;
    };

    const scale = () => {
        return Math.min(1468 / getWidth(), 740 / getHeight());
    };

    return (
        <>
            <div className={styles.content}>
                <div
                    className={styles.tableBody}
                    style={{
                        width: `${getWidth()}px`,
                        height: `${getHeight()}px`,
                        transform: `scale(${scale()})`
                    }}
                >
                    <div className={styles.columns}>
                        {
                            columns && columns.map((item, index) => {
                                return (
                                    <div>
                                        <TextField
                                            required={true}
                                            id="outlined-basic"
                                            variant="outlined"
                                            color="success"
                                            sx={{
                                                width: "150px",
                                                pointerEvents: 'none'
                                            }}
                                            value={item}
                                            InputProps={{
                                                readOnly: true,
                                            }}
                                        />
                                    </div>
                                )
                            })
                        }
                    </div>
                    <div className={styles.rows}>
                        {
                            rows && rows.map((item, index) => {
                                return (
                                    <div className={styles.row}>
                                        {
                                            item.map((subItem, subIndex) => {
                                                return (
                                                    <div>
                                                        <TextField
                                                            required={true}
                                                            id="outlined-basic"
                                                            variant="outlined"
                                                            sx={{
                                                                width: "150px",
                                                                pointerEvents: 'none'
                                                            }}
                                                            value={subItem}
                                                            InputProps={{
                                                                readOnly: true,
                                                            }}
                                                        />
                                                    </div>
                                                )
                                            })
                                        }
                                    </div>
                                )
                            })
                        }
                    </div>
                </div>
            </div >
        </>
    );
};

export default TableItem;
