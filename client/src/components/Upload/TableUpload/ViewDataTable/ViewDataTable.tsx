import { FC, memo, useCallback, useEffect, useState } from "react";
import styles from "./ViewDataTable.module.css";
import { TextField } from "@mui/material";
import { ITableItemResponse, ITableValues } from "src/models/Tables/ITableModel";
import zIndex from "@mui/material/styles/zIndex";

export interface IViewDataTable {
    columns: string[];
    rows: string[][];
    fullScreen?: boolean;
    norm?: boolean;
}

const ViewDataTable: FC<IViewDataTable> = ({ columns, rows, fullScreen = false, norm = false }) => {
    const [form, setForm] = useState<ITableValues>({
        columns: columns,
        rows: rows
    });

    const getWidth = useCallback(() => {
        return columns.length * 715;
    }, [columns]);

    const getHeight = useCallback(() => {
        return (rows.length + 1) * 515;
    }, [rows]);

    const scale = useCallback(() => {
        return Math.min(1468 / getWidth(), 740 / getHeight());
    }, [getWidth, getHeight]);

    return (
        <>
            <div className={(fullScreen) ? styles.fullscreen : styles.wrapper}>
                <div className={(norm) ? styles.content : styles.content2}>
                    <div
                        style={(!norm) ? {
                            width: `${getWidth()}px`,
                            height: `${getHeight()}px`,
                            transform: `scale(${scale()})`,
                            transformOrigin: "top left"
                        } : {}}
                    >
                        <div className={styles.columns}>
                            {
                                form.columns && form.columns.map((item, index) => {
                                    return (
                                        <div>
                                            <TextField
                                                required={true}
                                                id="outlined-basic"
                                                variant="outlined"
                                                color="success"
                                                defaultValue={item}
                                                value={item}
                                                sx={{
                                                    width: "150px",
                                                    pointerEvents: 'none'
                                                }}
                                            />
                                        </div>
                                    )
                                })
                            }
                        </div>
                        <div className={styles.rows}>
                            {
                                form.rows && form.rows.map((item, index) => {
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
                                                                defaultValue={subItem}
                                                                value={subItem}
                                                                sx={{
                                                                    width: "150px",
                                                                    pointerEvents: 'none'
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
                </div>
            </div>
        </>
    );
};

export default memo(ViewDataTable);
