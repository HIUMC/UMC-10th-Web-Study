import { useEffect, useState } from 'react';
import axios from 'axios';

const ACCESS_TOKEN =
  'eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI1NTZkZDNjMDQ0NTI5MTg2OWJkZDdlM2YyODAyMDM4YiIsIm5iZiI6MTc3NDc2OTM0Ny40MzkwMDAxLCJzdWIiOiI2OWM4ZDRjMzlhZDFlOGI0NTUwY2YyYjkiLCJzY29wZXMiOlsiYXBpX3JlYWQiXSwidmVyc2lvbiI6MX0.7DG9LPspLhf1Tqrjhlry0xTju-mvnIaSSXfrmAznXLw';

const useCustomFetch = <T,>(
  url: string,
  params?: Record<string, string | number>
) => {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if(!url) return;
    
    const fetchData = async () => {
      setLoading(true);
      setError('');

      try {
        const response = await axios.get<T>(url, {
          params,
          headers: {
            Authorization: `Bearer ${ACCESS_TOKEN}`,
          },
        });

        setData(response.data);
      } catch (err) {
        console.error(err);
        setError('데이터를 불러오는 중 오류가 발생했습니다.');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [url, JSON.stringify(params)]);

  return { data, loading, error };
};

export default useCustomFetch;