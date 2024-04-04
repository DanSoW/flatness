export interface ITextValues {
  text: string;
  delay: number;
}

export interface ITextResponse {
  items: ITextItemResponse[];
}

export interface ITextItemResponse {
  id: number;
  text: string;
  delay: number;
  created_at: string;
  updated_at: string;
  users_id: number;
}
