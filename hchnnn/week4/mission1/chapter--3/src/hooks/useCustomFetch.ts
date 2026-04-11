import { useEffect, useState } from 'react';
import axios from 'axios';

// 공통 응답 상태 타입
interface FetchResult<T> {
    data: T | null;
    isLoading: boolean;
    isError: boolean;
}

const useCustomFetch = <T>(url: string): FetchResult<T> => {
    const [data, setData] = useState<T | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [isError, setIsError] = useState<boolean>(false);

    useEffect(() => {
        const fetchData = async () => {
            setIsLoading(true);
            setIsError(false);
            try {
                const response = await axios.get<T>(
                    `https://api.themoviedb.org/3${url}`,
                    {
                        headers: {
                            Authorization: `Bearer ${import.meta.env.VITE_TMDB_KEY}`,
                            accept: 'application/json'
                        }
                    }
                );
                setData(response.data);
            } catch (error) {
                console.error(error);
                setIsError(true);
            } finally {
                setIsLoading(false);
            }
        };

        fetchData();
    }, [url]); // URL(페이지 번호나 카테고리 포함)이 변경되면 재실행

    return { data, isLoading, isError };
};

export default useCustomFetch;