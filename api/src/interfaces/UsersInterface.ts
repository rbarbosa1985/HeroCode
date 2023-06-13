export interface ICreate {
  name: string;
  email: string;
  password: string;
}

export interface IUpdate {
  name: string;
  oldPassword: string;
  newPassword: string;
  avatar_url?: string;
  user_id: string;
}