import { useEffect, useState } from "react";
import { getMyInfo } from "../apis/auth";
import type { ResponseMyInfoDto } from "../types/auth";

const MyPage = () => {
  const [data, setData] = useState<ResponseMyInfoDto | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await getMyInfo();
        console.log(response);
        setData(response);
      } catch (error) {
        console.log(error);
      }
    };

    fetchData();
  }, []);

  if (!data) {
    return <div>로딩 중...</div>;
  }

  console.log(data.data.name);

  return <div>{data.data.name}</div>;
};

export default MyPage;
