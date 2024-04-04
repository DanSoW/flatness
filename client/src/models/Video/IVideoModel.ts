export interface IVideoValues {
  link: string;
  audio: boolean;
}

export interface IVideoResponse {
  items: IVideoItemResponse[];
}

export interface IVideoItemResponse {
  id: number;
  link: string;
  audio: boolean;
  created_at: string;
  updated_at: string;
  users_id: number;
}
