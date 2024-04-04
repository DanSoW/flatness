import { FC, memo, useCallback, useEffect, useState } from "react";
import styles from "./ViewTable.module.css";
import { TextField } from "@mui/material";
import { ITableItemResponse, ITableValues } from "src/models/Tables/ITableModel";

export interface IVidewTable {
    data: ITableItemResponse;
}

const ViewTable: FC<IVidewTable> = ({ data }) => {
    const [form, setForm] = useState<ITableValues>({
        columns: data.columns.split(';'),
        rows: data.data_tables.map((item) => item.row.split(';'))
    });

    const getWidth = useCallback(() => {
        return data.columns.split(';').length * 715;
    }, [data.columns]);

    const getHeight = useCallback(() => {
        return (data.data_tables.length + 1) * 515;
    }, [data.data_tables]);

    const scale = useCallback(() => {
        return Math.min(1468 / getWidth(), 740 / getHeight());
    }, [getWidth, getHeight]);

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
        </>
    );
};

export default memo(ViewTable);
