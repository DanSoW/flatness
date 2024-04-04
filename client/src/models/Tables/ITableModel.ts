export interface ITableInfoValues {
  count_columns: number;
  count_rows: number;
  delay: number;
}

export interface ITableValues {
  columns: string[];
  rows: string[][];
  delay?: number;
}

export interface ITableResponse {
  items: ITableItemResponse[];
}

export interface ITableItemResponse {
  id: number;
  columns: string;
  delay: number;
  created_at: string;
  updated_at: string;
  users_id: number;
  data_tables: IDataTableResponse[];
}

export interface IDataTableResponse {
  id: number;
  row: string;
  created_at: string;
  updated_at: string;
  users_id: number;
  tables_id: number;
}
