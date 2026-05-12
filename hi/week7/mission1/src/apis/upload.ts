import axiosInstance from './axiosInstance';

interface UploadImageResponse {
  status: boolean;
  statusCode: number;
  message: string;
  data: {
    imageUrl: string;
  };
}

export const uploadImage = async (file: File): Promise<string> => {
  const formData = new FormData();

  formData.append('file', file);

  const response = await axiosInstance.post<UploadImageResponse>(
    '/v1/uploads',
    formData,
    {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    }
  );

  return response.data.data.imageUrl;
};