import axios from 'axios';

export const api = axios.create({
  baseURL: 'http://localhost:8000/v1',
  withCredentials: true,
});

api.interceptors.request.use(function (config) {
  const authString = localStorage.getItem('auth');

  if (authString) {
    const auth = JSON.parse(authString);

    if (auth.accessToken) {
      config.headers.Authorization = 'Bearer ' + auth.accessToken;
    }
  }

  return config;
});

export type LoginResponse = {
  status: boolean;
  message: string;
  statusCode: number;
  data: {
    id: number;
    name: string;
    accessToken: string;
    refreshToken: string;
  };
};

export type SignupResponse = {
  status: boolean;
  message: string;
  statusCode: number;
  data: {
    id: number;
    name: string;
    email: string;
    bio: string | null;
    avatar: string | null;
    createdAt: string;
    updatedAt: string;
  };
};

export type UploadResponse = {
  status: boolean;
  message: string;
  statusCode: number;
  data: {
    imageUrl: string;
  };
};

export async function signIn(email: string, password: string) {
  const response = await api.post<LoginResponse>('/auth/signin', {
    email,
    password,
  });

  return response.data.data;
}

export async function signUp(payload: {
  name: string;
  email: string;
  password: string;
  avatar?: string | null;
  bio?: string | null;
}) {
  const response = await api.post<SignupResponse>('/auth/signup', payload);
  return response.data.data;
}

export async function uploadPublicImage(file: File) {
  const formData = new FormData();
  formData.append('file', file);

  const response = await api.post<UploadResponse>('/uploads/public', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });

  return response.data.data.imageUrl;
}