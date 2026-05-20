export interface User {
  id: number;
  name: string;
  email?: string;
  bio?: string;
  avatar?: string;
}

export interface UpdateProfilePayload {
  name: string;
  bio?: string;
  avatar?: string;
}