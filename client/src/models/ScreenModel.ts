export interface ScreenModel {
  id: number;
  title: string;
  link: string;
  created_at: Date;
  updated_at: Date;
  users_id: number;
  tape_exist: boolean;
}

export interface IContentTypeList {
  type: string;
  content_id: number;
  queue_num: number;
}
