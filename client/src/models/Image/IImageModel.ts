/**
 * Интерфейс для представления Data URL
 */
export interface IDataURLModel {
  data_url: string;
}

/**
 * Интерфейс для представления всех изображений из ответа на GET ALL
 */
export interface ImagesResponse {
  items: ImageItemResponse[];
}

export interface ImageItemResponse {
  id:         number;
  filename:   string;
  filepath:   string;
  delay:      number;
  created_at: string;
  updated_at: string;
  users_id:   number;
}
