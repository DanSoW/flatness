export interface IUserModel {
  id: number;
  email: string;
  data_users: IDataUser[];
}

export interface IDataUser {
  id: number;
  available_screens: number;
}
