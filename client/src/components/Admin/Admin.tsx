import React, { FC, useEffect, useState } from "react";
import styles from "./Admin.module.scss";
import { alpha } from "@mui/material/styles";
import Box from "@mui/material/Box";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TablePagination from "@mui/material/TablePagination";
import TableRow from "@mui/material/TableRow";
import TableSortLabel from "@mui/material/TableSortLabel";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Paper from "@mui/material/Paper";
import Checkbox from "@mui/material/Checkbox";
import IconButton from "@mui/material/IconButton";
import Tooltip from "@mui/material/Tooltip";
import SettingsIcon from "@mui/icons-material/Settings";
import { visuallyHidden } from "@mui/utils";
import { useAppSelector, useAppDispatch } from "src/hooks/redux.hook";
import Button from "@mui/material/Button/Button";
import { IRoleModel } from "src/models/IRole";
import { IUserModel } from "src/models/IUserModel";
import { getUsers } from "src/store/actions/AuthAction";
import EditUser from "../EditUser";

interface Data {
    id: number;
    email: string;
    available_screens: number;
}

function createData(
    id: number,
    email: string,
    available_screens: number,
): Data {
    return {
        id,
        email,
        available_screens
    };
}

function descendingComparator<T>(a: T, b: T, orderBy: keyof T) {
    if (b[orderBy] < a[orderBy]) {
        return -1;
    }
    if (b[orderBy] > a[orderBy]) {
        return 1;
    }
    return 0;
}

type Order = "asc" | "desc";

function getComparator<Key extends keyof any>(
    order: Order,
    orderBy: Key
): (
    a: { [key in Key]: number | string },
    b: { [key in Key]: number | string }
) => number {
    return order === "desc"
        ? (a, b) => descendingComparator(a, b, orderBy)
        : (a, b) => -descendingComparator(a, b, orderBy);
}

// Since 2020 all major browsers ensure sort stability with Array.prototype.sort().
// stableSort() brings sort stability to non-modern browsers (notably IE11). If you
// only support modern browsers you can replace stableSort(exampleArray, exampleComparator)
// with exampleArray.slice().sort(exampleComparator)
function stableSort<T>(
    array: readonly T[],
    comparator: (a: T, b: T) => number
) {
    const stabilizedThis = array.map((el, index) => [el, index] as [T, number]);
    stabilizedThis.sort((a, b) => {
        const order = comparator(a[0], b[0]);
        if (order !== 0) {
            return order;
        }
        return a[1] - b[1];
    });
    return stabilizedThis.map((el) => el[0]);
}

interface HeadCell {
    disablePadding: boolean;
    id: keyof Data;
    label: string;
    numeric: boolean;
}

const headCells: readonly HeadCell[] = [
    {
        id: "id",
        numeric: false,
        disablePadding: true,
        label: "Email",
    },
    {
        id: "available_screens",
        numeric: true,
        disablePadding: false,
        label: "Количество доступных экранов",
    },
];

interface EnhancedTableProps {
    onRequestSort: (
        event: React.MouseEvent<unknown>,
        property: keyof Data
    ) => void;
    order: Order;
    orderBy: string;
    rowCount: number;
}

function EnhancedTableHead(props: EnhancedTableProps) {

    return (
        <TableHead>
            <TableRow>
                <TableCell padding="checkbox">
                </TableCell>
                {headCells.map((headCell) => (
                    <TableCell
                        key={headCell.id}
                        align={headCell.numeric ? "right" : "left"}
                        padding={headCell.disablePadding ? "none" : "normal"}
                    >
                        {headCell.label}
                    </TableCell>
                ))}
            </TableRow>
        </TableHead>
    );
}

interface EnhancedTableToolbarProps {
    selected: string | null;
    data: IUserModel[];
}

function EnhancedTableToolbar(props: EnhancedTableToolbarProps) {
    const authSelector = useAppSelector((s) => s.authReducer);
    const { selected, data } = props;
    const [open, setOpen] = React.useState(false);
    const [user, setUser] = useState<IUserModel | null>(null);

    useEffect(() => {
        if (selected) {
            const itemEmail = selected;
            const index = authSelector.users.findIndex((item) => {
                return itemEmail === item.email;
            });

            if (index >= 0) {
                setUser(authSelector.users[index]);
            } else {
                setUser(null);
            }
        } else {
            setUser(null);
        }
    }, [selected]);

    useEffect(() => {
        if (!open) {
            setUser(null);
        }
    }, [open]);

    return (
        <>
            <Toolbar
                sx={{
                    pl: { sm: 2 },
                    pr: { xs: 1, sm: 1 },
                    ...(selected && {
                        bgcolor: (theme) =>
                            alpha(
                                theme.palette.primary.main,
                                theme.palette.action.activatedOpacity
                            ),
                    }),
                }}
            >
                {selected ? (
                    <Typography
                        sx={{ flex: "1 1 100%" }}
                        color="inherit"
                        variant="subtitle1"
                        component="div"
                    >
                        Выбран пользователь {selected}
                    </Typography>
                ) : (
                    <Typography
                        sx={{ flex: "1 1 100%" }}
                        variant="h6"
                        id="tableTitle"
                        component="div"
                    >
                        Пользователи
                    </Typography>
                )}
                {
                    selected ? (
                        <Tooltip title="Setting">
                            <IconButton
                                onClick={() => {
                                    setOpen(true);
                                }}
                            >
                                <SettingsIcon />
                            </IconButton>
                        </Tooltip>
                    ) : (
                        <></>
                    )
                }
            </Toolbar>
            {
                user && <EditUser
                    // @ts-ignore
                    user={user}
                    open={open}
                    setOpen={setOpen}
                />
            }
        </>
    );
}

const Admin: FC<any> = () => {
    const [order, setOrder] = React.useState<Order>("asc");
    const [orderBy, setOrderBy] = React.useState<keyof Data>("id");
    const [selected, setSelected] = React.useState<string | null>(null);
    const [page, setPage] = React.useState(0);
    const [dense, setDense] = React.useState(false);
    const [rowsPerPage, setRowsPerPage] = React.useState(4);
    const authSelector = useAppSelector((s) => s.authReducer);
    const dispatch = useAppDispatch();
    const [open, setOpen] = React.useState<boolean>(false);

    useEffect(() => {
        dispatch(getUsers());
    }, []);

    useEffect(() => {
        setSelected(null);
    }, [authSelector.users]);

    const handleRequestSort = (
        event: React.MouseEvent<unknown>,
        property: keyof Data
    ) => {
        const isAsc = orderBy === property && order === "asc";
        setOrder(isAsc ? "desc" : "asc");
        setOrderBy(property);
    };

    const handleClick = (event: React.MouseEvent<unknown>, email: string) => {
        if (selected === email) {
            setSelected(null);
        } else {
            setSelected(email);
        }
    };

    const handleChangePage = (event: unknown, newPage: number) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (
        event: React.ChangeEvent<HTMLInputElement>
    ) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    const handleChangeDense = (event: React.ChangeEvent<HTMLInputElement>) => {
        setDense(event.target.checked);
    };

    const isSelected = (name: string) => ((selected && (selected === name)) ? true : false);

    // Avoid a layout jump when reaching the last page with empty rows.
    const emptyRows =
        page > 0 ? Math.max(0, (1 + page) * rowsPerPage - authSelector.users.length) : 0;

    const visibleRows = React.useMemo(
        () =>
            /*stableSort(rows, getComparator(order, orderBy)).slice(
              page * rowsPerPage,
              page * rowsPerPage + rowsPerPage
            )*/
            authSelector.users.slice(
                page * rowsPerPage,
                page * rowsPerPage + rowsPerPage
            )
        ,
        [order, orderBy, page, rowsPerPage, authSelector.users]
    );

    return (
        <div className={styles.container}>
            <Box sx={{ width: "100%", borderRadius: '0' }}>
                <Paper sx={{ width: "100%", borderRadius: '0' }}>
                    <EnhancedTableToolbar selected={selected} data={authSelector.users} />
                    <TableContainer>
                        <Table
                            sx={{ minWidth: 750 }}
                            aria-labelledby="tableTitle"
                            size={dense ? "small" : "medium"}
                        >
                            <EnhancedTableHead
                                order={order}
                                orderBy={orderBy}
                                onRequestSort={handleRequestSort}
                                rowCount={authSelector.users.length}
                            />
                            <TableBody>
                                {visibleRows.map((row, index) => {
                                    const isItemSelected = isSelected(row.email);
                                    const labelId = `enhanced-table-checkbox-${index}`;

                                    return (
                                        <TableRow
                                            hover
                                            onClick={(event) => handleClick(event, row.email)}
                                            role="checkbox"
                                            aria-checked={isItemSelected}
                                            tabIndex={-1}
                                            key={row.email}
                                            selected={isItemSelected}
                                            sx={{ cursor: "pointer" }}
                                        >
                                            <TableCell padding="checkbox">
                                                <Checkbox
                                                    color="primary"
                                                    checked={isItemSelected}
                                                    inputProps={{
                                                        "aria-labelledby": labelId,
                                                    }}
                                                />
                                            </TableCell>
                                            <TableCell
                                                component="th"
                                                id={labelId}
                                                scope="row"
                                                padding="none"
                                            >
                                                {row.email}
                                            </TableCell>
                                            <TableCell align="right">{row.data_users[0].available_screens}</TableCell>
                                        </TableRow>
                                    );
                                })}
                                {emptyRows > 0 && (
                                    <TableRow
                                        style={{
                                            height: (dense ? 33 : 53) * emptyRows,
                                        }}
                                    >
                                        <TableCell colSpan={6} />
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    </TableContainer>
                    <TablePagination
                        rowsPerPageOptions={[4]}
                        component="div"
                        count={authSelector.users.length}
                        rowsPerPage={rowsPerPage}
                        page={page}
                        onPageChange={handleChangePage}
                        onRowsPerPageChange={handleChangeRowsPerPage}
                    />
                </Paper>
            </Box>
        </div>
    );
};

export default Admin;
