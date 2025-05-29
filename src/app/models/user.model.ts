export interface User {
  id: string;
  username: string;
  tasks?: any[];
}

export interface AuthCredentials {
  username: string;
  password: string;
}

export interface AuthResponse {
  accessToken: string;
} 