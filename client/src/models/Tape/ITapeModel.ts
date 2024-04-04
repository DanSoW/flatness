import { ScreenModel } from "../ScreenModel";

export interface ITapeResponse {
  elements: ITapeItem[];
}

export interface ITapeResponseGetAll {
  tapes: ITapeItem[];
}

export interface ITapeResponseGetAllByScreen {
  tapes: ITapeItem[];
  screen: ScreenModel;
}

export interface ITapeItem {
  id: number;
  title: string;
  created_at: string;
  updated_at: string;
  users_id: number;
  data_tapes: ITapeDataItem[];
  is_active?: boolean;
}

export interface ITapeDataItem {
  id: number;
  data_id: number;
  table_name: string;
  type: string;
  created_at: string;
  updated_at: string;
  tapes_id: number;
  columns?: string[];
  rows?: Array<string[]>;
  text?: string;
  filepath?: string;
  video_link?: string;
  audio?: boolean;
  delay?: number;
  queue_num?: number;
}
