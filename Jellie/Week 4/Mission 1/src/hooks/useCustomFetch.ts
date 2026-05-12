import { useEffect, useState } from 'react';
import axios from 'axios';

export default function useCustomFetch<T>(url: string) {
  const [data, setData] = useState<T | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchData = async function () {
      try {
        setIsLoading(true);
        setError('');

        const response = await axios.get<T>(url, {
          headers: {
            Authorization: 'Bearer ' + import.meta.env.VITE_TMDB_KEY,
          },
        });

        setData(response.data);
      } catch (err) {
        console.error(err);
        setError('데이터를 불러오지 못했습니다.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [url]);

  return {
    data,
    isLoading,
    error,
  };
}