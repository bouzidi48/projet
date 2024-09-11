export interface User {
    id: number;
    username: string;
    email: string;
    password?: string; // Hashed, never sent to frontend
    createdate?: Date;
    updatedate?: Date;
    role:Roles;
  }
  export type Roles = 'user' | 'admin';

export interface UserRegistrationData {
  username: string;
  email: string;
  password: string;
}

export interface ApiResponse<T> {
  data: T;
  statusCode: number;
  message?: string;
}